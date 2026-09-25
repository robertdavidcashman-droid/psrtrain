-- Align Supabase RLS with app-layer access: training content for any signed-in user.
-- (Product is free while testing; Lemon Squeezy checkout removed in app code.)
--
-- APPLY IN SUPABASE: Dashboard → SQL editor → paste this whole file → Run.
-- Safe to re-run (idempotent). Run after 0006_paid_content_rls.sql if that was applied.
--
-- Keeps anon users blocked from answer keys / module bodies. Authenticated users
-- can read training tables via existing policies that call can_access_paid_training_content().
-- Function name is unchanged so policies on questions, content_modules, cit_scenarios,
-- and pace_code_sections do not need to be recreated.

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

-- has_paid_training_access() and is_app_admin() are unchanged (legacy billing + admin role).
