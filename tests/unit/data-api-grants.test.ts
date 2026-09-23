import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const migrationsDir = join(root, 'supabase/migrations');

function read(path: string): string {
  return readFileSync(join(root, path), 'utf-8');
}

describe('Data API grants (Supabase Oct 30 2026)', () => {
  const grantMig = read('supabase/migrations/0007_data_api_grants.sql');
  const readme = read('supabase/README.md');

  test('additive migration documents the Oct 30 change and apply step', () => {
    expect(grantMig).toMatch(/30 Oct 2026|30 October 2026/i);
    expect(grantMig).toMatch(/APPLY IN SUPABASE/i);
    expect(grantMig).toMatch(/idempotent/i);
  });

  test('never uses blanket anon grants on all public tables', () => {
    const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql'));
    for (const file of files) {
      const sql = readFileSync(join(migrationsDir, file), 'utf-8');
      expect(sql).not.toMatch(
        /grant\s+all\s+on\s+all\s+tables\s+in\s+schema\s+public\s+to\s+anon/i,
      );
    }
  });

  test('grants auth/billing tables used by supabase-js', () => {
    expect(grantMig).toMatch(/grant select,\s*update on public\.profiles to authenticated/i);
    expect(grantMig).toMatch(/grant select on public\.customer_access to authenticated/i);
    expect(grantMig).toMatch(
      /grant select,\s*insert,\s*update,\s*delete on public\.billing_webhook_events to service_role/i,
    );
    expect(grantMig).toMatch(/grant select on public\.v_current_access to authenticated/i);
  });

  test('grants cit_scenarios and syllabus view for authenticated clients', () => {
    expect(grantMig).toMatch(/grant select.*on public\.cit_scenarios to authenticated/i);
    expect(grantMig).toMatch(/grant select on public\.v_syllabus_coverage to authenticated/i);
  });

  test('keeps service-only tables unexposed to anon/authenticated', () => {
    for (const table of [
      'editorial_audit_state',
      'editorial_audit_findings',
      'seo_submission_state',
    ]) {
      expect(grantMig).toMatch(
        new RegExp(`revoke all on table public\\.${table} from anon, authenticated`, 'i'),
      );
      expect(grantMig).toMatch(
        new RegExp(`grant select,\\s*insert,\\s*update,\\s*delete on public\\.${table} to service_role`, 'i'),
      );
      expect(grantMig).not.toMatch(
        new RegExp(`grant\\s+.*\\s+on public\\.${table} to anon`, 'i'),
      );
    }
  });

  test('does not grant anon SELECT on customer_access or profiles', () => {
    expect(grantMig).not.toMatch(/grant\s+.*\s+on public\.customer_access to anon/i);
    expect(grantMig).not.toMatch(/grant\s+.*\s+on public\.profiles to anon/i);
  });

  test('README requires explicit GRANTs on future CREATE TABLE migrations', () => {
    expect(readme).toMatch(/30 October 2026|30 Oct 2026/i);
    expect(readme).toMatch(/explicit/i);
    expect(readme).toMatch(/GRANT/i);
    expect(readme).toMatch(/NEVER|Never|never/);
  });

  test('keepalive uses public count RPC instead of anon customer_access SELECT', () => {
    const keepalive = read('app/api/cron/supabase-keepalive/route.ts');
    expect(keepalive).toContain("rpc('approved_question_count')");
    expect(keepalive).not.toMatch(/from\(['"]customer_access['"]\)/);
  });
});
