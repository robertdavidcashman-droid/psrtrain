-- Block anonymous reads of the exam question bank (security audit M2).
--
-- Production still had the original permissive policy
-- "Approved questions are visible to all" (0006 was never applied), so anyone
-- with the public publishable/anon key could read all approved questions,
-- including answers and explanations, via PostgREST.
--
-- Training is free for every signed-in user (can_access_paid_training_content()
-- = auth.role() = 'authenticated', see 0008), so the questions SELECT policy is
-- now limited to authenticated users. Server code using the secret
-- (service_role) key bypasses RLS as before (homepage stat, editorial audit).
-- The homepage "try a question" widget is hard-coded and does not read the
-- table.
--
-- APPLY IN SUPABASE: Dashboard -> SQL editor -> paste this whole file -> Run
-- (or Management API database/query). Safe to re-run (idempotent).

-- 1. Helper used by the policy (identical to 0008).
create or replace function public.can_access_paid_training_content()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.role() = 'authenticated';
$$;

revoke all on function public.can_access_paid_training_content() from public;
grant execute on function public.can_access_paid_training_content() to authenticated, service_role;

-- 2. Count-only RPC for public marketing stats and the keepalive cron
--    (no question text, answers or explanations are exposed).
create or replace function public.approved_question_count()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::bigint
  from public.questions q
  where q.status = 'approved';
$$;

revoke all on function public.approved_question_count() from public;
grant execute on function public.approved_question_count() to anon, authenticated, service_role;

-- 3. questions: replace the permissive anon SELECT policy.
drop policy if exists "Approved questions are visible to all" on public.questions;
drop policy if exists "Paid users can view approved questions" on public.questions;
drop policy if exists "Signed-in users can view approved questions" on public.questions;

create policy "Signed-in users can view approved questions"
  on public.questions for select
  to authenticated
  using (
    status = 'approved'
    and public.can_access_paid_training_content()
  );

-- "Admins can manage questions" (admin role via public.users) is unchanged.

-- 4. Defence in depth: anon needs no direct table privileges on questions.
revoke all on table public.questions from anon;
