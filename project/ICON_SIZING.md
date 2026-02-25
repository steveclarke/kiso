# Icon Sizing in Components

How Kiso handles icon sizing inside components, and how the reference
frameworks (Nuxt UI, shadcn/ui) solve the same problem with different
component models.

## The Problem

Icons need different sizes depending on context: a button's icon should
scale with the button size, an alert icon is fixed, a standalone icon
uses a developer-chosen size. Who owns the sizing — the icon or the
parent component?

## The Answer: Parent Owns Sizing

All three frameworks agree: **the parent component controls icon size,
not the icon itself.** The icon renders with no default size; the parent
applies the appropriate size based on its own size variant.

## How Each Framework Does It

### Nuxt UI (Vue — named slots)

Nuxt UI uses a **slot-based** system. The Button theme has `leadingIcon`
and `trailingIcon` slots, each with per-size classes:

```ts
// vendor/nuxt-ui/src/theme/button.ts
slots: {
  leadingIcon: 'shrink-0',   // base: no size
  trailingIcon: 'shrink-0'
},
size: {
  xs: { leadingIcon: 'size-4', trailingIcon: 'size-4' },
  sm: { leadingIcon: 'size-4', trailingIcon: 'size-4' },
  md: { leadingIcon: 'size-5', trailingIcon: 'size-5' },
  lg: { leadingIcon: 'size-5', trailingIcon: 'size-5' },
  xl: { leadingIcon: 'size-6', trailingIcon: 'size-6' }
}
```

The Button Vue component renders the Icon into the slot and applies the
slot's classes directly. The Icon component itself has no size.

Alert is similar — the `icon` slot is fixed at `'shrink-0 size-5'`:

```ts
// vendor/nuxt-ui/src/theme/alert.ts
slots: {
  icon: 'shrink-0 size-5'
}
```

### shadcn/ui (React — CSS child selectors)

shadcn can't use slots (React doesn't have them), so it uses **Tailwind
CSS child selectors** on the parent. This is the same technique Kiso uses:

```tsx
// vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/button.tsx
const buttonVariants = cva(
  "... [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ...",
  {
    variants: {
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "... [&_svg:not([class*='size-'])]:size-3",
        sm: "...",
        lg: "...",
      }
    }
  }
)
```

The key selector: `[&_svg:not([class*='size-'])]:size-4`

- Targets any `<svg>` descendant
- Only applies when the SVG **doesn't** already have a `size-*` class
- Lets users override by passing an explicit size class on the icon

### Kiso (ERB partials — CSS child selectors, same as shadcn)

Kiso uses ERB partials with `yield`, not Vue slots or React component
props. Like shadcn, we use CSS child selectors on the parent theme:

```ruby
# lib/kiso/themes/button.rb
base: "... [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"

size: {
  xs: "... [&_svg:not([class*='size-'])]:size-3",
  xl: "... [&_svg:not([class*='size-'])]:size-5"
}
```

```ruby
# lib/kiso/themes/alert.rb
base: "... [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current"
```

```ruby
# lib/kiso/themes/badge.rb (per-size)
size: {
  xs: "... [&>svg]:size-2.5",
  sm: "... [&>svg]:size-3",
  md: "... [&>svg]:size-3",
  lg: "... [&>svg]:size-3.5",
  xl: "... [&>svg]:size-4"
}
```

## The `kiso_icon()` Helper

The `kiso_icon()` helper defaults to **no size class** so parent components
can control sizing:

```erb
<%# Inside a component — parent CSS handles sizing %>
<%= kiso(:button) do %>
  <%= kiso_icon("plus") %>
  Add Item
<% end %>

<%# Standalone — pass explicit size %>
<%= kiso_icon("check", size: :md) %>
```

**Output without size:**
```html
<svg class="shrink-0" viewBox="0 0 24 24" ...>...</svg>
```

**Output with size:**
```html
<svg class="shrink-0 size-5" viewBox="0 0 24 24" ...>...</svg>
```

### Size presets

| Preset | Class | px |
|--------|-------|-----|
| `:xs`  | `size-3` | 12 |
| `:sm`  | `size-4` | 16 |
| `:md`  | `size-5` | 20 |
| `:lg`  | `size-6` | 24 |
| `:xl`  | `size-8` | 32 |

## Why CSS Selectors Instead of Props

ERB partials with `yield` don't support named slots. We can't do:

```erb
<%# This doesn't exist in ERB %>
<%= kiso(:button, leading_icon: "plus") %>
```

Instead, icons are regular content inside a `yield` block:

```erb
<%= kiso(:button) do %>
  <%= kiso_icon("plus") %>
  Add Item
<% end %>
```

The Button partial doesn't know an icon is there — it just yields the
block. CSS selectors (`[&_svg]`, `has-[>svg]`) let the theme respond
to the icon's presence without any Ruby-level awareness. This gives us:

- **No wrapper divs** — the icon is a plain `<svg>` inside the component
- **Automatic sizing** — parent CSS matches the SVG and sizes it
- **Automatic padding** — `has-[>svg]:px-3` tightens button padding when
  an icon is present
- **Override escape hatch** — pass `class: "size-8"` on the icon to
  bypass parent auto-sizing (the `:not([class*='size-'])` guard skips it)

## Summary

| Framework | Component model | Icon sizing mechanism |
|-----------|----------------|----------------------|
| Nuxt UI   | Vue slots      | Slot classes set by parent theme per size variant |
| shadcn/ui | React props    | CSS child selectors: `[&_svg:not([class*='size-'])]:size-4` |
| Kiso      | ERB yield      | CSS child selectors (same as shadcn) |

All three: **parent owns icon sizing. Icon has no default size.**
