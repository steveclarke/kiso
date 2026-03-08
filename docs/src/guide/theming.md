---
title: Theming
layout: docs
description: Apply style presets and color palettes to customize the look and feel of all Kiso components.
---

Kiso ships with two layers of customization that let you make components look
like your own brand without touching individual component calls.

## Style presets

Presets are pre-built Ruby hashes that override `ClassVariants` for all
components at boot time. They change structural styles like border-radius across
every component in one line.

### Applying a preset

```ruby
# config/initializers/kiso.rb
Kiso.configure do |config|
  config.apply_preset(:rounded)
end
```

### Available presets

| Preset | Description |
|--------|-------------|
| `:rounded` | Pill-shaped buttons, fully rounded inputs, more rounded cards and dialogs |
| `:sharp` | No border-radius anywhere -- geometric, brutalist aesthetic |

The default (no preset) uses Kiso's standard border radii: `rounded-md` for
interactive elements, `rounded-xl` for cards, `rounded-lg` for dialogs.

### Per-component overrides on top of presets

Presets populate `config.theme` before overrides are applied, so any
per-component overrides you set **after** `apply_preset` take priority:

```ruby
Kiso.configure do |config|
  config.apply_preset(:rounded)

  # Override just the card -- everything else stays pill-shaped
  config.theme[:card] = { base: "rounded-3xl" }
end
```

Overrides set **before** `apply_preset` are merged with the preset values
(preset wins for conflicting keys).

### Creating your own preset

A preset is a Ruby file in `lib/kiso/presets/` that defines a frozen hash
constant under `Kiso::Presets`. Keys are snake_case component names (matching
`config.theme` keys), values are override hashes.

```ruby
# lib/kiso/presets/brand.rb
module Kiso
  module Presets
    BRAND = {
      button: {
        variants: {
          size: {
            xs: "rounded-lg",
            sm: "rounded-lg",
            md: "rounded-lg",
            lg: "rounded-lg",
            xl: "rounded-lg"
          }
        }
      },
      card: { base: "rounded-2xl shadow-xl" },
      input: { base: "rounded-lg" },
      # ... more components
    }.freeze
  end
end
```

Then apply it:

```ruby
Kiso.configure do |config|
  config.apply_preset(:brand)
end
```

Study the built-in presets in `lib/kiso/presets/` for the full list of
components and their overridable properties.

## Color palettes

Palettes are pure CSS files that redefine Kiso's semantic color tokens using
OKLCH values. They change the entire color scheme without touching Ruby.

### Using a palette

1. Import the palette CSS file in your Tailwind stylesheet:

```css
@import "tailwindcss";
@import "../builds/tailwind/kiso";
@import "kiso/palettes/blue.css";
```

2. Add the `data-palette` attribute to your root element:

```erb
<html data-palette="blue" <%= "class=dark" if dark_mode? %>>
```

### Available palettes

| Palette | Primary color | Neutral base | Description |
|---------|--------------|--------------|-------------|
| `zinc` | Near-black / near-white | Zinc | Cool neutral, monochrome feel |
| `blue` | Vivid blue | Slate | Professional SaaS / enterprise |
| `green` | Forest green | Zinc | Fresh, natural -- health, eco, finance |
| `orange` | Warm orange | Stone | Energetic -- creative, food, community |
| `violet` | Rich purple | Gray | Premium -- design tools, creative brands |

Each palette redefines all of Kiso's semantic tokens:

- `--color-primary` / `--color-primary-foreground`
- `--color-secondary` / `--color-secondary-foreground`
- `--color-background` / `--color-foreground`
- `--color-muted` / `--color-muted-foreground`
- `--color-accent` / `--color-accent-foreground`
- `--color-inverted` / `--color-inverted-foreground`
- `--color-elevated` / `--color-accented`
- `--color-border` / `--color-border-accented`
- `--color-ring`

Dark mode variants are included -- they activate when `.dark` is present on
an ancestor or the same element.

### Creating your own palette

Create a CSS file with `[data-palette="your-name"]` selector and define all
the semantic tokens. Use the built-in palettes as a starting point:

```css
/* app/assets/stylesheets/palettes/brand.css */
[data-palette="brand"] {
  --color-primary: oklch(0.55 0.24 270);
  --color-primary-foreground: oklch(0.98 0.01 270);
  /* ... all other tokens */
}

.dark [data-palette="brand"],
[data-palette="brand"].dark {
  --color-primary: oklch(0.65 0.22 270);
  --color-primary-foreground: oklch(0.98 0.01 270);
  /* ... dark mode values */
}
```

### Combining presets and palettes

Presets and palettes are independent -- use them together for full
customization:

```ruby
# config/initializers/kiso.rb
Kiso.configure do |config|
  config.apply_preset(:rounded)
end
```

```css
/* app/assets/stylesheets/application.tailwind.css */
@import "tailwindcss";
@import "../builds/tailwind/kiso";
@import "kiso/palettes/violet.css";
```

```erb
<html data-palette="violet">
```

This gives you pill-shaped components with a violet color scheme.
