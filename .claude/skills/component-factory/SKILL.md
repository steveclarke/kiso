---
name: component-factory
description: "Agentic Component Factory — build multiple Kiso components in parallel using builder and reviewer agents in isolated worktrees. Usage: /factory #47 #48 or /factory #47 #48 #49 (pass issue numbers)"
---

# Agentic Component Factory

Build components in parallel using the builder and reviewer agents.

## Instructions

### 1. Parse issues

Parse the issue numbers from the user's input (e.g., `/factory #47 #48`).
For each issue, read it with `gh issue view N` to get the component name.

### 2. Spawn builders in parallel

For each issue, spawn a builder agent in a worktree:

```
Agent(
  subagent_type: "component-builder",
  isolation: "worktree",
  mode: "bypassPermissions",
  prompt: "Build the component for issue #N. Run `gh issue view N` for requirements."
)
```

Spawn all builders in parallel (one Agent call per issue, all in the same
message).

### 3. Handle each builder's result

When a builder completes, you receive:

- **`worktree_path`** and **`branch`** — returned automatically by the Agent
  tool's worktree isolation. These are in the structured tool result, not the
  text output.
- **Text output** — the builder's summary including component name, files
  created, PR title/body text, and pass/fail status for previews/lint/tests.

Derive the ports (the builder left servers running):

```bash
cd <worktree_path> && bin/worktree port lookbook
cd <worktree_path> && bin/worktree port docs
```

### 4. Push and create PR

From the worktree, push the branch and create the PR:

```bash
cd <worktree_path> && git push -u origin <branch>
```

Then create the PR using the title and body from the builder's output.
The body MUST include `Closes #N`:

```bash
cd <worktree_path> && gh pr create --title "<title>" --body "$(cat <<'EOF'
<body from builder output>
EOF
)"
```

### 5. Show preview URLs

Print the Lookbook and docs URLs clearly so the user can click to review each
component visually. Format:

```
Preview servers ready:
- ComponentA
  Lookbook → http://localhost:<lb_port_a>/lookbook/inspect/kiso/<name_a>/playground
  Docs     → http://localhost:<docs_port_a>/components/<name_a>
- ComponentB
  Lookbook → http://localhost:<lb_port_b>/lookbook/inspect/kiso/<name_b>/playground
  Docs     → http://localhost:<docs_port_b>/components/<name_b>
```

### 6. Spawn reviewers

For each PR created, spawn a reviewer agent. The reviewer does NOT need
worktree isolation — it reads the PR diff via `gh`:

```
Agent(
  subagent_type: "component-reviewer",
  mode: "bypassPermissions",
  prompt: "Review PR #<pr_number> for the <ComponentName> component. Use `gh pr diff <pr_number>` to read the changes."
)
```

Spawn reviewers in the background so the user can start reviewing in
Lookbook while reviews run.

### 7. Report results

Summarize for each component:
- PR link
- Lookbook URL
- Docs URL
- Reviewer verdict (pass/needs fixes)
- Any issues found

### 8. Cleanup

After the user is done reviewing and all PRs are merged or closed, stop
Lookbook in each worktree:

```bash
cd <worktree_path> && bin/worktree stop
```

## Server lifecycle

The **builder** starts Lookbook and docs in its worktree (`bin/worktree start`)
and **leaves them running**. The factory does NOT restart them. Instead:

1. Derive ports: `cd <worktree_path> && bin/worktree port lookbook` and `bin/worktree port docs`
2. Print both URLs for the user to review
3. Stop them during cleanup (step 8) when the user is done

Each worktree gets deterministic ports (Lookbook 4101-4600, docs 4601-5100)
based on its directory name. No port conflicts. The user can open all
components side-by-side.

## Example usage

```
/factory #47 #48
/factory #47 #48 #49 #50
```
