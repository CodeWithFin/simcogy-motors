import { NextResponse } from "next/server";
import { z } from "zod";
import sql from "@/lib/db";
import { leadRateLimit } from "@/lib/rate-limit";
import { sendLeadNotificationEmail } from "@/lib/email";
import { getCarById } from "@/lib/cars";
import { formatKes } from "@/lib/format";

const schema = z.object({
  carId: z.string().uuid(),
  name: z.string().min(2).max(150),
  phone: z.string().min(7).max(20),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().max(2000).optional(),
  channel: z.enum(["form", "whatsapp", "call", "test_drive"]).default("form"),
});

export async function POST(req: Request) {
  const rateLimitResult = await leadRateLimit(req);
  if (!rateLimitResult.success) {
    return rateLimitResult.response!;
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const car = await getCarById(data.carId);
    if (!car) {
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

    const leadId = rows[0].id;

    await sendLeadNotificationEmail({
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      message: data.message || undefined,
      channel: data.channel,
      carMake: car.make,
      carModel: car.model,
      carYear: car.year,
      carSlug: car.slug,
      carPrice: formatKes(car.price),
    });

    return NextResponse.json({ id: leadId }, { status: 201 });
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
