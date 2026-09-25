import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { safeErrorLog } from '../../lib/safe-log.ts';
import { isRateLimited } from '../../lib/rate-limit.ts';
import { isCronRequestAuthorized } from '../../lib/auth/api-guards.ts';

const root = process.cwd();

function read(path: string): string {
  return readFileSync(join(root, path), 'utf-8');
}

describe('signed-in training RLS migration (0008)', () => {
  const sql = read('supabase/migrations/0008_rls_signed_in_training_access.sql');

  test('documents Supabase dashboard apply step', () => {
    expect(sql).toMatch(/APPLY IN SUPABASE/i);
    expect(sql).toMatch(/Dashboard/i);
  });

  test('can_access_paid_training_content allows any authenticated session', () => {
    expect(sql).toContain('can_access_paid_training_content');
    const fnBody = sql.split('create or replace function public.can_access_paid_training_content()')[1] ?? '';
    expect(fnBody).toMatch(/auth\.role\(\)\s*=\s*'authenticated'/);
    expect(fnBody).not.toMatch(/has_paid_training_access\(\)/);
  });
});

describe('paid content RLS migration', () => {
  const sql = read('supabase/migrations/0006_paid_content_rls.sql');

  test('documents Supabase dashboard apply step', () => {
    expect(sql).toMatch(/APPLY IN SUPABASE/i);
    expect(sql).toMatch(/Dashboard/i);
  });

  test('drops permissive anon question policy', () => {
    expect(sql).toContain('drop policy if exists "Approved questions are visible to all"');
    expect(sql).toContain('Paid users can view approved questions');
  });

  test('restricts modules and CIT scenarios to paid access', () => {
    expect(sql).toContain('Paid users can view modules');
    expect(sql).toContain('Paid users can view approved CIT scenarios');
    expect(sql).toContain('can_access_paid_training_content');
  });

  test('exposes count-only RPC for marketing stats', () => {
    expect(sql).toContain('approved_question_count');
    expect(sql).toMatch(/grant execute on function public\.approved_question_count/i);
  });
});

describe('cron auth hardening', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test('isCronRequestAuthorized uses timing-safe comparison', () => {
    const src = read('lib/auth/api-guards.ts');
    expect(src).toContain('timingSafeEqual');
    expect(src).not.toMatch(/auth === `Bearer \$\{secret\}`/);
  });

  test('fails closed in production when CRON_SECRET is unset', () => {
    delete process.env.CRON_SECRET;
    process.env.NODE_ENV = 'production';
    const req = new Request('https://psrtrain.com/api/cron/traffic-digest', {
      headers: { authorization: 'Bearer anything' },
    });
    expect(isCronRequestAuthorized(req)).toBe('misconfigured');
  });

  test('rejects wrong bearer secret', () => {
    process.env.CRON_SECRET = 'test-secret-value';
    process.env.NODE_ENV = 'production';
    const req = new Request('https://psrtrain.com/api/cron/traffic-digest', {
      headers: { authorization: 'Bearer wrong-secret-value' },
    });
    expect(isCronRequestAuthorized(req)).toBe(false);
  });

  test('accepts correct bearer secret', () => {
    process.env.CRON_SECRET = 'test-secret-value';
    process.env.NODE_ENV = 'production';
    const req = new Request('https://psrtrain.com/api/cron/traffic-digest', {
      headers: { authorization: 'Bearer test-secret-value' },
    });
    expect(isCronRequestAuthorized(req)).toBe(true);
  });
});

describe('access gate verify route', () => {
  test('rate limits and timing-safe codeword check', () => {
    const src = read('app/api/access/verify/route.ts');
    expect(src).toContain('isRateLimited');
    expect(src).toContain('timingSafeEqualStrings');
    expect(src).toContain('429');
  });
});

describe('logout-track auth', () => {
  test('requires authenticated session owner or admin', () => {
    const src = read('app/api/auth/logout-track/route.ts');
    expect(src).toContain("getUser()");
    expect(src).toContain('Unauthorized');
    expect(src).toContain('isAdminEmail');
    expect(src).toContain('Forbidden');
  });
});

describe('admin cache headers', () => {
  test('next.config sets Cache-Control no-store on /admin', () => {
    const src = read('next.config.mjs');
    expect(src).toMatch(/\/admin\/:path\*/);
    expect(src).toContain('Cache-Control');
    expect(src).toContain('no-store');
  });
});

describe('PII-safe logging', () => {
  test('safeErrorLog redacts email addresses in error payloads', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    safeErrorLog('test', { email: 'user@example.com', code: 'smtp_error' });
    const logged = spy.mock.calls[0]?.join(' ') ?? '';
    expect(logged).not.toContain('user@example.com');
    expect(logged).toContain('[redacted]');
    spy.mockRestore();
  });
});

describe('rate limiter', () => {
  test('blocks after max requests in window', () => {
    const ip = `test-${Date.now()}`;
    const opts = { windowMs: 60_000, maxRequests: 2, scope: 'test' };
    expect(isRateLimited(ip, opts)).toBe(false);
    expect(isRateLimited(ip, opts)).toBe(false);
    expect(isRateLimited(ip, opts)).toBe(true);
  });

  test('scopes buckets independently per route', () => {
    const ip = `test-scope-${Date.now()}`;
    const contact = { windowMs: 60_000, maxRequests: 2, scope: 'contact' };
    const newsletter = { windowMs: 60_000, maxRequests: 2, scope: 'newsletter' };
    expect(isRateLimited(ip, contact)).toBe(false);
    expect(isRateLimited(ip, contact)).toBe(false);
    expect(isRateLimited(ip, contact)).toBe(true);
    expect(isRateLimited(ip, newsletter)).toBe(false);
  });
});
