// app/files/[key]/route.js
// GET /files/<key> — sends the actual image file to the browser.
// This is the link people copy and share.
import { getImageStore } from "@/lib/storage";
import { getImageByKey } from "@/lib/images";

// Keys are created with crypto.randomUUID(), so anything else can't be ours.
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function notFound() {
  return new Response("Image not found", { status: 404 });
}

export async function GET(request, { params }) {
  const { key } = await params;
  if (!UUID_PATTERN.test(key)) return notFound();

  // 1. Is this a known image? (The database is our list of uploads.)
  const image = await getImageByKey(key);
  if (!image) return notFound();

  // 2. Load the file itself from Netlify Blobs.
  const data = await getImageStore().get(key, { type: "arrayBuffer" });
  if (!data) return notFound();

  return new Response(data, {
    headers: {
      "Content-Type": image.contentType,
      // Files never change once uploaded, so browsers and the CDN may cache them for a long time.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
