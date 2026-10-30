# CLAUDE.md

Single-user, browser-only Todo app (v1): React 19 + TypeScript + Vite 8, plain CSS, localStorage, no backend.

docs/ is the source of truth: intent.md (why), spec.md (what, with AC ids), arch.md (how). Read the relevant doc before writing code. No code exists yet; scaffold it as described in arch.md §7.

## Commands

- Dev: `npm run dev` → http://localhost:5173 (separate data from daily use)
- Test: `npm test` (watch: `npm run test:watch`; one AC: `npx vitest run -t "AC4.3"`)
- Build: `npm run build`
- Preview (daily use): `npm run build && npm run preview` → http://localhost:4173

## Workflow

- One feature = one branch `feat/prN-short-name` = one PR. Never commit to `main`.
- Run `npm test` before every commit.
- Put AC ids in test names (e.g. `AC4.3 cancel keeps todo`) and in PR descriptions.

## Code rules

- `src/todos.ts` and `src/storage.ts` must stay free of React and the DOM, so they can be unit-tested directly.
- Components only display state and call hook actions. No todo logic or storage access in them.

## Gotchas

- Node.js 22.12+ is required (Vitest 5).
- The daily-use URL is exactly `http://localhost:4173`. localStorage is per origin, so `127.0.0.1` or another port shows an empty list. Keep `preview: { port: 4173, strictPort: true }`.
- Never change spec.md ACs without asking me first. AC ids are stable: new ones go at the end of a feature, never renumber.
