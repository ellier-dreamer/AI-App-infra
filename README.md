# AI App Infra

A responsive, installable-PWA webapp. v1 scope: email/password registration and login with
session persistence. Built with Next.js (App Router), Supabase (Postgres + Auth), and deployed
on Vercel.

## Free-tier services this depends on

| Service  | Used for            | Free tier limits (as of mid-2026)                                                                 |
| -------- | -------------------- | -------------------------------------------------------------------------------------------------- |
| Supabase | Auth + Postgres      | 50,000 MAU, 500MB database, 1GB storage. Free projects pause after 7 days with zero API requests (auto-resumes on next request; data is retained). |
| Vercel   | Hosting              | 100GB data transfer/mo, 1M function invocations/mo. **Hobby plan ToS restricts to non-commercial/personal use** — budget the $20/mo Pro plan before this becomes a commercial product. |

## Manual setup required (can't be done for you)

These steps require access to third-party dashboards and must be done by a human:

1. **Create a Supabase account and project** at [supabase.com](https://supabase.com). Note the
   region and set a database password. From Project Settings -> API, copy the **Project URL**
   and **anon public key**.
2. **In the Supabase dashboard**, go to Authentication -> Providers -> Email and:
   - Turn **off** "Confirm email" (v1 has no email-verification step).
   - Set the minimum password length to **8** (to match the app's validation).
3. **Create a Vercel account** and connect the Vercel GitHub App to this repository
   (`ellier-dreamer/AI-App-infra`) — this needs an interactive OAuth flow in a browser.
4. **In Vercel -> Project Settings -> Environment Variables**, set `NEXT_PUBLIC_SUPABASE_URL`
   and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from step 1) for Production, Preview, and Development.
5. **Acknowledge the Vercel Hobby plan's non-commercial restriction** noted above.

## Running locally

1. Copy `.env.example` to `.env.local` and fill in the two Supabase values from step 1 above:

   ```bash
   cp .env.example .env.local
   ```

2. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) — it redirects to `/login` (or
   `/dashboard` if already signed in).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` / `npm run start` — production build and start
- `npm run lint` — ESLint
- `npm run test` — Vitest unit tests (currently covers the registration/login validation schemas)
- `npx tsc --noEmit` — typecheck

## Project structure

- `src/app/` — routes: `/login`, `/register`, `/dashboard` (session-protected), plus the PWA
  `manifest.ts`.
- `src/components/auth/` — login/register form client components.
- `src/lib/supabase/` — Supabase client helpers: `client.ts` (browser), `server.ts` (Server
  Components/Actions), `proxy.ts` (session-refresh, used by `src/proxy.ts`).
- `src/lib/auth/guards.ts` — `requireUser()` / `redirectIfAuthenticated()`, called directly from
  page components (not shared layouts — Next.js layouts don't re-run on every client-side
  navigation, so an auth check placed there wouldn't be reliably re-checked).
- `src/lib/validations/auth.ts` — zod schemas shared by client-side `minLength` hints and the
  server actions.
- `src/lib/errors/supabase-auth.ts` — maps raw Supabase Auth errors to user-facing messages
  (duplicate email, weak password, invalid credentials).
- `src/actions/auth.ts` — `registerAction`, `loginAction`, `logoutAction` server actions.
- `src/proxy.ts` — Next.js 16 renamed `middleware.ts` to `proxy.ts`; this only refreshes the
  Supabase session cookie on every request, it does not do authorization redirects (that's in
  `guards.ts`).
- `public/sw.js` — a deliberately no-op service worker; combined with `manifest.ts` and icons in
  `public/icons/`, it's enough to make the site installable (Chrome/Android requires a
  registered service worker with a fetch handler, even a trivial one, for the install prompt).
  Real offline/caching support is not implemented yet.

## Deployment

Push to `main` (or open a PR) once the Vercel GitHub integration is connected (manual step 3
above) — Vercel builds and deploys automatically. Production and Preview environments both need
the two `NEXT_PUBLIC_SUPABASE_*` environment variables set (manual step 4 above).
