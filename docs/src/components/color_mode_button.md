---
title: ColorModeButton
layout: docs
description: A toggle button that switches between light and dark mode.
category: Element
source: lib/kiso/themes/color_mode_button.rb
---

## Quick Start

```erb
<%%= kui(:color_mode_button) %>
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
| `size:` | `:sm` \| `:md` \| `:lg` | `:md` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

### Size

Use the `size:` local to change the button size.

```erb
<%%= kui(:color_mode_button, size: :sm) %>
<%%= kui(:color_mode_button, size: :md) %>
<%%= kui(:color_mode_button, size: :lg) %>
```

| Size | Dimensions | Icon size |
|------|-----------|-----------|
| `sm` | 28x28 | 14px |
| `md` | 32x32 | 16px |
| `lg` | 36x36 | 20px |

### In a Dashboard Navbar

The color mode button is commonly placed in the dashboard topbar:

```erb
<%%= kui(:dashboard_navbar) do %>
  <%%= kui(:dashboard_navbar, :toggle) %>
  <div class="flex-1"></div>
  <%%= kui(:color_mode_button) %>
<%% end %>
```

### Custom Icons

Host apps can swap the sun and moon icons globally:

```ruby
Kiso.configure do |c|
  c.icons[:sun] = "heroicons:sun"
  c.icons[:moon] = "heroicons:moon"
end
```

## Theme

```ruby
Kiso::Themes::ColorModeButton = ClassVariants.build(
  base: "inline-flex items-center justify-center rounded-md
         text-foreground/50 hover:text-foreground hover:bg-accent
         transition-colors duration-150 shrink-0 cursor-pointer",
  variants: {
    size: {
      sm: "w-7 h-7 [&>svg]:size-3.5",
      md: "w-8 h-8 [&>svg]:size-4",
      lg: "w-9 h-9 [&>svg]:size-5"
    }
  },
  defaults: { size: :md }
)
```

## How It Works

Clicking the button calls `kiso--theme#toggle`, which toggles the `.dark`
class on `<html>` and persists the preference to `localStorage` and a cookie.

Two icon spans are rendered inside the button. CSS rules in `color-mode.css`
show the sun icon in light mode and the moon icon in dark mode, keyed off
the `.dark` class on `<html>`.

## Accessibility

| Attribute | Value |
|-----------|-------|
| `data-slot` | `"color-mode-button"` |
| `aria-label` | `"Toggle color mode"` |
| `type` | `"button"` |

The button uses `aria-label` since the icon-only content has no visible text.
