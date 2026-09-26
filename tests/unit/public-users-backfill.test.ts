import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(path: string): string {
  return readFileSync(join(root, path), 'utf-8');
}

describe('public.users backfill (0010)', () => {
  const sql = read('supabase/migrations/0010_backfill_public_users.sql');

  test('documents FK root cause and apply step', () => {
    expect(sql).toMatch(/APPLY IN SUPABASE/i);
    expect(sql).toMatch(/public\.users/i);
    expect(sql).toMatch(/foreign-key|FK/i);
    expect(sql).toMatch(/0010_backfill_public_users|on_auth_user_created|0001_auth_billing/i);
  });

  test('backfills from auth.users and updates auth trigger', () => {
    expect(sql).toMatch(/insert into public\.users/i);
    expect(sql).toMatch(/from auth\.users/i);
    expect(sql).toMatch(/on conflict do nothing/i);
    expect(sql).toContain('tg_on_auth_user_created');
    expect(sql).toMatch(/insert into public\.users \(id, email, full_name\)/i);
  });
});

describe('user_progress writes in app', () => {
  test('practice page uses insert only', () => {
    const src = read('app/(main)/practice/page.tsx');
    expect(src).toMatch(/\.from\('user_progress'\)\.insert/);
    expect(src).not.toMatch(/\.from\('user_progress'\)\.update/);
    expect(src).not.toMatch(/\.from\('user_progress'\)\.upsert/);
  });
});
