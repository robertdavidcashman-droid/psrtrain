-- Explicit Data API (PostgREST) role grants for objects created in migrations
-- 0001–0006.
--
-- WHY (Supabase notice, 23 Sep 2026 / effective 30 Oct 2026):
--   New tables in `public` on existing projects will NO LONGER auto-receive
--   grants for anon / authenticated / service_role. Existing tables keep
--   working. After that date, CREATE TABLE without explicit GRANTs leaves
--   new tables unreachable via supabase-js after db reset, preview branch
--   reset, or a fresh paste of migrations.
--
-- APPLY IN SUPABASE: Dashboard → SQL editor → paste this whole file → Run.
-- Safe to re-run (idempotent). Does not change RLS policies.
--
-- Prefer minimal grants. NEVER: GRANT ALL ON ALL TABLES IN SCHEMA public TO anon.
-- Future CREATE TABLE / VIEW / FUNCTION migrations MUST include explicit GRANTs
-- (see supabase/README.md).

-- ============================================================
-- 1. Auth + billing (0001)
-- ============================================================
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

grant select on public.customer_access to authenticated;
grant select, insert, update, delete on public.customer_access to service_role;

-- Intentionally unexposed to anon/authenticated (webhook idempotency log)
grant select, insert, update, delete on public.billing_webhook_events to service_role;

grant select on public.v_current_access to authenticated;
grant select on public.v_current_access to service_role;

-- ============================================================
-- 2. CIT scenarios + syllabus view (0002)
-- ============================================================
grant select, insert, update, delete on public.cit_scenarios to authenticated;
grant select, insert, update, delete on public.cit_scenarios to service_role;

grant select on public.v_syllabus_coverage to authenticated;
grant select on public.v_syllabus_coverage to service_role;

-- ============================================================
-- 3. Editorial audit — service_role only (0003 / 0004)
-- ============================================================
revoke all on table public.editorial_audit_state from anon, authenticated;
revoke all on table public.editorial_audit_findings from anon, authenticated;
grant select, insert, update, delete on public.editorial_audit_state to service_role;
grant select, insert, update, delete on public.editorial_audit_findings to service_role;

-- ============================================================
-- 4. SEO submission state — service_role only (0005)
-- ============================================================
revoke all on table public.seo_submission_state from anon, authenticated;
grant select, insert, update, delete on public.seo_submission_state to service_role;

-- ============================================================
-- 5. Paid-content helper functions (0006)
-- ============================================================
revoke all on function public.approved_question_count() from public;
grant execute on function public.approved_question_count() to anon, authenticated, service_role;

revoke all on function public.is_app_admin() from public;
revoke all on function public.has_paid_training_access() from public;
revoke all on function public.can_access_paid_training_content() from public;
grant execute on function public.is_app_admin() to authenticated, service_role;
grant execute on function public.has_paid_training_access() to authenticated, service_role;
grant execute on function public.can_access_paid_training_content() to authenticated, service_role;
