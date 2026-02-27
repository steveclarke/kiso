---
title: Badge
layout: docs
description: Displays a small label for status, category, or count.
category: Element
source: lib/kiso/themes/badge.rb
---

## Quick Start

```erb
<%%= kui(:badge) { "New" } %>
```

<%= render "component_preview", component: "kiso/badge", scenario: "playground", height: "300px" %>

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
<%%= kui(:badge, color: :primary) { "Primary" } %>
<%%= kui(:badge, color: :secondary) { "Secondary" } %>
<%%= kui(:badge, color: :success) { "Success" } %>
<%%= kui(:badge, color: :info) { "Info" } %>
<%%= kui(:badge, color: :warning) { "Warning" } %>
<%%= kui(:badge, color: :error) { "Error" } %>
<%%= kui(:badge, color: :neutral) { "Neutral" } %>
```

### Variant

Use the `variant:` local to change the visual style.

```erb
<%%= kui(:badge, variant: :solid) { "Solid" } %>
<%%= kui(:badge, variant: :outline) { "Outline" } %>
<%%= kui(:badge, variant: :soft) { "Soft" } %>
<%%= kui(:badge, variant: :subtle) { "Subtle" } %>
```

### Size

Use the `size:` local to change the size.

```erb
<%%= kui(:badge, size: :xs) { "XS" } %>
<%%= kui(:badge, size: :sm) { "SM" } %>
<%%= kui(:badge, size: :md) { "MD" } %>
<%%= kui(:badge, size: :lg) { "LG" } %>
<%%= kui(:badge, size: :xl) { "XL" } %>
```

## Examples

### With Inline Icon

Drop an SVG inside the yield block. The badge's `gap` and `items-center`
handle spacing automatically.

```erb
<%%= kui(:badge, color: :success, variant: :solid) do %>
  <%%= kiso_icon("check") %>
  Active
<%% end %>
```

### Custom Classes

Use `css_classes:` to override styles. TailwindMerge resolves conflicts.

```erb
<%%= kui(:badge, css_classes: "rounded-md px-3") { "Squared" } %>
```

### With Component Options

Pass HTML attributes via `**component_options` for data attributes, ARIA, etc.

```erb
<%%= kui(:badge, color: :error, data: { count: 5 }) { "5" } %>
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
| `data-slot` | `"badge"` |

Badges are decorative by default. If a badge conveys meaningful status,
add `aria-label:` via component options:

```erb
<%%= kui(:badge, color: :error, "aria-label": "3 unread messages") { "3" } %>
```
