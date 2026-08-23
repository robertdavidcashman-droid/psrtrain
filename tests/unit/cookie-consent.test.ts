import { describe, expect, test, beforeEach, afterEach, vi } from 'vitest';

function mockLocalStorage() {
  const store = new Map<string, string>();
  const api = {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    get length() {
      return store.size;
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
  };
  vi.stubGlobal('localStorage', api);
  vi.stubGlobal('window', {
    localStorage: api,
    dispatchEvent: () => true,
  });
  return api;
}

describe('cookie-consent helpers', () => {
  beforeEach(() => {
    vi.resetModules();
    mockLocalStorage().clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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
