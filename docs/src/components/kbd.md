---
title: Kbd
layout: docs
description: Displays a keyboard key or shortcut inline.
category: Element
source: lib/kiso/themes/kbd.rb
---

## Quick Start

```erb
<%%= kui(:kbd) { "⌘K" } %>
```

<%= render "component_preview", component: "kiso/kbd", scenario: "playground" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `size:` | `:sm` \| `:md` \| `:lg` | `:md` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Sub-parts

| Part | Element | Description |
|------|---------|-------------|
| `:group` | `<kbd>` | Wraps multiple Kbd elements inline |

## Usage

### Modifier Symbols

Display modifier keys as individual keycaps grouped together.

```erb
<%%= kui(:kbd, :group) do %>
  <%%= kui(:kbd) { "⌘" } %>
  <%%= kui(:kbd) { "⇧" } %>
  <%%= kui(:kbd) { "⌥" } %>
  <%%= kui(:kbd) { "⌃" } %>
<%% end %>
```

### Key Combination

Use a group with a separator for multi-key shortcuts.

```erb
<%%= kui(:kbd, :group) do %>
  <%%= kui(:kbd) { "Ctrl" } %>
  <span>+</span>
  <%%= kui(:kbd) { "B" } %>
<%% end %>
```

### Inline with Text

Embed key references naturally in prose.

```erb
<p class="text-muted-foreground text-sm">
  Use
  <%%= kui(:kbd, :group) do %>
    <%%= kui(:kbd) { "Ctrl + B" } %>
    <%%= kui(:kbd) { "Ctrl + K" } %>
  <%% end %>
  to open the command palette
</p>
```

### Sizes

Three sizes match the spatial system.

```erb
<%%= kui(:kbd, size: :sm) { "⌘K" } %>
<%%= kui(:kbd, size: :md) { "⌘K" } %>
<%%= kui(:kbd, size: :lg) { "⌘K" } %>
```

### Inside a Button

```erb
<%%= kui(:button, variant: :outline) do %>
  Accept <%%= kui(:kbd) { "⏎" } %>
<%% end %>
```

### Inside an Input Group

```erb
<%%= kui(:input_group) do %>
  <%%= kui(:input_group, :addon) do %>
    <%%= kiso_icon("search", class: "size-4") %>
  <%% end %>
  <%%= kui(:input, placeholder: "Search...") %>
  <%%= kui(:input_group, :addon, align: :end) do %>
    <%%= kui(:kbd) { "⌘" } %>
    <%%= kui(:kbd) { "K" } %>
  <%% end %>
<%% end %>
```

## Theme

```ruby
# lib/kiso/themes/kbd.rb
Kiso::Themes::Kbd = ClassVariants.build(
  base: "bg-muted text-muted-foreground pointer-events-none inline-flex items-center " \
        "justify-center gap-1 rounded-sm font-sans font-medium select-none " \
        "[&_svg:not([class*='size-'])]:size-3",
  variants: {
    size: {
      sm: "h-4 min-w-4 px-0.5 text-xs",
      md: "h-5 min-w-5 px-1 text-xs",
      lg: "h-6 min-w-6 px-1.5 text-xs"
    }
  },
  defaults: { size: :md }
)

Kiso::Themes::KbdGroup = ClassVariants.build(
  base: "inline-flex items-center gap-1"
)
```

## Accessibility

The `<kbd>` element is semantic HTML that represents user keyboard input.
Screen readers announce it as keyboard input without any additional ARIA
attributes needed.

| Attribute | Value |
|-----------|-------|
| `data-slot` | `"kbd"` / `"kbd-group"` |
| Element | `<kbd>` (semantic HTML) |
