import { getVariantIdForPlan, type LemonCheckoutPlan } from '@/lib/billing/lemon-config';
import { resolveLemonTestMode } from '@/lib/billing/test-mode';

export type CreateLemonCheckoutInput = {
  apiKey: string;
  storeId: string;
  plan: LemonCheckoutPlan;
  userEmail: string;
  userId: string;
  origin: string;
  env?: NodeJS.ProcessEnv;
};

export type CreateLemonCheckoutResult =
  | { ok: true; url: string }
  | { ok: false; status: number; error: string };

export async function createLemonCheckout(
  input: CreateLemonCheckoutInput,
): Promise<CreateLemonCheckoutResult> {
  const env = input.env ?? process.env;
  const variantId = getVariantIdForPlan(input.plan, env);
  if (!variantId) {
    const key =
      input.plan === 'annual'
        ? 'LEMON_SQUEEZY_VARIANT_ID_ANNUAL'
        : 'LEMON_SQUEEZY_VARIANT_ID_MONTHLY';
    return { ok: false, status: 503, error: `Plan is not configured (${key})` };
  }

  let testMode: boolean;
  try {
    testMode = resolveLemonTestMode(env);
  } catch {
    return { ok: false, status: 503, error: 'Billing is misconfigured (LEMON_SQUEEZY_TEST_MODE)' };
  }

  const successUrl = `${input.origin}/billing?success=true&plan=${input.plan}`;
  const cancelUrl = `${input.origin}/billing?canceled=true`;

  const lsRes = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: input.userEmail,
            custom: {
              user_id: input.userId,
              plan: input.plan,
            },
          },
          checkout_options: {
            embed: false,
            media: true,
            logo: true,
          },
          product_options: {
            redirect_url: successUrl,
            receipt_button_text: 'Return to PSR Train',
            receipt_link_url: successUrl,
          },
          expires_at: null,
          preview: false,
          test_mode: testMode,
        },
        relationships: {
          store: {
            data: { type: 'stores', id: String(input.storeId) },
          },
          variant: {
            data: { type: 'variants', id: String(variantId) },
          },
        },
      },
      meta: {
        cancel_url: cancelUrl,
      },
    }),
  });

  const payload = await lsRes.json();
  if (!lsRes.ok) {
    const message =
      payload?.errors?.[0]?.detail ||
      payload?.message ||
      'Failed to create Lemon Squeezy checkout';
    return { ok: false, status: 500, error: String(message) };
  }

  const url = payload?.data?.attributes?.url;
  if (!url || typeof url !== 'string') {
    return { ok: false, status: 500, error: 'Missing checkout URL from Lemon Squeezy' };
  }

  return { ok: true, url };
}
