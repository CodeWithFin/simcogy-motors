import { NextResponse } from "next/server";
import { z } from "zod";
import sql from "@/lib/db";
import { tradeInRateLimit } from "@/lib/rate-limit";
import { sendTradeInNotificationEmail } from "@/lib/email";

const schema = z.object({
  make: z.string().min(1).max(60),
  model: z.string().min(1).max(60),
  year: z.number().int().min(1980).max(2100),
  mileage_km: z.number().int().min(0),
  phone: z.string().min(7).max(20),
  condition_notes: z.string().max(2000).optional(),
});

export async function POST(req: Request) {
  const rateLimitResult = await tradeInRateLimit(req);
  if (!rateLimitResult.success) {
    return rateLimitResult.response!;
  }

  try {
    const data = schema.parse(await req.json());

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

    await sendTradeInNotificationEmail({
      make: data.make,
      model: data.model,
      year: data.year,
      mileage_km: data.mileage_km,
      condition_notes: data.condition_notes || "",
      phone: data.phone,
    });

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
