import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import sql from "@/lib/db";

type Params = Promise<{ id: string }>;

const schema = z.object({
  status: z.enum([
    "new",
    "contacted",
    "test_drive_booked",
    "negotiating",
    "won",
    "lost",
  ]),
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
    const { status } = schema.parse(await req.json());
    await sql`UPDATE leads SET status = ${status} WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
