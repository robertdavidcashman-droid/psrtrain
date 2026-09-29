-- Data API grants for legacy activity / progress tables (setup.sql).
--
-- Activity writes also require a row in public.users (FK on user_id). If inserts
-- fail with foreign-key violations while reads still work, apply
-- 0010_backfill_public_users.sql — the usual cause is on_auth_user_created
-- populating profiles but not public.users after 0001_auth_billing.sql.
--
-- This file additionally documents explicit PostgREST grants for fresh applies
-- (catch-up alongside 0007). Production may already have these grants.
--
-- APPLY IN SUPABASE: Dashboard → SQL editor → paste this whole file → Run.
-- Safe to re-run (idempotent). Does not weaken RLS — policies still scope rows.
--
-- user_activity_log: not used by the app (no writers in repo). No grant here.

-- ============================================================
-- Activity & progress (authenticated users, own rows via RLS)
-- ============================================================
grant select, insert, update on public.user_progress to authenticated;
grant select, insert, update, delete on public.user_progress to service_role;

grant select, insert, update on public.user_sessions to authenticated;
grant select, insert, update, delete on public.user_sessions to service_role;

grant select, insert, update, delete on public.mock_exam_sessions to authenticated;
grant select, insert, update, delete on public.mock_exam_sessions to service_role;

grant select, insert, update on public.scenario_sessions to authenticated;
grant select, insert, update, delete on public.scenario_sessions to service_role;

-- Certificates issued after practice / mock milestones
grant select, insert on public.certificates to authenticated;
grant select, insert, update, delete on public.certificates to service_role;

-- ============================================================
-- Tighten session insert policy (was WITH CHECK (true))
-- ============================================================
drop policy if exists "System can insert sessions" on public.user_sessions;
drop policy if exists "Users can insert own sessions" on public.user_sessions;
create policy "Users can insert own sessions"
  on public.user_sessions
  for insert
  with check (auth.uid() = user_id);
