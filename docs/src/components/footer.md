---
title: Footer
layout: docs
description: Site or application footer for secondary navigation and legal text.
category: Layout
source: lib/kiso/themes/layout.rb
---

## Quick Start

```erb
<%%= kui(:footer) do %>
  <%%= kui(:container) do %>
    <p class="text-sm text-muted-foreground">&copy; 2026</p>
  <%% end %>
<%% end %>
```

<%= render "component_preview", component: "kiso/layout/footer", scenario: "playground" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

Footer renders a semantic `<footer>` element. It has no default styling
beyond the element itself, giving you full control over borders, padding,
and background via `css_classes:` or inner elements.

```erb
<%%= kui(:footer) do %>
  <%%= kui(:container) do %>
    <div class="flex items-center justify-between py-8 border-t border-border">
      <p class="text-sm text-muted-foreground">&copy; 2026 My Company</p>
      <nav class="flex items-center gap-4 text-sm text-muted-foreground">
        <a href="/privacy" class="hover:text-foreground">Privacy</a>
        <a href="/terms" class="hover:text-foreground">Terms</a>
      </nav>
    </div>
  <%% end %>
<%% end %>
```

## Theme

```ruby
# lib/kiso/themes/layout.rb
Kiso::Themes::Footer = ClassVariants.build(
  base: ""
)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| `data-slot` | `"footer"` |
| Element | `<footer>` (landmark) |

The `<footer>` element creates a `contentinfo` landmark when used as a direct
child of `<body>` or your App wrapper. Screen readers use it for navigation.
