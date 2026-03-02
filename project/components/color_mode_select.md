# ColorModeSelect

A three-way theme selector (Light, Dark, System) built on top of `kui(:select)`.
Allows users to choose between explicit light/dark modes or follow the OS
preference.

## Current API

```erb
<%= kui(:color_mode_select) %>
<%= kui(:color_mode_select, size: :sm) %>
```

**Locals:** `size:`, `css_classes:`, `**component_options`

## Target API

Same as current. The select is a thin composition wrapper.

## Locals

| Local | Type | Default | Description |
|-------|------|---------|-------------|
| `size` | Symbol | `:md` | Passed through to the select trigger (sm, md) |
| `css_classes` | String | `""` | Override classes on the wrapper div |
| `**component_options` | Hash | `{}` | Arbitrary HTML attributes |

## How It Works

The component wraps `kui(:select)` inside a div that connects the
`kiso--theme` Stimulus controller. The select dispatches
`kiso--select:change` events, which are routed to `kiso--theme#set`.

The `set` action reads `event.detail.value` to get the selected preference
("light", "dark", or "system"). When "system" is selected, the controller
resolves to the OS preference via `matchMedia("(prefers-color-scheme: dark)")`.

## Three Options

| Value | Icon | Behavior |
|-------|------|----------|
| `system` | `kiso_component_icon(:monitor)` | Follows OS `prefers-color-scheme` |
| `light` | `kiso_component_icon(:sun)` | Forces light mode |
| `dark` | `kiso_component_icon(:moon)` | Forces dark mode |

## Dependencies

- **Components:** `kui(:select)` and its sub-parts (trigger, value, content, item)
- **Stimulus:** `kiso--theme` controller (set mode, persist)
- **Stimulus:** `kiso--select` controller (built into `kui(:select)`)
- **Helper:** `kiso_theme_script` in `<head>` for FOUC-free initial theme

## Design Decisions

- **Composition over custom widget.** Rather than building a custom three-way
  toggle, the component composes `kui(:select)` for consistent dropdown
  behavior, keyboard navigation, and accessibility.
- **Event-based wiring.** The theme controller listens for `kiso--select:change`
  rather than coupling to the select internals. Any component that dispatches
  a `change` event with `detail.value` can drive the theme controller.
- **Icons inline in items.** Each select item renders its icon inline via
  `kiso_component_icon`. The icons are purely decorative (opacity-60).
