# memotime

A shared Dutch ↔ English word list with translation practice. React (Vite) + Supabase, deploys to Vercel.

## Tabs

- **Words** — paste pairs in bulk (one per line, Dutch first: `de hond - the dog`, `lopen = to walk`, tab-separated from a spreadsheet works too). The list is shared: everyone who logs in sees the same words, live.
- **NL → EN** — you get a Dutch word, type the English.
- **EN → NL** — you get an English word, type the Dutch.

Answer checking ignores case, accents, punctuation and leading articles (`de`, `het`, `the`, `to`…). Use `/` for several accepted answers (`huis - house / home`). Small typos count as right but are flagged; "I was right" overrules a wrong verdict.

## Default words

Built-in words live in `src/data/defaultWords.js` and are shown to everyone alongside the ones added in the app.

## Setup

1. In Supabase → SQL Editor, run `supabase/words.sql` once (creates the shared `words` table).
2. `.env.local` (and Vercel's environment variables) need `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
3. `npm install && npm run dev`.

Deploy: push to GitHub and import in Vercel (build `npm run build`, output `dist`). `vercel.json` handles SPA routing.
