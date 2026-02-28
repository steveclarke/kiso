---
title: Select
layout: docs
description: Displays a list of options for the user to pick from, triggered by a button.
category: Form
source: lib/kiso/themes/select.rb
---

## Quick Start

```erb
<%%= kui(:select, name: :fruit) do %>
  <%%= kui(:select, :trigger) do %>
    <%%= kui(:select, :value, placeholder: "Select a fruit") %>
  <%% end %>
  <%%= kui(:select, :content) do %>
    <%%= kui(:select, :group) do %>
      <%%= kui(:select, :label) { "Fruits" } %>
      <%%= kui(:select, :item, value: "apple") { "Apple" } %>
      <%%= kui(:select, :item, value: "banana") { "Banana" } %>
      <%%= kui(:select, :item, value: "blueberry") { "Blueberry" } %>
    <%% end %>
  <%% end %>
<%% end %>
```

<%= render "component_preview", component: "kiso/select", scenario: "playground", height: "400px" %>

## Locals

### Select (root)

| Local | Type | Default |
|-------|------|---------|
| `name:` | `Symbol` \| `String` | `nil` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

### SelectTrigger

| Local | Type | Default |
|-------|------|---------|
| `size:` | `:sm` \| `:md` | `:md` |
| `disabled:` | `Boolean` | `false` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

### SelectValue

| Local | Type | Default |
|-------|------|---------|
| `placeholder:` | `String` | `nil` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

### SelectItem

| Local | Type | Default |
|-------|------|---------|
| `value:` | `String` | (required) |
| `disabled:` | `Boolean` | `false` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Sub-parts

| Part | Usage | Purpose |
|------|-------|---------|
| `:trigger` | `kui(:select, :trigger)` | Button that opens the dropdown |
| `:value` | `kui(:select, :value)` | Displays current selection or placeholder |
| `:content` | `kui(:select, :content)` | Dropdown panel (listbox) |
| `:group` | `kui(:select, :group)` | Groups related items |
| `:label` | `kui(:select, :label)` | Group heading label |
| `:item` | `kui(:select, :item)` | Selectable option with checkmark indicator |
| `:separator` | `kui(:select, :separator)` | Divider between groups |

All sub-parts accept `css_classes:` and `**component_options`.

## Anatomy

```
Select
├── SelectTrigger
│   ├── SelectValue
│   └── ChevronDown icon
├── SelectContent (listbox)
│   ├── SelectGroup
│   │   ├── SelectLabel
│   │   ├── SelectItem
│   │   │   ├── Checkmark indicator
│   │   │   └── Item text
│   │   └── ...
│   ├── SelectSeparator
│   └── SelectGroup
│       └── ...
└── Hidden input (form submission)
```

## Usage

### Groups with Labels

Use `SelectGroup`, `SelectLabel`, and `SelectSeparator` to organize items.

```erb
<%%= kui(:select, name: :food) do %>
  <%%= kui(:select, :trigger) do %>
    <%%= kui(:select, :value, placeholder: "Select a fruit") %>
  <%% end %>
  <%%= kui(:select, :content) do %>
    <%%= kui(:select, :group) do %>
      <%%= kui(:select, :label) { "Fruits" } %>
      <%%= kui(:select, :item, value: "apple") { "Apple" } %>
      <%%= kui(:select, :item, value: "banana") { "Banana" } %>
    <%% end %>
    <%%= kui(:select, :separator) %>
    <%%= kui(:select, :group) do %>
      <%%= kui(:select, :label) { "Vegetables" } %>
      <%%= kui(:select, :item, value: "carrot") { "Carrot" } %>
      <%%= kui(:select, :item, value: "broccoli") { "Broccoli" } %>
    <%% end %>
  <%% end %>
<%% end %>
```

### Disabled

Disable the entire select or individual items.

```erb
<%# Disabled trigger %>
<%%= kui(:select, :trigger, disabled: true) do %>
  <%%= kui(:select, :value, placeholder: "Select a fruit") %>
<%% end %>

<%# Disabled item %>
<%%= kui(:select, :item, value: "grapes", disabled: true) { "Grapes" } %>
```

### With Field

Wrap in a Field for label, description, and error support.

```erb
<%%= kui(:field) do %>
  <%%= kui(:field, :label, for: :fruit) { "Fruit" } %>
  <%%= kui(:select, name: :fruit) do %>
    <%%= kui(:select, :trigger) do %>
      <%%= kui(:select, :value, placeholder: "Select a fruit") %>
    <%% end %>
    <%%= kui(:select, :content) do %>
      <%%= kui(:select, :group) do %>
        <%%= kui(:select, :item, value: "apple") { "Apple" } %>
        <%%= kui(:select, :item, value: "banana") { "Banana" } %>
      <%% end %>
    <%% end %>
  <%% end %>
  <%%= kui(:field, :description) { "Choose your favorite fruit." } %>
<%% end %>
```

### Validation

Set `aria-invalid` on the trigger and `invalid: true` on the Field.

```erb
<%%= kui(:field, invalid: true) do %>
  <%%= kui(:field, :label, for: :language) { "Language" } %>
  <%%= kui(:select, name: :language) do %>
    <%%= kui(:select, :trigger, "aria-invalid": true) do %>
      <%%= kui(:select, :value, placeholder: "Select a language") %>
    <%% end %>
    <%%= kui(:select, :content) do %>
      <%%= kui(:select, :group) do %>
        <%%= kui(:select, :item, value: "ruby") { "Ruby" } %>
        <%%= kui(:select, :item, value: "python") { "Python" } %>
      <%% end %>
    <%% end %>
  <%% end %>
  <%%= kui(:field, :error, errors: ["Please select a language."]) %>
<%% end %>
```

### Size

The trigger supports `sm` and `md` sizes.

```erb
<%%= kui(:select, :trigger, size: :sm) do %>...<%% end %>
<%%= kui(:select, :trigger, size: :md) do %>...<%% end %>
```

## Theme

```ruby
# lib/kiso/themes/select.rb
SelectTrigger = ClassVariants.build(
  base: "text-foreground flex w-full items-center justify-between gap-2
         rounded-md bg-background px-3 py-2 text-sm whitespace-nowrap shadow-xs
         ring ring-inset ring-accented outline-none transition-[color,box-shadow]
         focus-visible:ring-2 focus-visible:ring-primary
         aria-invalid:ring-error aria-invalid:focus-visible:ring-error
         disabled:cursor-not-allowed disabled:opacity-50",
  variants: { size: { sm: "h-8", md: "h-9" } },
  defaults: { size: :md }
)

SelectContent = ClassVariants.build(
  base: "bg-background text-foreground z-50 max-h-60 min-w-32
         overflow-y-auto rounded-md shadow-md ring ring-inset ring-border p-1"
)

SelectItem = ClassVariants.build(
  base: "relative flex w-full cursor-default items-center gap-2 rounded-sm
         py-1.5 pr-8 pl-2 text-sm outline-none select-none
         data-[highlighted]:bg-elevated data-[highlighted]:text-foreground"
)

SelectLabel    = ClassVariants.build(base: "text-muted-foreground px-2 py-1.5 text-xs font-medium")
SelectSeparator = ClassVariants.build(base: "bg-border pointer-events-none -mx-1 my-1 h-px")
```

## Stimulus Controller

The Select component requires the `kiso--select` Stimulus controller for
interactivity. It handles:

- Toggle open/close on trigger click
- Close on outside click and Escape key
- Keyboard navigation (Arrow keys, Home, End)
- Enter/Space to select highlighted item
- Type-ahead character matching
- Hidden input sync for form submission
- Checkmark indicator on selected item

Register the controller in your application:

```javascript
import KisoUi from "kiso-ui"
KisoUi.start(application)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| `role="listbox"` | On the content panel |
| `role="option"` | On each item |
| `aria-haspopup="listbox"` | On the trigger |
| `aria-expanded` | `true`/`false` on trigger |
| `aria-selected` | `true` on selected item |
| `aria-invalid` | Set when validation fails |
| `aria-disabled` | On disabled items |
| `data-slot` | `"select"`, `"select-trigger"`, etc. |

### Keyboard

| Key | Action |
|-----|--------|
| `Space` / `Enter` | Open select or select highlighted item |
| `ArrowDown` / `ArrowUp` | Navigate through items |
| `Home` / `End` | Jump to first / last item |
| `Escape` | Close the dropdown |
| `Tab` | Close and move focus |
| Character key | Type-ahead to matching item |
