# Auth & access — operator guide

This document describes how sign-in and training access work on PSR Train.
Billing via Lemon Squeezy has been removed; the product is **free for every
signed-in user** while testing.

---

## 1. One-page summary

```
[ user ] -- email --> /auth (page)
                           |
                           v
            POST /api/auth/request-code        (server-side cooldown +
                           |                   Supabase signInWithOtp)
                           v
                  user gets email with:
                       6-digit OTP
                       one-click link
                           |
            +--------------+--------------+
            |                             |
            v                             v
     enters code on /auth         clicks email link
     (verifyOtp client-side)        (lands on /auth/callback)
                           \       /
                            v     v
                       Supabase session set
                            |
                            v
            proxy.ts requires session on training routes
                            |
                            v
              signed in -> /dashboard, /practice, …
              signed out -> redirect to /auth
```

There is **no paywall** and **no checkout**. Planned paid plans appear on
`/pricing` as “Coming soon” only.

---

## 2. Files of interest

| File | Purpose |
|------|---------|
| `app/auth/page.tsx` | Unified sign-in/sign-up UI (OTP + magic link). |
| `app/auth/callback/route.ts` | Exchanges magic-link codes for a session. |
| `proxy.ts` | Edge auth gate: training routes require a Supabase session. |
| `lib/auth/access.ts` | `getAccessSnapshot()` — signed-in users have training access. |
| `lib/auth/api-guards.ts` | `requirePaidTrainingAccess()` — requires sign-in only (name kept for callers). |
| `app/(main)/billing/page.tsx` | Access status copy (free while testing). |
| `app/pricing/page.tsx` | Marketing pricing; CTAs go to signup / dashboard. |
| `supabase/migrations/0001_auth_billing.sql` | Legacy `customer_access` / webhook tables (unused by app gating). |

---

## 3. Required environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key for auth + RLS client. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin tooling (optional for basic training use). |

No Lemon Squeezy or payment-provider variables are required to boot or serve
training routes.

Optional:

| Variable | Purpose |
|----------|---------|
| `ADMIN_EMAILS` | Comma-separated staff emails for `/admin`. |
| `FREE_ACCESS_UNTIL` | Optional end date **for promo copy only** (banners); does not gate access. |
| `APP_ACCESS_CODE` | Legacy pre-launch access-code gate (independent of auth). |

---

## 4. Access rules

1. **Anonymous users** can browse marketing pages. Training routes under
   `/practice`, `/dashboard`, `/modules`, etc. redirect to `/auth`.
2. **Signed-in users** can use all training routes and paid API handlers
   (`/api/flashcards`, `/api/pace`, …) without subscription checks.
3. **`/admin`** still requires an email listed in `ADMIN_EMAILS`
   (see `app/admin/layout.tsx`).

The `customer_access` table may still exist in Supabase from earlier billing
work; the application **does not** read it for gating.

---

## 5. Production smoke checklist

- [ ] Request OTP on `/auth` → email arrives → code or magic link signs user in.
- [ ] Signed-in user opens `/dashboard` and `/practice` without redirect to `/pricing`.
- [ ] Signed-out user hitting `/practice` is sent to `/auth` with `next=` preserved.
- [ ] `/pricing` shows “Free while we test” and “Create free account” (no checkout).
- [ ] `/api/lemonsqueezy/*` routes are absent (404).

---

## 6. Troubleshooting

- **Redirect loop on /auth?** Check Supabase redirect URLs include your
  production origin and `NEXT_PUBLIC_SUPABASE_*` match the project.
- **Training route always redirects to /auth?** Session cookie missing —
  confirm apex host (`psrtrain.com`, not `www`) and Supabase cookie settings.
- **Admin cannot open /admin?** Add their email to `ADMIN_EMAILS` and redeploy.
