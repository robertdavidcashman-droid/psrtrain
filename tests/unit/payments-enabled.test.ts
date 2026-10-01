import { describe, expect, test } from 'vitest';
import {
  isPaymentsEnabled,
  PAYMENTS_DISABLED_STATUS,
} from '../../lib/billing/payments-enabled.ts';

describe('isPaymentsEnabled', () => {
  test('defaults to false when unset', () => {
    expect(isPaymentsEnabled({})).toBe(false);
    expect(isPaymentsEnabled({ PAYMENTS_ENABLED: '' })).toBe(false);
  });

  test('false-like values stay off', () => {
    expect(isPaymentsEnabled({ PAYMENTS_ENABLED: 'false' })).toBe(false);
    expect(isPaymentsEnabled({ PAYMENTS_ENABLED: '0' })).toBe(false);
    expect(isPaymentsEnabled({ PAYMENTS_ENABLED: 'no' })).toBe(false);
  });

  test('true-like values turn payments on', () => {
    expect(isPaymentsEnabled({ PAYMENTS_ENABLED: 'true' })).toBe(true);
    expect(isPaymentsEnabled({ PAYMENTS_ENABLED: '1' })).toBe(true);
    expect(isPaymentsEnabled({ PAYMENTS_ENABLED: 'yes' })).toBe(true);
    expect(isPaymentsEnabled({ PAYMENTS_ENABLED: '"true"' })).toBe(true);
  });

  test('disabled routes use 404', () => {
    expect(PAYMENTS_DISABLED_STATUS).toBe(404);
  });
});
