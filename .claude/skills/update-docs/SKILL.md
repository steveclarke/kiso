---
name: update-docs
description: Audit and update documentation after making changes. Use at the end of a session, after merging a PR, or when the user asks "is there anything we need to document?" Checks all documentation locations for each audience and reports what's stale.
---

# Update Docs

Run this after any meaningful change to the codebase. It checks every
documentation location, determines who needs to know about the change, and
helps you update what's stale.

## Step 1 — Understand what changed

Figure out the scope of recent changes. Use whichever applies:

```bash
# Changes on the current branch vs master
git log --oneline master..HEAD
git diff --stat master..HEAD

# Or if working on master, recent commits
git log --oneline -10
```

Summarize the changes in one sentence. Classify the change type:

| Type | Example |
|------|---------|
| **New component** | Added Breadcrumb component |
| **Component change** | Changed Button API, added size variant |
| **Infrastructure** | New test framework, build changes |
| **Convention change** | Updated naming rules, new pattern |
| **Bug fix** | Fixed dark mode on Card |
| **Dependency change** | Upgraded class_variants, added gem |

## Step 2 — Determine affected audiences

For each change, ask: **who needs to know?**

| Audience | They care about... |
|----------|--------------------|
| **End users** | API changes, new components, new features, breaking changes |
| **Contributors** | Convention changes, architecture decisions, new patterns, setup changes |
| **AI agents** | Convention changes, new patterns, workflow changes, new shared utils |
| **External AI** | New components, API changes, removed components |

A new component affects all four. A convention change affects contributors
and agents. A bug fix might only affect the changelog.

## Step 3 — Check each documentation location

Go through every location below. For each one, check whether it's current
given the changes. Report a checklist of what needs updating.

### End users — `docs/src/`

| Check | File(s) |
|-------|---------|
| Component docs page exists | `docs/src/components/{name}.md` |
| Component listed in index | `docs/src/components/index.md` |
| Component in sidebar nav | `docs/src/_data/navigation.yml` |
| Guide pages still accurate | `docs/src/guide/*.md` |
| Design system page current | `docs/src/design-system.md` |

### End users — root files

| Check | File(s) |
|-------|---------|
| README install/usage still accurate | `README.md` |
| CHANGELOG has entry | `CHANGELOG.md` |

### Contributors — `project/`

| Check | File(s) |
|-------|---------|
| Design system rules current | `project/design-system.md` |
| Component strategy current | `project/component-strategy.md` |
| Testing strategy current | `project/testing-strategy.md` |
| Component vision doc exists (if new) | `project/components/{name}.md` |
| Build plan updated (if batch work) | `project/plans/*.md` |
| PLAN.md status current | `PLAN.md` |
| CONTRIBUTING.md setup still works | `CONTRIBUTING.md` |

### AI agents — `.claude/`

| Check | File(s) |
|-------|---------|
| CLAUDE.md conventions current | `CLAUDE.md` |
| Contributing skill workflow current | `.claude/skills/contributing/SKILL.md` |
| Component structure reference current | `.claude/skills/contributing/references/component-structure.md` |
| Theme structure reference current | `.claude/skills/contributing/references/theme-structure.md` |
| Builder agent instructions current | `.claude/agents/component-builder.md` |
| Reviewer agent checklist current | `.claude/agents/component-reviewer.md` |

### External AI — `skills/kiso/`

| Check | File(s) |
|-------|---------|
| Component reference exists | `skills/kiso/references/components/{name}.md` |
| Component listed in index | `skills/kiso/references/components.md` |
| Theming reference current | `skills/kiso/references/theming.md` |
| Skill entry point current | `skills/kiso/SKILL.md` |

## Step 4 — Report findings

Present the checklist as a table:

```
| Status | File | What needs updating |
|--------|------|---------------------|
| OK     | docs/src/components/badge.md | — |
| STALE  | PLAN.md | Mark Breadcrumb as done |
| MISSING| skills/kiso/references/components/toast.md | New component needs reference |
```

Only show files that are STALE or MISSING — skip the OK ones unless the
user wants the full list.

## Step 5 — Make the updates

For each STALE or MISSING item, update the file. Follow these rules:

- **Don't duplicate content.** If the canonical source is `project/`, update
  there. Other locations should point to it, not copy from it.
- **Component docs** (`docs/src/components/`) follow the format in
  `docs/src/components/card.md`.
- **Component references** (`skills/kiso/references/components/`) follow the
  format of existing reference files — concise API summary, not full docs.
- **CHANGELOG** entries are user-facing prose, grouped under Added/Changed/
  Fixed/Removed.
- **PLAN.md** updates are status changes only (mark items done, update
  "What's Next").

## Quick reference — what to update per change type

| Change type | Always update | Usually update | Check if needed |
|-------------|--------------|----------------|-----------------|
| **New component** | docs page, nav, index, skills ref, skills index, PLAN.md | CHANGELOG | component-strategy, design-system |
| **Component API change** | docs page, skills ref | CHANGELOG | README (if usage example affected) |
| **New convention** | CLAUDE.md | project/ doc, contributing skill | builder/reviewer agents |
| **Infrastructure** | PLAN.md | CONTRIBUTING.md, CHANGELOG | CLAUDE.md (if new commands) |
| **Bug fix** | CHANGELOG | — | docs page (if workaround documented) |
| **Dependency change** | CHANGELOG | README, CONTRIBUTING.md | CLAUDE.md |
