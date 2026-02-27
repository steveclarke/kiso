---
title: Switch
layout: docs
description: A binary toggle for on/off states, built on a native checkbox input.
category: Form
source: lib/kiso/themes/switch.rb
---

## Quick Start

```erb
<%%= kui(:switch) %>
```

<%= render "component_preview", component: "kiso/switch", scenario: "playground", height: "300px" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `color:` | `:primary` \| `:secondary` \| `:success` \| `:info` \| `:warning` \| `:error` \| `:neutral` | `:primary` |
| `size:` | `:sm` \| `:md` | `:md` |
| `checked:` | `Boolean` | `false` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

All standard HTML input attributes (`name:`, `id:`, `value:`, `disabled:`,
`required:`, etc.) pass through via `**component_options`.

## Usage

### Color

The color applies to the checked state background.

```erb
<%%= kui(:switch, color: :primary, checked: true) %>
<%%= kui(:switch, color: :success, checked: true) %>
<%%= kui(:switch, color: :error, checked: true) %>
```

### Size

```erb
<%%= kui(:switch, size: :sm) %>
<%%= kui(:switch, size: :md) %>
```

| Size | Track | Thumb |
|------|-------|-------|
| `sm` | `h-4 w-8` | `size-3` |
| `md` (default) | `h-5 w-9` | `size-4` |

### With Field

Pair with Field for label, description, and accessible structure.

```erb
<%%= kui(:field, orientation: :horizontal) do %>
  <%%= kui(:switch, id: :marketing, name: :marketing, value: "1") %>
  <%%= kui(:field, :content) do %>
    <%%= kui(:field, :label, for: :marketing) { "Marketing emails" } %>
    <%%= kui(:field, :description) { "Receive emails about new products." } %>
  <%% end %>
<%% end %>
```

### Disabled

```erb
<%%= kui(:switch, disabled: true) %>
<%%= kui(:switch, checked: true, disabled: true) %>
```

### With Rails Form Helpers

Use the theme classes directly with Rails form builders:

```erb
<%%= f.check_box :dark_mode,
    class: "peer sr-only",
    role: :switch %>
```

Or render the full component by passing form attributes:

```erb
<%%= kui(:switch, id: :dark_mode, name: "user[dark_mode]", value: "1") %>
```

## Theme

```ruby
# lib/kiso/themes/switch.rb (track)
Kiso::Themes::SwitchTrack = ClassVariants.build(
  base: "relative inline-flex shrink-0 cursor-pointer items-center
         rounded-full border-2 border-transparent shadow-xs
         outline-none bg-accented transition-colors
         has-[:focus-visible]:ring-[3px]
         has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
  variants: {
    color: { primary: "", ... },
    size: { sm: "h-4 w-8", md: "h-5 w-9" }
  },
  compound_variants: [
    { color: :primary, class: "has-[:checked]:bg-primary
        has-[:focus-visible]:ring-primary/50" },
    ...
  ],
  defaults: { color: :primary, size: :md }
)

# Thumb
Kiso::Themes::SwitchThumb = ClassVariants.build(
  base: "pointer-events-none block rounded-full bg-background
         shadow-lg ring-0 transition-transform translate-x-0.5",
  variants: {
    size: {
      sm: "size-3 peer-checked:translate-x-4",
      md: "size-4 peer-checked:translate-x-4"
    }
  },
  defaults: { size: :md }
)
```

The `<label>` element serves as the track, wrapping an `sr-only` checkbox
input and a thumb `<span>`. `has-[:checked]` drives the track color,
`peer-checked:` drives the thumb translation.

## Accessibility

| Attribute | Value |
|-----------|-------|
| `data-component` | `"switch"` |
| `role` | `"switch"` |
| `type` | `"checkbox"` |
| `disabled` | Native attribute |

The hidden `<input>` has `role="switch"` for screen readers.

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | Moves focus to/from the switch. |
| `Space` | Toggles the switch state. |
