---
title: Alert
layout: docs
description: Contextual feedback message with optional icon, title, and description.
category: Element
source: lib/kiso/themes/alert.rb
---

## Quick Start

```erb
<%%= kiso(:alert) do %>
  <%%= kiso(:alert, :title) { "Heads up!" } %>
  <%%= kiso(:alert, :description) { "You can add components using the CLI." } %>
<%% end %>
```

[Lookbook playground →](/lookbook/inspect/kiso/alert/playground)

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
<%%= kiso(:alert, color: :info) do %>
  <svg>...</svg>
  <%%= kiso(:alert, :title) { "Title text" } %>
  <%%= kiso(:alert, :description) { "Description text." } %>
<%% end %>
```

### Sub-parts

| Part | Rendered via | Description |
|------|-------------|-------------|
| `:title` | `kiso(:alert, :title)` | Bold heading with `tracking-tight`. Inherits parent text color. |
| `:description` | `kiso(:alert, :description)` | Supporting text at `opacity-90`. |

## Usage

### Color

```erb
<%%= kiso(:alert, color: :primary) do %>
  <%%= kiso(:alert, :title) { "Primary" } %>
  <%%= kiso(:alert, :description) { "This is a primary alert." } %>
<%% end %>
```

### Variant

```erb
<%%= kiso(:alert, variant: :solid) do %>...<%% end %>
<%%= kiso(:alert, variant: :outline) do %>...<%% end %>
<%%= kiso(:alert, variant: :soft) do %>...<%% end %>
<%%= kiso(:alert, variant: :subtle) do %>...<%% end %>
```

### With Icon

Place an SVG as a direct child of the alert. The grid handles sizing
(`size-4`) and alignment (`translate-y-0.5`) automatically — no extra classes
needed on the SVG.

```erb
<%%= kiso(:alert, color: :error, variant: :soft) do %>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
       fill="currentColor">
    <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 ..." clip-rule="evenodd" />
  </svg>
  <%%= kiso(:alert, :title) { "Error" } %>
  <%%= kiso(:alert, :description) { "Something went wrong." } %>
<%% end %>
```

### Title Only

```erb
<%%= kiso(:alert, color: :warning) do %>
  <%%= kiso(:alert, :title) { "Your trial expires in 3 days." } %>
<%% end %>
```

## Examples

### Custom Classes

```erb
<%%= kiso(:alert, css_classes: "max-w-md") do %>
  <%%= kiso(:alert, :title) { "Constrained width" } %>
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
