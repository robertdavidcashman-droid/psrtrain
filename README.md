# PSR Train

[![CI](https://github.com/robertcashman-bit/pstrain-rebuild/actions/workflows/ci.yml/badge.svg)](https://github.com/robertcashman-bit/pstrain-rebuild/actions/workflows/ci.yml)

PSRAS preparation platform for police station representative candidates in England & Wales.

**Live site:** [psrtrain.com](https://psrtrain.com)

## Development

```bash
npm ci
npm run dev
```

## Tests

```bash
npm run lint
npm run typecheck
npm run test:unit
npm run test:e2e
npm run build
```

User-journey regression tests (login, mobile clicks, monthly checkout, Stephanie account checks):

```bash
npm run test:user-journey
```

## Payments (Lemon Squeezy)

Billing is **wired in code but disabled by default**. With `PAYMENTS_ENABLED=false` (the production default), nothing changes for users: training stays free for every signed-in user, and there are no buy buttons, pricing pages, or paywall UI.

When you are ready to turn payments on:

1. Set these environment variables in Vercel (names must match; values come from Lemon Squeezy):
   - `PAYMENTS_ENABLED=true`
   - `LEMON_SQUEEZY_API_KEY`
   - `LEMON_SQUEEZY_STORE_ID`
   - `LEMON_SQUEEZY_WEBHOOK_SECRET`
   - `LEMON_SQUEEZY_VARIANT_ID_MONTHLY`
   - `LEMON_SQUEEZY_VARIANT_ID_ANNUAL`
   - `LEMON_SQUEEZY_TEST_MODE` — set to `true` while testing in Lemon’s test mode first
2. In Lemon Squeezy → Settings → Webhooks, add a webhook pointing at  
   `https://psrtrain.com/api/lemonsqueezy/webhook` and use the same signing secret as `LEMON_SQUEEZY_WEBHOOK_SECRET`.
3. Redeploy so the new env vars are picked up.

**Server routes (only active when `PAYMENTS_ENABLED=true`):**

- `POST /api/lemonsqueezy/create-checkout` — creates a hosted checkout (authenticated).
- `POST /api/lemonsqueezy/webhook` — verifies `X-Signature` (HMAC-SHA256 of the raw body). Database writes are still stubbed; wire `customer_access` / `billing_webhook_events` and update `can_access_paid_training_content()` before payments should gate training.
