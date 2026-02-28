---
title: DropdownMenu
layout: docs
description: Displays a menu to the user -- such as a set of actions or functions -- triggered by a button.
category: Overlay
source: lib/kiso/themes/dropdown_menu.rb
---

## Quick Start

```erb
<%%= kui(:dropdown_menu) do %>
  <%%= kui(:dropdown_menu, :trigger) do %>
    <%%= kui(:button, variant: :outline) { "Open" } %>
  <%% end %>
  <%%= kui(:dropdown_menu, :content) do %>
    <%%= kui(:dropdown_menu, :label) { "My Account" } %>
    <%%= kui(:dropdown_menu, :separator) %>
    <%%= kui(:dropdown_menu, :group) do %>
      <%%= kui(:dropdown_menu, :item) { "Profile" } %>
      <%%= kui(:dropdown_menu, :item) { "Settings" } %>
    <%% end %>
  <%% end %>
<%% end %>
```

<%= render "component_preview", component: "kiso/dropdown_menu", scenario: "playground", height: "400px" %>

## Locals

### DropdownMenuItem

| Local | Type | Default |
|-------|------|---------|
| `variant:` | `:default` \| `:destructive` | `:default` |
| `inset:` | Boolean | `false` |
| `disabled:` | Boolean | `false` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

### DropdownMenuCheckboxItem

| Local | Type | Default |
|-------|------|---------|
| `checked:` | Boolean | `false` |
| `disabled:` | Boolean | `false` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

### DropdownMenuRadioItem

| Local | Type | Default |
|-------|------|---------|
| `value:` | String | (required) |
| `checked:` | Boolean | `false` |
| `disabled:` | Boolean | `false` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

### DropdownMenuLabel

| Local | Type | Default |
|-------|------|---------|
| `inset:` | Boolean | `false` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

### DropdownMenuSubTrigger

| Local | Type | Default |
|-------|------|---------|
| `inset:` | Boolean | `false` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

### DropdownMenuRadioGroup

| Local | Type | Default |
|-------|------|---------|
| `value:` | String | `nil` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

## Sub-parts

| Part | Usage | Purpose |
|------|-------|---------|
| `:trigger` | `kui(:dropdown_menu, :trigger)` | Opens/closes the menu |
| `:content` | `kui(:dropdown_menu, :content)` | The floating menu panel |
| `:item` | `kui(:dropdown_menu, :item)` | Standard menu item |
| `:checkbox_item` | `kui(:dropdown_menu, :checkbox_item)` | Toggle item with checkbox |
| `:radio_group` | `kui(:dropdown_menu, :radio_group)` | Radio group container |
| `:radio_item` | `kui(:dropdown_menu, :radio_item)` | Radio selection item |
| `:label` | `kui(:dropdown_menu, :label)` | Section header label |
| `:separator` | `kui(:dropdown_menu, :separator)` | Visual divider |
| `:shortcut` | `kui(:dropdown_menu, :shortcut)` | Keyboard shortcut hint |
| `:group` | `kui(:dropdown_menu, :group)` | Semantic grouping |
| `:sub` | `kui(:dropdown_menu, :sub)` | Sub-menu wrapper |
| `:sub_trigger` | `kui(:dropdown_menu, :sub_trigger)` | Opens nested sub-menu |
| `:sub_content` | `kui(:dropdown_menu, :sub_content)` | Nested sub-menu panel |

All sub-parts accept `css_classes:` and `**component_options`.

## Anatomy

```
DropdownMenu
├── Trigger
├── Content
│   ├── Group
│   │   ├── Label
│   │   ├── Item
│   │   │   └── Shortcut
│   │   ├── CheckboxItem
│   │   ├── RadioGroup
│   │   │   └── RadioItem
│   │   └── Sub
│   │       ├── SubTrigger
│   │       └── SubContent
│   │           └── (nested items)
│   └── Separator
```

## Usage

### With Icons

```erb
<%%= kui(:dropdown_menu, :item) do %>
  <%%= kiso_icon("user") %>
  Profile
<%% end %>
```

### With Shortcuts

```erb
<%%= kui(:dropdown_menu, :item) do %>
  Settings
  <%%= kui(:dropdown_menu, :shortcut) { "⌘S" } %>
<%% end %>
```

### Destructive Item

Use `variant: :destructive` for irreversible actions like delete.

```erb
<%%= kui(:dropdown_menu, :item, variant: :destructive) do %>
  <%%= kiso_icon("trash") %>
  Delete
<%% end %>
```

### Checkbox Items

```erb
<%%= kui(:dropdown_menu, :checkbox_item, checked: true) do %>
  Status Bar
<%% end %>
<%%= kui(:dropdown_menu, :checkbox_item, checked: false, disabled: true) do %>
  Activity Bar
<%% end %>
```

### Radio Group

```erb
<%%= kui(:dropdown_menu, :radio_group, value: "bottom") do %>
  <%%= kui(:dropdown_menu, :radio_item, value: "top") { "Top" } %>
  <%%= kui(:dropdown_menu, :radio_item, value: "bottom", checked: true) { "Bottom" } %>
  <%%= kui(:dropdown_menu, :radio_item, value: "right") { "Right" } %>
<%% end %>
```

### Sub-menus

```erb
<%%= kui(:dropdown_menu, :sub) do %>
  <%%= kui(:dropdown_menu, :sub_trigger) { "More options" } %>
  <%%= kui(:dropdown_menu, :sub_content) do %>
    <%%= kui(:dropdown_menu, :item) { "Option A" } %>
    <%%= kui(:dropdown_menu, :item) { "Option B" } %>
  <%% end %>
<%% end %>
```

### Disabled Items

```erb
<%%= kui(:dropdown_menu, :item, disabled: true) { "API" } %>
```

## Theme

```ruby
DropdownMenuContent = ClassVariants.build(
  base: "bg-background text-foreground z-50 min-w-32 max-h-80
         overflow-x-hidden overflow-y-auto rounded-md
         ring ring-inset ring-border p-1 shadow-md"
)

DropdownMenuItem = ClassVariants.build(
  base: "relative flex cursor-default items-center gap-2 rounded-sm
         px-2 py-1.5 text-sm outline-none select-none
         data-[highlighted]:bg-elevated data-[highlighted]:text-foreground
         data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ...",
  variants: {
    variant: {
      default: "",
      destructive: "text-error data-[highlighted]:bg-error/10 ..."
    }
  }
)
```

## Stimulus

The dropdown menu uses the `kiso--dropdown-menu` Stimulus controller for:

- Open/close on trigger click
- Keyboard navigation (arrow keys, Enter, Space, Escape)
- Focus management (highlights move through items)
- Sub-menu open on hover or right-arrow, close on left-arrow or Escape
- Checkbox item toggle on click
- Radio group exclusive selection
- Click outside dismisses
- Type-ahead character search

Register the controller via `KisoUi.start(application)` in your Stimulus setup.

## Accessibility

- Uses `role="menu"` on content, `role="menuitem"` on items
- `role="menuitemcheckbox"` and `role="menuitemradio"` for toggle items
- `aria-haspopup="menu"` and `aria-expanded` on the trigger
- `aria-checked` on checkbox and radio items
- `aria-disabled` on disabled items
- Keyboard navigation: Arrow keys, Enter/Space to select, Escape to close
- Focus is trapped within the menu when open
