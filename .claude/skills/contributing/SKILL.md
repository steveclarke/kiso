---
name: contributing
description: Kiso component conventions and development workflow. Points to the right docs for building, reviewing, and shipping components.
---

# Kiso Development

Guidelines for contributing to the Kiso component library.

## Where to find what

| Topic | File |
|-------|------|
| **Building a component** | `project/component-creation.md` — full workflow, templates, checklist |
| **Reviewing a component** | `project/component-review.md` — 12-point checklist, common mistakes |
| **Design system rules** | `project/design-system.md` — compound variants, tokens, spatial system |
| **Architecture patterns** | `project/component-strategy.md` — ClassVariants, override system |
| **Testing strategy** | `project/testing-strategy.md` — tier system, E2E requirements |
| **Docs page template** | `project/component-doc-template.md` — structure and guidelines |
| **All conventions** | `CLAUDE.md` — framework mindset, naming, code rules |

## Project structure

```
lib/kiso/themes/              Ruby theme modules (ClassVariants definitions)
app/views/kiso/components/    ERB partials (rendered via kui() helper)
app/assets/tailwind/kiso/     engine.css — shipped with gem (fonts + all color tokens)
app/helpers/kiso/             kui(), kiso_prepare_options() helpers
app/javascript/controllers/kiso/  Stimulus controllers (namespaced kiso--)
app/javascript/kiso/utils/    Shared JS utilities (positioning, highlight, focusable)
test/components/previews/kiso/  Lookbook previews + templates
skills/kiso/                  AI skill (update when adding components)
project/                      Architecture docs, design system, decisions
docs/                         Bridgetown docs site (published documentation)
lookbook/                     Lookbook dev app (bin/dev → port 4001)
```

## CSS architecture

**`app/assets/tailwind/kiso/engine.css`** is what the gem ships. It contains
Geist fonts, all default color tokens (`@theme`), dark mode overrides
(`.dark {}`), and `@source` directives for Kiso's views, helpers, and theme
modules. **Never put color tokens in the Lookbook's `application.css`** — they
belong in `engine.css` so host apps get them too.

The `tailwindcss:engines` Rake task (from `tailwindcss-rails` v4) automatically
detects any Rails engine with `app/assets/tailwind/{engine_name}/engine.css`
and generates `app/assets/builds/tailwind/{engine_name}.css`. Kiso's engine
name is `kiso`, so the directory must be `app/assets/tailwind/kiso/`.

**Lookbook setup:** `lookbook/app/assets/tailwind/application.css` imports the
auto-generated engine file and adds Lookbook-specific source paths:

```css
@import "tailwindcss";
@import "../builds/tailwind/kiso.css";

@source "../../views";
@source "../../../../test/components/previews";
```

## Pull request workflow

**Always include `Closes #N` in the PR body** so GitHub auto-closes the issue
on merge. This is the most commonly missed step.

```bash
# Create branch
git checkout -b feat/{name}-component

# Stage specific files (never git add -A)
git add lib/kiso/themes/{name}.rb app/views/kiso/components/...

# Commit
git commit -m "feat: ComponentName component (#N)"

# Push and create PR
git push -u origin feat/{name}-component
gh pr create --title "feat: ComponentName component" --body "$(cat <<'EOF'
## Summary
- [what was built]

Closes #N

## Test plan
- [x] All Lookbook previews render (200)
- [x] standardrb passes
- [x] rake test passes
- [ ] Visual review in Lookbook
EOF
)"
```

## Commands

```bash
bin/dev                         # All services via Overmind (Lookbook :4001 + docs :4000)
bin/dev -- -l web,css           # Lookbook + Tailwind only (no docs)
bin/worktree start              # Start on worktree-assigned port
bin/worktree port               # Show port for current worktree
overmind restart web            # Restart Lookbook server
bundle exec rake test           # Run Ruby tests
npm run test:unit               # Run JS unit tests (Vitest)
npm run test:e2e                # Run Playwright E2E tests (needs bin/dev)
npm run test:e2e:ui             # Open Playwright GUI
bundle exec standardrb --fix    # Lint & auto-format Ruby
npm run lint                    # Lint JS (oxlint)
npm run fmt                     # Format JS (oxfmt)
```

## Worktree workflow

See `.claude/skills/worktree/SKILL.md` for the full worktree lifecycle
(create, start Lookbook, commit, push, PR, cleanup). Key command:
`bin/worktree start` — starts Lookbook on a deterministic port (4101-4600).
