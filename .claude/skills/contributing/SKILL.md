---
name: contributing
description: Guide for contributing to Kiso. Provides component structure patterns, class_variants theming, Lookbook preview conventions, and the component creation workflow. Use when creating new components, modifying existing components, writing tests, or reviewing PRs in this codebase.
---

# Kiso Development

Guidelines for contributing to the Kiso component library.

## Philosophy

Kiso is a UI framework built for the **era of agentic coding**. Every design
decision serves one goal: **agents produce consistent, high-quality output
without drift.**

### Framework mindset — no one-offs

This is a UI framework, not an application. In a normal project you might add
a one-off Tailwind class or make a local exception. Here, every decision is a
pattern. Before changing a class, a token, a prop name, or a structural pattern
in one component, consider its impact on every other component in the system.
If the change doesn't apply consistently, either make it consistent across all
components or don't make it at all. When unsure, ask before introducing
something that only applies to one place. Consistency is more important than
any individual improvement.

### Design principles

1. **Props over composition for common patterns.** If 90% of usages look the
   same (icon + title + description), the component should accept props and
   handle the layout internally. Yield blocks remain for full override. Props
   are the guardrails that keep agent output consistent.

2. **Identical compound variant formulas across all colored components.** Badge,
   Alert, Button — same 28 compound variants. Only base/layout classes change.
   Copy from an existing component, never invent new formulas. See
   `project/DESIGN_SYSTEM.md`.

3. **shadcn aesthetic, Nuxt UI theming.** shadcn/ui is the visual reference
   (clean, minimal layout and spacing). Nuxt UI is the theming source of truth
   (two-axis color × variant, semantic tokens, compound variant system). When
   in doubt about styling, check the Nuxt UI theme file at
   `vendor/nuxt-ui/src/theme/`. When in doubt about look and
   feel, check shadcn at `vendor/shadcn-ui/`.

4. **Spatial system from shadcn.** All spacing, typography, radius, and icon
   sizing follows the scales extracted from shadcn/ui and documented in the
   "Spatial System" section of `project/DESIGN_SYSTEM.md`. Never use arbitrary
   values (`text-[8px]`, `h-[1.15rem]`). Pick from the established scales.

5. **Deterministic output.** Components should produce the same HTML structure
   regardless of who (or what) writes the template. This means: standardized
   prop names, consistent defaults, well-defined layout behavior. An agent
   passing `title:` and `description:` should get the exact same result every
   time.

6. **Progressive enhancement.** Start with props-driven ERB (Phase 1). Add
   Stimulus controllers only when native HTML5 can't handle it (Phase 2).
   Never require JS for basic rendering.

### What we take from each reference

**From shadcn/ui — structure + naming + implementation (the skeleton):**
- **Match names exactly.** Use the same component name and sub-part names
  that shadcn uses. If shadcn calls it `empty`, we call it `empty` — not
  `empty_state`. Check the shadcn source file name and exported component
  names before naming anything.
- **Match div-for-div, class-for-class.** Read the shadcn component at
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/` and copy their
  Tailwind utility classes for layout, spacing, typography, and structure.
  Do not invent your own classes — use what shadcn uses.
- Simple sub-parts (Title, Description, Action) as separate partials
- Single `css_classes:` override — no multi-layer config system
- ~30 semantic tokens is the right scope
- Only deviate from shadcn where Kiso's variant system or semantic tokens
  require it (e.g., replacing `border` with `ring ring-inset ring-border`
  for the outline variant, or `bg-card` with `bg-background`).

**From Nuxt UI — theming + variants (the paint):**
- Two-axis `color:` × `variant:` compound variants
- Pure CSS custom properties, zero `dark:` prefixes
- The outline/soft/subtle variant system and compound variant formulas
- Props-driven API that encapsulates common patterns (icon, title, description,
  actions, close) — agents pass data, component handles layout
- `opacity-90` for description text (relative to parent, not absolute)
- Foreground pairing convention (every color has `-foreground`)
- Nuxt UI token mapping (see `project/DESIGN_SYSTEM.md`)

## Mandatory reading before building any component

1. `project/DESIGN_SYSTEM.md` — compound variant formulas, token table, spatial
   system (heights, padding, gaps, typography, radius, icon sizing), rules
2. `project/components/COMPONENT.md` — vision doc for the specific component
   (if it exists)
3. The shadcn component at `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/`
   — read and copy the Tailwind classes for structure, spacing, and layout
4. The Nuxt UI theme at `vendor/nuxt-ui/src/theme/` — read for variant
   formulas and slot structure
5. An existing Kiso component (Badge, Alert, or Card) — copy the exact
   compound variant block for colored components, only change the base classes

## Project structure

```
lib/kiso/
├── themes/              # ClassVariants theme modules (badge.rb, alert.rb)
├── engine.rb            # Rails engine config
└── version.rb
app/
├── views/kiso/components/  # ERB partials (_badge.html.erb, alert/_title.html.erb)
├── assets/
│   ├── stylesheets/kiso/   # Component CSS (transitions/pseudo-states only)
│   └── tailwind/kiso/  # engine.css — shipped with gem (fonts + all color tokens)
├── helpers/kiso/           # kui(), kiso_prepare_options() helpers
└── javascript/controllers/kiso/  # Stimulus controllers (namespaced)
test/
├── components/previews/kiso/  # Lookbook previews + templates
skills/kiso/                   # AI skill (update when adding components)
project/
├── DESIGN_SYSTEM.md           # Strict compound variant rules + token map
├── COMPONENT_STRATEGY.md      # Architecture, recipes, patterns
└── components/                # Per-component vision docs
docs/                          # Bridgetown docs site (published documentation)
lookbook/                      # Dev Rails app (Lookbook on :4001)
```

## CSS architecture

**`app/assets/tailwind/kiso/engine.css`** is what the gem ships. It
contains Geist fonts, all default color tokens (`@theme`), dark mode overrides
(`.dark {}`), and `@source` directives for Kiso's views, helpers, and theme
modules. **Never put color tokens in the Lookbook's `application.css`** — they
belong in `engine.css` so host apps get them too.

### How tailwindcss-rails engine bundling works

The `tailwindcss:engines` Rake task (from `tailwindcss-rails` v4) automatically
detects any Rails engine that has `app/assets/tailwind/{engine_name}/engine.css`
and generates `app/assets/builds/tailwind/{engine_name}.css` with an `@import`
pointing to the engine's CSS. This runs as a prerequisite of both
`tailwindcss:build` and `tailwindcss:watch` — no custom Rake tasks needed.

Kiso's engine name is `kiso`, so the directory must be
`app/assets/tailwind/kiso/` to match.

### Lookbook setup

**`lookbook/app/assets/tailwind/application.css`** imports the auto-generated
engine file and adds Lookbook-specific source paths:

```css
@import "tailwindcss";
@import "../builds/tailwind/kiso.css";

/* Lookbook-specific sources */
@source "../../views";
@source "../../../../test/components/previews";
```

## Component creation workflow

### Before writing code

1. Check if a vision doc exists at `project/components/COMPONENT.md`. If not,
   create one following the Badge/Alert pattern (Current API → Target API →
   Dependencies → Migration).
2. Read `project/DESIGN_SYSTEM.md` for the compound variant formulas.
3. **Read the shadcn component** at
   `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/{name}.tsx` — this is
   the structural source of truth. Copy their Tailwind classes div-for-div.
4. **Read the shadcn docs and examples** at
   `vendor/shadcn-ui/apps/v4/content/docs/components/radix/{name}.mdx` and
   `vendor/shadcn-ui/apps/v4/examples/radix/{name}-*.tsx` — these define
   which demos to create in Lookbook and what content/icons to use.
5. Read the Nuxt UI theme file at
   `vendor/nuxt-ui/src/theme/{name}.ts` for variant formulas and slot
   structure — this is the theming source of truth.

### Creation checklist

```
Component: [name]
Progress:
- [ ] 1. Read project/DESIGN_SYSTEM.md and project/components/[NAME].md
- [ ] 2. Verify component name matches shadcn exactly (check file name + exports)
- [ ] 3. Read Nuxt UI theme file for this component
- [ ] 4. Create theme module in lib/kiso/themes/
         - Copy compound variants from Badge (same formulas, different base)
- [ ] 5. Require theme in lib/kiso.rb
- [ ] 6. Create ERB partial in app/views/kiso/components/
         - Props-driven for common patterns, yield for override
- [ ] 7. Create sub-part partials if needed (title, description, etc.)
- [ ] 8. Create Lookbook previews mirroring shadcn demos (read examples/radix/{name}-*.tsx)
- [ ] 9. Add CSS file if needed (transitions/animations only)
- [ ] 10. Update skills/kiso/references/components.md
- [ ] 11. Write/update project/components/[NAME].md vision doc
- [ ] 12. Create docs page AND add to docs/src/_data/navigation.yml (see "Documentation page" below)
- [ ] 13. Run: bundle exec standardrb --fix
- [ ] 14. Rebuild Tailwind: cd test/dummy && bin/rails tailwindcss:build
- [ ] 15. Verify in Lookbook: http://localhost:4001/lookbook
```

### Documentation page

Every component needs a docs page in the Bridgetown site. Follow the template
at `project/COMPONENT_DOC_TEMPLATE.md` for content structure and guidelines.

**Create the page** at `docs/src/components/{component_name}.md` with this
frontmatter:

```yaml
---
title: ComponentName
layout: docs
description: One sentence describing what the component does.
category: Element | Form | Layout | Data | Navigation | Overlay
source: lib/kiso/themes/component_name.rb
---
```

The `docs` layout renders the `title` and `description` from frontmatter
automatically. Do NOT repeat an `# Title` heading or description paragraph in
the markdown body — start with `## Quick Start`.

**Update navigation** — add the component to the "Components" section in
`docs/src/_data/navigation.yml` (alphabetical order):

```yaml
- title: ComponentName
  href: /components/component_name
```

**Escape ERB in code examples** — Bridgetown processes ERB, so fenced code
blocks containing `<%=` will be executed. Escape the tag as `<%%=` so it
renders as literal code:

```
<%%= kui(:badge) { "Example" } %>
```

## Colored component template

**Every colored component uses this exact compound variant block.** Copy it
verbatim. Only change the `base:` string and any additional variant axes
(like `size:` for Badge).

```ruby
module Kiso
  module Themes
    MyComponent = ClassVariants.build(
      base: "...",  # ONLY THIS LINE CHANGES PER COMPONENT
      variants: {
        variant: {
          solid: "",
          outline: "ring ring-inset",
          soft: "",
          subtle: "ring ring-inset"
        },
        color: COLORS.index_with { "" }
      },
      compound_variants: [
        # -- solid --
        {color: :primary, variant: :solid, class: "bg-primary text-primary-foreground"},
        {color: :secondary, variant: :solid, class: "bg-secondary text-secondary-foreground"},
        {color: :success, variant: :solid, class: "bg-success text-success-foreground"},
        {color: :info, variant: :solid, class: "bg-info text-info-foreground"},
        {color: :warning, variant: :solid, class: "bg-warning text-warning-foreground"},
        {color: :error, variant: :solid, class: "bg-error text-error-foreground"},
        {color: :neutral, variant: :solid, class: "bg-inverted text-inverted-foreground"},

        # -- outline --
        {color: :primary, variant: :outline, class: "text-primary ring-primary/50"},
        {color: :secondary, variant: :outline, class: "text-secondary ring-secondary/50"},
        {color: :success, variant: :outline, class: "text-success ring-success/50"},
        {color: :info, variant: :outline, class: "text-info ring-info/50"},
        {color: :warning, variant: :outline, class: "text-warning ring-warning/50"},
        {color: :error, variant: :outline, class: "text-error ring-error/50"},
        {color: :neutral, variant: :outline, class: "text-foreground bg-background ring-accented"},

        # -- soft --
        {color: :primary, variant: :soft, class: "bg-primary/10 text-primary"},
        {color: :secondary, variant: :soft, class: "bg-secondary/10 text-secondary"},
        {color: :success, variant: :soft, class: "bg-success/10 text-success"},
        {color: :info, variant: :soft, class: "bg-info/10 text-info"},
        {color: :warning, variant: :soft, class: "bg-warning/10 text-warning"},
        {color: :error, variant: :soft, class: "bg-error/10 text-error"},
        {color: :neutral, variant: :soft, class: "text-foreground bg-elevated"},

        # -- subtle --
        {color: :primary, variant: :subtle, class: "bg-primary/10 text-primary ring-primary/25"},
        {color: :secondary, variant: :subtle, class: "bg-secondary/10 text-secondary ring-secondary/25"},
        {color: :success, variant: :subtle, class: "bg-success/10 text-success ring-success/25"},
        {color: :info, variant: :subtle, class: "bg-info/10 text-info ring-info/25"},
        {color: :warning, variant: :subtle, class: "bg-warning/10 text-warning ring-warning/25"},
        {color: :error, variant: :subtle, class: "bg-error/10 text-error ring-error/25"},
        {color: :neutral, variant: :subtle, class: "text-foreground bg-elevated ring-accented"}
      ],
      defaults: {color: :primary, variant: :soft}
    )
  end
end
```

## Partial patterns

### Props-driven with yield fallback

The target pattern for all components with internal structure:

```erb
<%# locals: (title: nil, description: nil, icon: nil, color: :primary,
             variant: :soft, css_classes: "", **component_options) %>
<% content = capture { yield }.presence %>
<%= content_tag :div,
    class: Kiso::Themes::Alert.render(color: color, variant: variant, class: css_classes),
    data: { component: :alert },
    **component_options do %>
  <% if content %>
    <%# Full override — user controls everything %>
    <%= content %>
  <% else %>
    <%# Props-driven layout — component handles structure %>
    <%# icon, title, description rendered here %>
  <% end %>
<% end %>
```

### Default content with optional block override

When a component renders default content (like an icon) but allows the caller
to replace it with a block:

```erb
<%# One-liner — default with inline fallback %>
<%= capture { yield }.presence || kiso_component_icon(:chevron_right, class: "size-3.5") %>

<%# Multi-line — assign first, then branch %>
<% content = capture { yield }.presence %>
<% if content %>
  <%= content %>
<% else %>
  <%# default content here %>
<% end %>
```

**Use `kiso_component_icon(:semantic_name)` for all default icons in component
partials** — never hardcode `kiso_icon("icon-name")`. This lets host apps swap
icons globally via `Kiso.config.icons`. Add new semantic names to
`lib/kiso/configuration.rb` when a component needs a new default icon.
`kiso_icon("name")` is only for user-specified icons in app templates.

**CRITICAL: Never use `block_given?` in ERB partials.** Rails wraps every
partial in an internal block, so `block_given?` is always `true` — even when
the caller passes no block. `yield` returns an empty string in that case, so
`block_given?` + `yield` silently swallows the default. Use
`capture { yield }.presence` instead — it correctly returns `nil` when no
block content is provided.

### Sub-part partials

For composed usage via `kui(:component, :part)`:

```erb
<%# app/views/kiso/components/alert/_title.html.erb %>
<%# locals: (css_classes: "", **component_options) %>
<%= content_tag :div,
    class: Kiso::Themes::AlertTitle.render(class: css_classes),
    data: kiso_prepare_options(component_options, slot: "alert-title"),
    **component_options do %>
  <%= yield %>
<% end %>
```

## Code conventions

| Convention | Rule |
|------------|------|
| Compound variants | **Identical across all colored components.** Copy from Badge. |
| Description text | `opacity-90` inside colored components. Never `text-muted-foreground`. |
| Ring vs border | `ring ring-inset` for outline/subtle variants. Never `border`. |
| Semantic tokens | `bg-primary`, `text-foreground` — never raw palette shades. |
| No `dark:` prefixes | Tokens flip automatically via CSS variables (`.dark {}` block). |
| `text-foreground` on containers | Every component root that displays text must set `text-foreground`. Browser default is black and won't flip in dark mode. |
| Foreground pairing | Every color has `-foreground`. Including `inverted-foreground`. |
| Heights | `h-9` default interactive. Scale: `h-6` (xs), `h-8` (sm), `h-9` (md), `h-10` (lg). |
| Gaps | `gap-2` default. `gap-1` tight lists, `gap-4` sections, `gap-6` card-level. |
| Font sizes | `text-sm` body, `text-xs` labels, `text-lg` modal titles. **Never below `text-xs`.** |
| Font weights | `font-medium` interactive/labels, `font-semibold` headings. |
| Border radius | `rounded-md` interactive, `rounded-xl` containers, `rounded-full` pills. **No per-size variation.** |
| Icon sizing | `size-4` standard, `size-3` compact, `size-5` larger. No arbitrary values. |
| Container padding | `p-6` large (Card, Dialog), `p-4` medium (Sheet, Popover), `p-2` compact. |
| No arbitrary values | Never use `text-[8px]`, `h-[1.15rem]`, etc. Use standard Tailwind classes only. |
| Sub-part naming | `kui(:alert, :title)` — **never** `kui(:alert_title)`. Files live in `alert/_title.html.erb`. Slot: `data-slot="alert-title"`. |
| Default icons | Use `kiso_component_icon(:semantic_name)` for built-in icons in partials. Never hardcode `kiso_icon("name")`. Add new names to `lib/kiso/configuration.rb`. |
| No `block_given?` in ERB | Rails makes `block_given?` always true in partials. Use `capture { yield }.presence` for default-with-override. |
| Strict locals | Every partial: `<%# locals: (color: :primary, ...) %>` |
| Data slot | `data-slot="alert"` for identity (shadcn v4 convention). Kebab-case. Can be used as CSS selectors (`has-[[data-slot=...]]`). |
| `css_classes:` override | Single override point, merged via tailwind_merge. |
| Lookbook previews | Playground first, then Colors, Variants, feature galleries. |
| Lookbook dark mode | Preview wrapper `div`s must include `text-foreground` so text/icons are visible in dark mode. Lookbook doesn't set a base text color on the preview iframe. |
| Update docs | `skills/kiso/references/components.md` + vision doc. |
| JSDoc on all JS | Every Stimulus controller, method, property, and event must have JSDoc. `@example`, `@property`, `@fires`, `@param`, `@returns`, `@private`. |
| Lint before commit | `bundle exec standardrb --fix` |

## Worktree workflow (parallel development)

When working in a git worktree (e.g., spawned by the orchestrator for parallel
component builds), use `bin/worktree` for port management:

```bash
# Get your unique Lookbook port (deterministic from worktree name)
bin/worktree port              # → 4237

# Start Lookbook + Tailwind on your assigned port (skips docs)
bin/worktree start

# Or manually:
export LOOKBOOK_PORT=$(bin/worktree port)
bin/dev -- -l web,css

# Verify previews render
curl -s -o /dev/null -w "%{http_code}" http://localhost:$LOOKBOOK_PORT/preview/kiso/{name}/playground

# Stop when done
bin/worktree stop
```

Port assignment is hash-based: main worktree → 4001, named worktrees → 4101–4600.
Same name always gets the same port, no conflicts between parallel agents.

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
bundle exec rake test           # Run tests
bundle exec standardrb --fix    # Lint & auto-format Ruby
```

## Available references

| File | Topics |
|------|--------|
| [references/theme-structure.md](references/theme-structure.md) | ClassVariants patterns, compound variants, semantic colors |
| [references/component-structure.md](references/component-structure.md) | ERB partial patterns, strict locals, data attributes |

**Load reference files based on your task. DO NOT load all files at once.**
