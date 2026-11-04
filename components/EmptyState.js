// components/EmptyState.js
// Shown when there are no images yet, or nothing matches the search.
import Link from "next/link";

export default function EmptyState({ query }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-line px-6 py-20 text-center">
      <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-raised text-flare">
        <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 16l5-5 4 4 3-3 6 6" strokeLinejoin="round" />
        </svg>
      </div>
      {query ? (
        <>
          <h2 className="text-xl font-bold">No images match “{query}”</h2>
          <p className="mt-2 max-w-sm text-sm text-muted">Try a shorter or different word.</p>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold">Your library is empty</h2>
          <p className="mt-2 max-w-sm text-sm text-muted">Upload your first image and it will show up here.</p>
          <Link
            href="/upload"
            className="mt-6 rounded-full bg-flare px-5 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
          >
            Upload an image
          </Link>
        </>
      )}
    </div>
  );
}
