---
title: AspectRatio
layout: docs
description: Displays content within a desired width-to-height ratio.
category: Layout
source: lib/kiso/themes/aspect_ratio.rb
---

## Quick Start

```erb
<%%= kui(:aspect_ratio, ratio: 16.0/9) do %>
  <%%= image_tag "photo.jpg", class: "h-full w-full rounded-md object-cover" %>
<%% end %>
```

<%= render "component_preview", component: "kiso/aspect_ratio", scenario: "playground", height: "300px" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `ratio:` | Number | `16.0/9` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

## Anatomy

```
AspectRatio
└── (children)
```

The component renders a single `<div>` with `position: relative`, `width: 100%`,
and `aspect-ratio` set to the given ratio. Children fill the container naturally.

## Usage

### 16:9 Landscape

The default ratio. Common for video embeds and hero images.

```erb
<%%= kui(:aspect_ratio) do %>
  <%%= image_tag "landscape.jpg", class: "h-full w-full rounded-lg object-cover" %>
<%% end %>
```

### Square

Use `ratio: 1` for a 1:1 square. Useful for avatars and thumbnails.

```erb
<%%= kui(:aspect_ratio, ratio: 1) do %>
  <%%= image_tag "avatar.jpg", class: "h-full w-full rounded-lg object-cover" %>
<%% end %>
```

<%= render "component_preview", component: "kiso/aspect_ratio", scenario: "square", height: "250px" %>

### Portrait

Use `ratio: 9.0/16` for a 9:16 portrait format. Useful for mobile-style content.

```erb
<%%= kui(:aspect_ratio, ratio: 9.0/16) do %>
  <%%= image_tag "portrait.jpg", class: "h-full w-full rounded-lg object-cover" %>
<%% end %>
```

<%= render "component_preview", component: "kiso/aspect_ratio", scenario: "portrait", height: "400px" %>

### Custom Ratios

Pass any numeric ratio. Common values: `4.0/3` (classic TV), `21.0/9` (ultrawide).

```erb
<%%= kui(:aspect_ratio, ratio: 4.0/3) do %>
  <%%= image_tag "photo.jpg", class: "h-full w-full object-cover" %>
<%% end %>
```

### With Video

```erb
<%%= kui(:aspect_ratio, ratio: 16.0/9) do %>
  <iframe src="https://www.youtube.com/embed/..." class="h-full w-full" allowfullscreen></iframe>
<%% end %>
```

### With Map

```erb
<%%= kui(:aspect_ratio, ratio: 16.0/9, css_classes: "rounded-lg overflow-hidden") do %>
  <iframe src="https://maps.google.com/..." class="h-full w-full"></iframe>
<%% end %>
```

## Theme

```ruby
Kiso::Themes::AspectRatio = ClassVariants.build(
  base: "relative w-full"
)
```

No variants. The `ratio:` local sets `aspect-ratio` via inline style.

## Accessibility

AspectRatio is a purely presentational wrapper. It renders a `<div>` with
`data-slot="aspect-ratio"`. The component itself has no semantic meaning;
accessible content depends on what you place inside (e.g., `alt` text on images).
