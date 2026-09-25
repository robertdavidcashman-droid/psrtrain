import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import {
  freeAccessEndsLabel,
  hasTrainingAccess,
  isFreeAccessPeriodActive,
} from '../../lib/free-access-promo';

describe('free-access-promo', () => {
  const saved: Record<string, string | undefined> = {};

  beforeEach(() => {
    saved.FREE_ACCESS_UNTIL = process.env.FREE_ACCESS_UNTIL;
  });

  afterEach(() => {
    if (saved.FREE_ACCESS_UNTIL === undefined) delete process.env.FREE_ACCESS_UNTIL;
    else process.env.FREE_ACCESS_UNTIL = saved.FREE_ACCESS_UNTIL;
  });

  test('training is always in free-while-testing mode for gating helpers', () => {
    expect(isFreeAccessPeriodActive()).toBe(true);
    expect(hasTrainingAccess({ subscriptionActive: false, isAdmin: false })).toBe(true);
    expect(hasTrainingAccess({ subscriptionActive: false, isAdmin: true })).toBe(true);
  });

  test('freeAccessEndsLabel reads optional FREE_ACCESS_UNTIL for copy only', () => {
    process.env.FREE_ACCESS_UNTIL = '2026-07-01';
    expect(freeAccessEndsLabel()).toMatch(/2026/);
    delete process.env.FREE_ACCESS_UNTIL;
    expect(freeAccessEndsLabel()).toBeNull();
  });
});
