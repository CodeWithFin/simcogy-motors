import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import sql from "@/lib/db";
import { deleteStoredFile, saveCarImage } from "@/lib/storage";

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    const carId = form.get("carId");

    if (!(file instanceof File) || typeof carId !== "string") {
      return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
    }

    const car = await sql`SELECT id FROM cars WHERE id = ${carId} LIMIT 1`;
    if (!car[0]) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    let stored: Awaited<ReturnType<typeof saveCarImage>>;
    try {
      stored = await saveCarImage(carId, file);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid image";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    try {
      const count = await sql`
        SELECT COUNT(*)::int AS n FROM car_images WHERE car_id = ${carId}
      `;
      const isCover = (count[0]?.n ?? 0) === 0;
      const position = count[0]?.n ?? 0;

      const rows = await sql`
        INSERT INTO car_images (car_id, storage_key, url, alt_text, position, is_cover)
        VALUES (
          ${carId},
          ${stored.key},
          ${stored.url},
          ${file.name.slice(0, 150)},
          ${position},
          ${isCover}
        )
        RETURNING *
      `;

      return NextResponse.json({ image: rows[0] }, { status: 201 });
    } catch (err) {
      await deleteStoredFile(stored.key);
      throw err;
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
