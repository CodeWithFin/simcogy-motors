import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import sql from "@/lib/db";

type Params = Promise<{ id: string }>;

const schema = z.object({
  featured: z.boolean(),
});

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
    const { featured } = schema.parse(await req.json());

    const existing = await sql`SELECT id FROM cars WHERE id = ${id} LIMIT 1`;
    if (!existing[0]) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await sql`UPDATE cars SET featured = ${featured} WHERE id = ${id}`;
    return NextResponse.json({ id, featured });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
