---
title: SelectNative
layout: docs
description: A styled native HTML select element with a chevron icon overlay. No JavaScript.
category: Forms
source: lib/kiso/themes/select_native.rb
---

## Quick Start

```erb
<%%= kui(:select_native, name: "timezone") do %>
  <option value="">Select a timezone...</option>
  <option value="utc">UTC</option>
  <option value="est">Eastern (ET)</option>
  <option value="pst">Pacific (PT)</option>
<%% end %>
```

## Locals

| Local | Type | Default |
|-------|------|---------|
| `variant:` | `Symbol` | `:outline` |
| `size:` | `Symbol` | `:md` |
| `disabled:` | `Boolean` | `false` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

### Sizes

```erb
<%%= kui(:select_native, size: :sm, name: "sm") do %>
  <option>Small</option>
<%% end %>

<%%= kui(:select_native, size: :md, name: "md") do %>
  <option>Medium (default)</option>
<%% end %>

<%%= kui(:select_native, size: :lg, name: "lg") do %>
  <option>Large</option>
<%% end %>
```

### Variants

```erb
<%%= kui(:select_native, variant: :outline, name: "v") do %>
  <option>Outline (default)</option>
<%% end %>

<%%= kui(:select_native, variant: :soft, name: "v") do %>
  <option>Soft</option>
<%% end %>

<%%= kui(:select_native, variant: :ghost, name: "v") do %>
  <option>Ghost</option>
<%% end %>
```

### With Field

Wrap in `kui(:field)` for labels and validation:

```erb
<%%= kui(:field) do %>
  <%%= kui(:label, for: "role") { "Role" } %>
  <%%= kui(:select_native, name: "role", id: "role") do %>
    <option value="member">Member</option>
    <option value="admin">Admin</option>
  <%% end %>
<%% end %>
```

### Disabled

```erb
<%%= kui(:select_native, name: "timezone", disabled: true) do %>
  <option>UTC</option>
<%% end %>
```

### Option Groups

Use standard HTML `<optgroup>` elements:

```erb
<%%= kui(:select_native, name: "city") do %>
  <optgroup label="North America">
    <option value="nyc">New York</option>
    <option value="sf">San Francisco</option>
  </optgroup>
  <optgroup label="Europe">
    <option value="lon">London</option>
    <option value="par">Paris</option>
  </optgroup>
<%% end %>
```

## When to use

Use **SelectNative** for simple dropdowns where the browser's native select
behavior is sufficient (timezone pickers, role selectors, country lists).

Use **Select** (`kui(:select)`) when you need custom styling for options,
search/filtering, or multi-select behavior.

## Theme

```ruby
SelectNativeWrapper = ClassVariants.build(
  base: "relative w-full has-[select:disabled]:opacity-50"
)

SelectNative = ClassVariants.build(
  base: "text-foreground w-full min-w-0 appearance-none rounded-md pr-9
         outline-none transition-[color,box-shadow]
         disabled:pointer-events-none disabled:cursor-not-allowed
         focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary
         aria-invalid:ring-error aria-invalid:focus-visible:ring-error",
  variants: {
    variant: {
      outline: "bg-background ring ring-inset ring-accented shadow-xs",
      soft:    "bg-elevated/50 hover:bg-elevated focus:bg-elevated",
      ghost:   "bg-transparent hover:bg-elevated focus:bg-elevated"
    },
    size: {
      sm: "h-8 px-2.5 py-1 text-sm",
      md: "h-9 px-3 py-1 text-base md:text-sm",
      lg: "h-10 px-3 py-2 text-base"
    }
  },
  defaults: { variant: :outline, size: :md }
)

SelectNativeIcon = ClassVariants.build(
  base: "text-muted-foreground pointer-events-none absolute top-1/2 right-3.5
         size-4 -translate-y-1/2 opacity-50 select-none"
)
```

## Accessibility

| Attribute | Element | Value |
|-----------|---------|-------|
| `data-slot` | wrapper | `"select-native-wrapper"` |
| `data-slot` | select | `"select-native"` |
| `data-slot` | icon | `"select-native-icon"` |
| `aria-hidden` | icon | `"true"` |
| `disabled` | select | set when `disabled: true` |
