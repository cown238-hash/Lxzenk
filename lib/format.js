// lib/format.js
// Small helpers that turn raw values into friendly text.

// 1532000 -> "1.5 MB"
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Date -> "Nov 4, 2026"
export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(date));
}

// Date -> "Nov 4, 2026, 7:15 PM UTC"
export function formatDateTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(date));
}

// The public address of an image file, e.g. "/files/3f2c...".
export function fileUrl(blobKey) {
  return `/files/${blobKey}`;
}
