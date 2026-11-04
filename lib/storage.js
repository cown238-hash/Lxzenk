// lib/storage.js
// Netlify Blobs is a key/value store for files. We keep every uploaded image
// in one store called "images". The key is a random id; the value is the file.
import { getStore } from "@netlify/blobs";

export function getImageStore() {
  return getStore("images");
}
