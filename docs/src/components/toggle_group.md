---
title: ToggleGroup
layout: docs
description: A group of toggle buttons with single or multiple selection mode.
category: Element
source: lib/kiso/themes/toggle_group.rb
---

## Quick Start

```erb
<%%= kui(:toggle_group, type: :single) do %>
  <%%= kui(:toggle_group, :item, value: "left", "aria-label": "Align left") do %>
    <%%= kiso_icon("align-left") %>
  <%% end %>
  <%%= kui(:toggle_group, :item, value: "center", "aria-label": "Align center") do %>
    <%%= kiso_icon("align-center") %>
  <%% end %>
  <%%= kui(:toggle_group, :item, value: "right", "aria-label": "Align right") do %>
    <%%= kiso_icon("align-right") %>
  <%% end %>
<%% end %>
```

## Locals

**ToggleGroup:**

| Local | Type | Default |
|-------|------|---------|
| `type:` | `:single` \| `:multiple` | `:single` |
| `variant:` | `:default` \| `:outline` | `:default` |
| `size:` | `:sm` \| `:default` \| `:lg` | `:default` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

**ToggleGroupItem:**

| Local | Type | Default |
|-------|------|---------|
| `value:` | String | `nil` |
| `variant:` | `:default` \| `:outline` | `:default` |
| `size:` | `:sm` \| `:default` \| `:lg` | `:default` |
| `pressed:` | Boolean | `false` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

## Sub-parts

| Part | Usage | Purpose |
|------|-------|---------|
| `:item` | `kui(:toggle_group, :item)` | Individual toggle button in the group |

## Anatomy

```
ToggleGroup
├── ToggleGroup Item (value: "left")
├── ToggleGroup Item (value: "center")
└── ToggleGroup Item (value: "right")
```

## Usage

### Single Selection

In single selection mode, only one item can be active at a time.

```erb
<%%= kui(:toggle_group, type: :single) do %>
  <%%= kui(:toggle_group, :item, value: "left", "aria-label": "Align left") do %>
    <%%= kiso_icon("align-left") %>
  <%% end %>
  <%%= kui(:toggle_group, :item, value: "center", "aria-label": "Align center") do %>
    <%%= kiso_icon("align-center") %>
  <%% end %>
  <%%= kui(:toggle_group, :item, value: "right", "aria-label": "Align right") do %>
    <%%= kiso_icon("align-right") %>
  <%% end %>
<%% end %>
```

### Multiple Selection

In multiple selection mode, any number of items can be active.

```erb
<%%= kui(:toggle_group, type: :multiple) do %>
  <%%= kui(:toggle_group, :item, value: "bold", "aria-label": "Toggle bold") do %>
    <%%= kiso_icon("bold") %>
  <%% end %>
  <%%= kui(:toggle_group, :item, value: "italic", "aria-label": "Toggle italic") do %>
    <%%= kiso_icon("italic") %>
  <%% end %>
  <%%= kui(:toggle_group, :item, value: "underline", "aria-label": "Toggle underline") do %>
    <%%= kiso_icon("underline") %>
  <%% end %>
<%% end %>
```

### Outline Variant

Pass `variant: :outline` to both the group and items.

```erb
<%%= kui(:toggle_group, type: :single, variant: :outline) do %>
  <%%= kui(:toggle_group, :item, value: "left", variant: :outline, "aria-label": "Left") do %>
    <%%= kiso_icon("align-left") %>
  <%% end %>
  <%%= kui(:toggle_group, :item, value: "center", variant: :outline, "aria-label": "Center") do %>
    <%%= kiso_icon("align-center") %>
  <%% end %>
<%% end %>
```

### Sizes

```erb
<%%= kui(:toggle_group, type: :single, size: :sm) do %>
  <%%= kui(:toggle_group, :item, value: "a", size: :sm, "aria-label": "A") do %>
    <%%= kiso_icon("align-left") %>
  <%% end %>
<%% end %>
```

## Theme

```ruby
Kiso::Themes::ToggleGroup = ClassVariants.build(
  base: "flex w-fit items-center rounded-md text-foreground"
)

Kiso::Themes::ToggleGroupItem = ClassVariants.build(
  base: "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ...",
  variants: {
    variant: { default: "", outline: "ring ring-inset ring-border shadow-xs" },
    size: { sm: "h-8 px-3 min-w-8", default: "h-9 px-3 min-w-9", lg: "h-10 px-3 min-w-10" }
  },
  defaults: { variant: :default, size: :default }
)
```

## Stimulus

The `kiso--toggle-group` controller manages selection state:

- **Single mode:** clicking an item deselects others, clicking the active item deselects it
- **Multiple mode:** each item toggles independently
- **Arrow keys:** navigate between items (ArrowLeft/Right, ArrowUp/Down)
- **Home/End:** jump to first/last item
- **Change event:** dispatches `kiso--toggle-group:change` with selected value(s)

## Accessibility

| Attribute | Value |
|-----------|-------|
| `role` | `"group"` (on container) |
| `aria-pressed` | `true` / `false` (on each item) |
| `data-state` | `"on"` / `"off"` (on each item) |
| `data-value` | Item value string |

### Keyboard

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Toggle the focused item |
| `ArrowRight` / `ArrowDown` | Move focus to next item |
| `ArrowLeft` / `ArrowUp` | Move focus to previous item |
| `Home` | Move focus to first item |
| `End` | Move focus to last item |
