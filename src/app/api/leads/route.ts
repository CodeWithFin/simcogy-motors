import { NextResponse } from "next/server";
import { z } from "zod";
import sql from "@/lib/db";

const schema = z.object({
  carId: z.string().uuid(),
  name: z.string().min(2).max(150),
  phone: z.string().min(7).max(20),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().max(2000).optional(),
  channel: z.enum(["form", "whatsapp", "call", "test_drive"]).default("form"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const cars = await sql`
      SELECT id FROM cars WHERE id = ${data.carId} LIMIT 1
    `;
    if (!cars[0]) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    const rows = await sql`
      INSERT INTO leads (car_id, name, phone, email, message, channel, status)
      VALUES (
        ${data.carId},
        ${data.name},
        ${data.phone},
        ${data.email || null},
        ${data.message || null},
        ${data.channel},
        'new'
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
