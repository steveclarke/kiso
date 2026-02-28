---
name: worktree
description: Work in an isolated git worktree for issues, features, or refactors. Use when the user asks to spin up a worktree, work in isolation, create an isolated branch, or says "worktree" in the context of starting work on something.
---

# Worktree Workflow

Work on a task in an isolated git worktree with its own Lookbook instance.

## 1. Create the worktree

Use the `EnterWorktree` tool to create and switch into a worktree. Name it
after the task when possible:

```
EnterWorktree(name: "fix-button-hover")
```

This creates a worktree in `.claude/worktrees/`, creates a branch based on
HEAD, and switches your working directory into it.

## 2. Start Lookbook

Start Lookbook on the worktree's assigned port:

```bash
bin/worktree start
```

This daemonizes Lookbook + Tailwind and returns immediately. The port is
deterministic (based on worktree name, range 4101-4600) and printed to
stdout.

Print the URL for the user:

```
Lookbook → http://localhost:<port>/lookbook
```

Useful commands while working:

```bash
bin/worktree port       # Show the assigned port
bin/worktree status     # Check if services are running
bin/worktree stop       # Stop services (do this at the end)
```

## 3. Do the work

Work on the task. For component work, follow the contributing skill
(`.claude/skills/contributing/SKILL.md`) for conventions.

## 4. Commit

The worktree already has its own branch (created by `EnterWorktree`). Commit
to the current branch — do NOT create a new branch:

```bash
git add [specific files]
git commit -m "feat: description (#N)"
```

Run lint and tests before committing:

```bash
bundle exec standardrb --fix
bundle exec rake test
```

## 5. Push and create PR

```bash
git push -u origin $(git branch --show-current)
```

Create the PR. Include `Closes #N` in the body if working on an issue:

```bash
gh pr create --title "<title>" --body "$(cat <<'EOF'
## Summary
- [what was done]

Closes #N

## Test plan
- [ ] Visual review in Lookbook
EOF
)"
```

Print the PR URL for the user.

## 6. Show Lookbook preview

Print the Lookbook URL so the user can review visually:

```
Lookbook → http://localhost:<port>/lookbook/inspect/kiso/<component>/playground
PR → https://github.com/steveclarke/kiso/pull/<number>
```

## 7. Cleanup

Stop Lookbook when the user is done reviewing:

```bash
bin/worktree stop
```

On session exit, Claude Code will prompt the user to keep or remove the
worktree.
