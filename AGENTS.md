<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project shape

- Single Next.js 16.4.5 App Router app (npm, not a monorepo). Source in `src/`, alias `@/*` → `src/*`.
- No test suite, no CI, no formatter. The only checks are lint, typecheck, and build (below).
- Version-matched Next.js docs ship with the install at `node_modules/next/dist/docs/` — consult them before writing Next code; they differ from your training data.

## Commands

- `npm run dev` — Turbopack dev server on :3000 (Turbopack is also the default for `next build`). If a server is already running, `next dev` prints its URL/PID (from `.next/dev/lock`) instead of starting a second one — reuse it.
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`). Next 16 removed `next lint`, and `next build` no longer lints, so lint is a separate step.
- `npx tsc --noEmit` — there is no typecheck script; `npm run build` also type-checks.
- Verify changes with: `npm run lint` → `npx tsc --noEmit` → `npm run build`.
- On a fresh clone, `npx tsc --noEmit` fails with `Cannot find name 'LayoutProps'`: the route types used by `src/app/layout.tsx` are generated into `.next/types/` by `next dev`/`next build`. Run one of them first.

## Framework quirks (Next 16)

- `cacheComponents: true` + `partialPrefetching: true` are enabled in `next.config.ts`. Uncached data access (uncached `fetch`, `cookies()`/`headers()`, DB reads) during prerendering fails dev and build with a labeled-fix error — wrap it in `<Suspense>`, cache it with `"use cache"`, or `export const instant = false` for a blocking route.
- React Compiler is enabled (`reactCompiler: true` + `babel-plugin-react-compiler`): compiles run through Babel (slower) and enforce the Rules of React.
- Tailwind v4 is CSS-first: no `tailwind.config.*` file. Theme and `@import`s live in `src/app/globals.css`, loaded via the `@tailwindcss/turbopack` rule in `next.config.ts`.
- `.env` exists locally (gitignored) with `BETTER_AUTH_SECRET` / `BETTER_AUTH_URL` — never commit it. `better-auth` is only a stub so far (`src/lib/auth.ts`, no route handlers).

## UI stack

- shadcn/ui style `base-nova` (`components.json`): primitives come from **Base UI** (`@base-ui/react`), not Radix — don't import `@radix-ui/*`. Add components with `npx shadcn add <name>`; they land in `src/components/ui/`.
- `cn` is the `cn` npm package (re-exported by `src/lib/utils.ts`), not a local clsx + tailwind-merge helper.
