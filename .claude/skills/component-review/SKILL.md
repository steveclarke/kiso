---
name: component-review
description: Review a Kiso component for quality and consistency. Runs the 12-point checklist against shadcn source, design system rules, and deliverables. Use on a PR, branch, or working directory.
---

# Component Review

Review a Kiso component against the established quality standards.

## Instructions

1. Read `project/component-review.md` — this is the authoritative checklist.
   It contains the 12-point review, common mistakes, and report format.

2. Identify the component to review:
   - If given a PR number: `gh pr diff {N}` to read the changes
   - If on a branch: review the files directly
   - If given a component name: find its files in the codebase

3. Read the shadcn source for comparison:
   `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/{name}.tsx`

4. Run every check in the checklist. Report PASS or FAIL with specific details.

5. Run lint and tests:
   ```bash
   bundle exec standardrb --check lib/kiso/themes/{name}.rb
   bundle exec rake test
   npm run lint && npm run fmt:check
   npm run test:unit
   npm run test:e2e
   ```

6. Report findings using the table format from `project/component-review.md`.

7. If empowered to fix issues: make the changes, run lint/tests, and commit
   with `fix: address review feedback for {ComponentName}`.
