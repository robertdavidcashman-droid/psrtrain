# Security Hardening Report — PSR Train (psrtrain.com)

**Date:** 2026-08-07 (merged into live leftovers PR 2026-08-23)  
**Branch:** originally `cursor/security-hardening-uplift-34ef`; now on default via leftovers PR  
**Scope:** Next.js training platform (psrtrain.com)  
**Overall verdict:** **PARTIAL PASS** — code merged; **Supabase migrations still require manual apply**

**Update (2026-09-25):** App grants training to all signed-in users (no Lemon Squeezy paywall). RLS is aligned via `0008_signed_in_training_rls.sql` so PostgREST reads match the app.

---

## Executive summary

This uplift closes high-impact gaps where anonymous PostgREST clients could read MCQ answer keys and paid module bodies, unauthenticated callers could end arbitrary session records, cron secrets were compared with a non-constant-time check, and admin pages lacked `Cache-Control: no-store`. Contact and newsletter error paths now redact PII before logging.

**Manual steps required (production):**

1. Apply `supabase/migrations/0006_paid_content_rls.sql` if not already applied (blocks anon from answer keys).
2. Apply `supabase/migrations/0008_signed_in_training_rls.sql` so **signed-in** users can read training tables via RLS (matches free-access product decision).

Until 0006 is applied, production RLS may remain permissive for approved questions and answer keys stay readable via the anon key. Until 0008 is applied (after 0006), signed-in users without a `customer_access` row may see empty practice/module/CIT/PACE data despite passing app-layer gates.

| Area | Status | Notes |
|------|--------|-------|
| RLS — questions / modules / CIT / PACE | **PENDING DEPLOY** | Run 0006 then 0008 in Supabase dashboard |
| App + RLS access model | **PASS (in repo)** | Any authenticated user; anon blocked |
| `/api/access/verify` rate limit + timing-safe code | **PASS** | 10 attempts / min per IP |
| `/api/auth/logout-track` auth | **PASS** | Session owner or `ADMIN_EMAILS` only |
| Cron `CRON_SECRET` comparison | **PASS** | `crypto.timingSafeEqual`; fail closed in production |
| PII in contact/newsletter logs | **PASS** | `lib/safe-log.ts` redacts emails and sensitive keys |
| `/admin` Cache-Control | **PASS** | `no-store, no-cache, must-revalidate, private` |
| Vitest regression tests | **PASS** | `tests/unit/security-hardening.test.ts` |

---

## 1. RLS — training content (`0006` + `0008`)

### Finding

`scripts/setup.sql` policy **"Approved questions are visible to all"** allowed the anon Supabase key to `SELECT` full rows including `correct_answer` and `explanation`. `content_modules`, `cit_scenarios`, and `pace_code_sections` were readable by any authenticated user regardless of subscription.

Migration 0006 restricted reads to users passing `can_access_paid_training_content()`, which originally required paid `customer_access` or `users.role = 'admin'`. After the product moved to **free signed-in access**, app code allowed all authenticated users while RLS still required paid rows — a mismatch.

### Fix

**0006** (idempotent):

- `is_app_admin()` — checks `public.users.role = 'admin'` (admin UI / role-based DB access).
- `has_paid_training_access()` — legacy helper; checks `customer_access` for active/grace paid row (retained for possible future billing, not used by RLS after 0008).
- `can_access_paid_training_content()` — in current repo: **authenticated role only** (name unchanged for existing policies).
- Replaces permissive SELECT policies on questions, modules, CIT scenarios, and PACE sections.
- `approved_question_count()` SECURITY DEFINER RPC — count-only for homepage stats (no answer leakage).

**0008** (idempotent catch-up for databases that already ran 0006 with the paid-only function body):

- Replaces `can_access_paid_training_content()` to `auth.role() = 'authenticated'`.
- No policy renames required.

### Apply in Supabase

1. Open **Supabase Dashboard → SQL Editor**.
2. If not already done: paste and run `supabase/migrations/0006_paid_content_rls.sql`.
3. Paste and run `supabase/migrations/0008_signed_in_training_rls.sql`.
4. Verify: `npm run audit:supabase-rls` (requires `SB_PAT` in `.env.local`).

Quick check after 0008:

```sql
select public.can_access_paid_training_content();
-- as authenticated in SQL editor / JWT context: should be true when role is authenticated
```

### Residual risk

- **`/admin`** is gated by `ADMIN_EMAILS` in the app, not by `is_app_admin()` alone unless staff also have `users.role = 'admin'`.
- Migration not applied until operator runs SQL manually.
- Optional `FREE_ACCESS_UNTIL` affects promo copy only, not RLS.

---

## 2. Access gate brute force (`/api/access/verify`)

### Finding

Codeword verification used `===` (timing side-channel) and had no rate limit.

### Fix

- Per-IP limit: 10 POSTs / minute → HTTP 429.
- `crypto.timingSafeEqual` codeword comparison.

---

## 3. Session logout tracking (`/api/auth/logout-track`)

### Finding

Any caller could POST a `sessionId` and mark another user's session logged out (session fixation / presence spoofing).

### Fix

- Requires authenticated Supabase user.
- Non-admins may only end sessions they own (`user_sessions.user_id = auth.uid()`).
- Admins (`ADMIN_EMAILS`) may end any session (admin live view).

---

## 4. Cron authentication (`lib/auth/api-guards.ts`)

### Finding

`isCronRequestAuthorized` compared `Authorization: Bearer …` with `===`.

### Fix

- `timingSafeEqualStrings` for `Authorization` bearer and `x-cron-secret`.
- Unset `CRON_SECRET` in production still returns `'misconfigured'` (503 on cron routes).

---

## 5. PII in logs (contact / newsletter)

### Finding

Resend error objects can echo subscriber email addresses into `console.error`.

### Fix

- `lib/safe-log.ts` — `safeErrorLog()` redacts emails and sensitive keys.
- Wired in `app/api/contact/route.ts` and `app/api/newsletter/route.ts`.

---

## 6. Admin cache headers (`next.config.mjs`)

### Finding

`/admin/*` had `X-Robots-Tag` but no `Cache-Control`, allowing shared-cache retention of authenticated admin HTML on misconfigured proxies.

### Fix

Added `Cache-Control: no-store, no-cache, must-revalidate, private` for `/admin/:path*`.

---

## 7. Files changed

| File | Change |
|------|--------|
| `supabase/migrations/0006_paid_content_rls.sql` | Training-content RLS + count RPC (signed-in access in function body) |
| `supabase/migrations/0008_signed_in_training_rls.sql` | Catch-up: align RLS with free signed-in access |
| `lib/auth/api-guards.ts` | Timing-safe cron auth |
| `lib/rate-limit.ts` | Shared per-IP rate limiter |
| `lib/safe-log.ts` | PII redaction for logs |
| `lib/question-count.ts` | Service-role / RPC for marketing count |
| `app/api/access/verify/route.ts` | Rate limit + timing-safe gate code |
| `app/api/auth/logout-track/route.ts` | Auth + session ownership |
| `app/api/contact/route.ts` | Shared rate limit + safe logging |
| `app/api/newsletter/route.ts` | Shared rate limit + safe logging |
| `next.config.mjs` | Admin `Cache-Control: no-store` |
| `tests/unit/security-hardening.test.ts` | Regression tests |
| `docs/security-hardening-report.md` | This report |

---

## 8. Tests

```bash
npm run test:unit -- tests/unit/security-hardening.test.ts
```

Also run existing `tests/unit/security-headers.test.ts` — no regressions expected.

---

## 9. Out of scope / follow-ups

- Column-level masking view for anonymous users (currently blocked entirely at RLS for training tables).
- Upstash-backed rate limits (in-memory resets on serverless cold start).
- Reintroducing paid tiers would require updating `can_access_paid_training_content()` and app guards together.
- E2E verification against live Supabase after migration apply.

---

## 10. Verdict rationale (PARTIAL PASS)

Code and tests ship in-repo. **Production security for answer keys depends on applying migrations 0006 and 0008 in Supabase** — automated deploy does not run SQL migrations. Until 0006 is applied, anon clients can still read approved question rows via PostgREST. Until 0008 is applied on top of an older 0006, signed-in users may see empty training data from Supabase clients.
