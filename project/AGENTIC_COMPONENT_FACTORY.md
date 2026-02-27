# Agentic Component Factory

How we built a system where Claude Code autonomously builds UI components
in parallel — reading reference implementations, writing code, starting
dev servers, verifying output, and creating pull requests — while the
developer eats breakfast.

## The Problem

Kiso is a Rails UI component library inspired by shadcn/ui and Nuxt UI.
Building each component follows an identical pattern: read the shadcn
source for structure, read the Nuxt UI theme for styling, create a Ruby
theme module, create ERB partials, create Lookbook previews, create a docs
page, update the reference, lint, test, verify in the browser, create a PR.

This is 15 steps per component, highly formulaic, and we have dozens of
components to build. The pattern is the same every time — only the
component-specific details change.

## The Insight

If the pattern is codified well enough, an AI agent can follow it
autonomously. The key requirements:

1. **Reference sources must be available locally** — shadcn and Nuxt UI
   are git submodules the agent can read directly
2. **Conventions must be documented precisely** — not guidelines, but
   exact rules with copy-paste templates
3. **Verification must be automatable** — the agent needs to start a
   server and curl endpoints to confirm its work renders
4. **Multiple agents must not conflict** — each needs its own git branch,
   worktree, and dev server port

## What We Built

Five pieces of infrastructure, built in about 30 minutes:

### 1. Port-Configurable Dev Server

**File:** `Procfile.dev`

```
web: cd lookbook && bin/rails server -p ${LOOKBOOK_PORT:-4001}
css: cd lookbook && bin/rails tailwindcss:watch
docs: cd docs && bin/bridgetown start
```

One line change. The `LOOKBOOK_PORT` environment variable lets each
worktree run its own Lookbook instance without port conflicts. Defaults
to 4001 for the main worktree.

### 2. Deterministic Port Assignment

**File:** `bin/worktree`

A shell script that assigns a unique Lookbook port to each git worktree
using an MD5 hash of the worktree name:

```bash
bin/worktree port                  # → 4001 (main worktree)
bin/worktree port feat-input       # → 4173 (deterministic)
bin/worktree port feat-checkbox    # → 4132 (deterministic)
bin/worktree start                 # Start Lookbook on assigned port
```

Port formula: `4001 + (MD5(name) % 500) + 100` → range 4101–4600.
Same name always produces the same port. No coordination needed between
agents — they just hash their worktree name and get a guaranteed-unique
port.

### 3. Component Builder Agent

**File:** `.claude/agents/component-builder.md`

A custom Claude Code agent definition (~200 lines) that contains the
complete autonomous workflow:

1. Read the GitHub issue for requirements
2. Read the shadcn source at `vendor/shadcn-ui/.../ui/{name}.tsx` —
   copy div-for-div, class-for-class
3. Read the Nuxt UI theme at `vendor/nuxt-ui/src/theme/{name}.ts` —
   copy variant formulas
4. Read the design system doc for compound variant rules
5. Create the Ruby theme module with ClassVariants
6. Add the require to `lib/kiso.rb`
7. Create ERB partials (main + sub-parts)
8. Create Lookbook preview class + templates (matching shadcn demo count)
9. Create docs page + add to navigation
10. Create component reference file
11. Start Lookbook on the assigned port
12. Verify every preview returns HTTP 200
13. Run standardrb (linter) and rake test
14. Create a git branch, commit, push, and open a PR with `Closes #N`
15. Open the Lookbook preview URL in the user's browser

The agent has `permissionMode: bypassPermissions` in its frontmatter,
so it can commit, push, and create PRs without prompting.

### 4. Component Reviewer Agent

**File:** `.claude/agents/component-reviewer.md`

A quality gate agent (~150 lines) with a 10-point checklist:

| # | Check |
|---|-------|
| 1 | Component and sub-part names match shadcn exports exactly |
| 2 | HTML elements match shadcn (div, label, fieldset, etc.) |
| 3 | Tailwind classes match shadcn for layout/spacing/typography |
| 4 | Compound variant formulas match the design system (if colored) |
| 5 | `text-foreground` set on container roots (dark mode) |
| 6 | Data attributes use `kiso_prepare_options` helper |
| 7 | All deliverables present (theme, partials, previews, docs, nav, ref) |
| 8 | PR body contains `Closes #N` |
| 9 | No arbitrary Tailwind values |
| 10 | Lint and tests pass |

Reports a structured pass/fail table. Can optionally fix issues itself
if running in the same worktree.

### 5. Per-Component Reference Files

**Directory:** `skills/kiso/references/components/`

Instead of one monolithic `components.md` that every agent edits (causing
merge conflicts), each component has its own reference file:

```
components/
├── alert.md
├── badge.md
├── button.md
├── card.md
├── checkbox.md
├── ...
└── textarea.md
```

Agents create a new file instead of editing a shared one. No merge
conflicts when building components in parallel.

## How It Works End-to-End

### The Orchestration

The developer says:

> "Build RadioGroup (#38) and Switch (#39) in parallel."

The orchestrator (main Claude Code session) spawns two builder agents
using the Task tool:

```
Task(
  subagent_type: "component-builder",
  isolation: "worktree",
  mode: "bypassPermissions",
  prompt: "Build the Switch component. Issue #39. Port 4103."
)
```

Each agent gets:
- Its own git worktree (isolated copy of the repo)
- A unique Lookbook port (no conflicts)
- Full permissions to commit and push
- The complete contributing workflow in its context

### What Each Agent Does (Autonomously)

1. **Reads the issue** — understands what to build
2. **Reads shadcn source** — e.g. `vendor/shadcn-ui/.../ui/switch.tsx`
3. **Reads Nuxt UI theme** — e.g. `vendor/nuxt-ui/src/theme/switch.ts`
4. **Creates the theme module** — Ruby ClassVariants definition matching
   shadcn's Tailwind classes with Kiso's semantic tokens
5. **Creates ERB partials** — `<label>` wrapping a hidden checkbox +
   styled track/thumb, matching shadcn's DOM structure
6. **Creates Lookbook previews** — matching the demo count from shadcn's
   docs page
7. **Creates the docs page** — markdown with Quick Start, Locals table,
   Usage examples
8. **Starts Lookbook** — `LOOKBOOK_PORT=4103 bin/dev -- -l web,css`
9. **Verifies** — curls every preview URL, confirms HTTP 200
10. **Lints and tests** — `bundle exec standardrb --fix && rake test`
11. **Creates the PR** — branch, commit, push, `gh pr create` with
    `Closes #39` in the body
12. **Opens Lookbook** in the developer's browser for visual review

### What the Developer Does

Reviews the PRs. Squash merges the clean ones. Points out anything the
reviewer missed (which gets added to the reviewer's checklist for next
time).

## Why It Works

### 1. The Pattern is Fully Documented

The contributing skill (`.claude/skills/contributing/SKILL.md`) is ~400
lines of precise instructions: philosophy, mandatory reading list, 15-step
checklist, code templates, 24 convention rules. Not guidelines — rules.

The design system doc (`project/DESIGN_SYSTEM.md`) defines exact compound
variant formulas that are identical across all colored components. Agents
copy from Badge, never invent.

### 2. Reference Sources Are Local

shadcn/ui and Nuxt UI are git submodules. The agent reads the actual
TypeScript/TSX source files — not documentation, not a summary, the real
implementation. This is what makes div-for-div accuracy possible.

### 3. Verification Is Built In

The agent doesn't just write code and hope — it starts a real dev server,
curls every preview endpoint, and confirms HTTP 200 before creating the PR.
If something returns 500, it reads the error and fixes it.

### 4. Quality Gate Catches Drift

The reviewer agent runs the same checks a human would: are the names right?
Are the classes right? Are all the files present? Did you remember
`Closes #N`? This catches the most common issues before the human even
looks.

### 5. No Coordination Needed

Each agent works in an isolated worktree with a deterministic port. They
don't need to talk to each other. They don't share state. They just
create PRs against master.

## Results

First test run: two components (RadioGroup + Switch), two PRs, both
passing review, built while the developer was eating breakfast.

The system scales to as many parallel agents as you want. The only
remaining shared-file conflict point is `lib/kiso.rb` (one require line
per component), which git auto-merges cleanly.

## File Inventory

| File | Purpose | Size |
|------|---------|------|
| `Procfile.dev` | Port-configurable dev server | 3 lines |
| `bin/worktree` | Deterministic port assignment | ~80 lines bash |
| `.claude/agents/component-builder.md` | Autonomous builder instructions | ~200 lines |
| `.claude/agents/component-reviewer.md` | Quality gate checklist | ~150 lines |
| `skills/kiso/references/components/` | Per-component reference files | 1 file each |
| `.claude/skills/contributing/SKILL.md` | Contributing workflow + conventions | ~400 lines |
| `project/DESIGN_SYSTEM.md` | Compound variant formulas + spatial system | ~300 lines |

## What Made This Possible

1. **Claude Code's Task tool with `isolation: "worktree"`** — spawns
   agents in isolated git worktrees
2. **Custom agent definitions** (`.claude/agents/*.md`) — persistent
   instructions with `permissionMode: bypassPermissions`
3. **Skills** (`.claude/skills/`) — reusable knowledge that agents can
   reference
4. **Local reference repos** — git submodules of shadcn-ui and Nuxt UI
   that agents read directly
5. **Overmind** — process manager that agents can start/stop/restart
   for dev server management
6. **`gh` CLI** — agents create PRs programmatically with proper issue
   linking
