# memotime

Learn Dutch through real situations. A React (Vite) web app — deploys to Vercel as-is.

## What's inside

- **Login / Register** landing page.
- **First-run mini-quiz** that seeds your known words objectively (pick the English meaning; correct picks are added to your vocabulary).
- **Situations** (bus, café, doctor, bakery, work, …) each with three **attained** levels — clear *Makkelijk* to unlock *Gemiddeld*, then *Moeilijk*. Each situation shows a progress track.
- **My words** — everything you've collected.
- **Dictionary** — every word and phrase with English translation and a **pronounce key**.
- **Respond** tab — a Dutch line is spoken to you; you type your own reply, then reveal a model answer.

Every Dutch word and sentence, everywhere in the app, has a translation and a pronunciation button (browser text-to-speech, Dutch voice).

## Run it locally

Requires Node 18+.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Deploy to Vercel

1. Push this folder to a GitHub repo (or drag it into Vercel).
2. Import the repo in Vercel. It auto-detects Vite:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Deploy. `vercel.json` already handles single-page-app routing so refreshes on any tab work.

## Pronunciation note

Audio uses the browser's built-in Web Speech API. Chrome and Edge include a Dutch voice out of the box; on some systems Safari/Firefox may fall back to another voice or none. Nothing to configure.

## Prototype notes (what to upgrade for real users)

Accounts and progress are stored in the browser's `localStorage`, so data lives per-device and passwords are **not** securely stored — fine for testing, not for production. To make it real, add a backend (e.g. Supabase or a small API) for auth and to sync each user's known words and progress. The Respond tab currently self-checks against a model answer; it can be upgraded to grade free-form replies with the Anthropic API.

## Project structure

```
src/
  data/         situations, onboarding quiz, respond prompts (all the Dutch content)
  context/      AppContext — auth + progress, persisted to localStorage
  hooks/        useSpeech — Dutch text-to-speech
  components/   Layout, WordCard, SpeakButton, ProgressTrack
  pages/        Auth, Onboarding, Dashboard, SituationDetail, KnownWords, Dictionary, Respond
```

To add a situation, add an entry to `src/data/situations.js` — the dashboard, dictionary and checks pick it up automatically.
