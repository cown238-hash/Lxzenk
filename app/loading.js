// app/loading.js — shown automatically while a page loads its data
export default function Loading() {
  return (
    <div className="pt-16">
      <div className="h-4 w-24 animate-pulse rounded bg-raised" />
      <div className="mt-4 h-10 w-2/3 max-w-md animate-pulse rounded bg-raised" />
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-surface" />
        ))}
      </div>
    </div>
  );
}
