# Backend — Protocolo Mente Desligada

Serverless backend for the landing page: lead capture, server-side conversion
tracking (GA4 + Meta), a Hotmart purchase webhook, and a passwordless member area.
Everything lives under `/api` (Vercel serverless functions) plus a few files under
`src/lib` and `src/pages` for the browser side. It does not touch `App.tsx` or
anything under `src/components/sections/` — that's the landing page itself, owned
separately.

## Architecture at a glance

```
Browser                          Vercel /api                      Supabase
───────                          ───────────                      ────────
main.tsx: captureUtm()
          loadTrackingTags() ──▶ (client-side GA4/Meta tags only)

lead form (wherever it ends  ──▶ POST /api/lead        ──────────▶ leads table
up in the landing page)                                │
                                                        └────────▶ GA4 MP + Meta CAPI
                                                                    ("Lead" event)

CTA click                    ──▶ POST /api/track        ─────────▶ GA4 MP + Meta CAPI
(src/lib/tracking.ts             (initiate_checkout /              (mirrors the
 trackEvent())                    view_offer only)                  client-side pixel)

Hotmart (external)           ──▶ POST /api/webhook/purchase?platform=hotmart
                                        │
                                        ├─▶ purchases table (upsert, idempotent)
                                        ├─▶ GA4/Meta "Purchase" (first approval only)
                                        └─▶ grantMemberAccess / revokeMemberAccess
                                                 │
                                                 ├─▶ supabase.auth.admin.inviteUserByEmail
                                                 │   (sends the buyer their login link)
                                                 ├─▶ members table (email -> auth user id)
                                                 └─▶ ban/unban via updateUserById

/login   (src/pages/Login.tsx)   ──▶ supabase.auth.signInWithOtp (magic link, no
                                       signup — only buyers already invited can log in)

/membros (src/pages/Members.tsx) ──▶ reads the Supabase session client-side,
                                       redirects to /login if there isn't one
```

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com) (free tier is enough to start).
2. In the SQL Editor, run `supabase/schema.sql` once. It creates `leads`, `purchases`,
   and `members`, all with RLS enabled and zero policies — only the service-role key
   (server-side only) can read/write them.
3. Settings → API: copy the **Project URL** and **anon public key** (→
   `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`) and the **service_role key** (→
   `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — same URL, secret key).
4. Authentication → URL Configuration: add your production domain and
   `http://localhost:5173` to the Redirect URLs allow list (needed for both the
   invite email and the `/login` magic link to actually land the user on `/membros`
   instead of being rejected/redirected elsewhere).
5. (Optional, recommended) Authentication → Emails: customize the "Invite user" and
   "Magic Link" templates — the defaults are functional but generic.

## 2. Set up the Hotmart webhook

1. In Hotmart's product settings → Webhook, create a webhook pointing to:
   `https://<your-domain>/api/webhook/purchase?platform=hotmart`
2. Subscribe to at least: `PURCHASE_APPROVED`, `PURCHASE_COMPLETE`,
   `PURCHASE_REFUNDED`, `PURCHASE_CHARGEBACK` (others are recorded too, they just
   don't grant/revoke access).
3. Copy the **HOTTOK** shown in that same settings screen → `HOTMART_HOTTOK`.

Other platforms (Kiwify, Eduzz, Monetizze, ...) aren't implemented yet — see
`api/lib/platforms/` below if you need to add one.

## 3. Environment variables

Copy `.env.example` to `.env.local` for local dev and fill in what you have.
Everything except the Supabase and Hotmart vars is optional (GA4/Meta tracking
no-ops safely if unconfigured). Set the same variables in the Vercel project's
Environment Variables for preview/production — `.env.local` is gitignored and never
deployed.

| Variable | Required | Notes |
|---|---|---|
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only, never `VITE_`-prefixed |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Yes | Browser-side, for member login |
| `HOTMART_HOTTOK` | Yes | Webhook auth token |
| `PUBLIC_SITE_URL` / `VITE_PUBLIC_SITE_URL` | Recommended | Must match **exactly** — both the invite email and the magic-link login redirect to `${this}/membros`, and a mismatch between the two silently breaks the redirect |
| `GA4_MEASUREMENT_ID` / `GA4_API_SECRET` / `VITE_GA4_MEASUREMENT_ID` | Optional | Server-side Measurement Protocol + client-side gtag |
| `META_PIXEL_ID` / `META_CAPI_ACCESS_TOKEN` / `VITE_META_PIXEL_ID` | Optional | Server-side Conversions API + client-side Pixel |

## 4. Wiring the landing page to these endpoints

None of this is wired into the landing page's sections yet (that's intentionally
outside this backend work — see the section-by-section build happening separately).
When the Offer section's CTA and any lead-capture form are ready, they need:

```ts
// Lead capture form submit
await fetch('/api/lead', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email, ...getStoredUtm(), client_id: getClientId() }),
});

// CTA click, before sending the user to the Hotmart checkout URL
import { trackEvent } from './lib/tracking';
await trackEvent('initiate_checkout');
```

(`getStoredUtm` / `getClientId` / `trackEvent` all live in `src/lib/tracking.ts`,
already wired up at app start in `main.tsx`.)

## 5. Local development

```bash
npm run dev              # Vite dev server (frontend only — /api routes need `vercel dev`
                          # or a deploy to actually run; local npm run dev won't serve them)
npm test                 # vitest — 48 tests, no external services required
npm run test:api-types   # type-check the /api directory (separate tsconfig, not part of the app build)
```

## 6. Known limitations / next steps

- **Only Hotmart is implemented.** Add a new file under `api/lib/platforms/`
  implementing `PurchasePlatformAdapter` (see `hotmart.ts` for the reference) and
  register it in `api/lib/platforms/index.ts` to support another checkout platform.
- **No rate limiting** on `/api/lead` or `/api/track` — fine at low traffic, worth
  adding (e.g. Upstash Redis + `@upstash/ratelimit`, which needs its own account) before
  running paid ad traffic at scale.
- **Subscription semantics aren't modeled.** The status mapping in `hotmart.ts`
  assumes a single-payment product. If this ever becomes a recurring subscription,
  revisit what `CANCELLED`/`EXPIRED` should mean for member access.
- **Ban-by-email, not by-transaction.** A refund webhook revokes access for the
  buyer's email regardless of which transaction it was for — correct for a
  single-product funnel, worth revisiting if a customer could hold multiple
  independent purchases.
