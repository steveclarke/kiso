# CLAUDE.md

## Project Overview

**Kiso** (Japanese: foundation) — a Rails engine gem providing UI components
inspired by shadcn/ui and Nuxt UI. ERB partials, Tailwind CSS, progressive
Stimulus.

## Architecture

Two layers (CSS files only when needed for transitions/pseudo-states):
1. **Ruby Theme Modules** — variant definitions using `class_variants` +
   `tailwind_merge` (Ruby equivalents of shadcn's cva + tw-merge)
2. **ERB Partials** — strict locals, computed Tailwind classes from themes,
   composition via `yield` and sub-parts

See `docs/COMPONENT_STRATEGY.md` for the full theming and component strategy
(class_variants patterns, dark mode approach, override system, compound
variants).

## Key Conventions

- **Computed Tailwind classes in ERB** — variant styles defined in Ruby theme
  modules (`lib/kiso/themes/`), rendered as class strings. No `@apply` in CSS.
  CSS files only for transitions, animations, pseudo-states that ERB can't
  express.
- **Semantic tokens (shadcn/Nuxt UI hybrid)** — purpose-named colors
  (`primary`, `muted`, `foreground`, `border`) that flip in dark mode via CSS
  variables. Components never use `dark:` prefixes or raw palette shades.
  Uses `-foreground` pairing convention for accessible contrast.
- **`class_variants` for variant definitions** — flat variants for simple
  components (Badge, Label), compound variants only when color x variant
  matrix demands it (Button, Alert).
- **`tailwind_merge` for class deduplication** — `css_classes` override +
  tailwind_merge ensures user classes win over theme defaults.
- **Data attributes for identity, not styling** — `data-component="badge"` for
  testing, Stimulus, debugging. NOT for CSS selectors.
- **Native HTML5 first** — `<dialog>`, `[popover]`, `<details>`, `<progress>`
  before reaching for Stimulus.
- **Composition over configuration** — Card = Header + Title + Content + Footer.
  Small partials, flexibly combined.
- **Strict locals on every partial** — `<%# locals: (variant: :default) %>`

## Component Pattern

```ruby
# lib/kiso/themes/badge.rb — variant definitions
Kiso::Themes::Badge = ClassVariants.build(
  base: "inline-flex items-center rounded-md border font-medium",
  variants: {
    variant: {
      default: "border-border bg-muted text-foreground",
      primary: "border-primary/20 bg-primary/10 text-primary",
    },
    size: { sm: "px-1.5 py-0.5 text-xs", md: "px-2 py-0.5 text-xs" }
  },
  defaults: { variant: :default, size: :md }
)
```

```erb
<%# app/views/kiso/components/_badge.html.erb %>
<%# locals: (variant: :default, size: :md, css_classes: "", **component_options) %>
<%= content_tag :span,
    class: Kiso::Themes::Badge.render(variant: variant, size: size, class: css_classes),
    data: { component: :badge },
    **component_options do %>
  <%= yield %>
<% end %>
```

## File Structure

```
lib/kiso/themes/              Ruby theme modules (ClassVariants definitions)
app/views/kiso/components/    ERB partials (rendered via kiso() helper)
app/assets/stylesheets/kiso/  Component CSS (thin — transitions/pseudo-states only)
app/assets/tailwind/kiso/     Engine CSS bridge for host apps
app/javascript/controllers/kiso/  Stimulus controllers (namespaced)
app/helpers/kiso/             component_tag, kiso() helpers
test/components/previews/     Lookbook preview classes + templates
test/dummy/                   Development Rails app (Lookbook on port 4000)
docs/                         Architecture and strategy docs
```

## Dependencies

- Rails >= 8.0
- tailwindcss-rails (host app owns the Tailwind build)
- class_variants ~> 1.1 (variant definitions, Ruby cva equivalent)
- tailwind_merge ~> 1.0 (class deduplication, Ruby tw-merge equivalent)

## Commands

```bash
cd test/dummy && bin/dev   # Start dev server + Tailwind watcher (port 4000)
bundle exec rake test      # Run tests
```
