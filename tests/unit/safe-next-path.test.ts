import { describe, expect, test } from 'vitest';
import {
  isSafeInternalPath,
  resolveSameOriginUrl,
  safeInternalNextPath,
} from '../../lib/auth/safe-next-path.ts';

describe('safeInternalNextPath', () => {
  test('allows normal app paths', () => {
    expect(safeInternalNextPath('/dashboard')).toBe('/dashboard');
    expect(safeInternalNextPath('/practice')).toBe('/practice');
    expect(safeInternalNextPath('/billing?x=1')).toBe('/billing?x=1');
    expect(safeInternalNextPath('/practice?topic=a%2Fb#q1')).toBe('/practice?topic=a%2Fb#q1');
    expect(safeInternalNextPath('/critical-incidents/some-slug')).toBe('/critical-incidents/some-slug');
  });

  test('blocks protocol-relative URLs', () => {
    expect(safeInternalNextPath('//evil.com')).toBe('/dashboard');
    expect(safeInternalNextPath('//evil.com/phish')).toBe('/dashboard');
    expect(safeInternalNextPath('/%2F/evil.com')).toBe('/dashboard');
    expect(safeInternalNextPath('/%2f%2fevil.com')).toBe('/dashboard');
  });

  test('blocks backslash tricks (browsers normalise \\ to /)', () => {
    expect(safeInternalNextPath('/\\evil.com')).toBe('/dashboard');
    expect(safeInternalNextPath('/%5Cevil.com')).toBe('/dashboard');
    expect(safeInternalNextPath('/%5cevil.com')).toBe('/dashboard');
    expect(safeInternalNextPath('/foo\\bar')).toBe('/dashboard');
    expect(safeInternalNextPath('\\\\evil.com')).toBe('/dashboard');
  });

  test('blocks control characters, raw or encoded', () => {
    expect(safeInternalNextPath('/\t/evil.com')).toBe('/dashboard');
    expect(safeInternalNextPath('/%09/evil.com')).toBe('/dashboard');
    expect(safeInternalNextPath('/dash\nboard')).toBe('/dashboard');
    expect(safeInternalNextPath('/%0d%0aSet-Cookie:x')).toBe('/dashboard');
  });

  test('blocks schemes and absolute URLs', () => {
    expect(safeInternalNextPath('https://evil.com')).toBe('/dashboard');
    expect(safeInternalNextPath('http://evil.com/dashboard')).toBe('/dashboard');
    expect(safeInternalNextPath('javascript:alert(1)')).toBe('/dashboard');
    expect(safeInternalNextPath('JavaScript:alert(1)')).toBe('/dashboard');
    expect(safeInternalNextPath('/javascript:alert(1)')).toBe('/dashboard');
    expect(safeInternalNextPath('/javascript%3Aalert(1)')).toBe('/dashboard');
    expect(safeInternalNextPath('data:text/html,hi')).toBe('/dashboard');
  });

  test('rejects malformed percent-encoding', () => {
    expect(safeInternalNextPath('/%E0%A4%A')).toBe('/dashboard');
  });

  test('uses fallback for empty or external-looking values', () => {
    expect(safeInternalNextPath(null, '/practice')).toBe('/practice');
    expect(safeInternalNextPath(undefined)).toBe('/dashboard');
    expect(safeInternalNextPath('')).toBe('/dashboard');
    expect(safeInternalNextPath('   ')).toBe('/dashboard');
    expect(safeInternalNextPath('dashboard')).toBe('/dashboard');
    expect(safeInternalNextPath('https://x.com')).toBe('/dashboard');
  });
});

describe('isSafeInternalPath', () => {
  test('requires same origin when resolved', () => {
    expect(isSafeInternalPath('/dashboard', 'https://psrtrain.com')).toBe(true);
    expect(isSafeInternalPath('//evil.com', 'https://psrtrain.com')).toBe(false);
    expect(isSafeInternalPath('/\\evil.com', 'https://psrtrain.com')).toBe(false);
  });
});

describe('resolveSameOriginUrl', () => {
  const origin = 'https://psrtrain.com';
  test('keeps internal paths on the same origin', () => {
    expect(resolveSameOriginUrl('/practice?x=1', origin)).toBe('https://psrtrain.com/practice?x=1');
  });
  test.each(['/\\evil.com', '//evil.com', '/%5Cevil.com', 'https://evil.com', 'javascript:alert(1)'])(
    'falls back to /dashboard for %s',
    (value) => {
      const out = resolveSameOriginUrl(value, origin);
      expect(out).toBe('https://psrtrain.com/dashboard');
      expect(new URL(out).origin).toBe(origin);
    },
  );
});
