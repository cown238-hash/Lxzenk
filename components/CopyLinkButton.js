"use client";
// components/CopyLinkButton.js
// Copies the full image address (https://your-site/files/...) to the clipboard.
import { useState } from "react";

export default function CopyLinkButton({ path, className = "" }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = new URL(path, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Older browsers: fall back to a prompt the user can copy from.
      window.prompt("Copy this link:", url);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
        copied ? "bg-emerald-400 text-ink" : "bg-flare text-ink hover:bg-paper"
      } ${className}`}
    >
      {copied ? (
        <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M8.5 11.5a3.5 3.5 0 005 0l2.5-2.5a3.5 3.5 0 00-5-5l-1 1" strokeLinecap="round" />
          <path d="M11.5 8.5a3.5 3.5 0 00-5 0L4 11a3.5 3.5 0 005 5l1-1" strokeLinecap="round" />
        </svg>
      )}
      <span aria-live="polite">{copied ? "Link copied!" : "Copy image link"}</span>
    </button>
  );
}
