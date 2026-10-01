import { cleanEnvValue } from '@/lib/env';

/** Server-only feature flag. Default off — live site stays free for all signed-in users. */
export function isPaymentsEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  const raw = cleanEnvValue(env.PAYMENTS_ENABLED).toLowerCase();
  if (!raw) return false;
  return raw === 'true' || raw === '1' || raw === 'yes';
}

/** HTTP status when payment routes are disabled (no network calls, no side effects). */
export const PAYMENTS_DISABLED_STATUS = 404;
