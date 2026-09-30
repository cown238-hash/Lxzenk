import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { query } from '../db.js';
import { hashPassword, publicUser, requireAuth, signToken, verifyPassword } from '../auth.js';
import { HttpError, asyncRoute, loginInput, parse, registerInput } from '../validate.js';

export const authRouter = Router();

const cookieOptions = (maxAgeMs) => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: maxAgeMs,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many attempts. Try again in a few minutes.' },
});

authRouter.post(
  '/register',
  loginLimiter,
  asyncRoute((req, res) => {
    const { name, email, password } = parse(registerInput, req.body);
    const normalised = email.toLowerCase().trim();

    if (query.get('SELECT 1 AS hit FROM users WHERE email = ?', normalised)) {
      throw new HttpError(409, 'That email is already registered');
    }

    const info = query.run(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      name.trim(),
      normalised,
      hashPassword(password),
      'editor'
    );

    const user = query.get('SELECT * FROM users WHERE id = ?', Number(info.lastInsertRowid));
    const token = signToken(user);
    res.cookie('lxz_token', token, cookieOptions(7 * 24 * 60 * 60 * 1000));
    res.status(201).json({ user: publicUser(user), token });
  })
);

authRouter.post(
  '/login',
  loginLimiter,
  asyncRoute((req, res) => {
    const { email, password } = parse(loginInput, req.body);
    const user = query.get('SELECT * FROM users WHERE email = ?', email.toLowerCase().trim());

    if (!user || !verifyPassword(password, user.password_hash)) {
      throw new HttpError(401, 'Email or password is incorrect');
    }

    const token = signToken(user);
    res.cookie('lxz_token', token, cookieOptions(7 * 24 * 60 * 60 * 1000));
    res.json({ user: publicUser(user), token });
  })
);

authRouter.post('/logout', (_req, res) => {
  res.clearCookie('lxz_token');
  res.json({ ok: true });
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});
