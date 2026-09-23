# Supabase

SQL for PSR Train lives in `migrations/`. There is **no** automated
`supabase db reset` / migration runner in CI — operators apply each file
via the Supabase SQL editor (or an equivalent `psql` session). Scripts are
written to be **idempotent** and safe to re-run.

## Data API grants (before 30 Oct 2026)

From **30 October 2026**, Supabase will stop auto-granting Data API roles
(`anon`, `authenticated`, `service_role`) on **new** tables in `public` on
existing projects. Existing tables keep their grants. After that date,
any migration that `CREATE TABLE` / `CREATE VIEW` / exposes a function
without explicit `GRANT`s will leave the object unreachable via
`supabase-js` after a project reset, preview-branch reset, or fresh apply.

**Rule for every new migration that creates a public object:**

1. Enable RLS (or document why not).
2. Add **minimal** explicit grants for the roles that should reach it:
   - `GRANT SELECT … TO authenticated` (and write privileges only where the app needs them)
   - `GRANT … TO service_role` for server/admin/webhook/cron paths
   - `GRANT SELECT TO anon` **only** if the table is genuinely public-read **and** RLS is enabled
3. Never use blanket grants such as
   `GRANT ALL ON ALL TABLES IN SCHEMA public TO anon`.
4. Keep RLS policies tight — grants only open the PostgREST door; policies
   still decide which rows are visible.

See `0007_data_api_grants.sql` for the grant matrix on objects created in
`0001`–`0006`.

## Apply order

Paste and run in order when bootstrapping a project:

1. `0001_auth_billing.sql`
2. `0002_session_presence.sql` / `0002_syllabus_alignment.sql`
3. `0003_editorial_audit.sql`
4. `0004_editorial_audit_rls.sql`
5. `0005_seo_submission_state.sql`
6. `0006_paid_content_rls.sql`
7. `0007_data_api_grants.sql` (idempotent catch-up for already-applied DBs)

Tables that predate this folder (`questions`, `content_modules`,
`user_sessions`, etc.) were created outside these migrations and already
have legacy auto-grants on production; do not blanket-regrant them here.
