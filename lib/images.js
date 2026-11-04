// lib/images.js
// Every database query for images lives here, so pages stay short and readable.
import { desc, eq, ilike } from "drizzle-orm";
import { db } from "@/db";
import { images } from "@/db/schema";

// All images, newest first. If `search` is given, only names that contain it.
export async function listImages(search = "") {
  const term = search.trim();
  const query = db.select().from(images).orderBy(desc(images.createdAt), desc(images.id));

  if (!term) return query;

  // Escape % and _ so they are searched literally, then match anywhere in the name.
  const safe = term.replace(/[\\%_]/g, (char) => `\\${char}`);
  return query.where(ilike(images.name, `%${safe}%`));
}

// One image by its id, or null if it doesn't exist.
export async function getImageById(id) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId < 1) return null;

  const [image] = await db.select().from(images).where(eq(images.id, numericId)).limit(1);
  return image ?? null;
}

// One image by its storage key (used when serving the file).
export async function getImageByKey(blobKey) {
  const [image] = await db.select().from(images).where(eq(images.blobKey, blobKey)).limit(1);
  return image ?? null;
}

// Save a new row and return it.
export async function createImage({ name, blobKey, contentType, size }) {
  const [image] = await db.insert(images).values({ name, blobKey, contentType, size }).returning();
  return image;
}
