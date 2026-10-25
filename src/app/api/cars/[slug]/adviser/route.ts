import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import sql from "@/lib/db";
import { getCarBySlug } from "@/lib/cars";
import { getSeller } from "@/lib/cars";
import { formatKes } from "@/lib/format";
import { adviserRateLimit } from "@/lib/rate-limit";

const routeSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required.")
    .max(800, "Message is too long (max 800 characters).")
    .transform((v) => v.trim()),
});

const SELLER_INFO = `
  Simcogy Motors sells its own verified used cars in Kenya.
  Only stock from Simcogy Motors is listed here: inspected, clear pricing, no third parties.
  Vehicles are either locally used, foreign used, or brand new.
  Never invent seller phones, WhatsApp numbers, prices, or features; say straight.
`;

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const rateLimitResult = await adviserRateLimit(req);
  if (!rateLimitResult.success) {
    return rateLimitResult.response!;
  }

  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: "Car slug is required." }, { status: 400 });
  }
  const body = await req.json().catch(() => ({}));
  const { message } = routeSchema.parse(body);

  const car = await getCarBySlug(slug);
  if (!car) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }

  const seller = await getSeller();
  if (!seller) {
    return NextResponse.json({ error: "No seller configured" }, { status: 500 });
  }

  const prompt = [
    SELLER_INFO,
    `You are the car adviser for ${seller.name} (Simcogy Motors).`,
    `The vehicle is the ${car.year} ${car.make} ${car.model}${car.trim ? " " + car.trim : ""} (${car.body_type || "vehicle"}).`,
    `The asking price is ${formatKes(car.price)}.`,
    `The current listing is at ${process.env.NEXT_PUBLIC_SITE_URL || ""}/cars/${car.slug}.`,
    `The customer asked: ${message}`,
    `Answer in plain, friendly English. Keep it short. Use the price above if the customer asks what it costs; do not invent other prices. If you are unsure, say so and offer to pass the question to the team.`,
  ].join("\n");

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("GROQ_API_KEY is not set");
    return NextResponse.json(
      { error: "Car adviser is not configured." },
      { status: 503 }
    );
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SELLER_INFO },
          { role: "user", content: `Customer: ${message}${car ? ` | Vehicle: ${car.year} ${car.make} ${car.model}` : ""}` },
        ],
        temperature: 0.4,
        max_tokens: 300,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Groq error", res.status, data);
      return NextResponse.json(
        { error: "The car adviser is busy right now. Please try again." },
        { status: 503 }
      );
    }

    const text = (data.choices?.[0]?.message?.content ?? "").trim();
    if (!text) {
      return NextResponse.json(
        { error: "The car adviser did not answer." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("Groq request failed", err);
    return NextResponse.json(
      { error: "The car adviser is not available right now." },
      { status: 503 }
    );
  }
}
