---
name: component-create
description: Build a Kiso component from scratch. Reads shadcn/Nuxt UI sources, creates theme module, ERB partials, Lookbook previews, docs, E2E tests. Use when building a new component or picking up where a previous attempt left off.
---

# Component Create

Build a Kiso component following the established workflow and quality standards.

## Instructions

1. Read `project/component-creation.md` — this is the authoritative guide.
   Follow every step: mandatory reading, naming rules, implementation steps,
   Lookbook preview rules, and the quality checklist.

2. If given an issue number, read the issue with `gh issue view N` to get
   the component name and any specific requirements.

3. Work through the implementation steps in order. The guide contains code
   templates for theme modules, ERB partials, Lookbook previews, and E2E tests.

4. Before finishing, run through the quality checklist at the bottom of
   `project/component-creation.md`. Every item must pass.

5. Run lint and tests:
   ```bash
   bundle exec standardrb --fix
   npm run lint && npm run fmt
   bundle exec rake test
   npm run test:unit
   npm run test:e2e
   ```
