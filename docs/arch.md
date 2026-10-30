# Architecture: Todo Web App (v1)

How the app in [spec.md](spec.md) is built. Based on [intent.md](intent.md).

## 1. Stack

| Choice | Why | Rejected alternative |
|---|---|---|
| **React 19 + TypeScript** | Most docs and examples; types catch todo-shape bugs early | Svelte: less boilerplate, but fewer beginner answers online |
| **Vite 8** (`react-ts` template) | Official fast scaffold, dev server and build in one tool | Next.js: server features we don't need (no backend) |
| **Vitest 5 + jsdom** | Reuses the Vite config; Jest-like API | Jest: needs separate TS/ESM transform setup |
| **React Testing Library + user-event + jest-dom** | Tests what the user sees and does, not internals | Vitest Browser Mode: real browser, but heavier setup for a 1-week app |
| **localStorage** | Synchronous and simple; enough for one small list | IndexedDB: async and more complex, no benefit here |
| **Plain CSS** (one file, dark theme, blue accent; see [mockup.html](mockup.html)) | Nothing to learn; the UI is tiny | Tailwind: adds build config and new syntax |

Requires Node.js **22.12+** (needed by Vitest 5).

## 2. Folder structure

```
SprintPlan/
├── docs/                 intent.md, spec.md, arch.md
├── index.html
├── package.json
├── vite.config.ts        Vite + Vitest config
├── tsconfig*.json        from template
└── src/
    ├── main.tsx          mounts <App/>
    ├── App.tsx           page layout, wires hook to components
    ├── App.css
    ├── App.test.tsx      component tests (F1-F7 acceptance criteria)
    ├── todos.ts          pure todo logic
    ├── todos.test.ts
    ├── storage.ts        load/save to localStorage
    ├── storage.test.ts
    ├── useTodos.ts       React hook: state + save
    ├── components/
    │   ├── TodoInput.tsx
    │   ├── TodoItem.tsx  view + edit mode for one todo
    │   ├── FilterBar.tsx filter buttons + "Clear completed"
    │   └── ConfirmDialog.tsx  in-page Cancel / confirm dialog
    └── test/setup.ts     import '@testing-library/jest-dom/vitest'
```

## 3. Data model

**Todo** (stored):

| Field | Type | Notes |
|---|---|---|
| `id` | string | Internal only, from `crypto.randomUUID()`. Used as the React key and to find a todo. |
| `text` | string | Stored trimmed (start and end spaces removed). Never blank. No length limit. |
| `done` | boolean | `false` when created. |

**Filter:** `"all" | "active" | "completed"`, default `"all"`.

**Storage:** one localStorage key, **`todoApp.v1`**. A single key means everything is saved in one write.

```json
{
  "version": 1,
  "filter": "all",
  "todos": [
    { "id": "3f2c…", "text": "Buy milk", "done": false }
  ]
}
```

Todos are kept and shown in creation order, so new todos appear at the bottom (spec S1).

**Missing or corrupt data** (handled in `loadState`):

- **Key missing:** start with `{ todos: [], filter: "all" }`.
- **Invalid JSON, or the wrong shape/version:** start empty. Copy the raw value to `todoApp.v1.corrupt` so nothing is lost silently, and `console.warn`.
- **A single todo with bad fields:** drop that todo and keep the rest.
- **Unknown filter value:** use `"all"`.
- **localStorage throws** (blocked or quota): the app keeps working in memory and shows a small "Not saved" notice.

## 4. Modules

| Module | Does | Uses React? |
|---|---|---|
| `todos.ts` | Pure functions: `addTodo`, `editTodo`, `deleteTodo`, `toggleTodo`, `clearCompleted`, `visibleTodos(todos, filter)`, `hasCompleted`, `isBlank`. Each returns a new array and never mutates. `addTodo` and `editTodo` trim the text; blank text means no change. `addTodo` appends to the end. | No |
| `storage.ts` | `loadState(storage)` and `saveState(storage, state)`. They take a `Storage` argument, so tests can pass a fake. | No |
| `useTodos.ts` | Holds `{ todos, filter }` in state, starting from `loadState`. Exposes actions that call `todos.ts`, and saves through `saveState` whenever state changes. | Yes |
| `App.tsx` + `components/` | Display only; they call hook actions. `TodoItem` handles edit mode: the Edit button opens an input, Enter or Save saves, Esc or Cancel cancels. `FilterBar` shows "Clear completed" only when `hasCompleted`. | Yes |
| `ConfirmDialog.tsx` | In-page dialog (title, message, Cancel / confirm button). `App` holds a `pending` action, which is either "delete id" or "clear completed". Confirm runs the action; Cancel or Esc drops it. | Yes |

`todos.ts` and `storage.ts` never touch the DOM or React, so they are unit-tested directly.

## 5. Data flow

```
user action (click / Enter)
   │  e.g. "Delete"  → App sets pending → <ConfirmDialog> shown
   │                   Cancel / Esc? clear pending, stop
   ▼
component calls hook action        deleteTodo(id)
   ▼
useTodos: setState(todos.ts fn)    new { todos, filter }
   ▼
useEffect on state change          saveState(localStorage, state)
   ▼
React re-renders                   visibleTodos(todos, filter) → list

page load:  loadState(localStorage) → initial state → first render
```

## 6. Testing approach

- **Unit tests** (`todos.test.ts`, `storage.test.ts`): every logic rule and edge case. Covers blank or whitespace text, trimming on add and edit, append order, 2,000-character text, editing a completed todo, and `hasCompleted`. Storage tests cover a missing key, invalid JSON, a wrong shape, a bad item, an unknown filter, and a round-trip save then load.
- **Component tests** (`App.test.tsx`, jsdom + React Testing Library + user-event): one `describe` per feature, with test names that start with the AC id (e.g. `AC4.3 cancel keeps todo`).
  - A reload is simulated by unmounting and rendering `<App/>` again with the same localStorage.
  - Confirmation is tested through the real in-page dialog: find it by role `dialog`, then click Cancel or Delete.
  - Editing is tested with the keyboard: `{Enter}` saves and `{Escape}` cancels.
  - localStorage is cleared before each test.
- **Manual check in Chrome:** jsdom has no layout, so long-text wrapping (AC1.4, AC3.4) is checked by eye. A real reload is checked once too.
- **Test command:** `npm test`, which runs `vitest run` once. `npm run test:watch` runs `vitest` in watch mode.

Config example (in `vite.config.ts`, `defineConfig` imported from `vitest/config`):

```ts
test: { environment: "jsdom", globals: true, setupFiles: ["./src/test/setup.ts"] }
```

## 7. Commands

| Task | Command |
|---|---|
| Create the project (once) | `npm create vite@latest . -- --template react-ts`, then `npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom` |
| Install | `npm install` |
| Dev (hot reload) | `npm run dev` → http://localhost:5173 |
| Test | `npm test` |
| Build | `npm run build` → `dist/` |
| Daily use | `npm run build && npm run preview` → **http://localhost:4173** |

## 8. Browsers and hosting

- **Browser:** latest desktop Chrome only. Other browsers probably work but are not tested or promised. No mobile layout.
- **Hosting:** a local preview server (`vite preview`) serving the built `dist/`. There is no deploy.
- **The URL must stay the same.** localStorage belongs to one origin (scheme + host + port), so set `preview: { port: 4173, strictPort: true }`. Vite then fails instead of quietly moving to another port. Always open `http://localhost:4173`; `127.0.0.1` counts as a different origin.
- The dev server (5173) is a different origin, so it has its own separate test data and development never touches the real list.

## 9. Decisions

| # | Question | Decision |
|---|---|---|
| Intent 3 | Framework + language | React + TypeScript, built with Vite |
| Intent 4 | Browsers | Latest desktop Chrome only |
| Intent 5 | Hosting | Local `vite preview` on fixed port 4173 (`strictPort`) |
| Spec OQ4 | Survive browser restart? | Reload only. localStorage normally survives restarts too, but this isn't promised (e.g. site data cleared, incognito). |

## 10. Risks

1. **Data "disappears" because the origin changed** (another port, or `127.0.0.1` instead of `localhost`). Mitigation: `strictPort`, plus a bookmark of the exact URL.
2. **Two open tabs overwrite each other**, because the last save wins. Mitigation: use one tab; listening for the `storage` event can come later if needed.
3. **jsdom differs from Chrome** (no layout, no real focus or visuals). Mitigation: a short manual Chrome check against [mockup.html](mockup.html) before calling v1 done: wrapping, how the dialog looks, focus while editing, and a reload.
