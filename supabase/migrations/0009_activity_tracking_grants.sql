-- Data API grants for legacy activity / progress tables (setup.sql).
--
-- WHY: Migration 0007 documented grants for 0001–0006 objects only. Production
-- activity tables (user_progress, user_sessions, mock_exam_sessions,
-- scenario_sessions) need explicit INSERT/UPDATE for authenticated clients via
-- PostgREST. Without these grants, writes fail with permission denied while
-- reads on other tables may still work.
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
