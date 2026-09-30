import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../auth.js';
import { HttpError, articleInput, asyncRoute, parse } from '../validate.js';

export const articlesRouter = Router();

const shape = (row) => row && { ...row, published: Boolean(row.published) };

/** Public list — published only, newest first. */
export const listPublishedArticles = () =>
  query.all('SELECT * FROM articles WHERE published = 1 ORDER BY date DESC, id DESC').map(shape);

/** CMS list — everything, including drafts. */
articlesRouter.get(
  '/',
  requireAuth,
  asyncRoute((_req, res) => {
    const rows = query.all('SELECT * FROM articles ORDER BY date DESC, id DESC');
    res.json({ articles: rows.map(shape) });
  })
);

articlesRouter.get(
  '/:slug',
  requireAuth,
  asyncRoute((req, res) => {
    const row = query.get('SELECT * FROM articles WHERE slug = ?', req.params.slug);
    if (!row) throw new HttpError(404, 'Article not found');
    res.json({ article: shape(row) });
  })
);

articlesRouter.post(
  '/',
  requireAuth,
  asyncRoute((req, res) => {
    const d = parse(articleInput, req.body);
    if (query.get('SELECT 1 AS hit FROM articles WHERE slug = ?', d.slug)) {
      throw new HttpError(409, 'That slug is already used by another article');
    }
    const info = query.run(
      `INSERT INTO articles (slug, title, category, excerpt, image, content, date, read_time, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      d.slug,
      d.title,
      d.category,
      d.excerpt ?? null,
      d.image || null,
      d.content ?? null,
      d.date ?? new Date().toISOString().slice(0, 10),
      d.readTime ?? '5 min',
      d.published === false ? 0 : 1
    );
    const row = query.get('SELECT * FROM articles WHERE id = ?', Number(info.lastInsertRowid));
    res.status(201).json({ article: shape(row) });
  })
);

articlesRouter.put(
  '/:slug',
  requireAuth,
  asyncRoute((req, res) => {
    const d = parse(articleInput, req.body);
    const clash = query.get(
      'SELECT 1 AS hit FROM articles WHERE slug = ? AND slug != ?',
      d.slug,
      req.params.slug
    );
    if (clash) throw new HttpError(409, 'That slug is already used by another article');

    query.run(
      `UPDATE articles SET
         slug = ?, title = ?, category = ?, excerpt = ?, image = ?, content = ?,
         date = ?, read_time = ?, published = ?, updated_at = datetime('now')
       WHERE slug = ?`,
      d.slug,
      d.title,
      d.category,
      d.excerpt ?? null,
      d.image || null,
      d.content ?? null,
      d.date ?? new Date().toISOString().slice(0, 10),
      d.readTime ?? '5 min',
      d.published === false ? 0 : 1,
      req.params.slug
    );
    const row = query.get('SELECT * FROM articles WHERE slug = ?', d.slug);
    res.json({ article: shape(row) });
  })
);

articlesRouter.delete(
  '/:slug',
  requireAuth,
  asyncRoute((req, res) => {
    const info = query.run('DELETE FROM articles WHERE slug = ?', req.params.slug);
    if (!info.changes) throw new HttpError(404, 'Article not found');
    res.json({ ok: true });
  })
);
