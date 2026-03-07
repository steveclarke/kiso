---
title: Alert
layout: docs
description: Contextual feedback message with optional icon, title, description, actions, and close button.
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
| `icon:` | `String` \| `nil` | `nil` |
| `color:` | `:primary` \| `:secondary` \| `:success` \| `:info` \| `:warning` \| `:error` \| `:neutral` | `:primary` |
| `variant:` | `:solid` \| `:outline` \| `:soft` \| `:subtle` | `:soft` |
| `close:` | `Boolean` | `false` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Anatomy

The Alert uses flexbox layout. An optional icon sits before the content
wrapper, and an optional close button sits after it.

```erb
<%%= kui(:alert, icon: "info", close: true) do %>
  <%%= kui(:alert, :title) { "Title text" } %>
  <%%= kui(:alert, :description) { "Description text." } %>
  <%%= kui(:alert, :actions) do %>
    <%%= kui(:button, size: :xs, color: :neutral) { "Action" } %>
  <%% end %>
<%% end %>
```

### Sub-parts

| Part | Rendered via | Description |
|------|-------------|-------------|
| `:title` | `kui(:alert, :title)` | Bold heading with `tracking-tight`. Inherits parent text color. |
| `:description` | `kui(:alert, :description)` | Supporting text (inherits parent color). |
| `:actions` | `kui(:alert, :actions)` | Flex container for action buttons. |

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

Pass an icon name string to the `icon:` prop. The alert handles sizing and
positioning automatically.

```erb
<%%= kui(:alert, color: :error, variant: :soft, icon: "circle-alert") do %>
  <%%= kui(:alert, :title) { "Error" } %>
  <%%= kui(:alert, :description) { "Something went wrong." } %>
<%% end %>
```

### Dismissible

Set `close: true` to render a close button. Clicking it removes the alert
from the DOM and dispatches a `kiso--alert:close` event.

```erb
<%%= kui(:alert, color: :info, close: true) do %>
  <%%= kui(:alert, :title) { "Heads up!" } %>
  <%%= kui(:alert, :description) { "You can dismiss this alert." } %>
<%% end %>
```

The close event is cancelable — call `event.preventDefault()` in a listener
to keep the alert visible.

### With Actions

Use `kui(:alert, :actions)` to add action buttons below the description.

```erb
<%%= kui(:alert, color: :error, variant: :outline, icon: "circle-x", close: true) do %>
  <%%= kui(:alert, :title) { "Deployment failed" } %>
  <%%= kui(:alert, :description) { "The build process exited with code 1." } %>
  <%%= kui(:alert, :actions) do %>
    <%%= kui(:button, size: :xs, color: :neutral) { "Retry" } %>
    <%%= kui(:button, size: :xs, color: :neutral, variant: :outline) { "View logs" } %>
  <%% end %>
<%% end %>
```

### Title Only

```erb
<%%= kui(:alert, color: :warning) do %>
  <%%= kui(:alert, :title) { "Your trial expires in 3 days." } %>
<%% end %>
```

## Theme

```ruby
# lib/kiso/themes/alert.rb
Kiso::Themes::Alert = ClassVariants.build(
  base: "relative overflow-hidden w-full rounded-lg p-4 flex gap-2.5 text-sm",
  variants: {
    variant: { solid: "", outline: "ring ring-inset", soft: "", subtle: "ring ring-inset" },
    color: COLORS.index_with { "" }
  },
  compound_variants: [
    # Same formulas as Badge — see project/design-system.md
  ],
  defaults: { color: :primary, variant: :soft }
)

Kiso::Themes::AlertWrapper = ClassVariants.build(
  base: "min-w-0 flex-1 flex flex-col"
)
Kiso::Themes::AlertTitle = ClassVariants.build(
  base: "line-clamp-1 min-h-4 font-medium tracking-tight"
)
Kiso::Themes::AlertDescription = ClassVariants.build(
  base: "mt-1 first:mt-0 space-y-1 text-sm [&_p]:leading-relaxed"
)
Kiso::Themes::AlertActions = ClassVariants.build(
  base: "flex flex-wrap gap-1.5 shrink-0 mt-2.5"
)
Kiso::Themes::AlertClose = ClassVariants.build(
  base: "shrink-0 -m-0.5 p-0.5 rounded-md opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
)
```

**Note:** Description inherits the parent text color. Never use
`text-muted-foreground` inside colored components — it's an absolute color
that becomes unreadable on colored backgrounds.

## Accessibility

| Attribute | Value |
|-----------|-------|
| `role` | `alert` |
| `data-slot` | `"alert"` |
| Close button `aria-label` | `"Dismiss"` |

The `role="alert"` attribute is set automatically. Screen readers will
announce alert content when it appears. The close button includes an
`aria-label` for screen reader users.
