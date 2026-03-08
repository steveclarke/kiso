---
title: "Batch Merge: i18n, Generators, appui, Layout, Presets, Page Components"
layout: docs
description: Release notes for Kiso PR #189 — six features merged together.
---

This release adds six features developed in parallel and merged as a single
batch. Everything is backward compatible. Existing apps need no changes --
update the gem and all new features are available immediately.

## What's new

**i18n support** -- all hardcoded strings now use Rails `t()` with shipped
English defaults. **Layout components** -- semantic wrappers for full-page
structure. **Page components** -- content page layouts with headers, sections,
grids, and cards. **`appui()` helper** -- build your own components using
the same system Kiso uses internally. **Theme presets** -- change the look of
every component in one line. **Color palettes** -- swap the entire color
scheme with a CSS import and a data attribute. **Generators** -- scaffold
new components (both engine and host app) with a single command.

---

## i18n support

All 18 hardcoded English strings in Kiso components now use Rails `I18n.t()`.
Kiso ships `config/locales/en.yml` with default translations, so **existing
apps require zero changes** -- everything works exactly as before.

### Customizing strings

Override any key in your app's locale files:

```yaml
# config/locales/en.yml (your app)
en:
  kiso:
    dialog:
      close: "Dismiss"
    pagination:
      next: "Forward"
      previous: "Back"
```

### Full key reference

```yaml
en:
  kiso:
    alert:
      dismiss: "Dismiss"
    breadcrumb:
      label: "breadcrumb"
      more: "More"
    color_mode_button:
      toggle: "Toggle color mode"
    color_mode_select:
      theme: "Theme"
      system: "System"
      light: "Light"
      dark: "Dark"
    combobox:
      toggle: "Toggle"
      options: "Options"
    command:
      search: "Search"
      suggestions: "Suggestions"
    dashboard_sidebar:
      label: "Sidebar navigation"
      toggle: "Toggle sidebar"
      collapse: "Collapse sidebar"
    dialog:
      close: "Close"
    pagination:
      label: "pagination"
      more_pages: "More pages"
      next: "Next"
      next_page: "Go to next page"
      previous: "Previous"
      previous_page: "Go to previous page"
```

Rails standard locale lookup applies -- add `config/locales/fr.yml` (or any
other locale) and Kiso components render in the active locale automatically.

---

## Layout components

Five new components for full-page structure using semantic HTML elements.

| Component | HTML element | Purpose |
|-----------|-------------|---------|
| `App` | `<div>` | Root wrapper. Sets `bg-background text-foreground antialiased` so all children inherit correct colors in dark mode. |
| `Container` | `<div>` | Centered content with max-width and responsive padding. Four size variants: `:narrow` (max-w-3xl), `:default` (max-w-7xl), `:wide` (max-w-screen-2xl), `:full`. |
| `Header` | `<header>` | Sticky site header with backdrop blur and bottom border. |
| `Footer` | `<footer>` | Site footer. |
| `Main` | `<main>` | Primary content area (`flex-1`). |

### Quick start

```erb
<%%= kui(:app) do %>
  <%%= kui(:header) do %>
    <%%= kui(:container) do %>
      <!-- Navigation -->
    <%% end %>
  <%% end %>

  <%%= kui(:main) do %>
    <%%= kui(:container) do %>
      <%%= yield %>
    <%% end %>
  <%% end %>

  <%%= kui(:footer) do %>
    <%%= kui(:container) do %>
      <!-- Footer content -->
    <%% end %>
  <%% end %>
<%% end %>
```

### Container sizes

```erb
<%%= kui(:container, size: :narrow) do %>
  <!-- Blog post (max-w-3xl) -->
<%% end %>

<%%= kui(:container, size: :wide) do %>
  <!-- Dashboard (max-w-screen-2xl) -->
<%% end %>
```

> **Note:** `App` sets `text-foreground` on its root element. If you already
> have `text-foreground` on your `<body>` (added automatically by Kiso's
> `@layer base` rule since v0.2.0), the two are compatible -- `App` just
> ensures the correct color is present even if the body rule is overridden.

---

## Page components

Six components for content/marketing page layouts, ported from Nuxt UI.

| Component | Purpose |
|-----------|---------|
| `Page` | 10-column responsive grid with optional left/right sidebars. |
| `PageHeader` | Hero section with headline eyebrow, title, description, and action links. |
| `PageBody` | Main content wrapper with vertical spacing. |
| `PageSection` | Content section with horizontal (two-column) or vertical orientation. |
| `PageGrid` | Responsive 1/2/3-column grid for cards. |
| `PageCard` | Feature/content card with icon, title, description. Four variants: outline, soft, subtle, ghost. |

### Quick start

```erb
<%%= kui(:page_header, headline: "Getting Started", title: "Build something great",
    description: "Everything you need to get up and running.") %>

<%%= kui(:page_body) do %>
  <%%= kui(:page_section, orientation: :vertical) do %>
    <!-- Section content -->
  <%% end %>

  <%%= kui(:page_grid) do %>
    <%%= kui(:page_card, variant: :outline, icon: "rocket",
        title: "Fast", description: "Built for speed.") %>
    <%%= kui(:page_card, variant: :outline, icon: "shield",
        title: "Secure", description: "Locked down by default.") %>
    <%%= kui(:page_card, variant: :outline, icon: "zap",
        title: "Simple", description: "No config required.") %>
  <%% end %>
<%% end %>
```

### Page with sidebars

```erb
<%%= kui(:page) do %>
  <%%= kui(:page, :left) do %>
    <!-- Left sidebar (2 cols) -->
  <%% end %>
  <%%= kui(:page, :center) do %>
    <!-- Main content (8 cols) -->
  <%% end %>
  <%%= kui(:page, :right) do %>
    <!-- Right sidebar (2 cols) -->
  <%% end %>
<%% end %>
```

### PageCard variants

```erb
<%%= kui(:page_card, variant: :outline) %>  <!-- Border, background -->
<%%= kui(:page_card, variant: :soft) %>     <!-- Tinted background, no border -->
<%%= kui(:page_card, variant: :subtle) %>   <!-- Tinted background + border -->
<%%= kui(:page_card, variant: :ghost) %>    <!-- No background, no border -->
```

---

## appui() -- Build your own components

`appui()` is a new helper that mirrors `kui()` but resolves components from
your app instead of the engine. It gives you the same variant system
(`ClassVariants` + `tailwind_merge`), the same sub-part composition, and the
same `ui:` / `css_classes:` override system -- for components you own.

### End-to-end workflow

**1. Generate a component:**

```bash
bin/rails generate kiso:component pricing_card --sub-parts header footer
```

This creates:

```
app/themes/default/pricing_card.rb
app/themes/default/pricing_card_header.rb
app/themes/default/pricing_card_footer.rb
app/views/components/_pricing_card.html.erb
app/views/components/pricing_card/_header.html.erb
app/views/components/pricing_card/_footer.html.erb
```

**2. Define your theme (generated for you, edit as needed):**

```ruby
# app/themes/default/pricing_card.rb
AppThemes::PricingCard = ClassVariants.build(
  base: "rounded-xl border border-border bg-background p-6",
  variants: {
    featured: {
      true => "ring-2 ring-primary",
      false => ""
    }
  },
  defaults: { featured: false }
)
```

**3. Build your partial (generated for you, edit as needed):**

```erb
<%# app/views/components/_pricing_card.html.erb %>
<%# locals: (featured: false, css_classes: "", **component_options) %>
<%%= content_tag :div,
    class: AppThemes::PricingCard.render(featured: featured, class: css_classes),
    data: kiso_prepare_options(component_options, slot: "pricing-card"),
    **component_options do %>
  <%%= yield %>
<%% end %>
```

**4. Use it in your views:**

```erb
<%%= appui(:pricing_card, featured: true) do %>
  <%%= appui(:pricing_card, :header) { "Pro Plan" } %>
  <p>Everything you need.</p>
  <%%= appui(:pricing_card, :footer) do %>
    <%%= kui(:button) { "Get Started" } %>
  <%% end %>
<%% end %>
```

### Key details

- Theme files live in `app/themes/default/` (configurable via
  `Kiso.config.app_theme`).
- Constants are namespaced under `AppThemes::` (e.g., `AppThemes::PricingCard`).
- Hot-reloaded in development -- edit a theme file, refresh the browser.
- No global config layer -- you own the source directly.
- Mix `appui()` and `kui()` freely. Use Kiso components inside your app
  components and vice versa.

### Multiple themes

```ruby
# config/initializers/kiso.rb
Kiso.configure do |config|
  config.app_theme = :modern  # loads from app/themes/modern/
end
```

```bash
bin/rails generate kiso:component pricing_card --theme modern
```

---

## Theme presets

Presets override `ClassVariants` for every component in one line. They change
structural styles like border-radius across the entire system coherently.

### Applying a preset

```ruby
# config/initializers/kiso.rb
Kiso.configure do |config|
  config.apply_preset(:rounded)
end
```

### Available presets

| Preset | Effect |
|--------|--------|
| `:rounded` | Pill-shaped buttons and inputs (`rounded-full`), more rounded cards and dialogs (`rounded-2xl`), rounded toggles, pagination, nav items. Covers 40+ component theme definitions. |
| `:sharp` | Zero border-radius everywhere (`rounded-none`). Geometric, brutalist aesthetic. |

No preset (the default) uses Kiso's standard radii: `rounded-md` for
interactive elements, `rounded-xl` for cards, `rounded-lg` for dialogs.

### Per-component overrides on top of presets

Overrides set **after** `apply_preset` take priority:

```ruby
Kiso.configure do |config|
  config.apply_preset(:rounded)
  config.theme[:card] = { base: "rounded-3xl" }  # just cards get 3xl
end
```

### Creating your own preset

See the [Theming guide](/guide/theming) for the full preset authoring
workflow. Study `lib/kiso/presets/rounded.rb` and `lib/kiso/presets/sharp.rb`
for reference.

---

## Color palettes

Palettes are CSS files that redefine Kiso's semantic color tokens using OKLCH
values. They change the entire color scheme without touching Ruby.

### Using a palette

**1. Import the palette in your Tailwind stylesheet:**

```css
@import "tailwindcss";
@import "../builds/tailwind/kiso";
@import "../builds/tailwind/kiso/palettes/blue.css";
```

**2. Add the data attribute to your root element:**

```erb
<html data-palette="blue">
```

### Available palettes

| Palette | Primary | Neutral | Feel |
|---------|---------|---------|------|
| `zinc` | Near-black / near-white | Zinc | Cool neutral, monochrome |
| `blue` | Vivid blue | Slate | Professional SaaS |
| `green` | Forest green | Zinc | Fresh, natural |
| `orange` | Warm orange | Stone | Energetic, creative |
| `violet` | Rich purple | Gray | Premium, design-focused |

Each palette redefines all semantic tokens (primary, secondary, background,
foreground, muted, accent, inverted, elevated, border, ring) with dark mode
variants included.

### Combining presets and palettes

Presets (Ruby, structural) and palettes (CSS, color) are independent. Use
them together:

```ruby
# config/initializers/kiso.rb
Kiso.configure do |config|
  config.apply_preset(:rounded)
end
```

```css
@import "../builds/tailwind/kiso/palettes/violet.css";
```

```erb
<html data-palette="violet">
```

Result: pill-shaped components with a violet color scheme.

---

## Component generators

Two generators are included -- one for Kiso engine development, one for
host apps.

### kiso:component (for your app)

```bash
# Basic component
bin/rails generate kiso:component status_badge

# With sub-parts
bin/rails generate kiso:component pricing_card --sub-parts header footer

# Target a specific theme directory
bin/rails generate kiso:component pricing_card --theme modern
```

Creates theme files in `app/themes/<theme>/` and partials in
`app/views/components/`. Use with the `appui()` helper.

### kiso:framework_component (for engine development)

This generator is for internal Kiso development only and is not included
in the gem.

```bash
# Basic component
bin/rails generate kiso:framework_component tooltip

# Colored component with compound variants
bin/rails generate kiso:framework_component notification --colored

# With sub-parts and Stimulus controller
bin/rails generate kiso:framework_component accordion --sub-parts item trigger content --stimulus

# Skip docs page
bin/rails generate kiso:framework_component tooltip --skip-docs
```

Creates theme in `lib/kiso/themes/`, partial in
`app/views/kiso/components/`, Lookbook preview, and docs page.

---

## Breaking changes

**None.** This release is fully backward compatible. All existing component
calls, theme overrides, and configuration continue to work unchanged.

---

## Migration guide

No migration is required. All new features are opt-in.

**Optional enhancements you might want:**

- **i18n customization** -- if you previously worked around hardcoded
  English strings (e.g., wrapping components to change "Close" or
  "Previous"), you can now override them via locale files instead.

- **Layout components** -- if your layout currently has raw
  `<header>`, `<main>`, `<footer>` tags with manual Tailwind classes,
  consider switching to `kui(:header)`, `kui(:main)`, `kui(:footer)` for
  consistency and dark mode support.

- **Try a preset** -- add one line to your initializer to see the effect
  across your entire app.

---

## Upgrade steps

1. Update your Gemfile:
   ```ruby
   gem "kiso", "~> 0.4.0.pre"
   ```

2. Install:
   ```bash
   bundle install
   ```

3. That's it. Everything works as before. New features are available when
   you're ready to use them.
