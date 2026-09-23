-- Restrict paid training content so anonymous users cannot SELECT answer keys
-- or full module bodies via PostgREST (anon key).
--
-- APPLY IN SUPABASE: Dashboard → SQL editor → paste this whole file → Run.
-- Safe to re-run (idempotent).
--
-- After applying, only authenticated users with active paid access (or admins)
-- can read approved questions, content modules, and CIT scenarios.
-- service_role (server webhooks, cron, admin scripts) bypasses RLS as usual.

-- ============================================================
-- 1. Helpers
-- ============================================================
create or replace function public.is_app_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and u.role = 'admin'
  );
$$;

create or replace function public.has_paid_training_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.customer_access ca
    where ca.is_paid = true
      and ca.access_status in ('active', 'grace')
      and (
        ca.user_id = auth.uid()
        or lower(ca.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  );
$$;

create or replace function public.can_access_paid_training_content()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.role() = 'authenticated'
    and (public.is_app_admin() or public.has_paid_training_access());
$$;

-- Public marketing stat only — no answer keys or module bodies.
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

-- RLS helper RPCs: authenticated must EXECUTE for policy evaluation via Data API roles.
revoke all on function public.is_app_admin() from public;
revoke all on function public.has_paid_training_access() from public;
revoke all on function public.can_access_paid_training_content() from public;
grant execute on function public.is_app_admin() to authenticated, service_role;
grant execute on function public.has_paid_training_access() to authenticated, service_role;
grant execute on function public.can_access_paid_training_content() to authenticated, service_role;

-- ============================================================
-- 2. questions — drop permissive anon SELECT
-- ============================================================
drop policy if exists "Approved questions are visible to all" on public.questions;

drop policy if exists "Paid users can view approved questions" on public.questions;
create policy "Paid users can view approved questions"
  on public.questions for select
  using (
    status = 'approved'
    and public.can_access_paid_training_content()
  );

-- Admins retain full manage access via existing policy.

-- ============================================================
-- 3. content_modules — paid subscribers only
-- ============================================================
drop policy if exists "Authenticated users can view modules" on public.content_modules;

drop policy if exists "Paid users can view modules" on public.content_modules;
create policy "Paid users can view modules"
  on public.content_modules for select
  using (public.can_access_paid_training_content());

-- ============================================================
-- 4. cit_scenarios — paid subscribers only
-- ============================================================
drop policy if exists "Approved CIT scenarios visible to authenticated" on public.cit_scenarios;

drop policy if exists "Paid users can view approved CIT scenarios" on public.cit_scenarios;
create policy "Paid users can view approved CIT scenarios"
  on public.cit_scenarios for select
  using (
    status = 'approved'
    and public.can_access_paid_training_content()
  );

-- ============================================================
-- 5. pace_code_sections — paid subscribers only (training reference)
-- ============================================================
drop policy if exists "Authenticated users can view PACE sections" on public.pace_code_sections;

drop policy if exists "Paid users can view PACE sections" on public.pace_code_sections;
create policy "Paid users can view PACE sections"
  on public.pace_code_sections for select
  using (public.can_access_paid_training_content());
