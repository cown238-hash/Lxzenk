import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { query } from '../db.js';
import { requireAuth, requireRole } from '../auth.js';
import { HttpError, asyncRoute, messageInput, parse, subscribeInput } from '../validate.js';

export const inboxRouter = Router();
export const publicRouter = Router();

const publicLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

// ---------------------------------------------------------------- public
publicRouter.post(
  '/contact',
  publicLimiter,
  asyncRoute((req, res) => {
    const d = parse(messageInput, req.body);
    query.run(
      'INSERT INTO messages (name, email, subject, body) VALUES (?, ?, ?, ?)',
      d.name.trim(),
      d.email.toLowerCase().trim(),
      d.subject?.trim() || null,
      d.body.trim()
    );
    res.status(201).json({ ok: true, message: 'Thanks — your message is in the inbox.' });
  })
);

publicRouter.post(
  '/subscribe',
  publicLimiter,
  asyncRoute((req, res) => {
    const { email } = parse(subscribeInput, req.body);
    const normalised = email.toLowerCase().trim();
    if (query.get('SELECT 1 AS hit FROM subscribers WHERE email = ?', normalised)) {
      throw new HttpError(409, 'That email is already subscribed');
    }
    query.run('INSERT INTO subscribers (email) VALUES (?)', normalised);
    res.status(201).json({ ok: true, message: 'Subscribed. Welcome aboard.' });
  })
);

// ------------------------------------------------------------------ auth
inboxRouter.get(
  '/messages',
  requireAuth,
  asyncRoute((_req, res) => {
    res.json({ messages: query.all('SELECT * FROM messages ORDER BY created_at DESC') });
  })
);

inboxRouter.patch(
  '/messages/:id',
  requireAuth,
  asyncRoute((req, res) => {
    const info = query.run('UPDATE messages SET read = ? WHERE id = ?', req.body.read ? 1 : 0, req.params.id);
    if (!info.changes) throw new HttpError(404, 'Message not found');
    res.json({ ok: true });
  })
);

inboxRouter.delete(
  '/messages/:id',
  requireAuth,
  asyncRoute((req, res) => {
    const info = query.run('DELETE FROM messages WHERE id = ?', req.params.id);
    if (!info.changes) throw new HttpError(404, 'Message not found');
    res.json({ ok: true });
  })
);

inboxRouter.get(
  '/subscribers',
  requireAuth,
  asyncRoute((_req, res) => {
    res.json({ subscribers: query.all('SELECT * FROM subscribers ORDER BY created_at DESC') });
  })
);

inboxRouter.delete(
  '/subscribers/:id',
  requireRole('admin', 'editor'),
  asyncRoute((req, res) => {
    const info = query.run('DELETE FROM subscribers WHERE id = ?', req.params.id);
    if (!info.changes) throw new HttpError(404, 'Subscriber not found');
    res.json({ ok: true });
  })
);

/** Counts for the dashboard cards. */
inboxRouter.get(
  '/stats',
  requireAuth,
  asyncRoute((_req, res) => {
    const one = (sql) => query.get(sql).n;
    res.json({
      projects: one('SELECT COUNT(*) AS n FROM projects'),
      publishedProjects: one('SELECT COUNT(*) AS n FROM projects WHERE published = 1'),
      articles: one('SELECT COUNT(*) AS n FROM articles'),
      publishedArticles: one('SELECT COUNT(*) AS n FROM articles WHERE published = 1'),
      messages: one('SELECT COUNT(*) AS n FROM messages'),
      unreadMessages: one('SELECT COUNT(*) AS n FROM messages WHERE read = 0'),
      subscribers: one('SELECT COUNT(*) AS n FROM subscribers'),
    });
  })
);
