---
title: Separator
layout: docs
description: A visual divider between content sections or items.
category: Layout
source: lib/kiso/themes/separator.rb
---

## Quick Start

```erb
<%%= kui(:separator) %>
```

<%= render "component_preview", component: "kiso/separator", scenario: "playground", height: "250px" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `orientation:` | `:horizontal` \| `:vertical` | `:horizontal` |
| `decorative:` | `Boolean` | `true` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

### Horizontal

The default orientation. Add spacing with `css_classes:`.

```erb
<div class="space-y-1">
  <h4 class="text-sm font-medium leading-none">Kiso Components</h4>
  <p class="text-sm text-muted-foreground">A UI component library for Rails.</p>
</div>
<%%= kui(:separator, css_classes: "my-4") %>
<div class="space-y-1">
  <h4 class="text-sm font-medium leading-none">Built with Tailwind</h4>
  <p class="text-sm text-muted-foreground">Semantic tokens, dark mode, no @@apply.</p>
</div>
```

### Vertical

Use `orientation: :vertical` for inline dividers. The parent element needs
a fixed height and flex layout.

```erb
<div class="flex h-5 items-center space-x-4 text-sm">
  <div>Blog</div>
  <%%= kui(:separator, orientation: :vertical) %>
  <div>Docs</div>
  <%%= kui(:separator, orientation: :vertical) %>
  <div>Source</div>
</div>
```

## Examples

### Between Cards

```erb
<%%= kui(:card) do %>
  <%%= kui(:card, :content) { "First card" } %>
<%% end %>
<%%= kui(:separator, css_classes: "my-6") %>
<%%= kui(:card) do %>
  <%%= kui(:card, :content) { "Second card" } %>
<%% end %>
```

### Custom Classes

Use `css_classes:` to override styles. TailwindMerge resolves conflicts.

```erb
<%%= kui(:separator, css_classes: "my-8 bg-primary") %>
```

## Theme

```ruby
# lib/kiso/themes/separator.rb
Kiso::Themes::Separator = ClassVariants.build(
  base: "bg-border shrink-0",
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px"
    }
  },
  defaults: { orientation: :horizontal }
)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| `data-slot` | `"separator"` |
| `role` | `"none"` (decorative) or `"separator"` (semantic) |
| `aria-orientation` | Set when `decorative: false` |

By default, the separator is decorative (`role="none"`). When it serves as a
meaningful boundary, set `decorative: false` to add `role="separator"` and
`aria-orientation`:

```erb
<%%= kui(:separator, decorative: false) %>
```
