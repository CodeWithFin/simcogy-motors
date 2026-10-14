import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

const CONTENT_TYPES: Record<string, string> = Object.fromEntries(
  Object.entries(EXTENSIONS).map(([type, ext]) => [ext, type])
);

function uploadRoot() {
  return path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads"));
}

/** Resolves a storage key to an absolute path, refusing anything outside the upload folder. */
function resolveKey(key: string) {
  const root = uploadRoot();
  const full = path.resolve(root, key);
  if (!full.startsWith(root + path.sep)) {
    throw new Error("Invalid file path");
  }
  return full;
}

export function publicUrl(key: string) {
  return `/uploads/${key}`;
}

export async function saveCarImage(carId: string, file: File) {
  const ext = EXTENSIONS[file.type];
  if (!ext) {
    throw new Error("Only JPG, PNG, WEBP, AVIF or GIF images can be uploaded");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image is larger than 15 MB");
  }
  if (!/^[0-9a-f-]{36}$/i.test(carId)) {
    throw new Error("Invalid car id");
  }

  const key = `cars/${carId}/${randomUUID()}.${ext}`;
  const full = resolveKey(key);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, Buffer.from(await file.arrayBuffer()));

  return { key, url: publicUrl(key) };
}

export async function deleteStoredFile(key: string) {
  try {
    await unlink(resolveKey(key));
  } catch (err) {
    // Missing files (or keys from the old ImageKit setup) are not an error.
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("Could not delete stored file", key, err);
    }
  }
}

export async function readStoredFile(key: string) {
  const full = resolveKey(key);
  const ext = path.extname(full).slice(1).toLowerCase();
  const contentType = CONTENT_TYPES[ext === "jpeg" ? "jpg" : ext];
  if (!contentType) return null;
  try {
    return { body: await readFile(full), contentType };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}
