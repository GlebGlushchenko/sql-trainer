-- Выполните этот скрипт один раз: Supabase → SQL Editor → New query → Run

create table if not exists public.progress (
  user_id         uuid        not null references auth.users (id) on delete cascade,
  problem_id      integer     not null,
  status          text        check (status in ('solved', 'attempted')),
  attempts        integer     not null default 0,
  solved_at       timestamptz,
  draft           text,
  solution_viewed boolean     not null default false,
  updated_at      timestamptz not null default now(),
  primary key (user_id, problem_id)
);

alter table public.progress enable row level security;

drop policy if exists "progress_select_own" on public.progress;
drop policy if exists "progress_insert_own" on public.progress;
drop policy if exists "progress_update_own" on public.progress;
drop policy if exists "progress_delete_own" on public.progress;

create policy "progress_select_own" on public.progress
  for select using (auth.uid() = user_id);
create policy "progress_insert_own" on public.progress
  for insert with check (auth.uid() = user_id);
create policy "progress_update_own" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "progress_delete_own" on public.progress
  for delete using (auth.uid() = user_id);
