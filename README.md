# LXZENK

Full-stack portfolio: a React + Vite client backed by an Express + SQLite API with
cookie-based JWT auth and a CMS for projects, articles, inbox messages and subscribers.

```
.
├── client/            React 18 + Vite (public site + admin dashboard)
│   └── src/
│       ├── pages/         public routes: Home, Work, CaseStudy, Journal, Article, Contact
│       ├── pages/admin/   CMS routes: Login, Register, Dashboard, Projects, Articles, Messages
│       ├── layouts/        PublicLayout (nav + footer), AdminLayout (sidebar shell)
│       ├── context/        AuthContext — session state shared across routes
│       ├── components/     small feedback primitives
│       └── lib/api.js      typed-ish wrapper over every endpoint
├── server/            Express 4 + node:sqlite + JWT
│   └── src/
│       ├── index.js       app wiring, static SPA hosting, error handling
│       ├── db.js          schema + `query` helper over node:sqlite
│       ├── auth.js        password hashing, token signing, route guards
│       ├── validate.js    zod schemas and the HttpError type
│       ├── seed.js        first-run admin account and starter content
│       └── routes/        auth, projects, articles, inbox
└── package.json       dev/build/start scripts that fan out to both halves
```

## Requirements

Node 22.5 or newer (uses the built-in `node:sqlite` module — no native build step).
Node 24 is what this was developed against.

## Setup

```bash
npm run install:all     # installs root, server and client dependencies
```

Create your environment file:

```bash
cp server/.env.example server/.env    # macOS / Linux
Copy-Item server/.env.example server/.env   # PowerShell
```

Then edit `server/.env` and set a real secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

The values that matter:

| Variable | Purpose |
| --- | --- |
| `JWT_SECRET` | Signs session tokens. Change it before deploying. |
| `JWT_EXPIRES_IN` | Token lifetime, default `7d`. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded into the database on first run. |
| `CLIENT_ORIGIN` | Comma-separated CORS origins. |
| `PORT` | API port, default `4000`. |

## Run in development

```bash
npm run dev
```

This starts the API on `http://localhost:4000` and Vite on `http://localhost:5173`.
Vite proxies `/api` to Express, so both halves talk over the same origin and the
httpOnly session cookie just works. Open **5173** in the browser.

Sign in with the admin credentials from `server/.env` at `/login`.

## Production

```bash
npm run build    # builds the client into client/dist
npm start        # Express serves the API and the built SPA on PORT
```

Once `client/dist` exists the server mounts it as a static site and falls back to
`index.html` for every non-`/api` route, so client-side routing works on a hard refresh.

## API

Public — no token needed:

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/api/health` | Liveness check. |
| `GET` | `/api/projects` | Published projects, ordered by `sort_order`. |
| `GET` | `/api/articles` | Published articles, newest first. |
| `POST` | `/api/public/contact` | Store an inbox message. Rate limited. |
| `POST` | `/api/public/subscribe` | Add an email to the list. Rate limited. |

Authenticated — cookie or `Authorization: Bearer <token>`:

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/api/auth/register` | New accounts get the `editor` role. |
| `POST` | `/api/auth/login` | Sets the `lxz_token` httpOnly cookie. |
| `POST` | `/api/auth/logout` | Clears the cookie. |
| `GET` | `/api/auth/me` | Current user, used for session restore. |
| `GET/POST/PUT/DELETE` | `/api/cms/projects[/:slug]` | Full CRUD, includes drafts. |
| `GET/POST/PUT/DELETE` | `/api/cms/articles[/:slug]` | Full CRUD, includes drafts. |
| `GET` | `/api/cms/messages` | Inbox, newest first. |
| `PATCH` | `/api/cms/messages/:id` | Toggle read state. |
| `DELETE` | `/api/cms/messages/:id` | Remove a message. |
| `GET` | `/api/cms/subscribers` | Mailing list. |
| `DELETE` | `/api/cms/subscribers/:id` | Remove a subscriber. |
| `GET` | `/api/cms/stats` | Counts for the dashboard. |

## Adding content

Everything is edited in the dashboard, not in files. Two conveniences worth knowing:

- Slugs auto-generate from the title until you edit them by hand.
- Article bodies are written as plain text: blank line for a new paragraph, `## `
  at the start of a line for a heading. The editor converts it to HTML on save.

## Database

SQLite lives at `server/data/lxzenk.db` and is gitignored. To start over:

```bash
npm run db:reset
```

That deletes the file and re-seeds the admin account plus three starter projects
and four articles.

## Deploying

The app needs a writable filesystem for the SQLite file and Node 22.5+.

- **Railway / Render / Fly.io** — build `npm run build`, start `npm start`, and
  mount a volume at `server/data`.
- **A VPS** — same commands behind nginx or Caddy for TLS.
- **GitHub Pages** will not work: there is no server to run the API.

Set `NODE_ENV=production`, a strong `JWT_SECRET`, and add your real domain to
`CLIENT_ORIGIN` before going live. The cookie is marked `Secure` automatically
in production, so serve it over HTTPS.
