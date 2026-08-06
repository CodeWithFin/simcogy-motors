import { NextResponse } from "next/server";
import { z } from "zod";
import sql from "@/lib/db";

const schema = z.object({
  make: z.string().min(1).max(60),
  model: z.string().min(1).max(60),
  year: z.number().int().min(1980).max(2100),
  mileage_km: z.number().int().min(0),
  phone: z.string().min(7).max(20),
  condition_notes: z.string().max(2000).optional(),
});

export async function POST(req: Request) {
  try {
    const data = schema.parse(await req.json());

    // Store phone in condition notes prefix so staff can follow up
    // (trade_in_requests has no phone column in v1 schema)
    const notes = [
      `Contact: ${data.phone}`,
      data.condition_notes ? data.condition_notes : null,
    ]
      .filter(Boolean)
      .join("\n");

    const rows = await sql`
      INSERT INTO trade_in_requests (make, model, year, mileage_km, condition_notes, status)
      VALUES (
        ${data.make},
        ${data.model},
        ${data.year},
        ${data.mileage_km},
        ${notes},
        'pending'
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
