---
name: next-feature
description: Starts the next PR from docs/features.md - picks it, branches, plans, then builds it test-first after approval.
disable-model-invocation: true
argument-hint: "[PRn]"
---

# Start the next feature PR

1. **Pick the PR.** If `$ARGUMENTS` names a PR (e.g. `PR3`), use it. Otherwise pick the first PR in
   `docs/features.md` with `Status: todo` whose `Depends on:` PRs all have `Status: done`.
   If none qualifies, say why and stop.
2. **Check git.** Must be on `main`, working tree clean (`git status --porcelain` empty), and up to date
   with origin (`git pull`). If any check fails, stop and tell me what is wrong. Do not fix it yourself.
3. **Branch.** `git switch -c <Branch from the PR section>`.
4. **Read.** That PR's section in `docs/features.md`, each of its ACs in `docs/spec.md`, and the parts of
   `docs/arch.md` it touches (modules, data model, testing approach). Follow `CLAUDE.md` code rules.
5. **Plan, then wait.** Show a short plan:
   - files to create/change
   - tests first, named by AC id (e.g. `AC4.3 cancel keeps todo`)
   - then the code
   - how I can verify by hand (from "Done when")

   Do NOT write any code or tests until I approve.
6. **Build (after approval).**
   - Write the tests, run `npm test`, and show that the new ones fail.
   - Implement until `npm test` passes fully.
   - Set that PR's `Status:` to `in review` in `docs/features.md`.
7. **Stop before committing.** Summarise the changed files and the ACs covered (each AC id → test name).
   Remind me of the manual check, if any. Do not commit, push or open a PR.
