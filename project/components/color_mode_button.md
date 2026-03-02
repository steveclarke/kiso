# ColorModeButton

A toggle button that switches between light and dark mode. Displays a sun icon
in light mode and a moon icon in dark mode.

## Current API

```erb
<%= kui(:color_mode_button) %>
<%= kui(:color_mode_button, size: :sm) %>
<%= kui(:color_mode_button, size: :lg) %>
```

**Locals:** `size:`, `css_classes:`, `**component_options`

## Target API

Same as current. The button is intentionally simple.

## Locals

| Local | Type | Default | Description |
|-------|------|---------|-------------|
| `size` | Symbol | `:md` | sm, md, lg |
| `css_classes` | String | `""` | Override classes, merged via tailwind_merge |
| `**component_options` | Hash | `{}` | Arbitrary HTML attributes |

## How It Works

The button wraps the `kiso--theme` Stimulus controller. Clicking calls
`kiso--theme#toggle`, which toggles the `.dark` class on `<html>` and
persists the preference to both `localStorage` and a cookie.

Two icon spans are rendered inside the button:
- `data-slot="color-mode-icon-light"` — visible in light mode, hidden in dark
- `data-slot="color-mode-icon-dark"` — hidden in light mode, visible in dark

Icon visibility is driven by CSS rules in `color-mode.css` that key off the
`.dark` class on `<html>`.

## Swappable Icons

Icons are rendered via `kiso_component_icon(:sun)` and
`kiso_component_icon(:moon)`. Host apps can swap them globally:

```ruby
Kiso.configure do |c|
  c.icons[:sun] = "heroicons:sun"
  c.icons[:moon] = "heroicons:moon"
end
```

## Dependencies

- **Stimulus:** `kiso--theme` controller (toggle, persist to localStorage + cookie)
- **CSS:** `app/assets/tailwind/kiso/color-mode.css` (icon visibility toggling)
- **Helper:** `kiso_theme_script` in `<head>` for FOUC-free initial theme

## Design Decisions

- **No three-way cycle.** The button toggles light/dark only. For
  light/dark/system, use `color_mode_select` instead.
- **No color axis.** The button uses foreground/accent tokens like other
  toolbar-style controls. It does not use the compound variant system.
- **CSS-driven icon swap.** No JavaScript needed to show/hide icons. The
  `.dark` class on `<html>` drives visibility via CSS selectors.
