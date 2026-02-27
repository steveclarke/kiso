---
title: Checkbox
layout: docs
description: A toggle control for boolean choices in forms.
category: Form
source: lib/kiso/themes/checkbox.rb
---

## Quick Start

```erb
<%%= kiso(:checkbox) %>
```

<%= render "component_preview", component: "kiso/checkbox", scenario: "playground", height: "300px" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `color:` | `:primary` \| `:secondary` \| `:success` \| `:info` \| `:warning` \| `:error` \| `:neutral` | `:primary` |
| `checked:` | `Boolean` | `false` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

All standard HTML input attributes (`name:`, `id:`, `value:`, `disabled:`,
`required:`, etc.) pass through via `**component_options`.

## Usage

### Color

The color applies to the checked state — background fill, ring, and checkmark.

```erb
<%%= kiso(:checkbox, color: :primary, checked: true) %>
<%%= kiso(:checkbox, color: :success, checked: true) %>
<%%= kiso(:checkbox, color: :error, checked: true) %>
```

### With Field

Pair with Field for label, description, and validation support.

```erb
<%%= kiso(:field, orientation: :horizontal) do %>
  <%%= kiso(:checkbox, id: :terms, name: :terms, value: "1") %>
  <%%= kiso(:field, :content) do %>
    <%%= kiso(:field, :label, for: :terms) { "Accept terms and conditions" } %>
    <%%= kiso(:field, :description) { "You agree to our Terms of Service and Privacy Policy." } %>
  <%% end %>
<%% end %>
```

### Disabled

```erb
<%%= kiso(:checkbox, disabled: true) %>
<%%= kiso(:checkbox, checked: true, disabled: true) %>
```

### With Rails Form Helpers

Use the theme module directly with Rails form builders:

```erb
<%%= f.check_box :agree,
    class: Kiso::Themes::Checkbox.render(color: :primary) %>
```

## Theme

```ruby
# lib/kiso/themes/checkbox.rb
Kiso::Themes::Checkbox = ClassVariants.build(
  base: "appearance-none size-4 shrink-0 rounded-[4px]
         ring ring-inset ring-accented shadow-xs
         transition-shadow outline-none
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

The checkmark indicator uses a CSS `::after` pseudo-element with a mask-image
SVG (Lucide Check icon). The `currentColor` inherits from
`checked:text-{color}-foreground`.

## Accessibility

| Attribute | Value |
|-----------|-------|
| `data-component` | `"checkbox"` |
| `type` | `"checkbox"` |
| `aria-invalid` | Set when validation fails |
| `disabled` | Native attribute |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | Moves focus to/from the checkbox. |
| `Space` | Toggles checked state. |
