---
title: Header
layout: docs
description: Site or application header with sticky positioning and backdrop blur.
category: Layout
source: lib/kiso/themes/layout.rb
---

## Quick Start

```erb
<%%= kui(:header) do %>
  <%%= kui(:container) do %>
    <div class="flex items-center justify-between h-16">
      <span class="font-semibold">My Site</span>
      <nav>...</nav>
    </div>
  <%% end %>
<%% end %>
```

<%= render "component_preview", component: "kiso/layout/header", scenario: "playground", height: "320px" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

Header renders a semantic `<header>` element with sticky positioning,
background blur, and a bottom border. Compose it with Container for
consistent horizontal padding.

```erb
<%%= kui(:header) do %>
  <%%= kui(:container) do %>
    <div class="flex items-center justify-between h-16">
      <a href="/" class="font-semibold">Brand</a>
      <nav class="flex items-center gap-4 text-sm">
        <a href="/docs">Docs</a>
        <a href="/blog">Blog</a>
        <%%= kui(:button, size: :sm) { "Sign in" } %>
      </nav>
    </div>
  <%% end %>
<%% end %>
```

### Non-sticky

Override sticky positioning with `css_classes:`.

```erb
<%%= kui(:header, css_classes: "static") do %>
  ...
<%% end %>
```

## Theme

```ruby
# lib/kiso/themes/layout.rb
Kiso::Themes::Header = ClassVariants.build(
  base: "bg-background/75 backdrop-blur border-b border-border sticky top-0 z-50"
)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| `data-slot` | `"header"` |
| Element | `<header>` (landmark) |

The `<header>` element creates a `banner` landmark when used as a direct
child of `<body>` or your App wrapper. Screen readers use it for navigation.
