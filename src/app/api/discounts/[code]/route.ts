import { checkCode, cleanCode, rateLimited } from '@/server/preorders';

/**
 * GET /api/discounts/FS-XXXX-XXXX — public. Is this pre-order discount valid?
 *   200 { valid:true, percent, status:'reserved' } · 200 { valid:false, … } · 404 { valid:false }
 * Returns no personal data.
 */
export async function GET(req: Request, ctx: { params: Promise<{ code: string }> }) {
  if (rateLimited(req, 'check', 30)) return Response.json({ error: 'rate_limited' }, { status: 429 });
  const code = cleanCode((await ctx.params).code);
  if (!code) return Response.json({ valid: false }, { status: 404 });
  const r = checkCode(code);
  return Response.json({ code, ...r }, { status: 'percent' in r ? 200 : 404 });
}
