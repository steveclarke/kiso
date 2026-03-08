---
title: App
layout: docs
description: Root application wrapper that provides base structure and dark mode text inheritance.
category: Layout
source: lib/kiso/themes/layout.rb
---

## Quick Start

```erb
<%%= kui(:app) do %>
  <%%= yield %>
<%% end %>
```

<%= render "component_preview", component: "kiso/layout/app", scenario: "playground" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

Wrap your application content in `kui(:app)` to set `bg-background`,
`text-foreground`, and `antialiased` on the root wrapper. This ensures text
colors inherit correctly in dark mode.

```erb
<%%= kui(:app) do %>
  <%%= kui(:header) do %>
    <%%= kui(:container) do %>
      <nav>...</nav>
    <%% end %>
  <%% end %>
  <%%= kui(:main) do %>
    <%%= kui(:container) do %>
      <%%= yield %>
    <%% end %>
  <%% end %>
  <%%= kui(:footer) do %>
    <%%= kui(:container) do %>
      <p>&copy; 2026</p>
    <%% end %>
  <%% end %>
<%% end %>
```

## Theme

```ruby
# lib/kiso/themes/layout.rb
Kiso::Themes::App = ClassVariants.build(
  base: "bg-background text-foreground antialiased"
)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| `data-slot` | `"app"` |

App renders a `<div>`. It is purely structural with no semantic role.
