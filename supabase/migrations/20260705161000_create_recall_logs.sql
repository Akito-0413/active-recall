create extension if not exists pgcrypto;

create table if not exists public.recall_logs (
  id uuid primary key default gen_random_uuid(),
  book_title text not null,
  summary_points jsonb not null,
  reflection text,
  reviewed boolean not null default false,
  reviewed_at timestamptz,
  source text not null,
  source_type text not null default 'book',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint recall_logs_book_title_not_blank check (btrim(book_title) <> ''),
  constraint recall_logs_source_check check (source in ('manual', 'custom_gpt')),
  constraint recall_logs_source_type_check check (source_type = 'book'),
  constraint recall_logs_summary_points_is_array check (jsonb_typeof(summary_points) = 'array'),
  constraint recall_logs_summary_points_length check (jsonb_array_length(summary_points) between 3 and 4),
  constraint recall_logs_reviewed_at_consistency check (
    (reviewed = true and reviewed_at is not null)
    or (reviewed = false and reviewed_at is null)
  )
);

create index if not exists recall_logs_reviewed_idx on public.recall_logs (reviewed, created_at desc);
create index if not exists recall_logs_created_at_idx on public.recall_logs (created_at desc);

create or replace function public.set_recall_logs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists recall_logs_set_updated_at on public.recall_logs;

create trigger recall_logs_set_updated_at
before update on public.recall_logs
for each row
execute function public.set_recall_logs_updated_at();
