---
title: Main
layout: docs
description: Primary content area wrapper that fills remaining vertical space.
category: Layout
source: lib/kiso/themes/layout.rb
---

## Quick Start

```erb
<%%= kui(:main) do %>
  <%%= kui(:container) do %>
    <%%= yield %>
  <%% end %>
<%% end %>
```

<%= render "component_preview", component: "kiso/layout/main", scenario: "playground", height: "320px" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

Main renders a semantic `<main>` element with `flex-1` so it fills remaining
vertical space between the header and footer when the parent uses `flex flex-col`.

```erb
<%%= kui(:app, css_classes: "flex flex-col min-h-dvh") do %>
  <%%= kui(:header) do %>
    ...
  <%% end %>
  <%%= kui(:main) do %>
    <%%= kui(:container) do %>
      <%%= yield %>
    <%% end %>
  <%% end %>
  <%%= kui(:footer) do %>
    ...
  <%% end %>
<%% end %>
```

## Theme

```ruby
# lib/kiso/themes/layout.rb
Kiso::Themes::Main = ClassVariants.build(
  base: "flex-1"
)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| `data-slot` | `"main"` |
| Element | `<main>` (landmark) |

The `<main>` element creates a `main` landmark. There should be only one
`<main>` per page. Screen readers use it to skip directly to primary content.
