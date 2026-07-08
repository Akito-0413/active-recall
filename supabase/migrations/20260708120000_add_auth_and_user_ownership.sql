create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  username text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint user_profiles_email_not_blank check (btrim(email) <> ''),
  constraint user_profiles_username_not_blank check (btrim(username) <> '')
);

create or replace function public.set_user_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists user_profiles_set_updated_at on public.user_profiles;

create trigger user_profiles_set_updated_at
before update on public.user_profiles
for each row
execute function public.set_user_profiles_updated_at();

create or replace function public.sync_user_profile_from_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, email, username)
  values (
    new.id,
    new.email,
    split_part(new.email, '@', 1)
  )
  on conflict (id)
  do update
  set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.sync_user_profile_from_auth_user();

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
after update of email on auth.users
for each row
when (old.email is distinct from new.email)
execute function public.sync_user_profile_from_auth_user();

alter table public.recall_logs
add column if not exists owner_id uuid references auth.users (id) on delete cascade;

create index if not exists recall_logs_owner_created_at_idx
on public.recall_logs (owner_id, created_at desc);

create index if not exists recall_logs_owner_reviewed_created_at_idx
on public.recall_logs (owner_id, reviewed, created_at desc);

alter table public.user_profiles enable row level security;
alter table public.recall_logs enable row level security;

drop policy if exists "user_profiles_select_own" on public.user_profiles;
create policy "user_profiles_select_own"
on public.user_profiles
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "user_profiles_insert_own" on public.user_profiles;
create policy "user_profiles_insert_own"
on public.user_profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "user_profiles_update_own" on public.user_profiles;
create policy "user_profiles_update_own"
on public.user_profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "recall_logs_select_own" on public.recall_logs;
create policy "recall_logs_select_own"
on public.recall_logs
for select
to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "recall_logs_insert_own" on public.recall_logs;
create policy "recall_logs_insert_own"
on public.recall_logs
for insert
to authenticated
with check ((select auth.uid()) = owner_id);

drop policy if exists "recall_logs_update_own" on public.recall_logs;
create policy "recall_logs_update_own"
on public.recall_logs
for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "recall_logs_delete_own" on public.recall_logs;
create policy "recall_logs_delete_own"
on public.recall_logs
for delete
to authenticated
using ((select auth.uid()) = owner_id);
