-- Align training-content RLS with app policy (PR #17): any signed-in user may read
-- approved questions, modules, CIT scenarios, and PACE sections. Anonymous (anon
-- role) remains blocked. Admin tooling still uses is_app_admin() on other tables.
--
-- APPLY IN SUPABASE: Dashboard → SQL editor → paste this whole file → Run.
-- Safe to re-run (idempotent). Required once per environment after merge.
--
-- customer_access and has_paid_training_access() are unchanged (legacy billing data).

create or replace function public.can_access_paid_training_content()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.role() = 'authenticated';
$$;

-- Policies on questions, content_modules, cit_scenarios, and pace_code_sections
-- already reference can_access_paid_training_content(); no policy rewrites needed.

revoke all on function public.can_access_paid_training_content() from public;
grant execute on function public.can_access_paid_training_content() to authenticated, service_role;
