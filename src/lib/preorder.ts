import { COL_KEYS, byId, type CollectionKey, type Metal } from './data';

/*
 * Pre-order request shared by the popup (client) and the API (server).
 * The server re-runs `validatePreorder` on every request — never trust the browser.
 */

export const RING_SIZES = [50, 52, 54, 56, 58];

/** '' = help me choose · 'any:<collection>' = any piece from a collection · '<productId>' = one piece */
export type PieceChoice = string;

export interface PreorderInput {
  name: string;
  phone: string;
  email: string;
  piece: PieceChoice;
  metal: Metal;
  size: number | null;
  note: string;
  lang: 'en' | 'ar';
}

export interface PreorderResult {
  code: string;
  percent: number;
  existing: boolean;
}

export type FieldError = 'name' | 'phone' | 'email' | 'piece' | 'metal' | 'size' | 'note';

/** Egyptian mobile → 01XXXXXXXXX, or null. Accepts spaces, dashes and +20 / 0020 / 20 prefixes. */
export function normalizePhone(raw: string): string | null {
  let d = raw.replace(/[\s\-().]/g, '').replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 0x660));
  if (d.startsWith('+20')) d = '0' + d.slice(3);
  else if (d.startsWith('0020')) d = '0' + d.slice(4);
  else if (d.startsWith('20') && d.length === 12) d = '0' + d.slice(2);
  return /^01[0125]\d{8}$/.test(d) ? d : null;
}

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export function isValidPiece(p: string): boolean {
  if (p === '') return true;
  if (p.startsWith('any:')) return COL_KEYS.includes(p.slice(4) as CollectionKey);
  return !!byId[p];
}

export const pieceIsRing = (p: string) => !!byId[p] && byId[p].type === 'ring';

/** Returns the cleaned input, or the list of invalid fields. */
export function validatePreorder(raw: unknown): { ok: true; value: PreorderInput } | { ok: false; errors: FieldError[] } {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const str = (k: string, max: number) => (typeof o[k] === 'string' ? (o[k] as string).trim().slice(0, max) : '');
  const errors: FieldError[] = [];

  const name = str('name', 120);
  if (name.length < 2) errors.push('name');

  const phone = normalizePhone(str('phone', 30));
  if (!phone) errors.push('phone');

  const email = str('email', 200).toLowerCase();
  if (email && !isEmail(email)) errors.push('email');

  const piece = str('piece', 60);
  if (!isValidPiece(piece)) errors.push('piece');

  const metal = o.metal === 'silver' ? 'silver' : o.metal === 'gold' ? 'gold' : null;
  if (!metal) errors.push('metal');

  let size: number | null = null;
  if (pieceIsRing(piece) && o.size != null && o.size !== '') {
    size = Number(o.size);
    if (!RING_SIZES.includes(size)) errors.push('size');
  }

  const note = str('note', 600);
  const lang = o.lang === 'ar' ? 'ar' : 'en';

  if (errors.length) return { ok: false, errors };
  return { ok: true, value: { name, phone: phone!, email, piece, metal: metal!, size, note, lang } };
}
