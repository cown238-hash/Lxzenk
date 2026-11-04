// app/images/[id]/page.js — Detail page ("/images/123")
// Shows one image large, with its name, upload date, size and a copy-link button.
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyLinkButton from "@/components/CopyLinkButton";
import { getImageById } from "@/lib/images";
import { fileUrl, formatBytes, formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const image = await getImageById(id);
  return { title: image ? image.name : "Image not found" };
}

export default async function ImageDetailPage({ params }) {
  const { id } = await params; // in Next.js 15, params is a Promise
  const image = await getImageById(id);
  if (!image) notFound(); // shows app/not-found.js

  const src = fileUrl(image.blobKey);

  const details = [
    { label: "Uploaded", value: formatDateTime(image.createdAt) },
    { label: "Size", value: formatBytes(image.size) },
    { label: "Type", value: image.contentType.replace("image/", "").toUpperCase() },
  ];

  return (
    <div className="pt-6 sm:pt-10">
      <Link href="/" className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-paper">
        ← Back to library
      </Link>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_20rem] lg:gap-10">
        {/* The image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-surface lg:aspect-auto lg:min-h-[70vh]">
          <Image
            src={src}
            alt={image.name}
            fill
            priority
            sizes="(min-width: 1024px) 70vw, 100vw"
            className="object-contain p-2"
          />
        </div>

        {/* The info panel */}
        <aside className="flex flex-col gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-flare">Image #{image.id}</p>
            <h1 className="mt-2 break-words text-3xl font-extrabold tracking-tight">{image.name}</h1>
          </div>

          <dl className="divide-y divide-line rounded-2xl border border-line bg-surface">
            {details.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 px-4 py-3">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{item.label}</dt>
                <dd className="text-right text-sm">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-2">
            <CopyLinkButton path={src} />
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-line px-5 py-3 text-center text-sm text-muted transition-colors hover:border-muted hover:text-paper"
            >
              Open original ↗
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
