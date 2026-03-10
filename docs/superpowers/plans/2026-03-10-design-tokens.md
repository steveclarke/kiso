# Design Tokens (#188) Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add selective structural CSS variables, improve the design system document for agent and host-app consumption, and wire `/update-docs` into the maintenance workflow so the design system stays accurate.

**Architecture:** Two CSS variables (`--kiso-radius`, `--kiso-container`) added to the engine stylesheet following Nuxt UI's pattern. Documentation improvements to `project/design-system.md`. Workflow wiring in CLAUDE.md finalize checklist, release process, and the update-docs skill itself.

**Tech Stack:** CSS (Tailwind v4 `@theme`), Markdown documentation, GitHub CLI

---

## Chunk 1: Pre-implementation baseline

### Task 1: Run `/update-docs` to baseline documentation

Before changing anything, audit all docs for staleness against the current codebase.

**Files:**
- Audit: all files listed in `.claude/skills/update-docs/SKILL.md` Step 3

- [ ] **Step 1: Run the update-docs skill**

Invoke `/update-docs` and follow its full checklist. Fix every STALE or MISSING item it finds before proceeding to Task 2.

- [ ] **Step 2: Commit any fixes**

Stage only the files that were actually changed by the audit, then commit:

```bash
git add <changed-files>
git commit -m "docs: Baseline documentation audit before #188"
```

---

## Chunk 2: Structural CSS variables

### Task 2: Add `--kiso-radius` and `--kiso-container` to engine stylesheet

**Files:**
- Modify: `app/assets/tailwind/kiso/engine.css` (after the `@theme` block at line 47, before the semantic color tokens `@theme` block at line 71)

- [ ] **Step 1: Add a new `@theme` block for structural tokens**

Insert between the font `@theme inline` block (line 47-50) and the semantic color tokens `@theme` block (line 71). Add a comment section and the two variables:

```css
/* === Structural Tokens ===
   Framework-level layout values. Host apps override in their own @theme block:
     @theme { --kiso-radius: 0.5rem; --kiso-container: 64rem; } */

@theme {
  --kiso-radius: 0.375rem;
  --kiso-container: 80rem;
}
```

`0.375rem` (6px) matches Kiso's current default `rounded-md`. `80rem` (1280px) matches Nuxt UI's `--ui-container`.

- [ ] **Step 2: Verify Tailwind compiles without errors**

```bash
cd /Users/steve/src/kiso && bundle exec rake tailwindcss:build 2>&1 | tail -5
```

Expected: build succeeds, no errors.

- [ ] **Step 3: Commit**

```bash
git add app/assets/tailwind/kiso/engine.css
git commit -m "feat: Add --kiso-radius and --kiso-container structural tokens (#188)"
```

---

## Chunk 3: Design system document improvements

### Task 3: Add CSS variable reference section to design-system.md

**Files:**
- Modify: `project/design-system.md`

- [ ] **Step 1: Add structural tokens section after the "Semantic Color Tokens" section**

Insert after the color token tables (after line 110, before the `## Rules` section). This documents all CSS variables Kiso defines — structural and color — in one reference:

```markdown
---

## Structural Tokens (CSS Variables)

These CSS custom properties control framework-level layout values. Host apps
override them in their own `@theme` block — no need to touch component themes.

### Global

| Variable | Default | Purpose |
|----------|---------|---------|
| `--kiso-radius` | `0.375rem` | Base border radius |
| `--kiso-container` | `80rem` | Max content width |

### Dashboard

Defined in `app/assets/tailwind/kiso/dashboard.css`. Only present when the
dashboard layout components are used.

| Variable | Default | Purpose |
|----------|---------|---------|
| `--sidebar-width` | `16rem` | Sidebar panel width |
| `--topbar-height` | `3.5rem` | Top navigation bar height |
| `--sidebar-background` | white / zinc-950 | Sidebar surface color (light/dark) |
| `--sidebar-foreground` | zinc-900 / zinc-100 | Sidebar text color (light/dark) |
| `--sidebar-border` | zinc-200 / zinc-800 | Sidebar divider color (light/dark) |
| `--sidebar-accent` | zinc-100 / zinc-800 | Sidebar hover/active surface (light/dark) |
| `--sidebar-accent-foreground` | zinc-700 / zinc-300 | Sidebar hover/active text (light/dark) |
| `--sidebar-duration` | `220ms` | Sidebar open/close animation duration |

### Overriding tokens

```css
/* In your app's Tailwind CSS file */
@theme {
  --kiso-radius: 0.5rem;    /* rounder corners */
  --kiso-container: 64rem;  /* narrower content */
  --sidebar-width: 18rem;   /* wider sidebar */
}
```

Color tokens (`--color-primary`, `--color-background`, etc.) are documented
in the Semantic Color Tokens section above.
```

- [ ] **Step 2: Commit**

```bash
git add project/design-system.md
git commit -m "docs: Add structural tokens reference to design system (#188)"
```

### Task 4: Add host-app framing section to design-system.md

**Files:**
- Modify: `project/design-system.md`

- [ ] **Step 1: Add a "For Host Apps" section at the end of the document**

Append after the existing "Kiso size variants" section (end of file):

```markdown
---

## For Host Apps

This section is for developers building applications with Kiso — not for
contributing to Kiso itself. These are the values and patterns your components
should follow for visual consistency with Kiso's built-in components.

### Use the spatial scales above

When building custom components (via `appui()` or plain ERB), draw from the
same scales Kiso uses. The tables above are your reference:

- **Heights** — `h-7` through `h-11` for interactive elements
- **Padding** — `px-2`/`py-1` (compact) through `px-4`/`py-2` (large)
- **Gaps** — `gap-1` (tight) through `gap-6` (major sections)
- **Font sizes** — `text-xs` (labels) through `text-lg` (modal titles)
- **Border radius** — `rounded-md` (interactive), `rounded-lg` (containers), `rounded-xl` (cards)
- **Icon sizes** — `size-3` (compact) through `size-5` (large)

### Use semantic color tokens

Never use raw Tailwind palette shades (`text-zinc-500`, `bg-blue-600`).
Use Kiso's semantic tokens: `text-foreground`, `bg-primary`,
`text-muted-foreground`, `bg-elevated`, etc. These automatically adapt
to dark mode and theme presets.

### Follow the typography hierarchy

| Context | Title | Description |
|---------|-------|-------------|
| Page header | `text-lg font-semibold` | `text-sm text-muted-foreground` |
| Card | `font-semibold leading-none` | `text-sm text-muted-foreground` |
| Form field | `text-sm font-medium` (label) | `text-sm text-muted-foreground` |

### Override structural tokens

Customize Kiso's structural CSS variables in your Tailwind CSS:

```css
@theme {
  --kiso-radius: 0.5rem;
  --kiso-container: 64rem;
}
```

### Generate a design system

Run `rails generate kiso:design_system` to scaffold a complete design
system document for your app, pre-populated with Kiso's defaults. See #191.
```

- [ ] **Step 2: Commit**

```bash
git add project/design-system.md
git commit -m "docs: Add host-app framing section to design system (#188)"
```

### Task 5: Add spatial philosophy intro

**Files:**
- Modify: `project/design-system.md`

- [ ] **Step 1: Add introductory paragraph to the Spatial System section**

Find the `## Spatial System` heading (line 157) and update the paragraph below it:

Replace:
```
Extracted from shadcn/ui v4 source code. These values are the spatial
foundation — every component must draw from these scales. No arbitrary values
(`text-[8px]`, `h-[1.15rem]`). If Tailwind doesn't have a class for it, don't
use it.
```

With:
```
Extracted from shadcn/ui v4 source code. These values are the spatial
foundation — every Kiso component and every host-app component built with
Kiso must draw from these scales. No arbitrary values (`text-[8px]`,
`h-[1.15rem]`). If Tailwind doesn't have a class for it, don't use it.

These are not CSS variables — they're documented scales that agents and
developers reference when choosing Tailwind utilities. The consistency
comes from using these tables as a lookup, not from runtime token resolution.
Spacing and typography do not need CSS variables because they're applied via
Tailwind utility classes in component themes, which is the same approach
shadcn/ui and Nuxt UI use.
```

- [ ] **Step 2: Commit**

```bash
git add project/design-system.md
git commit -m "docs: Clarify spatial system philosophy in design system (#188)"
```

---

## Chunk 4: Workflow wiring

### Task 6: Add `/update-docs` to CLAUDE.md finalize checklist

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add update-docs item to the per-PR checklist**

Find the `**Per PR:**` section (line 392). Add this item after the `MEMORY.md` line (line 403):

```markdown
- [ ] `/update-docs` audit — design system, skills, and docs site reflect current state
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: Add /update-docs to finalize checklist (#188)"
```

### Task 7: Add doc audit step to release process

**Files:**
- Modify: `project/releasing.md`

- [ ] **Step 1: Add documentation audit step**

Find step 3 ("Run the full test suite", line 45). Insert a new step after it, before the dry run. This means renumbering existing steps 4-6 to 5-7:

Insert after the test suite step:

```markdown
### 4. Audit documentation

Run `/update-docs` to verify all documentation reflects the current state —
design system, component docs, skills references, and CLAUDE.md. Fix anything
stale before releasing. A release with outdated docs misleads users.
```

Then renumber:
- Old "4. Dry run" → "5. Dry run"
- Old "5. Execute release" → "6. Execute release"
- Old "6. Write release notes" → "7. Write release notes"

- [ ] **Step 2: Commit**

```bash
git add project/releasing.md
git commit -m "docs: Add documentation audit step to release process (#188)"
```

### Task 8: Add design system drift detection to update-docs skill

**Files:**
- Modify: `.claude/skills/update-docs/SKILL.md`

- [ ] **Step 1: Add design system drift check to the contributor checks**

Find the contributor checks table (starts at line 73). Add a new row after the "Design system rules current" row (line 75):

```markdown
| Spatial/typography scales match components | `project/design-system.md` |
```

- [ ] **Step 2: Add guidance note after the contributor checks table**

Insert after the last row of the contributor checks table (after line 80, before the `### AI agents` heading):

```markdown
**Design system drift detection:** When checking `project/design-system.md`,
verify that components don't use spacing, typography, or radius values outside
the documented scales. If a component introduces a new value, either change
the component to use an existing scale value or update the scale tables to
include the new value with justification.
```

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/update-docs/SKILL.md
git commit -m "docs: Add design system drift detection to update-docs skill (#188)"
```

---

## Chunk 5: Follow-up issue and cleanup

### Task 9: Create radius scale computation follow-up issue

- [ ] **Step 1: Create the GitHub issue**

```bash
gh issue create \
  --title "Compute radius scale from --kiso-radius base variable" \
  --label "enhancement" \
  --body "$(cat <<'EOF'
## Summary

Compute a full border radius scale from the single `--kiso-radius` CSS
variable, following shadcn's pattern:

```css
@theme {
  --kiso-radius: 0.375rem;
  --radius-sm: calc(var(--kiso-radius) - 4px);
  --radius-md: calc(var(--kiso-radius) - 2px);
  --radius-lg: var(--kiso-radius);
  --radius-xl: calc(var(--kiso-radius) + 4px);
  --radius-2xl: calc(var(--kiso-radius) + 8px);
}
```

This would let theme presets (rounded, sharp) override one variable instead
of per-component radius classes. Currently presets override radius at the
Ruby theme module level.

## Context

- `--kiso-radius` was added in #188
- shadcn source: `vendor/shadcn-ui/apps/v4/styles/globals.css` lines 26-32
- Current presets: `lib/kiso/presets/rounded.rb`, `lib/kiso/presets/sharp.rb`

## Considerations

- Would existing components need to reference the computed scale variables
  instead of hardcoded `rounded-md`, `rounded-lg`, etc.?
- How does this interact with presets that currently override at the Ruby level?
- Tailwind v4 `@theme` supports `calc()` — verify this works with the build
EOF
)"
```

- [ ] **Step 2: Add the issue to the project board (Backlog)**

```bash
gh project item-add 7 --owner steveclarke --url <issue-url>
```

Then set status to Backlog using the item ID from item-list.

- [ ] **Step 3: Commit nothing** — this task creates no code changes.

### Task 10: Update issue #188 description with final scope

- [ ] **Step 1: Add a comment to #188 summarizing what was delivered**

```bash
gh issue comment 188 --body "$(cat <<'EOF'
## Delivered

1. Structural CSS variables: `--kiso-radius` (0.375rem) and `--kiso-container` (80rem) in engine.css
2. Design system doc improvements: structural tokens reference, host-app framing section, spatial philosophy clarification
3. Workflow wiring: `/update-docs` added to finalize checklist and release process
4. Design system drift detection added to update-docs skill
5. Follow-up issue created for radius scale computation from base variable

## Design spec

See `docs/superpowers/specs/2026-03-10-design-tokens-design.md`
EOF
)"
```

- [ ] **Step 2: Close the issue**

```bash
gh issue close 188
```
