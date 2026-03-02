---
title: ColorModeSelect
layout: docs
description: A three-way theme selector for choosing between light, dark, and system color modes.
category: Element
source: lib/kiso/themes/color_mode_select.rb
---

## Quick Start

```erb
<%%= kui(:color_mode_select) %>
```

Add `kiso_theme_script` to your layout's `<head>` to prevent a flash of
unstyled content on page load:

```erb
<head>
  <%%= kiso_theme_script %>
  <%%= stylesheet_link_tag "tailwind" %>
</head>
```

## Locals

| Local | Type | Default |
|-------|------|---------|
| `size:` | `:sm` \| `:md` | `:md` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

### Size

The `size:` local is passed through to the select trigger:

```erb
<%%= kui(:color_mode_select, size: :sm) %>
<%%= kui(:color_mode_select, size: :md) %>
```

### Theme Options

The select offers three options:

| Value | Icon | Behavior |
|-------|------|----------|
| System | monitor icon | Follows the operating system preference |
| Light | sun icon | Forces light mode |
| Dark | moon icon | Forces dark mode |

### In a Settings Page

```erb
<%%= kui(:field) do %>
  <%%= kui(:label) { "Theme" } %>
  <%%= kui(:color_mode_select) %>
<%% end %>
```

### Custom Icons

Host apps can swap the icons globally:

```ruby
Kiso.configure do |c|
  c.icons[:sun] = "heroicons:sun"
  c.icons[:moon] = "heroicons:moon"
  c.icons[:monitor] = "heroicons:computer-desktop"
end
```

## How It Works

The component composes `kui(:select)` inside a wrapper div that connects the
`kiso--theme` Stimulus controller. When the user picks an option, the select
dispatches a `kiso--select:change` event. The wrapper routes this event to
`kiso--theme#set`, which reads the selected value and applies it.

When "system" is selected, the controller resolves the actual theme from the
operating system's `prefers-color-scheme` media query. The preference is
persisted to both `localStorage` and a cookie.

## Theme

```ruby
Kiso::Themes::ColorModeSelect = ClassVariants.build(
  base: ""
)
```

The visual styling comes entirely from the composed `kui(:select)` component.
The wrapper has no additional styles.

## Accessibility

| Attribute | Value |
|-----------|-------|
| `data-slot` | `"color-mode-select"` |

The select inherits all accessibility features from `kui(:select)`, including
keyboard navigation, ARIA attributes, and focus management.
