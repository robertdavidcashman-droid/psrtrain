import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(path: string): string {
  return readFileSync(join(root, path), 'utf-8');
}

describe('activity tracking Data API grants (0009)', () => {
  const sql = read('supabase/migrations/0009_activity_tracking_grants.sql');

  test('documents Supabase apply step', () => {
    expect(sql).toMatch(/APPLY IN SUPABASE/i);
    expect(sql).toMatch(/idempotent/i);
  });

  test('grants authenticated write access to activity tables', () => {
    for (const table of [
      'user_progress',
      'user_sessions',
      'mock_exam_sessions',
      'scenario_sessions',
    ]) {
      expect(sql).toMatch(
        new RegExp(`grant\\s+.*\\s+on public\\.${table} to authenticated`, 'i'),
      );
      expect(sql).toMatch(
        new RegExp(`grant\\s+.*\\s+on public\\.${table} to service_role`, 'i'),
      );
    }
  });

  test('tightens user_sessions insert policy to own user_id', () => {
    expect(sql).toContain('Users can insert own sessions');
    expect(sql).toMatch(/with check \(auth\.uid\(\) = user_id\)/i);
  });
});

describe('activity write error logging', () => {
  test('session tracker checks insert errors', () => {
    const src = read('lib/session-tracker.ts');
    expect(src).toContain('logSupabaseWriteError');
    expect(src).toMatch(/if \(error\)/);
  });

  test('practice page logs user_progress insert failures', () => {
    const src = read('app/(main)/practice/page.tsx');
    expect(src).toContain('progressError');
    expect(src).toContain('Progress save error');
  });
});
