/**
 * Client-side cookie / analytics consent helpers.
 * Essential cookies (auth, security, gate) always run; analytics only after accept.
 */

export const COOKIE_CONSENT_KEY = 'psr-cookie-consent';
/** Legacy key used by the previous banner / GA gate. */
export const LEGACY_COOKIES_ACCEPTED_KEY = 'cookies-accepted';
export const CONSENT_CHANGE_EVENT = 'psr-cookie-consent-change';

export type CookieConsentValue = 'accepted' | 'rejected';

export function readCookieConsent(): CookieConsentValue | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (raw === 'accepted' || raw === 'rejected') return raw;
  // Migrate prior Accept-only banner.
  if (localStorage.getItem(LEGACY_COOKIES_ACCEPTED_KEY) === 'true') return 'accepted';
  return null;
}

export function hasAnalyticsConsent(): boolean {
  return readCookieConsent() === 'accepted';
}

export function setCookieConsent(value: CookieConsentValue): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COOKIE_CONSENT_KEY, value);
  localStorage.setItem(LEGACY_COOKIES_ACCEPTED_KEY, value === 'accepted' ? 'true' : 'false');
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}
