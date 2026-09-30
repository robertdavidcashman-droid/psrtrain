/**
 * Validates redirect targets for post-login / post-logout navigation.
 *
 * Only same-origin relative paths are allowed. Rejected (→ fallback):
 * - anything not starting with a single `/` (absolute URLs, `javascript:` …)
 * - protocol-relative `//host` and `/\host` (browsers treat `\` as `/`)
 * - any backslash or ASCII control character, raw or percent-encoded
 * - a colon in the path segment (pseudo-schemes such as `/javascript:…`)
 * - anything that does not resolve to the same origin via `new URL()`
 */
const CHECK_ORIGIN = 'https://psrtrain.invalid';
const UNSAFE_CHARS = /[\\\u0000-\u001F\u007F]/;

export function isSafeInternalPath(value: string, origin: string = CHECK_ORIGIN): boolean {
  if (value === '' || value.length > 2048) return false;
  if (!value.startsWith('/')) return false;
  if (value.startsWith('//') || value.startsWith('/\\')) return false;
  if (UNSAFE_CHARS.test(value)) return false;

  let decoded: string;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return false;
  }
  if (decoded.startsWith('//') || UNSAFE_CHARS.test(decoded)) return false;

  const pathOnly = value.split(/[?#]/)[0] ?? value;
  const decodedPathOnly = decoded.split(/[?#]/)[0] ?? decoded;
  if (pathOnly.includes(':') || decodedPathOnly.includes(':')) return false;

  try {
    const base = new URL(origin);
    return new URL(value, base).origin === base.origin;
  } catch {
    return false;
  }
}

export function safeInternalNextPath(
  raw: string | null | undefined,
  fallback = '/dashboard',
): string {
  if (raw == null || typeof raw !== 'string') return fallback;
  const t = raw.trim();
  return isSafeInternalPath(t) ? t : fallback;
}

/**
 * Resolve a validated `next` against a concrete origin and return an absolute
 * same-origin URL (falls back to `${origin}${fallback}`).
 */
export function resolveSameOriginUrl(
  raw: string | null | undefined,
  origin: string,
  fallback = '/dashboard',
): string {
  const path = safeInternalNextPath(raw, fallback);
  try {
    const base = new URL(origin);
    const url = new URL(path, base);
    if (url.origin === base.origin) return url.toString();
    return new URL(fallback, base).toString();
  } catch {
    return `${origin.replace(/\/$/, '')}${fallback}`;
  }
}
