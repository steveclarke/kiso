---
title: Toggle
layout: docs
description: A two-state button that can be toggled on or off.
category: Element
source: lib/kiso/themes/toggle.rb
---

## Quick Start

```erb
<%%= kui(:toggle, "aria-label": "Toggle bold") do %>
  <svg class="size-4">...</svg>
<%% end %>
```

## Locals

| Local | Type | Default |
|-------|------|---------|
| `variant:` | `:default` \| `:outline` | `:default` |
| `size:` | `:sm` \| `:default` \| `:lg` | `:default` |
| `pressed:` | Boolean | `false` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

## Usage

### Variant

Use the `variant:` local to change the toggle's visual style.

```erb
<%%= kui(:toggle, "aria-label": "Bold") do %>
  <%%= kiso_icon("bold") %>
<%% end %>

<%%= kui(:toggle, variant: :outline, "aria-label": "Italic") do %>
  <%%= kiso_icon("italic") %>
<%% end %>
```

| Variant | Appearance |
|---------|------------|
| `default` | Transparent background, muted hover |
| `outline` | Border with subtle shadow |

### Size

```erb
<%%= kui(:toggle, size: :sm, "aria-label": "Bold") do %>
  <%%= kiso_icon("bold") %>
<%% end %>

<%%= kui(:toggle, size: :default, "aria-label": "Bold") do %>
  <%%= kiso_icon("bold") %>
<%% end %>

<%%= kui(:toggle, size: :lg, "aria-label": "Bold") do %>
  <%%= kiso_icon("bold") %>
<%% end %>
```

### Pressed State

Set the initial pressed state with `pressed:`. The Stimulus controller
handles toggling on click.

```erb
<%%= kui(:toggle, pressed: true, "aria-label": "Bold") do %>
  <%%= kiso_icon("bold") %>
<%% end %>
```

### With Text

Toggle buttons can include text alongside icons.

```erb
<%%= kui(:toggle, "aria-label": "Toggle italic") do %>
  <%%= kiso_icon("italic") %>
  Italic
<%% end %>
```

### Disabled

```erb
<%%= kui(:toggle, disabled: true, "aria-label": "Bold") do %>
  <%%= kiso_icon("bold") %>
<%% end %>
```

## Theme

```ruby
Kiso::Themes::Toggle = ClassVariants.build(
  base: "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ...",
  variants: {
    variant: {
      default: "",
      outline: "ring ring-inset ring-border shadow-xs"
    },
    size: {
      sm: "h-8 px-1.5 min-w-8",
      default: "h-9 px-2 min-w-9",
      lg: "h-10 px-2.5 min-w-10"
    }
  },
  defaults: { variant: :default, size: :default }
)
```

## Accessibility

The toggle renders a `<button>` with `aria-pressed` and `data-state` attributes.
The Stimulus controller (`kiso--toggle`) toggles between `"on"` and `"off"` states
on click.

| Attribute | Value |
|-----------|-------|
| `aria-pressed` | `true` / `false` |
| `data-state` | `"on"` / `"off"` |
| `data-slot` | `"toggle"` |

### Keyboard

| Key | Action |
|-----|--------|
| `Enter` | Toggles pressed state |
| `Space` | Toggles pressed state |
