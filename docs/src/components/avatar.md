---
title: Avatar
layout: docs
description: An image element with a fallback for representing the user.
category: Data Display
source: lib/kiso/themes/avatar.rb
---

## Quick Start

```erb
<%%= kui(:avatar, text: "CN") %>
<%%= kui(:avatar, src: "/photo.jpg", alt: "User", text: "CN") %>
```

<%= render "component_preview", component: "kiso/avatar", scenario: "playground" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `src` | `String` | `nil` |
| `alt` | `String` | `""` |
| `text` | `String` | `nil` |
| `size` | `Symbol` | `:md` |
| `color` | `String` | `nil` |
| `contrast_threshold` | `Float` | `nil` |
| `ui` | `Hash` | `{}` |
| `css_classes` | `String` | `""` |

## Sizes

Six sizes: `:xs` (20px), `:sm` (24px), `:md` (32px), `:lg` (40px), `:xl` (64px), `:2xl` (80px).

```erb
<%%= kui(:avatar, size: :xs, text: "XS") %>
<%%= kui(:avatar, size: :sm, text: "SM") %>
<%%= kui(:avatar, size: :md, text: "MD") %>
<%%= kui(:avatar, size: :lg, text: "LG") %>
<%%= kui(:avatar, size: :xl, text: "XL") %>
<%%= kui(:avatar, size: :"2xl", text: "2X") %>
```

<%= render "component_preview", component: "kiso/avatar", scenario: "sizes" %>

## Custom Colors

Pass a hex color value to `color:` for per-user or per-entity backgrounds.
Text contrast (white or black) is computed automatically using WCAG relative
luminance.

```erb
<%%= kui(:avatar, text: "SC", color: "#e11d48") %>
<%%= kui(:avatar, text: "JD", color: "#2563eb") %>
<%%= kui(:avatar, text: "YL", color: "#eab308") %>
```

The default threshold (0.42) works well for Tailwind 500-shade palettes. Override
per-instance with `contrast_threshold:` or globally via `Kiso.configure`:

```ruby
# config/initializers/kiso.rb
Kiso.configure do |config|
  config.contrast_threshold = 0.36
end
```

<%= render "component_preview", component: "kiso/avatar", scenario: "custom_colors" %>

## With Badge

Use the composition API to add a status badge.

```erb
<%%= kui(:avatar) do %>
  <%%= kui(:avatar, :fallback) { "CN" } %>
  <%%= kui(:avatar, :badge) %>
<%% end %>
```

<%= render "component_preview", component: "kiso/avatar", scenario: "with_badge" %>

## Group

Overlapping avatars with an optional overflow count.

```erb
<%%= kui(:avatar, :group) do %>
  <%%= kui(:avatar, text: "CN") %>
  <%%= kui(:avatar, text: "LR") %>
  <%%= kui(:avatar, text: "ER") %>
  <%%= kui(:avatar, :group_count) { "+3" } %>
<%% end %>
```

<%= render "component_preview", component: "kiso/avatar", scenario: "group" %>

## Sub-parts

| Sub-part | Description |
|----------|-------------|
| `:image` | Profile photo `<img>` — hides on load error to reveal fallback |
| `:fallback` | Initials or icon shown when no image |
| `:badge` | Status indicator dot positioned at bottom-right |
| `:group` | Overlapping container for multiple avatars |
| `:group_count` | Overflow indicator (e.g., "+3") |
