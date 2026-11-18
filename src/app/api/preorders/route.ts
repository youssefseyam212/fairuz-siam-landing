import { validatePreorder } from '@/lib/preorder';
import { createPreorder, isAdmin, listPreorders, rateLimited } from '@/server/preorders';

/**
 * POST /api/preorders — public. Saves a pre-order and returns the customer's discount code.
 *   body: { name, phone, email?, piece, metal, size?, note?, lang }
 *   201 { code, percent, existing:false } · 200 { code, percent, existing:true } (same phone again)
 *   400 { error:'invalid', fields:[...] } · 429 { error:'rate_limited' }
 *
 * GET /api/preorders — admin (Authorization: Bearer <ADMIN_TOKEN>). ?format=csv for a spreadsheet.
 */
export async function POST(req: Request) {
  if (rateLimited(req, 'preorder')) return Response.json({ error: 'rate_limited' }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch { return Response.json({ error: 'invalid_json' }, { status: 400 }); }

  const v = validatePreorder(body);
  if (!v.ok) return Response.json({ error: 'invalid', fields: v.errors }, { status: 400 });

  try {
    const r = createPreorder(v.value);
    return Response.json(r, { status: r.existing ? 200 : 201 });
  } catch (e) {
    console.error('[preorders] save failed', e);
    return Response.json({ error: 'server_error' }, { status: 500 });
  }
}

const CSV_COLS = ['created_at', 'code', 'status', 'discount_percent', 'name', 'phone', 'email', 'piece', 'metal', 'size', 'note', 'lang', 'redeemed_at'];
const csvCell = (v: unknown) => {
  let s = v == null ? '' : String(v);
  if (/^[=+\-@]/.test(s)) s = "'" + s; // stop spreadsheet formula injection
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export async function GET(req: Request) {
  if (!isAdmin(req)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const rows = listPreorders();
  if (new URL(req.url).searchParams.get('format') === 'csv') {
    const csv = [CSV_COLS.join(','), ...rows.map((r) => CSV_COLS.map((c) => csvCell(r[c])).join(','))].join('\n');
    return new Response('﻿' + csv, { // BOM so Excel reads Arabic names correctly
      headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="preorders.csv"' },
    });
  }
  return Response.json({ count: rows.length, preorders: rows });
}
