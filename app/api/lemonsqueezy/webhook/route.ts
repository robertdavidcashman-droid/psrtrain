import { NextRequest, NextResponse } from 'next/server';
import { deriveAccessUpdate } from '@/lib/billing/lemon-events';
import { getLemonWebhookSecret } from '@/lib/billing/lemon-config';
import { verifyLemonWebhookSignature } from '@/lib/billing/lemon-webhook-signature';
import {
  isPaymentsEnabled,
  PAYMENTS_DISABLED_STATUS,
} from '@/lib/billing/payments-enabled';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type LemonPayload = {
  meta?: {
    event_name?: string;
    custom_data?: Record<string, unknown>;
  };
  data?: {
    id?: string;
    type?: string;
    attributes?: Record<string, unknown>;
  };
};

/**
 * When payments are enabled, persist webhook outcomes to billing_webhook_events and
 * customer_access (see pre-removal webhook handler). Intentionally a no-op until
 * PAYMENTS_ENABLED is flipped on alongside a deliberate access-rule change.
 */
function stubProcessWebhookEvent(eventName: string, payload: LemonPayload): void {
  const update = deriveAccessUpdate(eventName, payload.data?.attributes);
  if (!update) return;
  // TODO: idempotent insert into billing_webhook_events + upsert customer_access
  // via service role — requires PAYMENTS_ENABLED rollout and RLS/access alignment.
}

export async function POST(request: NextRequest) {
  if (!isPaymentsEnabled()) {
    return NextResponse.json({ error: 'Not found' }, { status: PAYMENTS_DISABLED_STATUS });
  }

  const secret = getLemonWebhookSecret();
  if (!secret) {
    return NextResponse.json(
      { error: 'Webhook secret not configured (LEMON_SQUEEZY_WEBHOOK_SECRET)' },
      { status: 503 },
    );
  }

  const signature = request.headers.get('x-signature');
  const rawBody = await request.text();

  if (!verifyLemonWebhookSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: 'Invalid or missing signature' }, { status: 401 });
  }

  let payload: LemonPayload;
  try {
    payload = JSON.parse(rawBody) as LemonPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventName = payload?.meta?.event_name;
  if (!eventName) {
    return NextResponse.json({ error: 'Missing event_name' }, { status: 400 });
  }

  stubProcessWebhookEvent(eventName, payload);

  return NextResponse.json({ ok: true, eventName, persisted: false });
}
