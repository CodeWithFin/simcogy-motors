import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import sql from "@/lib/db";

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

type Params = Promise<{ id: string }>;

export async function PATCH(
  req: Request,
  { params }: { params: Params }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = carSchema.parse(await req.json());

    const existing = await sql`
      SELECT id, slug, status, listed_at FROM cars WHERE id = ${id} LIMIT 1
    `;
    if (!existing[0]) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let listedAt = existing[0].listed_at;
    if (data.status === "published" && !listedAt) {
      listedAt = new Date();
    }

    await sql`
      UPDATE cars SET
        make = ${data.make},
        model = ${data.model},
        trim = ${data.trim || null},
        year = ${data.year},
        vin = ${data.vin || null},
        body_type = ${data.body_type || null},
        transmission = ${data.transmission || null},
        fuel_type = ${data.fuel_type || null},
        drivetrain = ${data.drivetrain || null},
        engine_capacity_cc = ${data.engine_capacity_cc ?? null},
        mileage_km = ${data.mileage_km},
        color = ${data.color || null},
        seats = ${data.seats ?? null},
        condition = ${data.condition},
        import_type = ${data.import_type || null},
        price = ${data.price},
        negotiable = ${data.negotiable},
        previous_price = ${data.previous_price ?? null},
        status = ${data.status},
        featured = ${data.featured},
        description = ${data.description || null},
        listed_at = ${listedAt}
      WHERE id = ${id}
    `;

    return NextResponse.json({ id });
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

export async function DELETE(
  _req: Request,
  { params }: { params: Params }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await sql`DELETE FROM cars WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
