-- SEO submission state (IndexNow delta tracking)

create table if not exists public.seo_submission_state (
  id text primary key default 'default',
  url_timestamps jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.seo_submission_state enable row level security;
revoke all on table public.seo_submission_state from anon, authenticated;
-- IndexNow script uses service_role via PostgREST (required after 30 Oct 2026; see supabase/README.md)
grant select, insert, update, delete on public.seo_submission_state to service_role;

insert into public.seo_submission_state (id)
values ('default')
on conflict (id) do nothing;
