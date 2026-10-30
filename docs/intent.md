# Intent: Todo Web App (v1)

## Problem

I lose track of day-to-day tasks. I want one simple place to write tasks down and tick them off.

## Users

- **Only me.** One user, on my own desktop browser.
- No accounts, no login, no sharing.

## Outcome

A small web app that runs in the browser where I can:

- **Add** a todo
- **List** my todos
- **Edit** a todo
- **Delete** a todo
- **Mark** a todo complete, or back to incomplete
- **Filter** the list: All / Active / Completed
- **Clear completed**: remove all completed todos in one action

Todos are **saved in the browser** and are still there after a page reload.

## Constraints

- **No backend.** All data stays in the browser (e.g. `localStorage`).
- **No login.** Single user.
- **Platform:** desktop browsers only. Mobile layout is not required.
- **Tech stack:** a framework (e.g. React, Vue, Svelte) with a build step is acceptable.
- **Timeline:** v1 done within about one week.

## Out of scope (v1)

- Login, accounts, or any backend (from the original brief)
- Tags, priorities, categories, or multiple lists
- Sync across devices, export, or import
- Drag-and-drop or manual reordering
- Mobile-specific support

## Success measures

- **I use it daily** for my own tasks.

## Open questions

1. **Daily-use period:** for how long must I use it daily before v1 counts as a success (e.g. 1 week, 2 weeks)?
2. **Due dates and reminders:** not a must-have, but not ruled out either. Are they in v1, later, or never?
3. **Framework:** which one exactly? Any preference for language (JavaScript vs TypeScript)?
4. **Browsers:** which desktop browsers and versions must be supported?
5. **Hosting:** how will I open the app (local file, local dev server, static hosting such as GitHub Pages)?
6. **Todo fields:** is a todo just a text title, or does it carry more (e.g. created date, notes)?
7. **Behaviour details:**
   - Should deleting a todo (or clearing completed) ask for confirmation, or offer undo?
   - What happens to empty or whitespace-only input?
   - Should the chosen filter be remembered across reloads?
8. **Other success signals:** is anything beyond daily use needed, e.g. all must-haves working with no data loss across browser restarts?
