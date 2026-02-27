---
title: Alert
layout: docs
description: Contextual feedback message with optional icon, title, and description.
category: Element
source: lib/kiso/themes/alert.rb
---

## Quick Start

```erb
<%%= kui(:alert) do %>
  <%%= kui(:alert, :title) { "Heads up!" } %>
  <%%= kui(:alert, :description) { "You can add components using the CLI." } %>
<%% end %>
```

<%= render "component_preview", component: "kiso/alert", scenario: "playground", height: "300px" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `color:` | `:primary` \| `:secondary` \| `:success` \| `:info` \| `:warning` \| `:error` \| `:neutral` | `:primary` |
| `variant:` | `:solid` \| `:outline` \| `:soft` \| `:subtle` | `:soft` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Anatomy

The Alert uses CSS Grid layout. When an SVG icon is a direct child, the grid
automatically creates a two-column layout (icon + content). Without an icon,
content spans the full width.

```erb
<%%= kui(:alert, color: :info) do %>
  <svg>...</svg>
  <%%= kui(:alert, :title) { "Title text" } %>
  <%%= kui(:alert, :description) { "Description text." } %>
<%% end %>
```

### Sub-parts

| Part | Rendered via | Description |
|------|-------------|-------------|
| `:title` | `kui(:alert, :title)` | Bold heading with `tracking-tight`. Inherits parent text color. |
| `:description` | `kui(:alert, :description)` | Supporting text at `opacity-90`. |

## Usage

### Color

```erb
<%%= kui(:alert, color: :primary) do %>
  <%%= kui(:alert, :title) { "Primary" } %>
  <%%= kui(:alert, :description) { "This is a primary alert." } %>
<%% end %>
```

### Variant

```erb
<%%= kui(:alert, variant: :solid) do %>...<%% end %>
<%%= kui(:alert, variant: :outline) do %>...<%% end %>
<%%= kui(:alert, variant: :soft) do %>...<%% end %>
<%%= kui(:alert, variant: :subtle) do %>...<%% end %>
```

### With Icon

Place an SVG as a direct child of the alert. The grid handles sizing
(`size-4`) and alignment (`translate-y-0.5`) automatically — no extra classes
needed on the SVG.

```erb
<%%= kui(:alert, color: :error, variant: :soft) do %>
  <%%= kiso_icon("circle-alert") %>
  <%%= kui(:alert, :title) { "Error" } %>
  <%%= kui(:alert, :description) { "Something went wrong." } %>
<%% end %>
```

### Title Only

```erb
<%%= kui(:alert, color: :warning) do %>
  <%%= kui(:alert, :title) { "Your trial expires in 3 days." } %>
<%% end %>
```

## Examples

### Custom Classes

```erb
<%%= kui(:alert, css_classes: "max-w-md") do %>
  <%%= kui(:alert, :title) { "Constrained width" } %>
<%% end %>
```

## Theme

```ruby
# lib/kiso/themes/alert.rb
Kiso::Themes::Alert = ClassVariants.build(
  base: "relative w-full rounded-lg px-4 py-3 text-sm
         grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr]
         grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start
         [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  variants: {
    variant: { solid: "", outline: "ring ring-inset", soft: "", subtle: "ring ring-inset" },
    color: COLORS.index_with { "" }
  },
  compound_variants: [
    # Same formulas as Badge — see project/DESIGN_SYSTEM.md
  ],
  defaults: { color: :primary, variant: :soft }
)

Kiso::Themes::AlertTitle = ClassVariants.build(
  base: "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight"
)
Kiso::Themes::AlertDescription = ClassVariants.build(
  base: "col-start-2 grid justify-items-start gap-1 text-sm opacity-90 [&_p]:leading-relaxed"
)
```

**Note:** Description uses `opacity-90` (relative to parent text color), not
`text-muted-foreground`. This ensures readability on colored backgrounds.

## Accessibility

| Attribute | Value |
|-----------|-------|
| `role` | `alert` |
| `data-component` | `"alert"` |

The `role="alert"` attribute is set automatically. Screen readers will
announce alert content when it appears.
