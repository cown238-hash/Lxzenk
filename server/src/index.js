import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { query } from './db.js';
import { HttpError, notFound } from './validate.js';
import { authRouter } from './routes/auth.js';
import { projectsRouter, listPublishedProjects } from './routes/projects.js';
import { articlesRouter, listPublishedArticles } from './routes/articles.js';
import { inboxRouter, publicRouter } from './routes/inbox.js';
import { ensureSeed } from './seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_DIST = path.join(__dirname, '..', '..', 'client', 'dist');

ensureSeed();

// ------------------------------------------------------------------ setup
app.set('trust proxy', 1);
app.use(
  helmet({
    // The API also serves the built SPA, so relax the asset policies here.
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  cors({
    origin: (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim()),
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// ----------------------------------------------------------------- routes
app.get('/api/health', (_req, res) => res.json({ ok: true, uptime: process.uptime() }));

// Auth
app.use('/api/auth', authRouter);

// CMS (protected)
app.use('/api/cms/projects', projectsRouter);
app.use('/api/cms/articles', articlesRouter);
app.use('/api/cms', inboxRouter);

// Public content (read) + public forms (write)
app.get('/api/projects', (_req, res) => res.json({ projects: listPublishedProjects() }));
app.get('/api/articles', (_req, res) => res.json({ articles: listPublishedArticles() }));
app.use('/api/public', publicRouter);

// ------------------------------------------- static SPA (production only)
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get(/^(?!\/api\/).*/, (_req, res) => res.sendFile(path.join(CLIENT_DIST, 'index.html')));
} else {
  app.get('/', (_req, res) =>
    res
      .status(200)
      .type('text/plain')
      .send('LXZENK API is running. Run "npm run build" in client/ to serve the SPA from this server.')
  );
}

app.use(notFound);

// ---------------------------------------------------------- error handler
app.use((err, _req, res, _next) => {
  const status = err instanceof HttpError ? err.status : 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: status >= 500 ? 'Something went wrong on the server' : err.message,
  });
});

app.listen(PORT, () => {
  const admin = query.get("SELECT email FROM users WHERE role = 'admin' ORDER BY id LIMIT 1");
  console.log(`\n  LXZENK API ready → http://localhost:${PORT}/api`);
  if (admin) console.log(`  Admin account   → ${admin.email} (see server/.env for the password)\n`);
});
