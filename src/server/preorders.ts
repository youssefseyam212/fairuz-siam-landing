// Server only: imported from route handlers under src/app/api, never from client components.
import { randomInt, timingSafeEqual } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import type { PreorderInput, PreorderResult } from '@/lib/preorder';

/*
 * Pre-order storage: one SQLite file (default `data/preorders.db`, git-ignored).
 * Needs a host with a persistent disk (a VPS, Render/Railway with a volume, …).
 * When the NestJS + PostgreSQL backend exists, move this table there and point the popup at it.
 */

const DB_PATH = process.env.PREORDER_DB_PATH || path.join(process.cwd(), 'data', 'preorders.db');

/** Discount every pre-order gets, in percent. Business decision — set it in .env. */
export const DISCOUNT_PERCENT = (() => {
  const n = Number(process.env.PREORDER_DISCOUNT_PERCENT ?? 10);
  return Number.isFinite(n) && n > 0 && n < 100 ? Math.round(n) : 10;
})();

let db: DatabaseSync | null = null;
function open(): DatabaseSync {
  if (db) return db;
  mkdirSync(path.dirname(DB_PATH), { recursive: true });
  db = new DatabaseSync(DB_PATH);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS preorders (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      code             TEXT NOT NULL UNIQUE,
      name             TEXT NOT NULL,
      phone            TEXT NOT NULL UNIQUE,
      email            TEXT,
      piece            TEXT NOT NULL,
      metal            TEXT NOT NULL,
      size             INTEGER,
      note             TEXT,
      lang             TEXT NOT NULL,
      discount_percent INTEGER NOT NULL,
      status           TEXT NOT NULL DEFAULT 'reserved',  -- reserved | redeemed | cancelled
      created_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      updated_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      redeemed_at      TEXT
    );
  `);
  return db;
}

// No 0/O/1/I/L: codes get read out over the phone and typed by hand.
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const part = () => Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
const newCode = () => `FS-${part()}-${part()}`;

/** Normalize what a person typed into the stored code format. */
export const cleanCode = (s: string) => {
  const c = s.toUpperCase().replace(/[^0-9A-Z]/g, '');
  return /^FS[0-9A-Z]{8}$/.test(c) ? `FS-${c.slice(2, 6)}-${c.slice(6)}` : null;
};

/**
 * Save a pre-order. One reservation per phone number: a repeat request updates the details
 * and returns the code that number already has, so a customer never ends up with two discounts.
 */
export function createPreorder(p: PreorderInput): PreorderResult {
  const d = open();
  const found = d.prepare('SELECT code, discount_percent FROM preorders WHERE phone = ?').get(p.phone);
  if (found) {
    // keep earlier email / note when the new request leaves them empty
    d.prepare(`UPDATE preorders SET name = ?, email = COALESCE(?, email), piece = ?, metal = ?, size = ?, note = COALESCE(?, note), lang = ?,
      updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE phone = ? AND status = 'reserved'`)
      .run(p.name, p.email || null, p.piece, p.metal, p.size, p.note || null, p.lang, p.phone);
    return { code: String(found.code), percent: Number(found.discount_percent), existing: true };
  }
  for (let i = 0; i < 5; i++) {
    const code = newCode();
    try {
      d.prepare(`INSERT INTO preorders (code, name, phone, email, piece, metal, size, note, lang, discount_percent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(code, p.name, p.phone, p.email || null, p.piece, p.metal, p.size, p.note || null, p.lang, DISCOUNT_PERCENT);
      return { code, percent: DISCOUNT_PERCENT, existing: false };
    } catch (e) {
      const msg = String((e as Error).message);
      if (msg.includes('preorders.phone')) return createPreorder(p); // raced with a parallel request
      if (!msg.includes('preorders.code')) throw e;                  // otherwise: code collision, retry
    }
  }
  throw new Error('Could not generate a unique code');
}

/** Public check: is this a valid, unused pre-order discount? Returns no personal data. */
export function checkCode(code: string) {
  const r = open().prepare('SELECT discount_percent, status FROM preorders WHERE code = ?').get(code);
  if (!r) return { valid: false as const };
  return { valid: r.status === 'reserved', percent: Number(r.discount_percent), status: String(r.status) };
}

/** Admin: mark a code as used (call this when the order is confirmed). */
export function redeemCode(code: string) {
  const res = open().prepare(`UPDATE preorders SET status = 'redeemed', redeemed_at = strftime('%Y-%m-%dT%H:%M:%fZ','now'),
    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE code = ? AND status = 'reserved'`).run(code);
  return Number(res.changes) > 0;
}

export function listPreorders() {
  return open().prepare('SELECT * FROM preorders ORDER BY created_at DESC').all();
}

/** `Authorization: Bearer <ADMIN_TOKEN>`. With no ADMIN_TOKEN set, admin routes stay closed. */
export function isAdmin(req: Request): boolean {
  const token = process.env.ADMIN_TOKEN;
  if (!token || token.length < 16) return false;
  const got = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const a = Buffer.from(got), b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Simple in-memory rate limit for the public form (per IP). Fine for one server process.
// `bucket` keeps limits separate (code checks must not use up the form's allowance).
const hits = new Map<string, number[]>();
export function rateLimited(req: Request, bucket: string, max = 5, windowMs = 10 * 60_000): boolean {
  const ip = bucket + ':' + ((req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'local');
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return list.length > max;
}
