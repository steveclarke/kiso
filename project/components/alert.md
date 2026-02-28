# Alert — Component Vision

## Current API

Composition-only via yield + sub-parts. Uses CSS Grid layout — when an SVG
icon is a direct child, the grid automatically creates a two-column layout.
No wrapper divs or manual icon sizing needed.

```erb
<%= kui(:alert, color: :info) do %>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">...</svg>
  <%= kui(:alert, :title) { "Heads up!" } %>
  <%= kui(:alert, :description) { "You can add components." } %>
<% end %>
```

**Remaining problem:** Every usage still requires manually placing an SVG.
The props-driven API (below) will accept an icon name and handle rendering.

## Target API

Props-driven for the common case. Yield for full override.

```erb
<%# Simple: just strings %>
<%= kui(:alert, color: :info,
    title: "Heads up!",
    description: "You can add components using the CLI.") %>

<%# With icon (name resolved by icon helper) %>
<%= kui(:alert, color: :error, variant: :soft,
    icon: "x-circle",
    title: "Error",
    description: "Something went wrong.") %>

<%# With close button %>
<%= kui(:alert, color: :warning,
    icon: "exclamation-triangle",
    title: "Warning",
    description: "Your session expires in 5 minutes.",
    close: true) %>

<%# With actions (renders Buttons, requires Button component) %>
<%= kui(:alert, color: :info,
    icon: "sparkles",
    title: "New feature available",
    description: "Dark mode is now supported.",
    actions: [
      { text: "Enable", color: :primary, variant: :soft, size: :xs },
      { text: "Dismiss", color: :neutral, variant: :ghost, size: :xs }
    ]) %>

<%# Full override: yield replaces all internal structure %>
<%= kui(:alert, color: :error) do %>
  anything you want — icon, custom layout, etc.
<% end %>
```

### Target locals

| Local | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | String | nil | Alert title. Bold, inherits parent color. |
| `description` | String | nil | Alert description. Rendered at `opacity-90`. |
| `icon` | String | nil | Icon name (leading). Rendered via icon helper. |
| `close` | Boolean | false | Show close button (X icon, top-right). |
| `close_url` | String | nil | If set, close button is a link instead of dismiss. |
| `actions` | Array | `[]` | Array of Button prop hashes. Rendered as xs buttons. |
| `color` | Symbol | `:primary` | One of 7 semantic colors. |
| `variant` | Symbol | `:soft` | solid, outline, soft, subtle. |
| `css_classes` | String | `""` | Override classes. |
| `**component_options` | Hash | `{}` | Arbitrary HTML attributes. |

### Behavior

- If `title:` or `description:` is provided (and no block), the partial renders
  the standard layout: `[icon] [wrapper: title + description + actions] [close]`
- If a block is given, it replaces all internal structure (current behavior).
- `close: true` renders a neutral link-style button with X icon. Dismissal via
  Stimulus controller (`data-action="click->kiso--alert#dismiss"`).
- `actions:` renders Button components in a flex-wrap container below the
  description.

### Theme additions needed

```ruby
# Icon sizing is handled by the Alert grid: [&>svg]:size-4
# No separate AlertIcon theme needed for the basic case.
AlertActions = ClassVariants.build(base: "col-start-2 flex flex-wrap gap-1.5 mt-2.5")
AlertClose = ClassVariants.build(base: "absolute top-2.5 right-2.5")
```

### Sub-parts (kept for advanced usage)

- `kui(:alert, :title)` — still works for yield-based composition
- `kui(:alert, :description)` — still works
- `kui(:alert, :icon)` — NEW: wraps icon with proper sizing/shrink
- `kui(:alert, :actions)` — NEW: flex container for action buttons

## Dependencies

- **Icon helper** — renders icon by name (needed for `icon:` and `close:`)
- **Button component** — needed for `actions:` and `close:` rendering
- **Stimulus controller** — `kiso--alert` for dismiss behavior (close button)

## Migration

Current yield-based API is permanent. Props are additive. The partial checks
`block_given?` to decide which path to take.

## Phased implementation

1. **Now (done):** Composition-only with sub-parts. Color × variant theming.
2. **After Icon helper:** Add `icon:` prop, `AlertIcon` theme.
3. **After Button:** Add `actions:`, `close:` props.
4. **After Stimulus setup:** Add dismiss controller for close.
