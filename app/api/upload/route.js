// app/api/upload/route.js
// POST /api/upload — receives one image from the upload form.
// 1. Check the file  2. Save it in Netlify Blobs  3. Save its details in the database
import { getImageStore } from "@/lib/storage";
import { createImage } from "@/lib/images";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "@/lib/constants";

export async function POST(request) {
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Could not read the upload. Please try again." }, { status: 400 });
  }

  const file = formData.get("file");
  const customName = String(formData.get("name") ?? "").trim();

  // --- 1. Validate -------------------------------------------------------
  if (!file || typeof file === "string") {
    return Response.json({ error: "Please choose an image to upload." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json({ error: "Only JPG, PNG, GIF, WebP or AVIF images are allowed." }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: "That image is too large. The limit is 4 MB." }, { status: 400 });
  }

  const name = (customName || file.name || "Untitled").slice(0, 200);

  // --- 2. Store the file -------------------------------------------------
  // A random key means two files with the same name never overwrite each other.
  const blobKey = crypto.randomUUID();
  const store = getImageStore();
  await store.set(blobKey, await file.arrayBuffer(), {
    metadata: { contentType: file.type },
  });

  // --- 3. Save the details -----------------------------------------------
  try {
    const image = await createImage({ name, blobKey, contentType: file.type, size: file.size });
    return Response.json({ image }, { status: 201 });
  } catch (error) {
    // If the database fails, remove the file so we don't keep orphans around.
    await store.delete(blobKey);
    console.error("Failed to save image record", error);
    return Response.json({ error: "Something went wrong while saving. Please try again." }, { status: 500 });
  }
}
