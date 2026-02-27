---
title: RadioGroup
layout: docs
description: A group of radio buttons for selecting one option from a set.
category: Form
source: lib/kiso/themes/radio_group.rb
---

## Quick Start

```erb
<%%= kui(:radio_group, name: :plan) do %>
  <div class="flex items-center gap-3">
    <%%= kui(:radio_group, :item, value: "free", id: :plan_free) %>
    <%%= kui(:field, :label, for: :plan_free) { "Free" } %>
  </div>
  <div class="flex items-center gap-3">
    <%%= kui(:radio_group, :item, value: "pro", id: :plan_pro) %>
    <%%= kui(:field, :label, for: :plan_pro) { "Pro" } %>
  </div>
<%% end %>
```

<%= render "component_preview", component: "kiso/radio_group", scenario: "playground", height: "300px" %>

## Locals

### RadioGroup

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

### RadioGroupItem

| Local | Type | Default |
|-------|------|---------|
| `color:` | `:primary` \| `:secondary` \| `:success` \| `:info` \| `:warning` \| `:error` \| `:neutral` | `:primary` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

All standard HTML input attributes (`name:`, `id:`, `value:`, `disabled:`,
`required:`, `checked:`, etc.) pass through via `**component_options`.

## Sub-parts

| Part | Usage | HTML Element |
|------|-------|-------------|
| `:item` | `kui(:radio_group, :item)` | `<input type="radio">` |

## Anatomy

```
radio_group (div role="radiogroup")
  radio_group > item (input type="radio")
  radio_group > item (input type="radio")
```

## Usage

### Color

The color applies to the checked state -- background fill and ring.

```erb
<%%= kui(:radio_group, name: :color_demo) do %>
  <div class="flex items-center gap-3">
    <%%= kui(:radio_group, :item, color: :primary, value: "a", id: :color_a, checked: true) %>
    <label for="color_a" class="text-sm">Primary</label>
  </div>
  <div class="flex items-center gap-3">
    <%%= kui(:radio_group, :item, color: :success, value: "b", id: :color_b) %>
    <label for="color_b" class="text-sm">Success</label>
  </div>
  <div class="flex items-center gap-3">
    <%%= kui(:radio_group, :item, color: :error, value: "c", id: :color_c) %>
    <label for="color_c" class="text-sm">Error</label>
  </div>
<%% end %>
```

### With Field

Pair with FieldSet and Field for labels, descriptions, and accessible structure.

```erb
<%%= kui(:field_set) do %>
  <%%= kui(:field_set, :legend, variant: :label) { "Subscription Plan" } %>
  <%%= kui(:field, :description) { "Choose the plan that works best for you." } %>

  <%%= kui(:radio_group, css_classes: "mt-3") do %>
    <%%= kui(:field, orientation: :horizontal) do %>
      <%%= kui(:radio_group, :item, value: "free", name: :plan, id: :plan_free) %>
      <%%= kui(:field, :content) do %>
        <%%= kui(:field, :label, for: :plan_free) { "Free" } %>
        <%%= kui(:field, :description) { "Up to 3 projects." } %>
      <%% end %>
    <%% end %>

    <%%= kui(:field, orientation: :horizontal) do %>
      <%%= kui(:radio_group, :item, value: "pro", name: :plan, id: :plan_pro) %>
      <%%= kui(:field, :content) do %>
        <%%= kui(:field, :label, for: :plan_pro) { "Pro" } %>
        <%%= kui(:field, :description) { "Unlimited projects." } %>
      <%% end %>
    <%% end %>
  <%% end %>
<%% end %>
```

### Disabled

```erb
<%%= kui(:radio_group, name: :status) do %>
  <div class="flex items-center gap-3">
    <%%= kui(:radio_group, :item, value: "on", id: :on, checked: true) %>
    <label for="on" class="text-sm">Enabled (selected)</label>
  </div>
  <div class="flex items-center gap-3">
    <%%= kui(:radio_group, :item, value: "off", id: :off, disabled: true) %>
    <label for="off" class="text-sm text-muted-foreground">Disabled</label>
  </div>
<%% end %>
```

### With Rails Form Helpers

Use the theme module directly with Rails form builders:

```erb
<%%= f.radio_button :plan, "free",
    class: Kiso::Themes::RadioGroupItem.render(color: :primary) %>
<%%= f.radio_button :plan, "pro",
    class: Kiso::Themes::RadioGroupItem.render(color: :primary) %>
```

## Theme

```ruby
# lib/kiso/themes/radio_group.rb
Kiso::Themes::RadioGroup = ClassVariants.build(
  base: "grid gap-3"
)

Kiso::Themes::RadioGroupItem = ClassVariants.build(
  base: "appearance-none aspect-square size-4 shrink-0 rounded-full
         ring ring-inset ring-accented shadow-xs
         transition-[color,box-shadow] outline-none
         disabled:cursor-not-allowed disabled:opacity-50
         focus-visible:ring-[3px]
         aria-invalid:ring-error/30 aria-invalid:ring-2",
  variants: {
    color: { primary: "", secondary: "", ... }
  },
  compound_variants: [
    { color: :primary, class: "checked:bg-primary checked:ring-primary
       checked:text-primary-foreground focus-visible:ring-primary/50" },
    ...
  ],
  defaults: { color: :primary }
)
```

The radio dot indicator uses a CSS `::after` pseudo-element with a rounded
background. The `currentColor` inherits from `checked:text-{color}-foreground`.

## Accessibility

| Attribute | Value |
|-----------|-------|
| `data-component` | `"radio_group"` |
| `role` | `"radiogroup"` (on container) |
| `type` | `"radio"` (on each item) |
| `aria-invalid` | Set when validation fails |
| `disabled` | Native attribute |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | Moves focus into/out of the radio group. |
| `Arrow Up/Down` | Moves selection between radio items. |
| `Arrow Left/Right` | Moves selection between radio items. |
| `Space` | Selects the focused radio item. |
