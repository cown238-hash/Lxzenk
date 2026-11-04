// app/not-found.js — shown for unknown pages or missing images
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center py-28 text-center">
      <p className="font-mono text-7xl font-bold text-flare">404</p>
      <h1 className="mt-4 text-2xl font-bold">We couldn’t find that</h1>
      <p className="mt-2 text-muted">The image may have been removed, or the link is wrong.</p>
      <Link href="/" className="mt-6 rounded-full bg-paper px-5 py-2.5 text-sm font-semibold text-ink hover:bg-flare">
        Back to library
      </Link>
    </div>
  );
}
