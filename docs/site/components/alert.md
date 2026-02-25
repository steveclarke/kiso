---
title: Alert
description: Contextual feedback message with optional icon, title, and description.
category: Element
source: lib/kiso/themes/alert.rb
---

# Alert

Contextual feedback message with optional icon, title, and description.

## Quick Start

```erb
<%= kiso(:alert) do %>
  <div class="flex-1">
    <%= kiso(:alert, :title) { "Heads up!" } %>
    <%= kiso(:alert, :description) { "You can add components using the CLI." } %>
  </div>
<% end %>
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

The Alert root is a flex container with `gap-2.5`. Place an icon before the
content wrapper, and use sub-parts for title and description.

```erb
<%= kiso(:alert, color: :info) do %>
  <svg class="size-5 shrink-0 mt-0.5">...</svg>
  <div class="flex-1">
    <%= kiso(:alert, :title) { "Title text" } %>
    <%= kiso(:alert, :description) { "Description text." } %>
  </div>
<% end %>
```

### Sub-parts

| Part | Rendered via | Description |
|------|-------------|-------------|
| `:title` | `kiso(:alert, :title)` | Bold heading. Inherits parent text color. |
| `:description` | `kiso(:alert, :description)` | Supporting text at `opacity-90`. |

## Usage

### Color

```erb
<%= kiso(:alert, color: :primary) do %>
  <div class="flex-1">
    <%= kiso(:alert, :title) { "Primary" } %>
    <%= kiso(:alert, :description) { "This is a primary alert." } %>
  </div>
<% end %>
```

### Variant

```erb
<%= kiso(:alert, variant: :solid) do %>...<%end%>
<%= kiso(:alert, variant: :outline) do %>...<%end%>
<%= kiso(:alert, variant: :soft) do %>...<%end%>
<%= kiso(:alert, variant: :subtle) do %>...<%end%>
```

### With Icon

Place an SVG before the content wrapper. Use `size-5 shrink-0 mt-0.5` for
consistent alignment.

```erb
<%= kiso(:alert, color: :error, variant: :soft) do %>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
       fill="currentColor" class="size-5 shrink-0 mt-0.5">
    <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 ..." clip-rule="evenodd" />
  </svg>
  <div class="flex-1">
    <%= kiso(:alert, :title) { "Error" } %>
    <%= kiso(:alert, :description) { "Something went wrong." } %>
  </div>
<% end %>
```

### Title Only

```erb
<%= kiso(:alert, color: :warning) do %>
  <div class="flex-1">
    <%= kiso(:alert, :title) { "Your trial expires in 3 days." } %>
  </div>
<% end %>
```

## Examples

### Custom Classes

```erb
<%= kiso(:alert, css_classes: "max-w-md") do %>
  <div class="flex-1">
    <%= kiso(:alert, :title) { "Constrained width" } %>
  </div>
<% end %>
```

## Theme

```ruby
# lib/kiso/themes/alert.rb
Kiso::Themes::Alert = ClassVariants.build(
  base: "relative w-full rounded-lg p-4 flex gap-2.5 text-sm",
  variants: {
    variant: { solid: "", outline: "ring ring-inset", soft: "", subtle: "ring ring-inset" },
    color: COLORS.index_with { "" }
  },
  compound_variants: [
    # Same formulas as Badge — see docs/DESIGN_SYSTEM.md
  ],
  defaults: { color: :primary, variant: :soft }
)

Kiso::Themes::AlertTitle = ClassVariants.build(base: "font-medium leading-snug")
Kiso::Themes::AlertDescription = ClassVariants.build(base: "opacity-90 [&_p]:leading-relaxed")
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
