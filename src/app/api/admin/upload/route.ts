import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import sql from "@/lib/db";
import { getImageKit } from "@/lib/imagekit";

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

    const buffer = Buffer.from(await file.arrayBuffer());
    const ik = getImageKit();
    const result = await ik.upload({
      file: buffer,
      fileName: file.name || `car-${carId}.jpg`,
      folder: `/simcogy-motors/${carId}`,
    });

    const count = await sql`
      SELECT COUNT(*)::int AS n FROM car_images WHERE car_id = ${carId}
    `;
    const isCover = (count[0]?.n ?? 0) === 0;
    const position = count[0]?.n ?? 0;

    const rows = await sql`
      INSERT INTO car_images (car_id, imagekit_file_id, url, alt_text, position, is_cover)
      VALUES (
        ${carId},
        ${result.fileId},
        ${result.url},
        ${file.name},
        ${position},
        ${isCover}
      )
      RETURNING *
    `;

    return NextResponse.json({ image: rows[0] }, { status: 201 });
  } catch (err) {
    console.error(err);
    const message =
      err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
