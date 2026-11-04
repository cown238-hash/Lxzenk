// components/ImageCard.js
// One tile in the grid: thumbnail, file name and upload date.
import Image from "next/image";
import Link from "next/link";
import { fileUrl, formatDate } from "@/lib/format";

export default function ImageCard({ image, index = 0 }) {
  return (
    <Link
      href={`/images/${image.id}`}
      className="group block animate-fade-up rounded-2xl border border-line bg-surface p-2 transition-colors hover:border-flare/60 focus-visible:border-flare focus-visible:outline-none"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-raised">
        <Image
          src={fileUrl(image.blobKey)}
          alt={image.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex items-baseline justify-between gap-3 px-2 pb-1 pt-3">
        <p className="truncate text-sm font-semibold" title={image.name}>
          {image.name}
        </p>
        <time dateTime={new Date(image.createdAt).toISOString()} className="shrink-0 font-mono text-[11px] text-muted">
          {formatDate(image.createdAt)}
        </time>
      </div>
    </Link>
  );
}
