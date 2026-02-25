# Alert — Component Vision

## Current API

Composition-only. Users build the internal structure via yield + sub-parts.

```erb
<%= kiso(:alert, color: :info) do %>
  <svg class="size-5 shrink-0 mt-0.5">...</svg>
  <div class="flex-1">
    <%= kiso(:alert, :title) { "Heads up!" } %>
    <%= kiso(:alert, :description) { "You can add components." } %>
  </div>
<% end %>
```

**Problem:** Every usage requires the same boilerplate — icon sizing, `shrink-0`,
wrapper div with `flex-1`, spacing nudges. Agents will make inconsistent choices
here. The component should handle this layout.

## Target API

Props-driven for the common case. Yield for full override.

```erb
<%# Simple: just strings %>
<%= kiso(:alert, color: :info,
    title: "Heads up!",
    description: "You can add components using the CLI.") %>

<%# With icon (name resolved by icon helper) %>
<%= kiso(:alert, color: :error, variant: :soft,
    icon: "x-circle",
    title: "Error",
    description: "Something went wrong.") %>

<%# With close button %>
<%= kiso(:alert, color: :warning,
    icon: "exclamation-triangle",
    title: "Warning",
    description: "Your session expires in 5 minutes.",
    close: true) %>

<%# With actions (renders Buttons, requires Button component) %>
<%= kiso(:alert, color: :info,
    icon: "sparkles",
    title: "New feature available",
    description: "Dark mode is now supported.",
    actions: [
      { text: "Enable", color: :primary, variant: :soft, size: :xs },
      { text: "Dismiss", color: :neutral, variant: :ghost, size: :xs }
    ]) %>

<%# Full override: yield replaces all internal structure %>
<%= kiso(:alert, color: :error) do %>
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
AlertIcon = ClassVariants.build(base: "shrink-0 size-5")
AlertActions = ClassVariants.build(base: "flex flex-wrap gap-1.5 mt-2.5")
AlertClose = ClassVariants.build(base: "absolute top-2.5 right-2.5")
```

### Sub-parts (kept for advanced usage)

- `kiso(:alert, :title)` — still works for yield-based composition
- `kiso(:alert, :description)` — still works
- `kiso(:alert, :icon)` — NEW: wraps icon with proper sizing/shrink
- `kiso(:alert, :actions)` — NEW: flex container for action buttons

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
