import { cleanEnvValue } from '@/lib/env';

export type LemonCheckoutEnv = {
  apiKey: string;
  storeId: string;
  variantIdMonthly: string;
  variantIdAnnual: string;
  webhookSecret: string;
};

export type LemonCheckoutPlan = 'monthly' | 'annual';

export function getVariantIdForPlan(
  plan: LemonCheckoutPlan,
  env: NodeJS.ProcessEnv = process.env,
): string {
  return plan === 'annual'
    ? cleanEnvValue(env.LEMON_SQUEEZY_VARIANT_ID_ANNUAL)
    : cleanEnvValue(env.LEMON_SQUEEZY_VARIANT_ID_MONTHLY);
}

export function getLemonCheckoutEnv(
  env: NodeJS.ProcessEnv = process.env,
): { ok: true; config: LemonCheckoutEnv } | { ok: false; missing: string[] } {
  const fields: Record<string, string> = {
    LEMON_SQUEEZY_API_KEY: cleanEnvValue(env.LEMON_SQUEEZY_API_KEY),
    LEMON_SQUEEZY_STORE_ID: cleanEnvValue(env.LEMON_SQUEEZY_STORE_ID),
    LEMON_SQUEEZY_VARIANT_ID_MONTHLY: cleanEnvValue(env.LEMON_SQUEEZY_VARIANT_ID_MONTHLY),
    LEMON_SQUEEZY_VARIANT_ID_ANNUAL: cleanEnvValue(env.LEMON_SQUEEZY_VARIANT_ID_ANNUAL),
    LEMON_SQUEEZY_WEBHOOK_SECRET: cleanEnvValue(env.LEMON_SQUEEZY_WEBHOOK_SECRET),
  };

  const missing = Object.entries(fields)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    return { ok: false, missing };
  }

  return {
    ok: true,
    config: {
      apiKey: fields.LEMON_SQUEEZY_API_KEY,
      storeId: fields.LEMON_SQUEEZY_STORE_ID,
      variantIdMonthly: fields.LEMON_SQUEEZY_VARIANT_ID_MONTHLY,
      variantIdAnnual: fields.LEMON_SQUEEZY_VARIANT_ID_ANNUAL,
      webhookSecret: fields.LEMON_SQUEEZY_WEBHOOK_SECRET,
    },
  };
}

/** Checkout route only needs API key, store, and the selected variant. */
export function getLemonCheckoutApiEnv(
  env: NodeJS.ProcessEnv = process.env,
): { ok: true; apiKey: string; storeId: string } | { ok: false; missing: string[] } {
  const apiKey = cleanEnvValue(env.LEMON_SQUEEZY_API_KEY);
  const storeId = cleanEnvValue(env.LEMON_SQUEEZY_STORE_ID);
  const missing: string[] = [];
  if (!apiKey) missing.push('LEMON_SQUEEZY_API_KEY');
  if (!storeId) missing.push('LEMON_SQUEEZY_STORE_ID');
  if (missing.length > 0) return { ok: false, missing };
  return { ok: true, apiKey, storeId };
}

export function getLemonWebhookSecret(env: NodeJS.ProcessEnv = process.env): string {
  return cleanEnvValue(env.LEMON_SQUEEZY_WEBHOOK_SECRET);
}
