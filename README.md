# KONRXVDO

An image library app built for beginners. You can upload images (drag and drop works), see them all on the home page, search them by name, open a detail page for each one, and copy a link to share.

**Stack:** Next.js 15 (App Router) · JavaScript · Tailwind CSS v4 · Netlify Blobs (file storage) · Netlify Database (Postgres, through Drizzle ORM)

---

## Features

| Feature | Where it lives |
| --- | --- |
| Home page that lists every image | `app/page.js` |
| Search by name (`?q=cat`) | `components/SearchBar.js` → `lib/images.js` |
| Upload page with drag & drop | `app/upload/page.js` + `components/UploadForm.js` |
| Loading indicator with progress % | inside `UploadForm.js` |
| "Upload complete" notification | `components/Toast.js` |
| Image detail page (name, date, size, type) | `app/images/[id]/page.js` |
| Copy image link button | `components/CopyLinkButton.js` |
| Works on phones and desktops | Tailwind responsive classes (`sm:`, `lg:`) |

---

## Project structure

```
app/                      ← pages and API routes (Next.js App Router)
  layout.js               ← wraps every page (fonts, header, footer)
  globals.css             ← Tailwind and the color theme
  page.js                 ← "/"            home page and search
  upload/page.js          ← "/upload"      upload page
  images/[id]/page.js     ← "/images/12"   detail page
  api/upload/route.js     ← POST /api/upload  saves a new image
  files/[key]/route.js    ← GET  /files/…     sends the image file
  loading.js / error.js / not-found.js        ← shared loading, error and 404 screens
components/               ← reusable UI pieces
  Header.js  SearchBar.js  ImageGrid.js  ImageCard.js
  UploadForm.js  Toast.js  CopyLinkButton.js  EmptyState.js
lib/                      ← plain helper code (no UI)
  images.js               ← every database query
  storage.js              ← connects to Netlify Blobs
  format.js               ← turns bytes and dates into readable text
  constants.js            ← max file size and allowed types
db/
  schema.ts               ← the database table definition
  index.js                ← the database client
netlify/database/migrations/  ← SQL that creates the table (applied on deploy)
public/                   ← static files (favicon)
```

---

## SQL: creating the table

The table is defined in `db/schema.ts`. Drizzle turns that definition into this SQL, which is saved in `netlify/database/migrations/`:

```sql
CREATE TABLE "images" (
  "id"           serial PRIMARY KEY,                       -- 1, 2, 3 … set automatically
  "name"         text NOT NULL,                            -- file name people see and search
  "blob_key"     text NOT NULL UNIQUE,                     -- where the file is kept in Netlify Blobs
  "content_type" text NOT NULL,                            -- e.g. image/png
  "size"         integer NOT NULL,                         -- size in bytes
  "created_at"   timestamp with time zone DEFAULT now() NOT NULL  -- upload date
);

CREATE INDEX "images_created_at_idx" ON "images" ("created_at");  -- makes "newest first" fast
```

You don't run this yourself. **Netlify runs it for you on every deploy.** Each migration runs once per database.

> **Why two storage systems?** Databases are good at small, searchable facts like names and dates. Blob storage is good at big files like images. So the file goes into **Blobs**, and its details (plus the key that points to it) go into the **Database**.

---

## Installation

### 1. What you need

- [Node.js](https://nodejs.org) 20 or newer (check with `node -v`)
- A free [Netlify](https://netlify.com) account
- The Netlify CLI: `npm install -g netlify-cli`

### 2. Get the code and install packages

```bash
git clone <your-repo-url> konrxvdo
cd konrxvdo
npm install
```

### 3. Connect to your Netlify site

```bash
netlify login      # opens the browser so you can sign in
netlify link       # pick your site (or run `netlify init` to create a new one)
```

### 4. Run it locally

```bash
netlify dev
```

Open the address it prints (usually http://localhost:8888). `netlify dev` starts Next.js **and** emulates Netlify Blobs and Netlify Database on your computer, so uploads work locally. Plain `npm run dev` won't connect to them.

The first time, create the table in your local database (this runs the SQL below on your computer only):

```bash
netlify db migrations apply
```

### 5. Deploy

Push to GitHub. If the repository is connected to Netlify, it deploys automatically. You can also run:

```bash
netlify deploy --prod
```

During the deploy, Netlify:
1. builds the Next.js app,
2. creates the database (on the first deploy) and runs the migration SQL,
3. publishes the site.

### Changing the table later

1. Edit `db/schema.ts` (for example, add a column).
2. Run `npx drizzle-kit generate --name add_my_column`. This writes a new SQL file in `netlify/database/migrations/`.
3. Commit and deploy. Netlify applies the new file.

Never edit a migration file that has already been deployed. Always add a new one.

---

## How the code works (for beginners)

### Server components vs. client components

Next.js runs files on the **server** unless they start with `"use client"`.

- **Server** (`app/page.js`, `app/images/[id]/page.js`): can talk to the database directly. The browser only receives the finished HTML.
- **Client** (`UploadForm.js`, `SearchBar.js`, `CopyLinkButton.js`, `Toast.js`): run in the browser. They can use `useState`, react to clicks, read dropped files and use the clipboard.

### What happens when you upload

1. **You drop a file** on the dashed box. `handleDrop` reads `event.dataTransfer.files[0]`.
2. **The browser checks it** (`validateFile`): is it an image, and is it under 4 MB? If not, you see an error right away.
3. **A preview appears.** `URL.createObjectURL(file)` makes a temporary local link to the file.
4. **You click "Upload image".** The file goes into a `FormData` and is sent with `XMLHttpRequest`. We use XHR instead of `fetch` because XHR can report upload progress, which drives the progress bar.
5. **The server route** `app/api/upload/route.js`:
   - checks the file again (never trust the browser alone),
   - creates a random key with `crypto.randomUUID()`,
   - saves the file in Netlify Blobs: `store.set(key, bytes)`,
   - saves a row in the database: `db.insert(images).values({...})`.
6. **The success toast appears**, and `router.refresh()` tells Next.js to reload server data, so the home page includes the new image.

### How search works

`SearchBar` waits until you stop typing for 300 ms (a "debounce"), then changes the URL to `/?q=yourword`. The home page reads `q` on the server and runs:

```js
db.select().from(images).where(ilike(images.name, `%${q}%`))
```

`ilike` means "contains, ignoring upper/lower case". Because the search term is in the URL, you can bookmark or share a search.

### How images are shown

Every file has a permanent address: `/files/<key>`. The route `app/files/[key]/route.js` checks that the key exists in the database, loads the file from Blobs and sends it with long cache headers. The file never changes after upload, so browsers and the CDN can keep a copy.

`next/image` (used in `ImageCard` and the detail page) resizes the images automatically. On Netlify it uses the Netlify Image CDN, so the grid loads small thumbnails instead of full-size files.

### How "Copy image link" works

```js
const url = new URL("/files/abc…", window.location.origin).toString();
await navigator.clipboard.writeText(url);
```

It builds the full `https://…` address and copies it to the clipboard. The button then says "Link copied!" for 2 seconds.

### Responsive design

Tailwind classes without a prefix apply to all screens. `sm:` applies from 640px wide and up, and `lg:` from 1024px and up. For example, the grid uses `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`: 1 column on phones, 2 on tablets, 3 on desktops.

---

## Limits and ideas for next steps

- Files can be at most **4 MB**, because Netlify Functions accept request bodies up to about 6 MB.
- There is no login, so anyone with the site URL can upload. To limit uploads to signed-in users, add Netlify Identity.
- Ideas: delete or rename images, upload several files at once, add tags.
