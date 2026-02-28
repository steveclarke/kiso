---
title: Combobox
layout: docs
description: Autocomplete input with a searchable dropdown of suggestions. Supports single and multi-select with chips.
category: Form
source: lib/kiso/themes/combobox.rb
---

## Quick Start

```erb
<%%= kui(:combobox, name: :framework) do %>
  <%%= kui(:combobox, :input, placeholder: "Select a framework") %>
  <%%= kui(:combobox, :content) do %>
    <%%= kui(:combobox, :list) do %>
      <%%= kui(:combobox, :item, value: "rails") { "Rails" } %>
      <%%= kui(:combobox, :item, value: "django") { "Django" } %>
      <%%= kui(:combobox, :item, value: "laravel") { "Laravel" } %>
      <%%= kui(:combobox, :empty) { "No frameworks found." } %>
    <%% end %>
  <%% end %>
<%% end %>
```

<%= render "component_preview", component: "kiso/combobox", scenario: "playground", height: "400px" %>

## Locals

### Combobox (root)

| Local | Type | Default |
|-------|------|---------|
| `name:` | `Symbol` \| `String` | `nil` |
| `multiple:` | `Boolean` | `false` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

### ComboboxInput

| Local | Type | Default |
|-------|------|---------|
| `placeholder:` | `String` | `nil` |
| `disabled:` | `Boolean` | `false` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

### ComboboxItem

| Local | Type | Default |
|-------|------|---------|
| `value:` | `String` | (required) |
| `disabled:` | `Boolean` | `false` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

### ComboboxChip

| Local | Type | Default |
|-------|------|---------|
| `value:` | `String` | (required) |
| `removable:` | `Boolean` | `true` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

### ComboboxChipsInput

| Local | Type | Default |
|-------|------|---------|
| `placeholder:` | `String` | `nil` |
| `disabled:` | `Boolean` | `false` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Sub-parts

| Part | Usage | Purpose |
|------|-------|---------|
| `:input` | `kui(:combobox, :input)` | Text input with trigger chevron |
| `:content` | `kui(:combobox, :content)` | Dropdown panel |
| `:list` | `kui(:combobox, :list)` | Scrollable list inside the dropdown |
| `:item` | `kui(:combobox, :item)` | Selectable option with checkmark |
| `:empty` | `kui(:combobox, :empty)` | Shown when no items match the filter |
| `:group` | `kui(:combobox, :group)` | Groups related items |
| `:label` | `kui(:combobox, :label)` | Group heading label |
| `:separator` | `kui(:combobox, :separator)` | Divider between groups |
| `:chips` | `kui(:combobox, :chips)` | Multi-select chip container |
| `:chip` | `kui(:combobox, :chip)` | Individual selected chip |
| `:chips_input` | `kui(:combobox, :chips_input)` | Inline text input inside chips container |

All sub-parts accept `css_classes:` and `**component_options`.

## Anatomy

```
Combobox
├── ComboboxInput (single select)
│   ├── Text input
│   └── Chevron trigger
├── -OR- ComboboxChips (multi-select)
│   ├── ComboboxChip (per selected value)
│   │   ├── Chip text
│   │   └── Remove button (x icon)
│   └── ComboboxChipsInput
├── ComboboxContent (dropdown)
│   └── ComboboxList (listbox)
│       ├── ComboboxGroup
│       │   ├── ComboboxLabel
│       │   └── ComboboxItem
│       │       ├── Item text
│       │       └── Checkmark indicator
│       ├── ComboboxSeparator
│       ├── ComboboxItem (ungrouped)
│       └── ComboboxEmpty
└── Hidden input (form submission)
```

## Usage

### Single Select

The default mode. The input field acts as both a search filter and display
for the selected value.

```erb
<%%= kui(:combobox, name: :framework) do %>
  <%%= kui(:combobox, :input, placeholder: "Select a framework") %>
  <%%= kui(:combobox, :content) do %>
    <%%= kui(:combobox, :list) do %>
      <%%= kui(:combobox, :item, value: "rails") { "Rails" } %>
      <%%= kui(:combobox, :item, value: "django") { "Django" } %>
      <%%= kui(:combobox, :item, value: "laravel") { "Laravel" } %>
      <%%= kui(:combobox, :empty) { "No frameworks found." } %>
    <%% end %>
  <%% end %>
<%% end %>
```

### Multi-select with Chips

Set `multiple: true` and use the chips sub-parts instead of the input.

```erb
<%%= kui(:combobox, name: "tags[]", multiple: true) do %>
  <%%= kui(:combobox, :chips) do %>
    <%%= kui(:combobox, :chip, value: "rails") { "Rails" } %>
    <%%= kui(:combobox, :chips_input, placeholder: "Add tag...") %>
  <%% end %>
  <%%= kui(:combobox, :content) do %>
    <%%= kui(:combobox, :list) do %>
      <%%= kui(:combobox, :item, value: "rails") { "Rails" } %>
      <%%= kui(:combobox, :item, value: "django") { "Django" } %>
      <%%= kui(:combobox, :item, value: "laravel") { "Laravel" } %>
      <%%= kui(:combobox, :empty) { "No tags found." } %>
    <%% end %>
  <%% end %>
<%% end %>
```

### Groups

Use `ComboboxGroup`, `ComboboxLabel`, and `ComboboxSeparator` to organize items.

```erb
<%%= kui(:combobox, name: :timezone) do %>
  <%%= kui(:combobox, :input, placeholder: "Select a timezone") %>
  <%%= kui(:combobox, :content) do %>
    <%%= kui(:combobox, :list) do %>
      <%%= kui(:combobox, :group) do %>
        <%%= kui(:combobox, :label) { "Americas" } %>
        <%%= kui(:combobox, :item, value: "new-york") { "(GMT-5) New York" } %>
        <%%= kui(:combobox, :item, value: "los-angeles") { "(GMT-8) Los Angeles" } %>
      <%% end %>
      <%%= kui(:combobox, :separator) %>
      <%%= kui(:combobox, :group) do %>
        <%%= kui(:combobox, :label) { "Europe" } %>
        <%%= kui(:combobox, :item, value: "london") { "(GMT+0) London" } %>
        <%%= kui(:combobox, :item, value: "paris") { "(GMT+1) Paris" } %>
      <%% end %>
      <%%= kui(:combobox, :empty) { "No timezones found." } %>
    <%% end %>
  <%% end %>
<%% end %>
```

### Disabled

Disable the input to prevent interaction.

```erb
<%%= kui(:combobox, :input, placeholder: "Select a framework", disabled: true) %>
```

### With Field

Wrap in a Field for label, description, and error support.

```erb
<%%= kui(:field) do %>
  <%%= kui(:field, :label, for: :framework) { "Framework" } %>
  <%%= kui(:combobox, name: :framework) do %>
    <%%= kui(:combobox, :input, placeholder: "Search frameworks...") %>
    <%%= kui(:combobox, :content) do %>
      <%%= kui(:combobox, :list) do %>
        <%%= kui(:combobox, :item, value: "rails") { "Rails" } %>
        <%%= kui(:combobox, :item, value: "django") { "Django" } %>
      <%% end %>
    <%% end %>
  <%% end %>
  <%%= kui(:field, :description) { "Choose your preferred framework." } %>
<%% end %>
```

## Theme

```ruby
# lib/kiso/themes/combobox.rb (abbreviated)
ComboboxInput = ClassVariants.build(
  base: "text-foreground flex w-full items-center rounded-md
         bg-background ring ring-inset ring-accented shadow-xs h-9 ..."
)

ComboboxContent = ClassVariants.build(
  base: "bg-background text-foreground z-50 max-h-96 min-w-32
         overflow-hidden rounded-md shadow-md ring ring-inset ring-border"
)

ComboboxItem = ClassVariants.build(
  base: "relative flex w-full cursor-default items-center gap-2 rounded-sm
         py-1.5 pr-8 pl-2 text-sm outline-none select-none
         data-[highlighted]:bg-elevated data-[highlighted]:text-foreground"
)

ComboboxChips = ClassVariants.build(
  base: "flex min-h-9 flex-wrap items-center gap-1.5 rounded-md
         bg-background ring ring-inset ring-accented shadow-xs ..."
)

ComboboxChip = ClassVariants.build(
  base: "bg-muted text-foreground flex h-5.5 w-fit items-center
         justify-center gap-1 rounded-sm px-1.5 text-xs font-medium ..."
)
```

## Stimulus Controller

The Combobox component requires the `kiso--combobox` Stimulus controller for
interactivity. It handles:

- Filter items as the user types in the input
- Keyboard navigation (Arrow keys, Home, End)
- Enter to select highlighted item
- Escape to close the dropdown
- Backspace to remove last chip (multi-select)
- Click outside to dismiss
- Hidden input sync for form submission
- Checkmark indicators on selected items
- Chip creation/removal for multi-select
- Group/separator visibility during filtering

Register the controller in your application:

```javascript
import KisoUi from "kiso-ui"
KisoUi.start(application)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| `role="listbox"` | On the list |
| `role="option"` | On each item |
| `role="group"` | On each group |
| `aria-selected` | `true` on selected items |
| `aria-disabled` | On disabled items |
| `data-slot` | `"combobox"`, `"combobox-input"`, etc. |

### Keyboard

| Key | Action |
|-----|--------|
| `ArrowDown` / `ArrowUp` | Navigate through visible items |
| `Enter` | Select highlighted item |
| `Escape` | Close the dropdown |
| `Home` / `End` | Jump to first / last item |
| `Backspace` | Remove last chip (multi-select, empty input) |
| `Tab` | Close and move focus |
| Type | Filter items by text |
