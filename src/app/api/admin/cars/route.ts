import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import sql from "@/lib/db";
import { getSeller } from "@/lib/cars";
import { slugify } from "@/lib/format";

const carSchema = z.object({
  make: z.string().min(1).max(60),
  model: z.string().min(1).max(60),
  trim: z.string().max(60).optional().nullable(),
  year: z.number().int().min(1980).max(2100),
  vin: z.string().max(32).optional().nullable(),
  body_type: z.string().max(30).optional().nullable(),
  transmission: z.enum(["automatic", "manual", "cvt"]).optional().nullable(),
  fuel_type: z
    .enum(["petrol", "diesel", "hybrid", "electric"])
    .optional()
    .nullable(),
  drivetrain: z.enum(["fwd", "rwd", "awd", "4wd"]).optional().nullable(),
  engine_capacity_cc: z.number().int().optional().nullable(),
  mileage_km: z.number().int().min(0),
  color: z.string().max(30).optional().nullable(),
  seats: z.number().int().optional().nullable(),
  condition: z.enum(["new", "used", "certified_preowned"]),
  import_type: z
    .enum(["locally_used", "foreign_used", "brand_new"])
    .optional()
    .nullable(),
  price: z.number().positive(),
  negotiable: z.boolean(),
  previous_price: z.number().positive().optional().nullable(),
  status: z.enum(["draft", "published", "reserved", "sold", "archived"]),
  featured: z.boolean(),
  description: z.string().optional().nullable(),
});

async function guard() {
  const session = await getAdminSession();
  if (!session) return null;
  return session;
}

export async function POST(req: Request) {
  if (!(await guard())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = carSchema.parse(await req.json());
    const seller = await getSeller();
    if (!seller) {
      return NextResponse.json(
        { error: "No seller configured" },
        { status: 500 }
      );
    }

    let base = slugify(`${data.year}-${data.make}-${data.model}-${data.trim || ""}`);
    if (!base) base = `car-${Date.now()}`;
    let slug = base;
    let n = 1;
    while (true) {
      const existing = await sql`SELECT id FROM cars WHERE slug = ${slug} LIMIT 1`;
      if (!existing[0]) break;
      slug = `${base}-${n++}`;
    }

    const listedAt = data.status === "published" ? new Date() : null;

    const rows = await sql`
      INSERT INTO cars (
        seller_id, make, model, trim, year, vin, body_type, transmission,
        fuel_type, drivetrain, engine_capacity_cc, mileage_km, color, seats,
        condition, import_type, price, negotiable, previous_price, status,
        featured, description, slug, listed_at
      ) VALUES (
        ${seller.id}, ${data.make}, ${data.model}, ${data.trim || null},
        ${data.year}, ${data.vin || null}, ${data.body_type || null},
        ${data.transmission || null}, ${data.fuel_type || null},
        ${data.drivetrain || null}, ${data.engine_capacity_cc ?? null},
        ${data.mileage_km}, ${data.color || null}, ${data.seats ?? null},
        ${data.condition}, ${data.import_type || null}, ${data.price},
        ${data.negotiable}, ${data.previous_price ?? null}, ${data.status},
        ${data.featured}, ${data.description || null}, ${slug}, ${listedAt}
      )
      RETURNING id
    `;

    return NextResponse.json({ id: rows[0].id }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
