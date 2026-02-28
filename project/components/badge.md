# Badge — Component Vision

## Current API

Inline label. Composition-only via yield.

```erb
<%= kui(:badge, color: :success, variant: :soft) { "Active" } %>
<%= kui(:badge, color: :error, variant: :solid, size: :sm) { "Failed" } %>
```

**Locals:** `color:`, `variant:`, `size:`, `css_classes:`, `**component_options`

## Target API

Props-driven for common patterns, yield for full override.

```erb
<%# Simple: text as prop %>
<%= kui(:badge, text: "Active", color: :success) %>

<%# With leading icon %>
<%= kui(:badge, text: "Active", color: :success, icon: "check-circle") %>

<%# With trailing icon %>
<%= kui(:badge, text: "3", color: :error, trailing_icon: "arrow-up") %>

<%# Yield still works for full control %>
<%= kui(:badge, color: :info) do %>
  <svg class="size-3">...</svg>
  Custom content
<% end %>
```

### Target locals

| Local | Type | Default | Description |
|-------|------|---------|-------------|
| `text` | String | nil | Badge label text. If provided, renders internally. |
| `icon` | String | nil | Leading icon name (rendered via icon helper). |
| `trailing_icon` | String | nil | Trailing icon name. |
| `color` | Symbol | `:primary` | One of 7 semantic colors. |
| `variant` | Symbol | `:soft` | solid, outline, soft, subtle. |
| `size` | Symbol | `:md` | xs, sm, md, lg, xl. |
| `css_classes` | String | `""` | Override classes, merged via tailwind_merge. |
| `**component_options` | Hash | `{}` | Arbitrary HTML attributes. |

### Theme additions needed

```ruby
# Icon sizing per badge size
AlertIcon = ClassVariants.build(
  base: "shrink-0",
  variants: {
    size: {
      xs: "size-3", sm: "size-3", md: "size-4", lg: "size-5", xl: "size-6"
    }
  }
)
```

## Dependencies

- Icon helper (renders icon by name — Heroicons, Iconify, or SVG sprite)

## Migration

Current yield-based API stays forever. Props are additive — no breaking changes.
