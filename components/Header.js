// components/Header.js
// Top bar with the logo and navigation. Sticks to the top while scrolling.
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="KONRXVDO home">
          <span className="grid size-7 place-items-center rounded-md bg-flare text-ink transition-transform group-hover:rotate-12">
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
              <path d="M4 5h16v14H4z" opacity=".25" />
              <path d="M4 19l5-6 4 4 3-3 4 5z" />
              <circle cx="15.5" cy="8.5" r="1.8" />
            </svg>
          </span>
          <span className="text-lg font-extrabold tracking-[0.18em]">KONRXVDO</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-paper"
          >
            Library
          </Link>
          <Link
            href="/upload"
            className="flex items-center gap-1.5 rounded-full bg-paper px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-flare"
          >
            <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M10 4v12M4 10h12" strokeLinecap="round" />
            </svg>
            Upload
          </Link>
        </nav>
      </div>
    </header>
  );
}
