---
title: ActionIcon
layout: docs
description: A small, inline icon-only action trigger for table cells, card headers, and text rows.
category: Element
source: lib/kiso/themes/action_icon.rb
---

## Quick Start

<%= render "component_preview", comp: "action_icon", scenario: "playground" %>

```erb
<%%= kui(:action_icon, icon: "pencil", title: "Edit") %>
```

## Locals

| Local | Type | Default |
|-------|------|---------|
| `icon:` | `String` | (required) |
| `size:` | `:xs` \| `:sm` \| `:md` | `:sm` |
| `title:` | `String` | `nil` |
| `href:` | `String` | `nil` |
| `method:` | `Symbol` | `nil` |
| `disabled:` | `Boolean` | `false` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Sizes

<%= render "component_preview", comp: "action_icon", scenario: "sizes" %>

Three sizes optimized for inline use — no fixed heights, padding-only
sizing.

```erb
<%%= kui(:action_icon, icon: "pencil", title: "Edit", size: :xs) %>
<%%= kui(:action_icon, icon: "pencil", title: "Edit", size: :sm) %>
<%%= kui(:action_icon, icon: "pencil", title: "Edit", size: :md) %>
```

## Inline with text

<%= render "component_preview", comp: "action_icon", scenario: "inline_with_text" %>

ActionIcon flows inline without overflowing the surrounding line height.
Choose a size that matches the text context.

## Links

Renders as `<a>` with `href:`, or as a `button_to` form when combined
with `method:`.

```erb
<%%= kui(:action_icon, icon: "external-link", title: "Open",
    href: "/page", target: "_blank") %>

<%%= kui(:action_icon, icon: "trash", title: "Delete",
    href: "/items/1", method: :delete) %>
```

## Destructive actions

Use `css_classes:` for one-off color overrides:

```erb
<%%= kui(:action_icon, icon: "trash", title: "Delete",
    css_classes: "text-error hover:text-error") %>
```

## Theme

```ruby
Kiso::Themes::ActionIcon = ClassVariants.build(
  base: "inline-flex items-center justify-center
         text-muted-foreground hover:text-foreground
         hover:bg-accent rounded-md
         cursor-pointer transition-colors duration-150 ...",
  variants: {
    size: {
      xs: "p-0.5 [&_svg:not([class*='size-'])]:size-3",
      sm: "p-1 [&_svg:not([class*='size-'])]:size-3.5",
      md: "p-1.5 [&_svg:not([class*='size-'])]:size-4"
    }
  },
  defaults: { size: :sm }
)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| `data-slot` | `"action-icon"` |
| `aria-label` | Set from `title:` prop (falls back to `t("kiso.action_icon.action")`) |
| `type` | `"button"` (when rendering as `<button>`) |

Always provide a descriptive `title:` — it sets both the visual tooltip
and the accessible label for screen readers.
