// app/upload/page.js — Upload page ("/upload")
// A thin page: all the interactive work happens inside <UploadForm />.
import UploadForm from "@/components/UploadForm";

export const metadata = { title: "Upload" };

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-2xl pt-10 sm:pt-16">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-flare">Upload</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Add an image</h1>
      <p className="mb-8 mt-3 text-muted">Drop a file below. It gets a permanent link you can share anywhere.</p>
      <UploadForm />
    </div>
  );
}
