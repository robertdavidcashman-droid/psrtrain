import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('questions RLS (audit M2)', () => {
  const sql = readFileSync(join(process.cwd(), 'supabase/migrations/0011_questions_signed_in_only.sql'), 'utf-8')
    .replace(/--.*$/gm, '');

  test('drops the permissive anon SELECT policy', () => {
    expect(sql).toContain('drop policy if exists "Approved questions are visible to all" on public.questions');
  });

  test('only authenticated users can select approved questions', () => {
    expect(sql).toMatch(/create policy "Signed-in users can view approved questions"\s+on public\.questions for select\s+to authenticated/);
    expect(sql).toContain('public.can_access_paid_training_content()');
  });

  test('revokes anon table privileges and keeps a count-only public RPC', () => {
    expect(sql).toMatch(/revoke all on table public\.questions from anon/);
    expect(sql).toMatch(/grant execute on function public\.approved_question_count\(\) to anon/);
    expect(sql).not.toMatch(/grant\s+select\s+on\s+(table\s+)?public\.questions\s+to\s+anon/i);
  });
});
