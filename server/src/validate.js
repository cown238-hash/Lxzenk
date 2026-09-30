import { z } from 'zod';

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const notFound = (_req, _res, next) => next(new HttpError(404, 'Route not found'));

/** Wraps async handlers so rejected promises reach the error middleware. */
export const asyncRoute = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const formats = {
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and dashes only'),
  title: z.string().min(1, 'Title is required').max(160),
  year: z.coerce.number().int().min(1990).max(2100).nullable().optional(),
  image: z.string().url('Must be a valid URL').or(z.literal('')).nullable().optional(),
  published: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
};

export const projectInput = z.object({
  slug: formats.slug,
  title: formats.title,
  category: z.enum(['web', 'branding', 'mobile', 'other']).default('web'),
  year: formats.year,
  tags: z.array(z.string()).default([]),
  image: formats.image,
  statement: z.string().max(500).nullable().optional(),
  gallery: z.array(z.string().url()).default([]),
  challenge: z.string().nullable().optional(),
  approach: z.string().nullable().optional(),
  results: z.array(z.string()).default([]),
  published: formats.published,
  sortOrder: formats.sortOrder,
});

export const articleInput = z.object({
  slug: formats.slug,
  title: formats.title,
  category: z.enum(['design', 'dev', 'thoughts']).default('thoughts'),
  excerpt: z.string().max(400).nullable().optional(),
  image: formats.image,
  content: z.string().nullable().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD').nullable().optional(),
  readTime: z.string().max(20).nullable().optional(),
  published: formats.published,
});

export const messageInput = z.object({
  name: z.string().min(1, 'Name is required').max(80),
  email: z.string().email('Enter a valid email'),
  subject: z.string().max(160).optional(),
  body: z.string().min(1, 'Message is required').max(5000),
});

export const subscribeInput = z.object({
  email: z.string().email('Enter a valid email'),
});

export const registerInput = z.object({
  name: z.string().min(1, 'Name is required').max(80),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Use at least 8 characters').max(200),
});

export const loginInput = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

/** Parse body with zod; throws HttpError(422) with readable messages. */
export function parse(schema, payload) {
  const result = schema.safeParse(payload);
  if (result.success) return result.data;
  const message = result.error.issues.map((i) => i.message).join(' · ');
  throw new HttpError(422, message);
}

/** Turn image lists / JSON columns into real JS values. */
export const parseJsonArray = (raw) => {
  try {
    const value = JSON.parse(raw ?? '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};
