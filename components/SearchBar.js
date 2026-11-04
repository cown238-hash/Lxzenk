"use client";
// components/SearchBar.js
// A search box that updates the address bar (?q=...) as you type.
// The home page reads ?q on the server and only returns matching images.
import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function SearchBar({ initialQuery = "" }) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  // Wait 300 ms after the last keystroke before searching ("debounce"),
  // so we don't hit the server on every single letter.
  useEffect(() => {
    if (value.trim() === initialQuery.trim()) return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (value.trim()) params.set("q", value.trim());
      const query = params.toString();
      startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }));
    }, 300);
    return () => clearTimeout(timer);
  }, [value, initialQuery, pathname, router]);

  return (
    <form role="search" onSubmit={(e) => e.preventDefault()} className="relative w-full sm:max-w-sm">
      <label htmlFor="search" className="sr-only">
        Search images by name
      </label>
      <svg
        viewBox="0 0 20 20"
        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="9" cy="9" r="6" />
        <path d="M14 14l4 4" strokeLinecap="round" />
      </svg>
      <input
        id="search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by name…"
        autoComplete="off"
        className="h-12 w-full rounded-full border border-line bg-surface pl-11 pr-11 text-sm text-paper placeholder:text-muted focus:border-flare focus:outline-none focus:ring-4 focus:ring-flare-soft"
      />
      {isPending && (
        <span
          className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin rounded-full border-2 border-muted border-t-flare"
          aria-label="Searching"
        />
      )}
    </form>
  );
}
