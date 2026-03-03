# Avatar

An image element with a fallback for representing the user.

## Current API

```erb
<%# Props-based (common case) %>
<%= kui(:avatar, src: "/photo.jpg", alt: "Steve Clarke", text: "SC") %>
<%= kui(:avatar, text: "SC", size: :lg) %>

<%# Composition-based (full control) %>
<%= kui(:avatar) do %>
  <%= kui(:avatar, :image, src: "/photo.jpg", alt: "Steve Clarke") %>
  <%= kui(:avatar, :fallback) { "SC" } %>
  <%= kui(:avatar, :badge, css_classes: "bg-success") %>
<% end %>

<%# Group %>
<%= kui(:avatar, :group) do %>
  <%= kui(:avatar, text: "CN") %>
  <%= kui(:avatar, text: "LR") %>
  <%= kui(:avatar, :group_count) { "+3" } %>
<% end %>
```

## Target API

Same as current. Future additions (deferred):
- Icon fallback via `icon:` prop (when no image or text)
- Chip/status wrapper integration

## Sub-parts

| Part | Theme module | Purpose |
|------|-------------|---------|
| `:image` | `AvatarImage` | Profile photo, absolute positioned over fallback |
| `:fallback` | `AvatarFallback` | Initials or icon shown when no image |
| `:badge` | `AvatarBadge` | Status dot at bottom-right, size-responsive |
| `:group` | `AvatarGroup` | Overlapping container with ring borders |
| `:group_count` | `AvatarGroupCount` | Overflow indicator (e.g., "+3") |

## Variants

| Variant | Values | Default |
|---------|--------|---------|
| `size` | `:sm` (24px), `:md` (32px), `:lg` (40px) | `:md` |

## Design Decisions

- **No `overflow-hidden` on root.** Removed to allow AvatarBadge to render
  outside the circle boundary with its ring. Image uses `rounded-full` for
  circular clipping instead.
- **Image absolute-positioned over fallback.** Both render in the DOM (unlike
  shadcn's Radix which conditionally renders one). Image overlays fallback
  via `absolute inset-0`. On load error, `onerror` hides the image, revealing
  the fallback underneath.
- **`data-size` attribute on root.** Drives AvatarBadge sizing via
  `group-data-[size=*]/avatar:` selectors. Root sizing uses ClassVariants.
- **`font-medium` on fallback.** Follows Nuxt UI convention (not in shadcn).
- **Group uses `-space-x-2` + `ring-2`.** Matches shadcn's overlapping pattern
  with white ring borders between avatars.

## Dependencies

None. Pure CSS, no Stimulus. Inline `onerror` on image for fallback
(CSP-safe Stimulus controller could replace this in the future).
