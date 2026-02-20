# GrowthLedger

Creator Revenue OS rebranded as GrowthLedger. A client-only SaaS dashboard for creators to forecast revenue, price sponsorships, track growth, and plan releases.

## Stack

- Vite + React (SPA)
- Vercel Serverless Functions
- localStorage for all client data

## Routes

- `/app` main app
- `/owner` owner unlock

## Stripe flow

1) Checkout via Stripe Payment Link.
2) Success URL must be set to:
   `https://growthledgerpro.vercel.app/app?session_id={CHECKOUT_SESSION_ID}`
3) `/app` detects `session_id` and calls `POST /api/stripe/activate`.
4) Client stores `pro_token` and refreshes status via `GET /api/auth/verify` on load and every 10 minutes.

## Serverless endpoints

- `POST /api/stripe/activate`
  - Input: `{ sessionId, deviceId }`
  - Verifies Stripe session, issues JWT if subscription is active/trialing.
- `GET /api/auth/verify`
  - Input: `Authorization: Bearer <token>`, `X-Device-Id: <deviceId>`
  - Validates JWT, checks Stripe status, returns refreshed token if eligible.
- `GET /api/subscription/status`
  - Input: `Authorization: Bearer <token>`, `X-Device-Id: <deviceId>`
  - Returns status details for UI.
- `POST /api/owner/unlock`
  - Input: `{ key, deviceId }`
  - Validates PBKDF2-derived owner key, issues JWT.

## Environment variables

Server (Vercel only):

- `STRIPE_SECRET_KEY`
- `JWT_SECRET`
- `OWNER_SALT`
- `OWNER_PEPPER`
- `PBKDF2_ITERS`
- `OWNER_KEY_DERIVED_HEX`

Client (Vite):

- `VITE_STRIPE_CHECKOUT_URL`
- `VITE_STRIPE_BILLING_URL`

## Owner key derivation

The owner unlock uses PBKDF2 (sha256, 32 bytes, hex output) with:

- `password = submitted key`
- `salt = OWNER_SALT + ":" + OWNER_PEPPER`
- `iterations = Number(PBKDF2_ITERS)`

Generate `OWNER_KEY_DERIVED_HEX` locally (do not commit the raw key):

```bash
OWNER_KEY="<your-owner-key>" \
OWNER_SALT="<salt>" \
OWNER_PEPPER="<pepper>" \
PBKDF2_ITERS="100000" \
node -e "const crypto=require('crypto'); const key=process.env.OWNER_KEY; const salt=`${process.env.OWNER_SALT}:${process.env.OWNER_PEPPER}`; const iters=Number(process.env.PBKDF2_ITERS); const hex=crypto.pbkdf2Sync(key, salt, iters, 32, 'sha256').toString('hex'); console.log(hex);"
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`

## Deployment notes

- `vercel.json` includes a SPA fallback rewrite so `/app` routes to the Vite index.
- Ensure Vercel env vars are set for both server and client entries.
