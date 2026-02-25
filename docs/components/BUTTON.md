# Button — Component Vision

## Current API

Interactive element with smart tag, 6 variants, 5 sizes, 7 colors.

```erb
<%# Basic %>
<%= kiso(:button) { "Click me" } %>

<%# Color + variant %>
<%= kiso(:button, color: :error, variant: :solid) { "Delete" } %>

<%# As link (renders <a>) %>
<%= kiso(:button, href: "/settings", variant: :outline) { "Settings" } %>

<%# Ghost + link variants %>
<%= kiso(:button, variant: :ghost) { "Cancel" } %>
<%= kiso(:button, variant: :link) { "Learn more" } %>

<%# Disabled, full-width, submit %>
<%= kiso(:button, disabled: true) { "Unavailable" } %>
<%= kiso(:button, block: true) { "Continue" } %>
<%= kiso(:button, type: :submit) { "Save" } %>

<%# With inline icon (yield-based) %>
<%= kiso(:button, variant: :outline) do %>
  <svg class="size-4">...</svg>
  Download
<% end %>
```

### Current locals

| Local | Type | Default | Description |
|-------|------|---------|-------------|
| `color` | Symbol | `:primary` | One of 7 semantic colors. |
| `variant` | Symbol | `:solid` | solid, outline, soft, subtle, ghost, link. |
| `size` | Symbol | `:md` | xs, sm, md, lg, xl. |
| `disabled` | Boolean | `false` | Disables the button. |
| `block` | Boolean | `false` | Full-width button. |
| `type` | Symbol | `:button` | HTML type (button, submit, reset). Ignored for links. |
| `href` | String | nil | When present, renders `<a>` instead of `<button>`. |
| `css_classes` | String | `""` | Override classes. |
| `**component_options` | Hash | `{}` | Arbitrary HTML attributes. |

## Target API

Props-driven for common patterns, yield for override.

```erb
<%# Simple: text as prop %>
<%= kiso(:button, text: "Save", color: :primary) %>

<%# With leading icon %>
<%= kiso(:button, text: "Download", icon: "arrow-down-tray") %>

<%# With trailing icon %>
<%= kiso(:button, text: "Next", trailing_icon: "chevron-right") %>

<%# Icon-only (square mode) %>
<%= kiso(:button, icon: "plus", square: true, size: :sm) %>

<%# Loading state %>
<%= kiso(:button, text: "Saving...", loading: true) %>

<%# Yield still works for full control %>
<%= kiso(:button, color: :info, variant: :soft) do %>
  <svg class="size-4">...</svg>
  Custom content
<% end %>
```

### Target locals (additions)

| Local | Type | Default | Description |
|-------|------|---------|-------------|
| `text` | String | nil | Button label. Rendered internally if provided. |
| `icon` | String | nil | Leading icon name (via icon helper). |
| `trailing_icon` | String | nil | Trailing icon name. |
| `loading` | Boolean | false | Shows spinner, disables interaction. |
| `square` | Boolean | false | Equal padding (icon-only buttons). |

## Dependencies

- **Icon helper** — needed for `icon:`, `trailing_icon:`, `loading:` props

## Migration

Current yield-based API is permanent. Props are additive.

## Phased implementation

1. **Now:** Yield-only, smart tag, 6 variants, 5 sizes, block, disabled.
2. **After Icon helper:** Add `text:`, `icon:`, `trailing_icon:`, `square:`.
3. **After Stimulus setup:** Add `loading:` with spinner.
