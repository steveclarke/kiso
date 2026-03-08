---
title: Container
layout: docs
description: Content containment with consistent max-width and responsive padding.
category: Layout
source: lib/kiso/themes/layout.rb
---

## Quick Start

```erb
<%%= kui(:container) do %>
  <p>Centered content with responsive padding.</p>
<%% end %>
```

<%= render "component_preview", component: "kiso/layout/container", scenario: "playground" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `size:` | `:narrow` \| `:default` \| `:wide` \| `:full` | `:default` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

### Size

Use the `size:` local to control the max-width.

```erb
<%%= kui(:container, size: :narrow) do %>
  <p>Narrow container (max-w-3xl)</p>
<%% end %>

<%%= kui(:container) do %>
  <p>Default container (max-w-7xl)</p>
<%% end %>

<%%= kui(:container, size: :wide) do %>
  <p>Wide container (max-w-screen-2xl)</p>
<%% end %>

<%%= kui(:container, size: :full) do %>
  <p>Full-width container (max-w-full)</p>
<%% end %>
```

<%= render "component_preview", component: "kiso/layout/container", scenario: "sizes" %>

## Examples

### Inside Header

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

### Narrow for Prose

```erb
<%%= kui(:container, size: :narrow) do %>
  <article class="prose">
    <h1>Blog Post Title</h1>
    <p>Long-form content benefits from a narrow container.</p>
  </article>
<%% end %>
```

## Theme

```ruby
# lib/kiso/themes/layout.rb
Kiso::Themes::Container = ClassVariants.build(
  base: "mx-auto w-full px-4 sm:px-6 lg:px-8",
  variants: {
    size: {
      narrow: "max-w-3xl",
      default: "max-w-7xl",
      wide: "max-w-screen-2xl",
      full: "max-w-full"
    }
  },
  defaults: { size: :default }
)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| `data-slot` | `"container"` |

Container renders a `<div>`. It is purely structural with no semantic role.
