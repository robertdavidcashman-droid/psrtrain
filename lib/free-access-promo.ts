import { cleanEnvValue } from '@/lib/env';

function readFreeAccessUntil() {
  return cleanEnvValue(process.env.FREE_ACCESS_UNTIL);
}

/**
 * Training is free for all signed-in users while the product is in testing.
 * Optional FREE_ACCESS_UNTIL only affects promo copy (banner end date), not gating.
 */
export function isFreeAccessPeriodActive(): boolean {
  return true;
}

export function freeAccessEndsLabel(): string | null {
  const until = readFreeAccessUntil();
  if (!until) return null;
  const end = new Date(until);
  if (Number.isNaN(end.getTime())) return null;
  return end.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Legacy helper — training access is granted to all signed-in users in app code. */
export function hasTrainingAccess(opts: {
  subscriptionActive?: boolean;
  isAdmin?: boolean;
}): boolean {
  if (opts.isAdmin) return true;
  return true;
}
