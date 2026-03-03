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
| `css_classes` | `String` | `""` |

## Sizes

Three sizes: `:sm` (24px), `:md` (32px), `:lg` (40px).

```erb
<%%= kui(:avatar, size: :sm, text: "SM") %>
<%%= kui(:avatar, size: :md, text: "MD") %>
<%%= kui(:avatar, size: :lg, text: "LG") %>
```

<%= render "component_preview", component: "kiso/avatar", scenario: "sizes" %>

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
