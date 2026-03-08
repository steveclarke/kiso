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

## Custom brand colors

The most common customization: change the primary (or any brand) color to
match your product. No Ruby config needed -- just CSS.

### Define a shade scale

If you have a full color scale (from a design tool, Tailwind palette generator,
or your brand guidelines), define it in your Tailwind stylesheet:

```css
/* app/assets/tailwind/application.css */
@theme {
  --color-primary-50:  oklch(0.98 0.01 242);
  --color-primary-100: oklch(0.95 0.02 235);
  --color-primary-200: oklch(0.90 0.04 234);
  --color-primary-300: oklch(0.82 0.06 233);
  --color-primary-400: oklch(0.71 0.09 230);
  --color-primary-500: oklch(0.55 0.10 237);
  --color-primary-600: oklch(0.49 0.10 239);
  --color-primary-700: oklch(0.43 0.09 241);
  --color-primary-800: oklch(0.37 0.07 242);
  --color-primary-900: oklch(0.32 0.06 243);
  --color-primary-950: oklch(0.28 0.04 243);
}
```

That's it. Kiso automatically picks **shade 500** for light mode and
**shade 400** for dark mode. Foreground text uses **shade 50** (light) and
**shade 950** (dark) for accessible contrast. All Kiso components -- buttons,
badges, alerts, inputs -- use your color immediately.

You also get all the Tailwind utilities (`bg-primary-200`, `text-primary-700`,
etc.) for use in your own views.

This works for any brand color token: `primary`, `secondary`, `success`,
`info`, `warning`, `error`.

### Override the semantic token directly

If you just want to set a single color value without a full shade scale:

```css
@theme {
  --color-primary: oklch(0.55 0.10 237);
  --color-primary-foreground: white;
}
```

For dark mode, override in the `.dark` selector:

```css
.dark {
  --color-primary: oklch(0.71 0.09 230);
  --color-primary-foreground: oklch(0.28 0.04 243);
}
```

### How auto-wiring works

Kiso's semantic tokens use CSS `var()` fallbacks to connect shade scales to
components:

```css
/* What Kiso sets internally */
--color-primary: var(--color-primary-500, var(--color-rose-500));
```

If you define `--color-primary-500`, it takes precedence. If you don't,
the default (rose) is used. If you set `--color-primary` directly, that
overrides everything -- the `var()` chain is bypassed entirely.

| Shade | Used for |
|-------|----------|
| 50 | Foreground text on solid backgrounds (light mode) |
| 400 | Background color (dark mode) |
| 500 | Background color (light mode) |
| 950 | Foreground text on solid backgrounds (dark mode) |

## Color palettes

Palettes are pure CSS files that redefine Kiso's semantic color tokens using
OKLCH values. They change the entire color scheme without touching Ruby.

### Using a palette

1. Import the palette CSS file in your Tailwind stylesheet:

```css
@import "tailwindcss";
@import "../builds/tailwind/kiso";
@import "../builds/tailwind/kiso/palettes/blue.css";
```

2. Add the `data-palette` attribute to your root element:

```erb
<html data-palette="blue" <%%= "class=dark" if dark_mode? %>>
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
@import "../builds/tailwind/kiso/palettes/violet.css";
```

```erb
<html data-palette="violet">
```

This gives you pill-shaped components with a violet color scheme.
