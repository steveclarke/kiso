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

**Critically, Nuxt UI's Icon component outputs a plain SVG with no
Tailwind classes at all:**

```vue
<!-- vendor/nuxt-ui/src/runtime/vue/components/Icon.vue -->
<IconifyIcon v-if="typeof name === 'string'" :icon="name" />
```

The underlying `@iconify/vue` library renders the SVG with
`width="1em" height="1em"` attributes — no CSS framework coupling.

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

## Two-Layer Architecture: Renderer vs Helper

A key design decision: **the icon renderer and the Tailwind helper are
separate layers.** This matters for gem extraction (see issue #20).

### Layer 1: Renderer (framework-agnostic)

`Kiso::Icons::Renderer` outputs a **raw SVG** with no CSS framework
opinion, following the same approach as `@iconify/vue`:

```ruby
# lib/kiso/icons/renderer.rb
attrs = {
  "xmlns"       => "http://www.w3.org/2000/svg",
  "viewBox"     => "0 0 #{width} #{height}",
  "width"       => "1em",
  "height"      => "1em",
  "aria-hidden" => "true",
  "fill"        => "none"
}
```

Output:
```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
     width="1em" height="1em" aria-hidden="true" fill="none">
  <path d="..." stroke="currentColor" stroke-width="2"/>
</svg>
```

The renderer accepts an optional `css_class:` passthrough but adds
nothing itself. This keeps it usable in any Ruby project — Tailwind,
Bootstrap, plain CSS, or no CSS at all.

### Layer 2: `kiso_icon()` Helper (Tailwind-aware)

`Kiso::IconHelper` is the Tailwind wrapper that lives in Kiso. It adds
`shrink-0`, maps size presets to Tailwind classes, and uses TailwindMerge
for class deduplication:

```ruby
# app/helpers/kiso/icon_helper.rb
SIZE_PRESETS = {
  xs: "size-3", sm: "size-4", md: "size-5",
  lg: "size-6", xl: "size-8"
}.freeze

BASE_CLASSES = "shrink-0"
```

This separation means:
- **Gem extraction**: the renderer moves to the standalone gem with zero
  Tailwind dependency. No `@source` configuration needed in host apps.
- **Kiso helper stays**: `kiso_icon()` wraps the gem's renderer and adds
  the Tailwind layer, just like it does today.
- **Non-Tailwind use**: anyone using the gem directly gets a plain SVG
  and handles sizing however they want.

### Why this matters for Tailwind content scanning

Tailwind v4 uses `@source` directives to find class strings. If the
renderer contained Tailwind classes (like `size-5`), host apps would need
to add `@source` pointing into the gem's installed path — fragile and
ugly. By keeping Tailwind classes in the helper (which lives in
`app/helpers/`), they're in a standard location that apps already scan.

## The `kiso_icon()` Helper

The `kiso_icon()` helper defaults to **no size class** so parent components
can control sizing:

```erb
<%# Inside a component — parent CSS handles sizing %>
<%= kui(:button) do %>
  <%= kiso_icon("plus") %>
  Add Item
<% end %>

<%# Standalone — pass explicit size %>
<%= kiso_icon("check", size: :md) %>
```

**Output without size (inside a component):**
```html
<svg class="shrink-0" width="1em" height="1em" viewBox="0 0 24 24" ...>...</svg>
```

**Output with size (standalone):**
```html
<svg class="shrink-0 size-5" width="1em" height="1em" viewBox="0 0 24 24" ...>...</svg>
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
<%= kui(:button, leading_icon: "plus") %>
```

Instead, icons are regular content inside a `yield` block:

```erb
<%= kui(:button) do %>
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

| Layer | What it does | Tailwind dependency |
|-------|-------------|---------------------|
| Renderer (`Kiso::Icons::Renderer`) | Raw SVG with `width="1em" height="1em"` | None |
| Helper (`kiso_icon()`) | Adds `shrink-0`, size presets, TailwindMerge | Yes |
| Parent theme (Button, Alert, etc.) | CSS child selectors for sizing | Yes |
