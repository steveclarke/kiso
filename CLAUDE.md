# CLAUDE.md

## Project Overview

**Kiso** (Japanese: foundation) — a Rails engine gem providing UI components
inspired by shadcn/ui. ERB partials, Tailwind CSS, progressive Stimulus.

## Architecture

Three layers:
1. **ERB Partials** — strict locals, composition via `yield` and sub-parts
2. **CSS** — `data-component` / `data-variant` attribute selectors, thin files
3. **Stimulus Controllers** — only where native HTML5 falls short

## Key Conventions

- **Tailwind classes in ERB**, not `@apply` in CSS. Only use `@apply` for
  variant selectors, pseudo-states, or things you can't express in markup.
- **Theme uses semantic tokens (Nuxt UI style)** — palette aliases
  (`primary` → `blue`) for brand colors, surface tokens (`bg-elevated`,
  `text-muted`, `border-accented`) that flip in dark mode automatically.
  Components never use `dark:` for surface colors, text, or borders.
- **Data attributes are the API** — `data-component="button"`,
  `data-variant="primary"`, `data-size="sm"`, `data-*-part="header"`.
- **Native HTML5 first** — `<dialog>`, `[popover]`, `<details>`, `<progress>`
  before reaching for Stimulus.
- **Composition over configuration** — Card = Header + Title + Content + Footer.
  Small partials, flexibly combined.
- **Strict locals on every partial** — `<%# locals: (variant: :default) %>`

## Component Pattern

```erb
<%# locals: (variant: :default, size: :md, css_classes: "", **component_options) %>
<%= component_tag :span, :badge, variant:, size:, class: css_classes,
    **component_options do %>
  <%= yield %>
<% end %>
```

`component_tag` (in `Kiso::ComponentHelper`) wraps `content_tag` — it sets
`data-component`, `data-variant`, `data-size`, merges caller `data:`, and
compacts nils. Sub-parts use `part:` → `data-card-part="header"`.

## File Structure

```
app/views/kiso/components/  ERB partials (namespaced, rendered via kiso() helper)
app/assets/stylesheets/   Component CSS (thin, variant selectors only)
app/javascript/controllers/kiso/  Stimulus controllers (namespaced)
app/helpers/kiso/         Builder helpers
lib/kiso/                 Engine, version
```

## Dependencies

- Rails >= 8.0
- tailwindcss-rails (host app owns the Tailwind build)
- importmap-rails (for Stimulus controllers)

## Commands

```bash
bundle exec rake test    # Run tests (when we have them)
```
