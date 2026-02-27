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

3. Wait for all builders to complete.

4. For each completed builder, spawn a reviewer agent on the resulting worktree branch:

```
Task(
  subagent_type: "component-reviewer",
  isolation: "worktree",
  mode: "bypassPermissions",
  prompt: "Review the PR created by the builder for issue #N. Follow .claude/agents/component-reviewer.md exactly."
)
```

5. Report results — which components passed review, which need fixes.

## Example usage

```
/factory #47 #48
/factory #47 #48 #49 #50
```
