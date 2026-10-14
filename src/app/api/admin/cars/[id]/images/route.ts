import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import sql from "@/lib/db";
import { deleteStoredFile } from "@/lib/storage";

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
      SELECT storage_key FROM car_images
      WHERE id = ${imageId} AND car_id = ${carId}
      LIMIT 1
    `;
    if (rows[0]) {
      await sql`DELETE FROM car_images WHERE id = ${imageId}`;
      await deleteStoredFile(rows[0].storage_key);
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
