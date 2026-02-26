---
title: Badge
layout: docs
description: Displays a small label for status, category, or count.
category: Element
source: lib/kiso/themes/badge.rb
---

## Quick Start

```erb
<%%= kiso(:badge) { "New" } %>
```

[Lookbook playground →](/lookbook/inspect/kiso/badge/playground)

## Locals

| Local | Type | Default |
|-------|------|---------|
| `color:` | `:primary` \| `:secondary` \| `:success` \| `:info` \| `:warning` \| `:error` \| `:neutral` | `:primary` |
| `variant:` | `:solid` \| `:outline` \| `:soft` \| `:subtle` | `:soft` |
| `size:` | `:xs` \| `:sm` \| `:md` \| `:lg` \| `:xl` | `:md` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

### Color

Use the `color:` local to change the color of the Badge.

```erb
<%%= kiso(:badge, color: :primary) { "Primary" } %>
<%%= kiso(:badge, color: :secondary) { "Secondary" } %>
<%%= kiso(:badge, color: :success) { "Success" } %>
<%%= kiso(:badge, color: :info) { "Info" } %>
<%%= kiso(:badge, color: :warning) { "Warning" } %>
<%%= kiso(:badge, color: :error) { "Error" } %>
<%%= kiso(:badge, color: :neutral) { "Neutral" } %>
```

### Variant

Use the `variant:` local to change the visual style.

```erb
<%%= kiso(:badge, variant: :solid) { "Solid" } %>
<%%= kiso(:badge, variant: :outline) { "Outline" } %>
<%%= kiso(:badge, variant: :soft) { "Soft" } %>
<%%= kiso(:badge, variant: :subtle) { "Subtle" } %>
```

### Size

Use the `size:` local to change the size.

```erb
<%%= kiso(:badge, size: :xs) { "XS" } %>
<%%= kiso(:badge, size: :sm) { "SM" } %>
<%%= kiso(:badge, size: :md) { "MD" } %>
<%%= kiso(:badge, size: :lg) { "LG" } %>
<%%= kiso(:badge, size: :xl) { "XL" } %>
```

## Examples

### With Inline Icon

Drop an SVG inside the yield block. The badge's `gap` and `items-center`
handle spacing automatically.

```erb
<%%= kiso(:badge, color: :success, variant: :solid) do %>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-3">
    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
  </svg>
  Active
<%% end %>
```

### Custom Classes

Use `css_classes:` to override styles. TailwindMerge resolves conflicts.

```erb
<%%= kiso(:badge, css_classes: "rounded-md px-3") { "Squared" } %>
```

### With Component Options

Pass HTML attributes via `**component_options` for data attributes, ARIA, etc.

```erb
<%%= kiso(:badge, color: :error, data: { count: 5 }) { "5" } %>
```

## Theme

```ruby
# lib/kiso/themes/badge.rb
Kiso::Themes::Badge = ClassVariants.build(
  base: "inline-flex items-center justify-center font-medium
         whitespace-nowrap shrink-0 overflow-hidden
         transition-[color,box-shadow]
         [&>svg]:pointer-events-none [&>svg]:shrink-0
         focus-visible:outline-2 focus-visible:outline-offset-2
         focus-visible:outline-ring",
  variants: {
    variant: {
      solid: "",
      outline: "ring ring-inset",
      soft: "",
      subtle: "ring ring-inset"
    },
    size: {
      xs: "px-2 py-0.5 text-xs rounded-full gap-1 [&>svg]:size-3",
      sm: "px-2.5 py-0.5 text-xs rounded-full gap-1 [&>svg]:size-3",
      md: "px-3 py-1 text-xs rounded-full gap-1.5 [&>svg]:size-3.5",
      lg: "px-3.5 py-1 text-sm rounded-full gap-1.5 [&>svg]:size-4",
      xl: "px-4 py-1.5 text-sm rounded-full gap-2 [&>svg]:size-4"
    },
    color: COLORS.index_with { "" }
  },
  compound_variants: [
    # See project/DESIGN_SYSTEM.md for the full formula table.
    # All colored components use identical compound variants.
  ],
  defaults: { color: :primary, variant: :soft, size: :md }
)
```

### Compound Variant Formulas

| Variant | Colored | Neutral |
|---------|---------|---------|
| solid | `bg-{color} text-{color}-foreground` | `bg-inverted text-inverted-foreground` |
| outline | `text-{color} ring-{color}/50` | `text-foreground bg-background ring-accented` |
| soft | `bg-{color}/10 text-{color}` | `text-foreground bg-elevated` |
| subtle | `bg-{color}/10 text-{color} ring-{color}/25` | `text-foreground bg-elevated ring-accented` |

## Accessibility

| Attribute | Value |
|-----------|-------|
| `data-component` | `"badge"` |

Badges are decorative by default. If a badge conveys meaningful status,
add `aria-label:` via component options:

```erb
<%%= kiso(:badge, color: :error, "aria-label": "3 unread messages") { "3" } %>
```
