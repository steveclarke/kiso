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
- **Theme uses Tailwind palette references** — semantic tokens like
  `--color-primary` alias Tailwind colors (`var(--color-blue-600)`). No
  hand-rolled OKLCH values.
- **Data attributes are the API** — `data-component="button"`,
  `data-variant="primary"`, `data-size="sm"`, `data-*-part="header"`.
- **Native HTML5 first** — `<dialog>`, `[popover]`, `<details>`, `<progress>`
  before reaching for Stimulus.
- **Composition over configuration** — Card = Header + Title + Content + Footer.
  Small partials, flexibly combined.
- **Strict locals on every partial** — `<%# locals: (variant: :default) %>`

## Component Pattern

```erb
<%# locals: (variant: :default, size: :md, css_classes: "", **html_options) %>
<% merged_data = (html_options.delete(:data) || {}).merge(
    component: :badge, variant: variant, size: size
  ).compact %>
<%= content_tag :span,
    class: ["inline-flex items-center rounded-md font-medium", css_classes].compact_blank.join(" "),
    data: merged_data, **html_options do %>
  <%= yield %>
<% end %>
```

## File Structure

```
app/views/components/     ERB partials (main + sub-parts)
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
