import { readStoredFile } from "@/lib/storage";

type Params = Promise<{ path: string[] }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  const { path } = await params;

  let file;
  try {
    file = await readStoredFile(path.join("/"));
  } catch {
    return new Response("Not found", { status: 404 });
  }
  if (!file) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(file.body), {
    headers: {
      "Content-Type": file.contentType,
      // File names are random and never reused, so they can be cached forever.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
