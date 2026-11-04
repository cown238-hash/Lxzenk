"use client";
// components/Toast.js
// A small pop-up message in the corner. Closes itself after a few seconds.
import { useEffect } from "react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96" role="status" aria-live="polite">
      <div
        className={`flex animate-toast-in items-start gap-3 rounded-2xl border bg-raised p-4 shadow-2xl shadow-black/50 ${
          isError ? "border-red-500/50" : "border-emerald-400/40"
        }`}
      >
        <span
          className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-ink ${
            isError ? "bg-red-400" : "bg-emerald-400"
          }`}
          aria-hidden="true"
        >
          {isError ? "!" : "✓"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.message && <p className="mt-0.5 text-sm text-muted">{toast.message}</p>}
          {toast.action}
        </div>
        <button type="button" onClick={onClose} className="text-muted hover:text-paper" aria-label="Close notification">
          ✕
        </button>
      </div>
    </div>
  );
}
