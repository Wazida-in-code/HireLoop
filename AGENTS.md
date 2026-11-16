<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project shape

- Single Next.js 16.4.5 App Router app (npm, not a monorepo). Source in `src/`, alias `@/*` → `src/*`.
- No test suite, no CI, no formatter. The only checks are lint, typecheck, and build (below).
- Version-matched Next.js docs ship with the install at `node_modules/next/dist/docs/` — consult them before writing Next code; they differ from your training data.
- MongoDB (db `HireLoop`) is used **only by better-auth**. All job/application/user data comes from an external HTTP API (see Data flow).

## Commands

- `npm run dev` — Turbopack dev server on :3000 (Turbopack is also the default for `next build`). If a server is already running, `next dev` prints its URL/PID (from `.next/dev/lock`) instead of starting a second one — reuse it.
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`). Next 16 removed `next lint`, and `next build` no longer lints, so lint is a separate step. It currently exits 1 on a pre-existing error in `src/hooks/use-mobile.ts` (`react-hooks/set-state-in-effect`) plus a few unused-var warnings — don't assume you introduced it.
- `npx tsc --noEmit` — there is no typecheck script; `npm run build` also type-checks.
- Verify changes with: `npm run lint` → `npx tsc --noEmit` → `npm run build`.
- On a fresh clone, `npx tsc --noEmit` fails with `Cannot find name 'LayoutProps'`: the route types used by `src/app/layout.tsx` are generated into `.next/types/` by `next dev`/`next build`. Run one of them first.

## Data flow (easy to miss)

- `src/lib/api/*` (plain reads) and `src/lib/actions/*` (`'use server'` mutations) call a backend at `NEXT_PUBLIC_API_BASE_URL`, defaulting to `http://localhost:8000`. **That backend is not in this repo** — pages depending on it fail until it is running.
- Authenticated API calls must go through `authFetch` / `protectedMutation` in `src/lib/core/server.ts`, which attach the better-auth bearer token. A raw `fetch` to the API carries no auth.
- Two `requireRole` helpers exist: pages use `requireRole()` from `@/lib/require-role` (redirects to `/sign-in` or the user's role home). The older one in `src/lib/core/server.ts` redirects to `/unauthorized` and is effectively unused. Role homes: `/seeker`, `/recruiter`, `/admin` (`src/lib/roles.ts`).
- Payments: Stripe checkout via `src/app/api/checkout_sessions/route.ts` and the `/payment` pages.

## Auth (better-auth, no longer a stub)

- Config in `src/lib/auth.ts`; route handler at `src/app/api/auth/[...all]/route.ts` (`toNextJsHandler`). Email+password and Google sign-in, `admin()` plugin, Mongo adapter.
- Role lives in `user.userRole` (`seeker` | `recruiter` | `admin`). A `databaseHooks.user.create.before` hook mirrors it into better-auth's own `role` field so sign-ups pass the admin plugin's API gates — don't remove it as "duplicate".
- Session gating reads headers + MongoDB per request (`auth.api.getSession`), so gated routes cannot be prerendered.

## Framework quirks (Next 16)

- `cacheComponents` and `partialPrefetching` are currently **commented out** in `next.config.ts`, so prerender-time caching rules do not apply. If you re-enable them, uncached data access (`cookies()`, `headers()`, DB reads) during prerender fails dev/build with a labeled-fix error — wrap it in `<Suspense>` or cache it with `"use cache"`.
- React Compiler is enabled (`reactCompiler: true` + `babel-plugin-react-compiler`): compiles run through Babel (slower) and enforce the Rules of React.
- Tailwind v4 is CSS-first: no `tailwind.config.*` file. Theme and `@import`s live in `src/app/globals.css`, loaded via the `@tailwindcss/turbopack` rule in `next.config.ts`.
- `.env` is gitignored — never commit it. Keys present: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGO_DB_CLIENT_URI`, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`. Note `src/lib/auth.ts` also reads `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`, which are **not** in `.env` — Google sign-in fails until they are added.

## UI stack

- shadcn/ui style `base-nova` (`components.json`): primitives come from **Base UI** (`@base-ui/react`), not Radix — don't import `@radix-ui/*`. Add components with `npx shadcn add <name>`; they land in `src/components/ui/`.
- `cn` is the `cn` npm package (re-exported by `src/lib/utils.ts`), not a local clsx + tailwind-merge helper.
