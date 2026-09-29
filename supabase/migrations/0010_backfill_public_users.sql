-- Backfill public.users for auth accounts and restore trigger sync.
--
-- Root cause (activity tracking): user_progress, user_sessions, mock_exam_sessions,
-- and scenario_sessions reference public.users(id). After 0001_auth_billing.sql,
-- on_auth_user_created only populated public.profiles, so new sign-ups had no
-- public.users row and activity INSERTs failed the FK.
--
-- APPLY IN SUPABASE: Dashboard → SQL editor → paste this whole file → Run.
-- Safe to re-run (idempotent).
--
-- App code writes user_progress via INSERT only (no UPDATE/upsert).

insert into public.users (id, email, full_name)
select a.id, a.email, a.raw_user_meta_data->>'full_name' from auth.users a
where a.email is not null
  and not exists (select 1 from public.users u where u.id = a.id)
  and not exists (select 1 from public.users u where lower(u.email) = lower(a.email))
on conflict do nothing;

create or replace function public.tg_on_auth_user_created()
returns trigger language plpgsql security definer set search_path to 'public' as $$
begin
  insert into public.profiles (user_id, email)
  values (new.id, new.email)
  on conflict (user_id) do update set email = excluded.email;
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict do nothing;
  update public.customer_access
     set user_id = new.id, updated_at = now()
   where lower(email) = lower(new.email)
     and (user_id is null or user_id <> new.id);
  return new;
end;
$$;
