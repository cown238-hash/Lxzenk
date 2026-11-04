"use client";
// app/error.js — shown if something crashes while rendering a page
export default function Error({ reset }) {
  return (
    <div className="flex flex-col items-center py-28 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted">Please try again in a moment.</p>
      <button onClick={reset} className="mt-6 rounded-full bg-flare px-5 py-2.5 text-sm font-semibold text-ink">
        Try again
      </button>
    </div>
  );
}
