# CLAUDE.md

## Project Overview

**Kiso** (Japanese: foundation) — a Rails engine gem providing UI components
inspired by shadcn/ui and Nuxt UI. ERB partials, Tailwind CSS, progressive
Stimulus.

## Key References

- `PLAN.md` — **read first**. Current status, what's done, what to build next,
  priority-ordered component list with batches.
- `docs/COMPONENT_STRATEGY.md` — **read before building any component**. Covers
  class_variants patterns, compound variants, theming, override system, dark mode.
- `.claude/skills/contributing/SKILL.md` — component creation workflow and checklist
- `skills/kiso/` — AI skill with component reference (update when adding components)
- `VISION.md` — full roadmap, component catalog, phased rollout

## Architecture

Two layers (CSS files only for transitions/pseudo-states):
1. **Ruby Theme Modules** (`lib/kiso/themes/`) — variant definitions using
   `class_variants` + `tailwind_merge`. This is where component styles live.
2. **ERB Partials** (`app/views/kiso/components/`) — strict locals, computed
   class strings from theme modules, composition via `yield` and sub-parts.

## Key Conventions

- **Computed Tailwind classes in ERB** — theme modules define variant class
  strings, partials render them. No `@apply` in CSS. CSS files only for
  transitions, animations, pseudo-states that ERB can't express.
- **Two-axis variants (Nuxt UI pattern)** — components with colors use
  `color:` + `variant:` axes with compound variants. Colors: primary,
  secondary, success, info, warning, error, neutral. Variants: solid,
  outline, soft, subtle.
- **Semantic tokens** — `bg-primary`, `text-foreground`, `bg-muted`, etc.
  Components never use raw palette shades or `dark:` prefixes.
- **Foreground pairing** — every color has a `-foreground` companion.
  `bg-primary text-primary-foreground` is always accessible.
- **`css_classes:` override** — single override point, merged via
  tailwind_merge. Conflicting classes are resolved automatically.
- **Data attributes for identity, not styling** — `data-component="badge"`
  for testing, Stimulus, debugging. NOT for CSS selectors.
- **Native HTML5 first** — `<dialog>`, `[popover]`, `<details>`, `<progress>`
  before reaching for Stimulus.
- **Composition over configuration** — Card = Header + Title + Content + Footer.
  Small partials, flexibly combined.
- **Strict locals on every partial** — `<%# locals: (color: :primary) %>`

## Component Pattern

```ruby
# lib/kiso/themes/badge.rb — variant definitions
Kiso::Themes::Badge = ClassVariants.build(
  base: "inline-flex items-center rounded-md font-medium",
  variants: { ... },
  compound_variants: [ ... ],
  defaults: { color: :primary, variant: :soft, size: :md }
)
```

```erb
<%# app/views/kiso/components/_badge.html.erb %>
<%# locals: (color: :primary, variant: :soft, size: :md, css_classes: "", **component_options) %>
<%= content_tag :span,
    class: Kiso::Themes::Badge.render(color: color, variant: variant, size: size, class: css_classes),
    data: { component: :badge },
    **component_options do %>
  <%= yield %>
<% end %>
```

## File Structure

```
lib/kiso/themes/           Ruby theme modules (ClassVariants definitions)
app/views/kiso/components/ ERB partials (rendered via kiso() helper)
app/assets/stylesheets/    Component CSS (thin — transitions/pseudo-states only)
app/helpers/kiso/          component_tag, kiso() helpers
test/components/previews/  Lookbook preview classes + templates
test/dummy/                Development Rails app (bin/dev → port 4000)
skills/kiso/               AI skill (component reference, theming guide)
docs/                      Architecture docs (COMPONENT_STRATEGY.md)
```

## Dependencies

- Rails >= 8.0
- tailwindcss-rails (host app owns the Tailwind build)
- class_variants ~> 1.1 (variant definitions, Ruby cva equivalent)
- tailwind_merge ~> 1.0 (class deduplication)

## Git & PRs

- **Always squash merge PRs** (`gh pr merge --squash`). Repo is configured
  to only allow squash merges.
- **Do not commit without explicit permission** from the user.
- **Do not stop/restart the user's dev server.** If changes need a restart,
  tell the user.

## Commands

```bash
cd test/dummy && bin/dev   # Start dev server + Tailwind watcher (port 4000)
bundle exec rake test      # Run tests
```
