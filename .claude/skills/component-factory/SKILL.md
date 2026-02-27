---
name: component-factory
description: "Agentic Component Factory — build multiple Kiso components in parallel using builder and reviewer agents in isolated worktrees. Usage: /factory #47 #48 or /factory #47 #48 #49 (pass issue numbers)"
---

# Agentic Component Factory

Build components in parallel using the builder and reviewer agents.

## Instructions

1. Parse the issue numbers from the user's input. They will be provided as `#N` arguments (e.g., `/factory #47 #48`).

2. For each issue number, spawn a builder agent in parallel:

```
Task(
  subagent_type: "component-builder",
  isolation: "worktree",
  mode: "bypassPermissions",
  prompt: "Build the component for issue #N. Read the issue for requirements. Follow .claude/agents/component-builder.md exactly."
)
```

3. As each builder completes, **handle its deliverables immediately** (don't wait for all builders):

   a. **Push and create the PR** from the worktree branch. The builder commits locally but may not be able to push. Run from the worktree directory:
   ```bash
   cd <worktree_path>
   git push -u origin <branch_name>
   gh pr create --title "..." --body "..."
   ```

   b. **Start Lookbook** in the worktree so the user can preview the component:
   ```bash
   cd <worktree_path>
   bin/worktree start
   ```
   This assigns a deterministic port via `bin/worktree port` and starts Lookbook + Tailwind. The port is printed to stdout.

   c. **Give the user the Lookbook URL** immediately:
   ```
   Breadcrumb Lookbook → http://localhost:<port>/lookbook/inspect/kiso/<name>/playground
   ```

   d. **Spawn the reviewer** on the worktree branch (in background).

4. For each completed builder, spawn a reviewer agent:

```
Task(
  subagent_type: "component-reviewer",
  isolation: "worktree",
  mode: "bypassPermissions",
  prompt: "Review the PR #N for the component. Follow .claude/agents/component-reviewer.md exactly."
)
```

5. Report results — which components passed review, which need fixes. Include Lookbook URLs for each component.

## Important: Lookbook stays running

The builder agents stop Lookbook before they return (step 11 in builder instructions). This is correct — they clean up after themselves. **The factory orchestrator is responsible for restarting Lookbook** in each worktree using `bin/worktree start` so the user can preview components without merging.

Each worktree gets a deterministic port (4101–4600) based on its directory name. No port conflicts. The user can open all components side-by-side.

## Example usage

```
/factory #47 #48
/factory #47 #48 #49 #50
```
