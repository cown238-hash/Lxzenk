// Node's built-in SQLite driver — no native build step, ships with Node 22.5+
// (stable in Node 24). The API mirrors better-sqlite3, which is why every
// call site in this project looks the same.
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

export const db = new DatabaseSync(path.join(dataDir, 'lxzenk.db'));
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

/** node:sqlite returns null-prototype rows; plain objects are friendlier to spread. */
const plain = (row) => (row ? { ...row } : row);
const plainAll = (rows) => rows.map((row) => ({ ...row }));

/** Wraps the driver so callers get plain objects and boolean-ish integers. */
export const query = {
  all: (sql, ...params) => plainAll(db.prepare(sql).all(...params)),
  get: (sql, ...params) => plain(db.prepare(sql).get(...params)),
  run: (sql, ...params) => db.prepare(sql).run(...params),
};

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'editor',
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS projects (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT NOT NULL UNIQUE,
  title      TEXT NOT NULL,
  category   TEXT NOT NULL DEFAULT 'web',
  year       INTEGER,
  tags       TEXT NOT NULL DEFAULT '[]',
  image      TEXT,
  statement  TEXT,
  gallery    TEXT NOT NULL DEFAULT '[]',
  challenge  TEXT,
  approach   TEXT,
  results    TEXT NOT NULL DEFAULT '[]',
  published  INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS articles (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT NOT NULL UNIQUE,
  title      TEXT NOT NULL,
  category   TEXT NOT NULL DEFAULT 'thoughts',
  excerpt    TEXT,
  image      TEXT,
  content    TEXT,
  date       TEXT,
  read_time  TEXT,
  published  INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  body       TEXT NOT NULL,
  read       INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS subscribers (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published, sort_order);
CREATE INDEX IF NOT EXISTS idx_articles_published  ON articles(published, date DESC);
CREATE INDEX IF NOT EXISTS idx_messages_read       ON messages(read, created_at DESC);
`);

// Simple key/value settings helpers
export const getSetting = (key, fallback = '') => query.get('SELECT value FROM settings WHERE key = ?', key)?.value ?? fallback;

export const setSetting = (key, value) =>
  query.run(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    key,
    String(value)
  );
