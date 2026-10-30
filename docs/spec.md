# Spec: Todo Web App (v1)

## 1. Summary

A single-user, browser-only todo list for my own desktop. I can add, list, edit, delete and complete todos, filter them, and clear completed ones. Everything is saved in the browser and survives a reload.
Based on the approved intent: [intent.md](intent.md).

## 2. Data

One todo contains:

- **Text**: what the task is. Any length; cannot be empty or only spaces. Spaces at the start and end are trimmed.
- **Done**: whether it is completed or still active.

Nothing else (no dates, notes, tags or priorities).

The app also remembers one setting: **the chosen filter** (All / Active / Completed).

## 3. Features

### F1 Add a todo

As the user, I want to type a task and add it, so that it is on my list.

- **AC1.1** Given the input is filled with "Buy milk", When I submit it, Then a new active todo "Buy milk" appears at the bottom of the list and the input is cleared.
- **AC1.2** Given the input is empty, When I submit it, Then no todo is added.
- **AC1.3** Given the input contains only spaces, When I submit it, Then no todo is added.
- **AC1.4** Given the input contains very long text (e.g. 2,000 characters), When I submit it, Then the todo is added with the full text, and the text wraps in the list without breaking the layout.
- **AC1.5** Given I just added a todo, When I reload the page, Then the todo is still there.
- **AC1.6** Given the input is "  Buy milk  ", When I submit it, Then the todo's text is "Buy milk" (start and end spaces trimmed; spaces inside are kept).

### F2 List my todos

As the user, I want to see all my todos, so that I know what is left to do.

- **AC2.1** Given I have todos, When I open the app, Then I see each todo's text and whether it is done.
- **AC2.2** Given I have no todos, When I open the app, Then the list is empty and I can still add a todo.
- **AC2.3** Given I have todos, When I reload the page, Then the same todos are shown with the same text and done state.

### F3 Edit a todo

As the user, I want to change a todo's text, so that I can fix or update it.

- **AC3.1** Given a todo "Buy milk", When I choose its Edit button, change the text to "Buy oat milk" and press Enter (or Save), Then the todo shows "Buy oat milk".
- **AC3.2** Given I am editing a todo, When I clear the text (or leave only spaces) and save, Then the change is rejected and the old text stays.
- **AC3.3** Given I am editing a todo, When I press Esc (or Cancel), Then editing ends and the old text stays.
- **AC3.4** Given I am editing a todo, When I enter very long text and save, Then the full text is kept and wraps in the list.
- **AC3.5** Given I edited a todo, When I reload the page, Then the new text is shown.
- **AC3.6** Given a completed todo, When I edit its text, Then it stays completed.
- **AC3.7** Given I am editing a todo, When I save "  Buy oat milk  ", Then the todo's text is "Buy oat milk".

### F4 Delete a todo

As the user, I want to remove a todo, so that my list only holds what matters.

- **AC4.1** Given a todo, When I choose to delete it, Then an in-page dialog asks me to confirm, showing the todo's text.
- **AC4.2** Given the confirmation is shown, When I confirm, Then the todo is removed from the list.
- **AC4.3** Given the confirmation is shown, When I cancel, Then the todo stays unchanged.
- **AC4.4** Given I deleted a todo, When I reload the page, Then it does not come back.

### F5 Mark complete / incomplete

As the user, I want to tick a todo off (or un-tick it), so that I can see what is done.

- **AC5.1** Given an active todo, When I mark it complete, Then it is shown as completed.
- **AC5.2** Given a completed todo, When I mark it incomplete, Then it is shown as active again.
- **AC5.3** Given I changed a todo's done state, When I reload the page, Then the new state is shown.

### F6 Filter the list

As the user, I want to show All, Active or Completed todos, so that I can focus.

- **AC6.1** Given todos in both states, When I choose "All", Then every todo is shown.
- **AC6.2** Given todos in both states, When I choose "Active", Then only not-done todos are shown.
- **AC6.3** Given todos in both states, When I choose "Completed", Then only done todos are shown.
- **AC6.4** Given the "Active" filter is on, When I mark a todo complete, Then it disappears from the visible list (it is not deleted).
- **AC6.5** Given a filter matches no todos, When I choose it, Then the list is empty.
- **AC6.6** Given I chose a filter, When I reload the page, Then the same filter is still selected.
- **AC6.7** Given no filter was ever chosen, When I open the app, Then "All" is selected.

### F7 Clear completed

As the user, I want to remove all completed todos in one action, so that my list stays tidy.

- **AC7.1** Given some completed todos, When I choose "Clear completed", Then an in-page dialog asks me to confirm.
- **AC7.2** Given the confirmation is shown, When I confirm, Then all completed todos are removed and all active todos stay.
- **AC7.3** Given the confirmation is shown, When I cancel, Then no todo is removed.
- **AC7.4** Given no completed todos, When I look at the list, Then "Clear completed" is not shown. Given at least one completed todo (under any filter), Then it is shown.
- **AC7.5** Given I cleared completed todos, When I reload the page, Then they do not come back.

## 4. Persistence

- **What is saved:** all todos (text and done state) and the chosen filter.
- **Where:** in the browser only. No server.
- **When:** right after every change: add, edit, delete, mark complete/incomplete, clear completed, change filter.
- **What survives a reload:** all todos with their text and done state, and the selected filter.
- **Not shared:** a different browser or computer starts with an empty list.

## 5. Out of scope (v1)

From [intent.md](intent.md):

- Login, accounts, or any backend
- Tags, priorities, categories, or multiple lists
- Sync across devices, export, or import
- Drag-and-drop or manual reordering
- Mobile-specific support
- Due dates and reminders (decided: later, not v1)

## 6. Decisions

| # | Open question | Decision |
|---|---|---|
| 1 | Daily-use period | Use it daily for **1 week**. |
| 2 | Due dates and reminders | **Later**, not in v1. |
| 3 | Framework / language | -> arch.md |
| 4 | Browsers | -> arch.md |
| 5 | Hosting | -> arch.md |
| 6 | Todo fields | **Text only** (plus done state). |
| 7a | Confirm or undo on delete / clear completed | **Confirm first**, for both. No undo. |
| 7b | Empty or whitespace-only input | **Ignored**: no todo on add; edit is rejected and the old text stays. |
| 7c | Remember filter across reloads | **Yes**, remembered. |
| 7d | Very long text | **No limit**; text wraps. |
| 8 | Other success signals | **All 7 features (F1-F7) work** as specified. |
| S1 | (spec OQ1) List order | New todos go at the **bottom** (oldest first). |
| S2 | (spec OQ2) Spaces around text | **Trimmed** on add and edit; spaces inside are kept. |
| S3 | (spec OQ3) "Clear completed" with nothing completed | **Hidden** until at least one todo is completed. |
| S4 | (spec OQ4) Survive browser restart? | **Reload only.** Restart survival is best-effort, not required. |
| U1 | How editing works | **Edit button** starts editing; **Enter** or Save saves; **Esc** or Cancel cancels. |
| U2 | How confirmation looks | **In-page dialog** (Cancel / Delete), not the browser's confirm box. |
| U3 | Look | **Dark theme only**, blue accent. See [mockup.html](mockup.html). |

v1 counts as a success when F1-F7 meet their acceptance criteria and I have used the app daily for 1 week.

## 7. Open questions

None.
