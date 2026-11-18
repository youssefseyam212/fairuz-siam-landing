import { checkCode, cleanCode, isAdmin, redeemCode } from '@/server/preorders';

/**
 * POST /api/discounts/FS-XXXX-XXXX/redeem — admin (Authorization: Bearer <ADMIN_TOKEN>).
 * Marks the code as used once the customer's order is confirmed. A code can be redeemed only once.
 *   200 { redeemed:true } · 409 { redeemed:false, status } · 404 · 401
 */
export async function POST(req: Request, ctx: { params: Promise<{ code: string }> }) {
  if (!isAdmin(req)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const code = cleanCode((await ctx.params).code);
  if (!code) return Response.json({ error: 'not_found' }, { status: 404 });
  if (redeemCode(code)) return Response.json({ code, redeemed: true });
  const r = checkCode(code);
  if (!('status' in r)) return Response.json({ error: 'not_found' }, { status: 404 });
  return Response.json({ code, redeemed: false, status: r.status }, { status: 409 });
}
