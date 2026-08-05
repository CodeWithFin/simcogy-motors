import sql from "./db";
import type { Car, CarFilters, CarImage, Lead, Seller } from "./types";

export async function getSeller(): Promise<Seller | null> {
  const rows = await sql<Seller[]>`
    SELECT id, name, slug, phone, whatsapp, email, location_text
    FROM sellers
    ORDER BY created_at ASC
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getPublishedCars(filters: CarFilters = {}): Promise<{
  cars: Car[];
  total: number;
}> {
  const {
    make,
    model,
    yearMin,
    yearMax,
    priceMin,
    priceMax,
    mileageMax,
    transmission,
    fuelType,
    bodyType,
    condition,
    importType,
    sort = "newest",
    q,
    featured,
    limit = 24,
    offset = 0,
  } = filters;

  const conditions: string[] = [`c.status = 'published'`];
  const values: (string | number | boolean)[] = [];
  let i = 1;

  if (make) {
    conditions.push(`c.make ILIKE $${i++}`);
    values.push(make);
  }
  if (model) {
    conditions.push(`c.model ILIKE $${i++}`);
    values.push(`%${model}%`);
  }
  if (yearMin) {
    conditions.push(`c.year >= $${i++}`);
    values.push(yearMin);
  }
  if (yearMax) {
    conditions.push(`c.year <= $${i++}`);
    values.push(yearMax);
  }
  if (priceMin) {
    conditions.push(`c.price >= $${i++}`);
    values.push(priceMin);
  }
  if (priceMax) {
    conditions.push(`c.price <= $${i++}`);
    values.push(priceMax);
  }
  if (mileageMax) {
    conditions.push(`c.mileage_km <= $${i++}`);
    values.push(mileageMax);
  }
  if (transmission) {
    conditions.push(`c.transmission = $${i++}`);
    values.push(transmission);
  }
  if (fuelType) {
    conditions.push(`c.fuel_type = $${i++}`);
    values.push(fuelType);
  }
  if (bodyType) {
    conditions.push(`c.body_type ILIKE $${i++}`);
    values.push(bodyType);
  }
  if (condition) {
    conditions.push(`c.condition = $${i++}`);
    values.push(condition);
  }
  if (importType) {
    conditions.push(`c.import_type = $${i++}`);
    values.push(importType);
  }
  if (featured) {
    conditions.push(`c.featured = true`);
  }
  if (q) {
    conditions.push(
      `(c.make ILIKE $${i} OR c.model ILIKE $${i} OR c.trim ILIKE $${i} OR c.description ILIKE $${i})`
    );
    values.push(`%${q}%`);
    i++;
  }

  const where = conditions.join(" AND ");

  let orderBy = "c.listed_at DESC NULLS LAST, c.created_at DESC";
  switch (sort) {
    case "price_asc":
      orderBy = "c.price ASC";
      break;
    case "price_desc":
      orderBy = "c.price DESC";
      break;
    case "year_desc":
      orderBy = "c.year DESC";
      break;
    case "year_asc":
      orderBy = "c.year ASC";
      break;
    case "mileage_asc":
      orderBy = "c.mileage_km ASC";
      break;
    case "newest":
    default:
      break;
  }

  const countResult = await sql.unsafe<{ count: string }[]>(
    `SELECT COUNT(*)::text AS count FROM cars c WHERE ${where}`,
    values
  );

  const limitParam = i++;
  const offsetParam = i++;
  const cars = await sql.unsafe<Car[]>(
    `
    SELECT
      c.*,
      (
        SELECT ci.url FROM car_images ci
        WHERE ci.car_id = c.id
        ORDER BY ci.is_cover DESC, ci.position ASC
        LIMIT 1
      ) AS cover_url,
      (
        SELECT COUNT(*)::int FROM car_images ci WHERE ci.car_id = c.id
      ) AS image_count,
      (
        SELECT i.overall_score FROM inspections i
        WHERE i.car_id = c.id
        ORDER BY i.inspected_at DESC
        LIMIT 1
      ) AS overall_score
    FROM cars c
    WHERE ${where}
    ORDER BY ${orderBy}
    LIMIT $${limitParam} OFFSET $${offsetParam}
    `,
    [...values, limit, offset]
  );

  return { cars, total: Number(countResult[0]?.count ?? 0) };
}

export async function getFeaturedCars(limit = 6): Promise<Car[]> {
  const { cars } = await getPublishedCars({ featured: true, limit });
  if (cars.length > 0) return cars;
  const fallback = await getPublishedCars({ limit, sort: "newest" });
  return fallback.cars;
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  const rows = await sql<Car[]>`
    SELECT
      c.*,
      (
        SELECT ci.url FROM car_images ci
        WHERE ci.car_id = c.id
        ORDER BY ci.is_cover DESC, ci.position ASC
        LIMIT 1
      ) AS cover_url,
      (
        SELECT i.overall_score FROM inspections i
        WHERE i.car_id = c.id
        ORDER BY i.inspected_at DESC
        LIMIT 1
      ) AS overall_score
    FROM cars c
    WHERE c.slug = ${slug}
      AND c.status IN ('published', 'reserved', 'sold')
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getCarById(id: string): Promise<Car | null> {
  const rows = await sql<Car[]>`
    SELECT c.* FROM cars c WHERE c.id = ${id} LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getCarImages(carId: string): Promise<CarImage[]> {
  return sql<CarImage[]>`
    SELECT * FROM car_images
    WHERE car_id = ${carId}
    ORDER BY is_cover DESC, position ASC
  `;
}

export async function getFilterOptions() {
  const makes = await sql<{ make: string }[]>`
    SELECT DISTINCT make FROM cars WHERE status = 'published' ORDER BY make
  `;
  const bodyTypes = await sql<{ body_type: string }[]>`
    SELECT DISTINCT body_type FROM cars
    WHERE status = 'published' AND body_type IS NOT NULL
    ORDER BY body_type
  `;
  return {
    makes: makes.map((m) => m.make),
    bodyTypes: bodyTypes.map((b) => b.body_type),
  };
}

export async function getAllCarsAdmin(): Promise<Car[]> {
  return sql<Car[]>`
    SELECT
      c.*,
      (
        SELECT ci.url FROM car_images ci
        WHERE ci.car_id = c.id
        ORDER BY ci.is_cover DESC, ci.position ASC
        LIMIT 1
      ) AS cover_url
    FROM cars c
    ORDER BY c.updated_at DESC
  `;
}

export async function getLeads(): Promise<Lead[]> {
  return sql<Lead[]>`
    SELECT
      l.*,
      c.make AS car_make,
      c.model AS car_model,
      c.year AS car_year,
      c.slug AS car_slug
    FROM leads l
    JOIN cars c ON c.id = l.car_id
    ORDER BY l.created_at DESC
  `;
}
