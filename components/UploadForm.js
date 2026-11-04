"use client";
// components/UploadForm.js
// The upload box. You can drag & drop an image or click to pick one.
// While uploading we show a progress bar, and when it's done a success toast.
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Toast from "./Toast";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { formatBytes } from "@/lib/format";

// Check the file in the browser first, so people get instant feedback.
function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) return "Only JPG, PNG, GIF, WebP or AVIF images are allowed.";
  if (file.size > MAX_FILE_SIZE) return `That image is ${formatBytes(file.size)}. The limit is 4 MB.`;
  return null;
}

// fetch() can't report upload progress, so we use the older XMLHttpRequest for that.
function uploadWithProgress(formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.responseType = "json";
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      const body = xhr.response ?? {};
      if (xhr.status >= 200 && xhr.status < 300) resolve(body.image);
      else reject(new Error(body.error || "Upload failed. Please try again."));
    };
    xhr.onerror = () => reject(new Error("Network error. Check your connection and try again."));
    xhr.send(formData);
  });
}

export default function UploadForm() {
  const router = useRouter();
  const inputRef = useRef(null);

  const [file, setFile] = useState(null); // the chosen File object
  const [name, setName] = useState(""); // name to save it under
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const closeToast = useCallback(() => setToast(null), []);

  // Create a temporary local URL so we can preview the image before uploading.
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url); // free memory when the file changes
  }, [file]);

  function chooseFile(selected) {
    if (!selected) return;
    const problem = validateFile(selected);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setFile(selected);
    setName(selected.name);
  }

  function reset() {
    setFile(null);
    setName("");
    setProgress(0);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  // --- Drag & drop handlers ------------------------------------------------
  function handleDragOver(event) {
    event.preventDefault(); // required, otherwise the browser just opens the file
    if (!isUploading) setIsDragging(true);
  }
  function handleDragLeave(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) setIsDragging(false);
  }
  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    if (!isUploading) chooseFile(event.dataTransfer.files?.[0]);
  }

  // --- Submit --------------------------------------------------------------
  async function handleSubmit(event) {
    event.preventDefault();
    if (!file || isUploading) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name.trim() || file.name);

    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      const image = await uploadWithProgress(formData, setProgress);
      setToast({
        type: "success",
        title: "Upload complete",
        message: `“${image.name}” is now in your library.`,
        action: (
          <Link href={`/images/${image.id}`} className="mt-2 inline-block text-sm font-semibold text-flare hover:underline">
            View image →
          </Link>
        ),
      });
      reset();
      router.refresh(); // so the home page shows the new image right away
    } catch (err) {
      setError(err.message);
      setToast({ type: "error", title: "Upload failed", message: err.message });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Drop zone — it's a <label>, so clicking anywhere opens the file picker */}
        <label
          htmlFor="file"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex min-h-72 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed p-6 text-center transition-colors sm:min-h-80 ${
            isDragging
              ? "border-flare bg-flare-soft"
              : "border-line bg-surface hover:border-muted"
          } ${isUploading ? "pointer-events-none" : ""}`}
        >
          <input
            ref={inputRef}
            id="file"
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            className="sr-only"
            onChange={(e) => chooseFile(e.target.files?.[0])}
            disabled={isUploading}
          />

          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- local preview, not optimizable
            <img src={previewUrl} alt="Preview of the selected file" className="max-h-72 rounded-xl object-contain" />
          ) : (
            <>
              <div
                className={`mb-4 grid size-14 place-items-center rounded-2xl transition-colors ${
                  isDragging ? "bg-flare text-ink" : "bg-raised text-flare"
                }`}
              >
                <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M12 16V4m0 0l-4.5 4.5M12 4l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-lg font-bold">{isDragging ? "Drop it here" : "Drag & drop an image"}</p>
              <p className="mt-1 text-sm text-muted">
                or <span className="font-semibold text-paper underline decoration-flare underline-offset-4">browse your files</span>
              </p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted">
                JPG · PNG · GIF · WebP · AVIF — max 4 MB
              </p>
            </>
          )}

          {/* Loading overlay with progress bar */}
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/80 backdrop-blur-sm">
              <span className="size-10 animate-spin rounded-full border-4 border-line border-t-flare" aria-hidden="true" />
              <p className="font-mono text-sm">{progress < 100 ? `Uploading… ${progress}%` : "Saving…"}</p>
              <div className="h-1.5 w-2/3 max-w-xs overflow-hidden rounded-full bg-line">
                <div className="h-full rounded-full bg-flare transition-[width] duration-200" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </label>

        {error && (
          <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {file && (
          <div className="grid gap-4 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <label htmlFor="name" className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted">
                File name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={200}
                disabled={isUploading}
                className="h-11 w-full rounded-xl border border-line bg-ink px-3 text-sm focus:border-flare focus:outline-none focus:ring-4 focus:ring-flare-soft"
              />
              <p className="mt-1.5 font-mono text-[11px] text-muted">
                {file.type.replace("image/", "").toUpperCase()} · {formatBytes(file.size)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={reset}
                disabled={isUploading}
                className="h-11 flex-1 rounded-full border border-line px-5 text-sm text-muted transition-colors hover:text-paper disabled:opacity-50 sm:flex-none"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="h-11 flex-1 rounded-full bg-flare px-6 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60 sm:flex-none"
              >
                {isUploading ? "Uploading…" : "Upload image"}
              </button>
            </div>
          </div>
        )}
      </form>

      <Toast toast={toast} onClose={closeToast} />
    </>
  );
}
