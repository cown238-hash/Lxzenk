import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../auth.js';
import { HttpError, asyncRoute, parse, parseJsonArray, projectInput } from '../validate.js';

export const projectsRouter = Router();

const shape = (row) =>
  row && {
    ...row,
    tags: parseJsonArray(row.tags),
    gallery: parseJsonArray(row.gallery),
    results: parseJsonArray(row.results),
    published: Boolean(row.published),
  };

/** Public list — published only, ordered by sort_order. */
export const listPublishedProjects = () =>
  query.all('SELECT * FROM projects WHERE published = 1 ORDER BY sort_order ASC, id ASC').map(shape);

/** CMS list — everything, including drafts. */
projectsRouter.get(
  '/',
  requireAuth,
  asyncRoute((_req, res) => {
    const rows = query.all('SELECT * FROM projects ORDER BY sort_order ASC, id ASC');
    res.json({ projects: rows.map(shape) });
  })
);

projectsRouter.get(
  '/:slug',
  requireAuth,
  asyncRoute((req, res) => {
    const row = query.get('SELECT * FROM projects WHERE slug = ?', req.params.slug);
    if (!row) throw new HttpError(404, 'Project not found');
    res.json({ project: shape(row) });
  })
);

projectsRouter.post(
  '/',
  requireAuth,
  asyncRoute((req, res) => {
    const d = parse(projectInput, req.body);
    if (query.get('SELECT 1 AS hit FROM projects WHERE slug = ?', d.slug)) {
      throw new HttpError(409, 'That slug is already used by another project');
    }
    const info = query.run(
      `INSERT INTO projects
       (slug, title, category, year, tags, image, statement, gallery, challenge, approach, results, published, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      d.slug,
      d.title,
      d.category,
      d.year ?? null,
      JSON.stringify(d.tags),
      d.image || null,
      d.statement ?? null,
      JSON.stringify(d.gallery),
      d.challenge ?? null,
      d.approach ?? null,
      JSON.stringify(d.results),
      d.published === false ? 0 : 1,
      d.sortOrder ?? 0
    );
    const row = query.get('SELECT * FROM projects WHERE id = ?', Number(info.lastInsertRowid));
    res.status(201).json({ project: shape(row) });
  })
);

projectsRouter.put(
  '/:slug',
  requireAuth,
  asyncRoute((req, res) => {
    const d = parse(projectInput, req.body);
    const clash = query.get(
      'SELECT 1 AS hit FROM projects WHERE slug = ? AND slug != ?',
      d.slug,
      req.params.slug
    );
    if (clash) throw new HttpError(409, 'That slug is already used by another project');

    query.run(
      `UPDATE projects SET
         slug = ?, title = ?, category = ?, year = ?, tags = ?, image = ?, statement = ?,
         gallery = ?, challenge = ?, approach = ?, results = ?, published = ?, sort_order = ?,
         updated_at = datetime('now')
       WHERE slug = ?`,
      d.slug,
      d.title,
      d.category,
      d.year ?? null,
      JSON.stringify(d.tags),
      d.image || null,
      d.statement ?? null,
      JSON.stringify(d.gallery),
      d.challenge ?? null,
      d.approach ?? null,
      JSON.stringify(d.results),
      d.published === false ? 0 : 1,
      d.sortOrder ?? 0,
      req.params.slug
    );
    const row = query.get('SELECT * FROM projects WHERE slug = ?', d.slug);
    res.json({ project: shape(row) });
  })
);

projectsRouter.delete(
  '/:slug',
  requireAuth,
  asyncRoute((req, res) => {
    const info = query.run('DELETE FROM projects WHERE slug = ?', req.params.slug);
    if (!info.changes) throw new HttpError(404, 'Project not found');
    res.json({ ok: true });
  })
);
