// lib/constants.js
// Shared settings used by both the browser (upload form) and the server (API).

// Netlify Functions accept request bodies up to about 6 MB, so we stay under it.
export const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif"];
