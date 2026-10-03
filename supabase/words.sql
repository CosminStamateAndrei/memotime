-- Run this once in Supabase → SQL Editor.
-- One shared word list: every logged-in user can see, add and delete all words.

create table if not exists public.words (
  id          bigint generated always as identity primary key,
  nl          text not null,
  en          text not null,
  added_by    text,
  created_at  timestamptz not null default now()
);

alter table public.words enable row level security;

create policy "logged-in users read words"
  on public.words for select to authenticated using (true);

create policy "logged-in users add words"
  on public.words for insert to authenticated with check (true);

create policy "logged-in users edit words"
  on public.words for update to authenticated using (true) with check (true);

create policy "logged-in users delete words"
  on public.words for delete to authenticated using (true);

-- Push new/deleted words to everyone who has the app open.
alter publication supabase_realtime add table public.words;
