# Test reports

## PR1: Project scaffold

Branch `feat/pr1-scaffold`, uncommitted working tree, tested 2026-10-30. Node v24.13.0.
Source of checks: [features.md](features.md) PR1 "Files" and "Done when".

| # | Check | Command | Evidence (real output, short) | Result |
|---|---|---|---|---|
| 1 | `npm test` passes; smoke test exists with the planned name | `npm test`; `npx vitest run --reporter=verbose` | `Test Files 1 passed (1)` / `Tests 1 passed (1)`, exit 0; `✓ src/App.test.tsx > smoke: renders the app title` | PASS |
| 2 | `npm run build` succeeds (incl. `tsc -b`) | `npm run build` | `tsc -b && vite build` → `✓ 16 modules transformed` … `✓ built in 352ms`, exit 0 | PASS |
| 3 | `npm run lint` has no errors | `npm run lint` | `> oxlint`, no diagnostics printed, exit 0 | PASS |
| 4a | Preview serves on http://localhost:4173 | `Invoke-WebRequest http://localhost:4173` | `status: 200`, body has `<title>Todos</title>` and `<div id="root">`. Note: 4173 was already held by a `vite preview` from this repo (pid 1628, started 11:54, before this test run). I did not start it and left it running. | PASS |
| 4b | A second preview fails instead of switching port | `npm run preview` (while 4173 busy) | `error when starting preview server: Error: Port 4173 is already in use`; process exited; no listener on 4174–4180 afterwards | PASS |
| 5 | Protected files unchanged vs main: docs/ (except PR1 Status), .claude/, CLAUDE.md, .mcp.json | `git diff main --stat -- docs .claude CLAUDE.md .mcp.json` | Only `docs/features.md \| 2 +-`, and the diff is just `- Status: todo` → `+ Status: done` in PR1. Nothing under .claude/, CLAUDE.md, .mcp.json | PASS |
| 6a | Temp scaffold folder removed | `git status --short --untracked-files=all` | `?? scaffold-tmp/.gitignore`, `?? scaffold-tmp/README.md`: folder still exists (template README + .gitignore) | **FAIL** |
| 6b | Template demo removed from App | read `src/App.tsx`, `src/App.css` | App.tsx renders only `<main><h1>Todos</h1></main>`; App.css is 5 lines (body margin/font), no demo | PASS |
| 6c | No unused template files left | grep `src/`, `index.html`, configs for each asset name | Only `public/favicon.svg` is referenced (index.html). **Unreferenced:** `src/index.css` (100 lines, not imported by main.tsx), `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `public/icons.svg` | **FAIL** |
| 6d | git status shows only what PR1 should add | `git status --short --untracked-files=all` | Expected: `.gitignore`, `docs/features.md`, `.oxlintrc.json`, `index.html`, `package*.json`, `public/favicon.svg`, `src/{main.tsx,App.tsx,App.css,App.test.tsx,test/setup.ts}`, `tsconfig*.json`, `vite.config.ts`. Extra: the 7 files from 6a + 6c | **FAIL** |
| 7a | `.gitignore` merged with the template's, not replaced | `git diff main -- .gitignore` | Original 7 lines kept; 16 lines added under `# From the Vite template` (logs, dist-ssr, *.local, editor files) | PASS |
| 7b | package.json scripts | read `package.json` | `"test": "vitest run"`, `"test:watch": "vitest"`, plus dev/build/lint/preview | PASS |
| 7c | Dev deps from arch §7 | read `package.json` | vitest ^5.0.5, jsdom, @testing-library/react, /dom, /user-event, /jest-dom all present | PASS |
| 7d | vite.config.ts per plan | read `vite.config.ts` | `defineConfig` from `'vitest/config'`; `test: { environment: 'jsdom', globals: true, setupFiles: ['./src/test/setup.ts'] }`; `preview: { port: 4173, strictPort: true }` | PASS |
| 7e | tsconfig has Vitest globals types | read `tsconfig.app.json` | `"types": ["vite/client", "vitest/globals", "@testing-library/jest-dom/vitest"]` | PASS |
| 7f | Required files exist: index.html, src/main.tsx, src/App.tsx, src/App.css, src/test/setup.ts | `git status`, read files | All present. setup.ts = `import '@testing-library/jest-dom/vitest'`; index.html title `Todos` | PASS |
| 7g | No todo features in PR1 | read `src/` | No todos.ts / storage.ts / useTodos.ts / components | PASS |

### Manual checks for me

- Open http://localhost:4173 in Chrome: the page shows the "Todos" heading and the console has no errors.
- Decide about the preview server on 4173 (pid 1628, `vite preview` started 11:54). I didn't start it, so I didn't stop it. To see a fresh first-start yourself: stop it, then `npm run build && npm run preview` and watch it bind to 4173.
- After the builder's cleanup, rerun checks 6a–6d (`git status --short --untracked-files=all`).
- Decide whether `docs/test.md` (this file) goes into the PR1 commit or straight to `main`. It is a new file under `docs/`.

**Verdict: NOT READY.** Failed: 6a (`scaffold-tmp/` not removed), 6c (unused template files `src/index.css`, `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `public/icons.svg`), 6d (git status shows those extra files).

### PR1 re-test

Run by the `pr-tester` subagent on 2026-10-30, uncommitted working tree on `feat/pr1-scaffold`.

| # | Check | Command | Evidence | Result |
|---|---|---|---|---|
| 1 | ACs | none for PR1 (features.md: "ACs: none") | smoke test is named `smoke: renders the app title` | PASS |
| 2 | Tests | `npm test` | 1 file, 1 test passed (vitest 5.0.5) | PASS |
| 3 | Build | `npm run build` | `tsc -b && vite build`, built in 356ms, dist/ created | PASS |
| 4 | Lint | `npm run lint` | `oxlint` printed no warnings or errors | PASS |
| 5 | Preview serves | `npm run preview`, then GET http://localhost:4173 | HTTP 200, `Local: http://localhost:4173/` | PASS |
| 6 | strictPort | second `npm run preview` while the first was up | `Error: Port 4173 is already in use`, process exited | PASS |
| 7 | Servers stopped | `taskkill /T /F` on the process tree it started, then `netstat -ano \| grep 4173` | no output, 0 LISTEN entries (TIME_WAIT lines seen right after the kill had cleared by the recheck) | PASS |
| 8 | Protected files | `git diff main --stat -- docs .claude CLAUDE.md .mcp.json` | docs/features.md 1 line (PR1 `Status: todo` to `done`, allowed); .claude/skills/next-feature/SKILL.md +7/-2 (setup change, see note); docs/test.md untracked (allowed); CLAUDE.md and .mcp.json unchanged | PASS (see note) |
| 9 | Temp folder removed | `ls` of repo root | no `scaffold-tmp/` | PASS |
| 10 | Unused template files | `ls src src/test public`, grep for references | `src/index.css`, `src/assets/*` and `public/icons.svg` are gone. What's left is `App.css` (imported by App.tsx), `favicon.svg` (linked in index.html), `main.tsx`, `App.tsx`, `App.test.tsx` and `test/setup.ts`. All are referenced. | PASS |
| 11 | Git hygiene | `git status --short --untracked-files=all` | 19 entries. Scaffold files: .gitignore (Vite template ignores merged in), .oxlintrc.json, index.html, package.json, package-lock.json, public/favicon.svg, the 5 src files, 3 tsconfig files, vite.config.ts. Plus docs/features.md and docs/test.md. Plus two .claude entries (see note). `dist/` is ignored (`.gitignore:2`). No leftovers. | PASS |
| 12 | Done-when config | read `vite.config.ts` and `package.json` | `defineConfig` from `vitest/config`; jsdom, globals and setupFiles set; `preview: { port: 4173, strictPort: true }`; scripts `test: vitest run` and `test:watch: vitest` | PASS |

Note on .claude: the working tree has `.claude/skills/next-feature/SKILL.md` modified (+7/-2) and `.claude/agents/pr-tester.md` new. Both are setup changes outside PR1's scope. If committed with PR1, they would break the "docs/, .claude/, CLAUDE.md, .mcp.json unchanged" line in Done when. Commit them to main separately.

Manual checks for me:

- Open http://localhost:4173 after `npm run build && npm run preview` and confirm the "Todos" heading shows.
- Stage only the PR1 files. Leave out `.claude/agents/pr-tester.md` and `.claude/skills/next-feature/SKILL.md`.

**Verdict: READY FOR PR**, as long as the two .claude files are left out of the PR1 commit. With them included it is NOT READY (check 8). No failed or blocked checks.
