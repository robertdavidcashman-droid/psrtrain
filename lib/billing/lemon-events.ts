/**
 * Map a Lemon Squeezy webhook event onto internal access state.
 * Used when PAYMENTS_ENABLED is on and DB persistence is wired up.
 */

export type AccessStatus = 'active' | 'inactive' | 'grace' | 'refunded';

export type AccessUpdate = {
  is_paid: boolean;
  access_status: AccessStatus;
  subscription_status?: string | null;
  ended_at?: string | null;
};

const GRANT_STATUSES = new Set(['active', 'on_trial', 'paid']);

const GRACE_STATUSES = new Set(['cancelled', 'past_due']);

const REVOKE_STATUSES = new Set(['expired', 'unpaid', 'paused']);

function fromSubscriptionStatus(status: string | null | undefined): AccessUpdate {
  const s = (status ?? '').toLowerCase();
  if (GRANT_STATUSES.has(s)) {
    return { is_paid: true, access_status: 'active', subscription_status: s };
  }
  if (GRACE_STATUSES.has(s)) {
    return { is_paid: true, access_status: 'grace', subscription_status: s };
  }
  if (REVOKE_STATUSES.has(s)) {
    return { is_paid: false, access_status: 'inactive', subscription_status: s };
  }
  return { is_paid: false, access_status: 'inactive', subscription_status: s || null };
}

export function deriveAccessUpdate(
  eventName: string,
  attributes: Record<string, unknown> | undefined,
): AccessUpdate | null {
  const status = (attributes?.status as string | undefined) ?? null;

  switch (eventName) {
    case 'order_created':
      return { is_paid: true, access_status: 'active', subscription_status: 'paid' };

    case 'order_refunded':
      return {
        is_paid: false,
        access_status: 'refunded',
        subscription_status: 'refunded',
        ended_at: new Date().toISOString(),
      };

    case 'subscription_created':
    case 'subscription_resumed':
    case 'subscription_unpaused':
    case 'subscription_payment_success':
      return { is_paid: true, access_status: 'active', subscription_status: status ?? 'active' };

    case 'subscription_updated':
      return fromSubscriptionStatus(status);

    case 'subscription_cancelled':
      return { is_paid: true, access_status: 'grace', subscription_status: status ?? 'cancelled' };

    case 'subscription_paused':
    case 'subscription_expired':
    case 'subscription_payment_failed':
      return {
        is_paid: false,
        access_status: 'inactive',
        subscription_status: status ?? eventName.replace('subscription_', ''),
        ended_at: new Date().toISOString(),
      };

    case 'subscription_payment_refunded':
      return {
        is_paid: false,
        access_status: 'refunded',
        subscription_status: 'refunded',
        ended_at: new Date().toISOString(),
      };

    default:
      return null;
  }
}
