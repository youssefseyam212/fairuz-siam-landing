# Fairuz Siam — Landing + Pre-order

Pre-launch site for Fairuz Siam handmade jewelry (English / Arabic), copied from the shop frontend
(`fairuz-siam/frontend`) with the same design, CSS, fonts, intro and motion.

- `/` landing page: hero, collections, manifesto, story, pieces, gifting, craft, pre-order band
- `/about` About us: brand story, our name, the four stones, craft, gifting, brand facts
- **Pre-order popup**: opens by itself once per visit (after the brand intro), and from the
  header "Pre-order" button and every collection / piece / call-to-action
- **Pre-order API**: saves each request and gives the customer a personal discount code

No shop, bag or checkout in this copy.

**Live design preview:** https://youssefseyam212.github.io/fairuz-siam-landing/ — GitHub Pages, redeployed on every push to `main`.
Pages is static, so the preview has no API: the popup shows a sample code and saves nothing.

## Run

```bash
cp .env.example .env.local   # set ADMIN_TOKEN and PREORDER_DISCOUNT_PERCENT
npm install
npm run dev                  # http://localhost:3000
```

Requires **Node 22.13+** (uses Node's built-in SQLite). Pre-orders are saved to `data/preorders.db`.

## API

| Method | Path | Who | What |
|---|---|---|---|
| POST | `/api/preorders` | public (popup) | Save a pre-order → `{ code, percent, existing }`. One reservation per phone number; repeating returns the same code. 5 requests / 10 min per IP. |
| GET | `/api/discounts/FS-XXXX-XXXX` | public | `{ valid, percent, status }` (no personal data) |
| GET | `/api/preorders` (`?format=csv`) | admin | All pre-orders (CSV opens in Excel, Arabic included) |
| POST | `/api/discounts/FS-XXXX-XXXX/redeem` | admin | Mark the code as used (once) when the order is confirmed |

Admin calls need `Authorization: Bearer <ADMIN_TOKEN>`, for example:

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" "https://<site>/api/preorders?format=csv" -o preorders.csv
```

The server re-validates every field (name, Egyptian mobile, email, piece, metal, ring size) — it never
trusts the browser. Phones are stored as `01XXXXXXXXX`, emails lowercase.

## Hosting

The API needs a Node server with a **persistent disk** for the SQLite file (a VPS, or Render /
Railway / Fly with a volume). Static hosting (GitHub Pages) and serverless hosts without a disk
(plain Vercel) will not keep the data. When the NestJS + PostgreSQL backend exists, move the
`preorders` table there and keep the same endpoints.
