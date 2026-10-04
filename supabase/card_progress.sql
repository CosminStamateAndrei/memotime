-- Run this once in Supabase → SQL Editor.
-- Personal flashcard progress: each person has their own review pile and
-- "knew it" counts. Words stay shared; this table is private per user.

create table if not exists public.card_progress (
  user_id     uuid not null default auth.uid() references auth.users on delete cascade,
  word_key    text not null,
  review      boolean not null default false,
  known       int not null default 0,
  updated_at  timestamptz not null default now(),
  primary key (user_id, word_key)
);

alter table public.card_progress enable row level security;

create policy "own progress only"
  on public.card_progress for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
