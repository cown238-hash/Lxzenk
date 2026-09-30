import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db.js';

const secret = process.env.JWT_SECRET || 'dev-only-insecure-secret';
const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

export const hashPassword = (plain) => bcrypt.hashSync(plain, 12);
export const verifyPassword = (plain, hash) => bcrypt.compareSync(plain, hash);

export const signToken = (user) =>
  jwt.sign({ sub: user.id, email: user.email, role: user.role }, secret, { expiresIn });

export const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role });

/** node:sqlite rejects JS booleans as bound values — coerce to 0/1. */
export const bit = (value) => (value ? 1 : 0);

/** Read the token from cookie or Authorization header. */
function readToken(req) {
  const cookie = req.cookies?.lxz_token;
  if (cookie) return cookie;
  const header = req.get('authorization');
  if (header?.startsWith('Bearer ')) return header.slice(7);
  return null;
}

/** Hard gate: 401 unless a valid token maps to an existing user. */
export function requireAuth(req, res, next) {
  const token = readToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    const payload = jwt.verify(token, secret);
    const user = query.get('SELECT * FROM users WHERE id = ?', payload.sub);
    if (!user) return res.status(401).json({ error: 'Account no longer exists' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Session expired, please sign in again' });
  }
}

/** Soft gate: attaches req.user when a token is present, never blocks. */
export function optionalAuth(req, _res, next) {
  const token = readToken(req);
  if (token) {
    try {
      const payload = jwt.verify(token, secret);
      req.user = query.get('SELECT * FROM users WHERE id = ?', payload.sub) ?? null;
    } catch {
      req.user = null;
    }
  }
  next();
}

/** Editors and admins only. */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to do that' });
    }
    next();
  };
}
