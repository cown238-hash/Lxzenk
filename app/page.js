// app/page.js — Home page ("/")
// Runs on the server: reads ?q from the URL, loads matching images from the
// database, and renders the grid. No client-side data fetching needed.
import SearchBar from "@/components/SearchBar";
import ImageGrid from "@/components/ImageGrid";
import EmptyState from "@/components/EmptyState";
import { listImages } from "@/lib/images";

// Always load fresh data so new uploads appear immediately.
export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }) {
  const { q = "" } = await searchParams; // in Next.js 15, searchParams is a Promise
  const query = typeof q === "string" ? q : "";
  const images = await listImages(query);

  return (
    <>
      <section className="flex flex-col gap-6 pb-8 pt-10 sm:flex-row sm:items-end sm:justify-between sm:pt-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-flare">Library</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Every frame, in one place.</h1>
          <p className="mt-3 font-mono text-sm text-muted">
            {query
              ? `${images.length} result${images.length === 1 ? "" : "s"} for “${query}”`
              : `${images.length} image${images.length === 1 ? "" : "s"} uploaded`}
          </p>
        </div>
        <SearchBar initialQuery={query} />
      </section>

      {images.length > 0 ? <ImageGrid images={images} /> : <EmptyState query={query} />}
    </>
  );
}
