# Build plan: Todo Web App (v1)

Small PRs, in order. Source: [spec.md](spec.md) (ACs), [arch.md](arch.md) (how).

- Feature work reaches `main` only through a merged PR: one branch `feat/prN-short-name` each (below).
- Docs and setup changes may be pushed to `main` directly, by me.
- Each feature PR: `npm test` green before every commit, AC ids in test names and the PR description, main working after merge.

Status is `todo` or `done`. A PR sets its own `Status: done` in this file as part of the PR, so on `main`, `done` means merged.

Slicing notes:

- PR2 adds todos in memory only; PR3 adds saving. Combining them (F1 + F2 + full storage) would be ~500 lines. Main still works after PR2, it just forgets todos on reload.
- The storage format is final from PR3 (`{ version: 1, filter, todos }`, with `filter` in hook state), so PR7 needs no format change.
- AC2.2 lands in PR2 (first PR with the input). AC2.1 lands in PR3 (done state on open needs saved data).
- The checkbox is read-only in PR3 and becomes clickable in PR4.
- `ConfirmDialog` arrives in PR6 (first user) and is reused in PR8. `FilterBar` arrives in PR7 and gets "Clear completed" in PR8.

### PR1: Project scaffold
- Branch: feat/pr1-scaffold
- Status: todo
- Goal: Empty Vite react-ts app with Vitest + RTL + jest-dom and a passing smoke test; no todo features.
- ACs: none
- Files:
  - Scaffold with `npm create vite@latest` into a temp folder (e.g. `scaffold-tmp/`), then move its files to the root.
    Never delete or overwrite `docs/`, `.claude/`, `CLAUDE.md`, `.mcp.json`; merge the template's `.gitignore`
    into the existing one; remove the temp folder.
  - `package.json` (scripts `test: vitest run`, `test:watch: vitest`; dev deps from arch §7), `vite.config.ts`
    (`defineConfig` from `vitest/config`; `test: { environment: "jsdom", globals: true, setupFiles }`;
    `preview: { port: 4173, strictPort: true }`), `tsconfig*.json` (Vitest globals types), `index.html`,
    `src/main.tsx`, `src/App.tsx` (title only, template demo removed), `src/App.css`, `src/test/setup.ts`.
- Tests: `src/App.test.tsx`: `smoke: renders the app title`.
- Done when: `npm test` passes; `npm run build` succeeds; `npm run preview` serves on http://localhost:4173
  (and fails instead of switching port if 4173 is busy); docs/, .claude/, CLAUDE.md, .mcp.json unchanged.
- Depends on: none

### PR2: Add a todo
- Branch: feat/pr2-add-todo
- Status: todo
- Goal: Type a task and add it to the bottom of the list (in memory; saving comes in PR3).
- ACs: AC1.1, AC1.2, AC1.3, AC1.4, AC1.6, AC2.2
- Files: `src/todos.ts` (Todo type, `isBlank`, `addTodo`), `src/useTodos.ts` (state + `add`),
  `src/components/TodoInput.tsx`, `src/components/TodoItem.tsx` (view only: text), `src/App.tsx`,
  `src/App.css` (dark theme + blue accent from mockup.html; long text wraps).
- Tests:
  - `todos.test.ts`: `AC1.1 addTodo appends an active todo at the end`, `AC1.2 empty text adds nothing`,
    `AC1.3 spaces-only text adds nothing`, `AC1.4 keeps 2,000-character text in full`,
    `AC1.6 trims start/end spaces, keeps inner spaces`.
  - `App.test.tsx` (describe F1 / F2): `AC1.1 submit adds "Buy milk" at the bottom and clears input`,
    `AC1.2 empty submit adds nothing`, `AC1.3 spaces-only submit adds nothing`,
    `AC1.4 2,000-character todo is shown in full`, `AC1.6 "  Buy milk  " is shown as "Buy milk"`,
    `AC2.2 no todos: empty list and a todo can be added`.
- Done when: `npm test` passes + manual check in Chrome: a 2,000-character todo wraps without breaking the layout (AC1.4).
- Depends on: PR1

### PR3: Save and reload
- Branch: feat/pr3-persistence
- Status: todo
- Goal: Todos are saved to localStorage after every change and shown again (text + done state) after a reload.
- ACs: AC1.5, AC2.1, AC2.3
- Files: `src/storage.ts` (`loadState`, `saveState`; key `todoApp.v1`, format `{ version: 1, filter, todos }`;
  handling of missing, corrupt and throwing storage per arch §3), `src/useTodos.ts` (state `{ todos, filter }`
  initialised from `loadState`, `useEffect` → `saveState`, exposes a save-failed flag),
  `src/components/TodoItem.tsx` (shows done state: read-only checkbox + completed style),
  `src/App.tsx` ("Not saved" notice), `src/App.css`.
- Tests:
  - `storage.test.ts`: missing key → empty + "all"; invalid JSON → empty, raw copied to `todoApp.v1.corrupt`,
    warns; wrong shape/version → same; bad item dropped, rest kept; unknown filter → "all";
    save then load round-trip; storage that throws does not crash.
  - `App.test.tsx`: `AC1.5 added todo is still there after reload`,
    `AC2.1 opening the app shows each todo's text and done state` (seeded storage),
    `AC2.3 reload shows same todos with same text and done state`, `shows "Not saved" when storage throws`.
- Done when: `npm test` passes + manual check: on http://localhost:4173, add a todo, do a real browser reload, and it is still there.
- Depends on: PR2

### PR4: Mark complete / incomplete
- Branch: feat/pr4-toggle-done
- Status: todo
- Goal: Tick a todo off or un-tick it, and the new state is saved.
- ACs: AC5.1, AC5.2, AC5.3
- Files: `src/todos.ts` (`toggleTodo`), `src/useTodos.ts` (`toggle`), `src/components/TodoItem.tsx`
  (checkbox becomes clickable), `src/App.css`.
- Tests:
  - `todos.test.ts`: `AC5.1 toggleTodo marks active todo done`, `AC5.2 toggleTodo marks done todo active`,
    `toggleTodo does not mutate the input`.
  - `App.test.tsx` (describe F5): `AC5.1 marking complete shows it completed`,
    `AC5.2 marking incomplete shows it active again`, `AC5.3 done state survives reload`.
- Done when: `npm test` passes.
- Depends on: PR3

### PR5: Edit a todo
- Branch: feat/pr5-edit-todo
- Status: todo
- Goal: Change a todo's text with the Edit button; Enter/Save saves, Esc/Cancel cancels.
- ACs: AC3.1, AC3.2, AC3.3, AC3.4, AC3.5, AC3.6, AC3.7
- Files: `src/todos.ts` (`editTodo`), `src/useTodos.ts` (`edit`), `src/components/TodoItem.tsx`
  (edit mode: input, Save, Cancel, Enter/Esc keys), `src/App.css`.
- Tests:
  - `todos.test.ts`: `AC3.1 editTodo changes text`, `AC3.2 blank or spaces-only edit keeps old text`,
    `AC3.4 keeps very long text in full`, `AC3.6 editing a completed todo keeps it done`,
    `AC3.7 editTodo trims start/end spaces`.
  - `App.test.tsx` (describe F3): `AC3.1 Edit, type "Buy oat milk", {Enter} saves` (+ Save button case),
    `AC3.2 saving blank text is rejected, old text stays`, `AC3.3 {Escape} or Cancel keeps old text`,
    `AC3.4 long edited text is shown in full`, `AC3.5 edited text survives reload`,
    `AC3.6 edited completed todo stays completed`, `AC3.7 "  Buy oat milk  " is saved as "Buy oat milk"`.
- Done when: `npm test` passes + manual check in Chrome: long edited text wraps (AC3.4); focus goes to the edit input.
- Depends on: PR4 (AC3.6 needs completed todos)

### PR6: Delete a todo (with confirm dialog)
- Branch: feat/pr6-delete-todo
- Status: todo
- Goal: Delete a todo after confirming in an in-page dialog that shows its text.
- ACs: AC4.1, AC4.2, AC4.3, AC4.4
- Files: `src/todos.ts` (`deleteTodo`), `src/useTodos.ts` (`remove`),
  `src/components/ConfirmDialog.tsx` (new, shared: role `dialog`, title, message, Cancel / confirm button, Esc cancels),
  `src/App.tsx` (`pending` action: "delete id"), `src/components/TodoItem.tsx` (Delete button), `src/App.css`.
- Tests:
  - `todos.test.ts`: `AC4.2 deleteTodo removes only that todo`.
  - `App.test.tsx` (describe F4): `AC4.1 Delete opens a dialog showing the todo's text`,
    `AC4.2 confirm removes the todo`, `AC4.3 cancel keeps todo` (+ Esc case),
    `AC4.4 deleted todo does not come back after reload`.
- Done when: `npm test` passes + manual check in Chrome: the dialog looks like mockup.html.
- Depends on: PR3

### PR7: Filter the list
- Branch: feat/pr7-filter
- Status: todo
- Goal: Show All / Active / Completed todos; the chosen filter is remembered.
- ACs: AC6.1, AC6.2, AC6.3, AC6.4, AC6.5, AC6.6, AC6.7
- Files: `src/todos.ts` (`visibleTodos`), `src/useTodos.ts` (`setFilter`), `src/components/FilterBar.tsx` (new),
  `src/App.tsx` (renders `visibleTodos`), `src/App.css`. Storage already saves `filter` (PR3).
- Tests:
  - `todos.test.ts`: `AC6.1 all shows every todo`, `AC6.2 active shows only not-done`,
    `AC6.3 completed shows only done`, `AC6.5 no match gives empty list`.
  - `App.test.tsx` (describe F6): `AC6.1 "All" shows every todo`, `AC6.2 "Active" shows only not-done todos`,
    `AC6.3 "Completed" shows only done todos`, `AC6.4 completing a todo under Active hides it but keeps it`,
    `AC6.5 filter with no matches shows an empty list`, `AC6.6 chosen filter survives reload`,
    `AC6.7 first open selects "All"`.
- Done when: `npm test` passes.
- Depends on: PR4

### PR8: Clear completed
- Branch: feat/pr8-clear-completed
- Status: todo
- Goal: Remove all completed todos in one confirmed action; the button shows only when something is completed.
- ACs: AC7.1, AC7.2, AC7.3, AC7.4, AC7.5
- Files: `src/todos.ts` (`clearCompleted`, `hasCompleted`), `src/useTodos.ts` (`clearCompleted`),
  `src/components/FilterBar.tsx` ("Clear completed" button, shown when `hasCompleted`),
  `src/App.tsx` (`pending` action: "clear completed", reuses ConfirmDialog), `src/App.css`.
- Tests:
  - `todos.test.ts`: `AC7.2 clearCompleted removes done, keeps active`, `AC7.4 hasCompleted true/false`.
  - `App.test.tsx` (describe F7): `AC7.1 Clear completed opens a confirm dialog`,
    `AC7.2 confirm removes all completed, keeps active`, `AC7.3 cancel removes nothing`,
    `AC7.4 button hidden with no completed, shown with one under any filter`,
    `AC7.5 cleared todos do not come back after reload`.
- Done when: `npm test` passes + final v1 manual check in Chrome against mockup.html (wrapping, dialog look,
  edit focus, real reload on http://localhost:4173).
- Depends on: PR6 (ConfirmDialog), PR7 (FilterBar)

## AC coverage

| AC | PR |
|---|---|
| AC1.1 | PR2 |
| AC1.2 | PR2 |
| AC1.3 | PR2 |
| AC1.4 | PR2 |
| AC1.5 | PR3 |
| AC1.6 | PR2 |
| AC2.1 | PR3 |
| AC2.2 | PR2 |
| AC2.3 | PR3 |
| AC3.1 | PR5 |
| AC3.2 | PR5 |
| AC3.3 | PR5 |
| AC3.4 | PR5 |
| AC3.5 | PR5 |
| AC3.6 | PR5 |
| AC3.7 | PR5 |
| AC4.1 | PR6 |
| AC4.2 | PR6 |
| AC4.3 | PR6 |
| AC4.4 | PR6 |
| AC5.1 | PR4 |
| AC5.2 | PR4 |
| AC5.3 | PR4 |
| AC6.1 | PR7 |
| AC6.2 | PR7 |
| AC6.3 | PR7 |
| AC6.4 | PR7 |
| AC6.5 | PR7 |
| AC6.6 | PR7 |
| AC6.7 | PR7 |
| AC7.1 | PR8 |
| AC7.2 | PR8 |
| AC7.3 | PR8 |
| AC7.4 | PR8 |
| AC7.5 | PR8 |

35 of 35 ACs covered, each exactly once (F1: 6, F2: 3, F3: 7, F4: 4, F5: 3, F6: 7, F7: 5).
PR1 covers no AC (scaffold only).
