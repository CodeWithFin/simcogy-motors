import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import sql from "@/lib/db";
import { getImageKit } from "@/lib/imagekit";

type Params = Promise<{ id: string }>;

export async function PATCH(
  req: Request,
  { params }: { params: Params }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: carId } = await params;
  const body = await req.json();
  const { imageId, action } = body as {
    imageId: string;
    action: "cover" | "delete";
  };

  if (action === "cover") {
    await sql`UPDATE car_images SET is_cover = FALSE WHERE car_id = ${carId}`;
    await sql`
      UPDATE car_images SET is_cover = TRUE
      WHERE id = ${imageId} AND car_id = ${carId}
    `;
    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    const rows = await sql`
      SELECT imagekit_file_id FROM car_images
      WHERE id = ${imageId} AND car_id = ${carId}
      LIMIT 1
    `;
    if (rows[0]) {
      try {
        const ik = getImageKit();
        await ik.deleteFile(rows[0].imagekit_file_id);
      } catch (err) {
        console.error("ImageKit delete failed", err);
      }
      await sql`DELETE FROM car_images WHERE id = ${imageId}`;
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
