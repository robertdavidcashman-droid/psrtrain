import { describe, expect, test, beforeEach, afterEach, vi } from 'vitest';

describe('cookie-consent helpers', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('hasAnalyticsConsent is false until accepted', async () => {
    const { hasAnalyticsConsent, setCookieConsent, readCookieConsent } =
      await import('../../lib/cookie-consent.ts');
    expect(readCookieConsent()).toBeNull();
    expect(hasAnalyticsConsent()).toBe(false);
    setCookieConsent('rejected');
    expect(hasAnalyticsConsent()).toBe(false);
    setCookieConsent('accepted');
    expect(hasAnalyticsConsent()).toBe(true);
  });

  test('migrates legacy cookies-accepted=true', async () => {
    localStorage.setItem('cookies-accepted', 'true');
    const { readCookieConsent, hasAnalyticsConsent } = await import(
      '../../lib/cookie-consent.ts'
    );
    expect(readCookieConsent()).toBe('accepted');
    expect(hasAnalyticsConsent()).toBe(true);
  });
});
