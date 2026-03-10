---
name: release
description: Guide through releasing a new version of kiso. Use when cutting a release, publishing a new version, or running bin/release.
---

# Release kiso

Read and follow `project/releasing.md` — it has the complete release
process. This skill just adds Claude-specific notes.

## Claude-specific notes

- Use `-y` flag on `bin/release` and `bin/deploy` — Claude Code cannot
  open a TTY for interactive confirmation.
- After `bin/release` completes, write release notes immediately using
  `gh release edit`. Do not leave the auto-generated diff link as the
  release notes.
- Run `npm run test:e2e` yourself before the dry run — `bin/release`
  only runs Ruby tests, not Playwright.
