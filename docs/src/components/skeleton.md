---
title: Skeleton
layout: docs
description: A placeholder element displayed while content is loading.
category: Layout
source: lib/kiso/themes/skeleton.rb
---

## Quick Start

```erb
<%%= kui(:skeleton, css_classes: "h-4 w-[250px]") %>
```

<%= render "component_preview", component: "kiso/skeleton", scenario: "playground" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

Skeleton has no variants. Control shape and size entirely through `css_classes:`.

### Text Lines

```erb
<div class="flex flex-col gap-2">
  <%%= kui(:skeleton, css_classes: "h-4 w-[250px]") %>
  <%%= kui(:skeleton, css_classes: "h-4 w-[200px]") %>
</div>
```

### Circle (Avatar Placeholder)

```erb
<%%= kui(:skeleton, css_classes: "h-12 w-12 rounded-full") %>
```

### Card Placeholder

```erb
<div class="flex items-center gap-4">
  <%%= kui(:skeleton, css_classes: "h-12 w-12 rounded-full") %>
  <div class="flex flex-col gap-2">
    <%%= kui(:skeleton, css_classes: "h-4 w-[250px]") %>
    <%%= kui(:skeleton, css_classes: "h-4 w-[200px]") %>
  </div>
</div>
```

## Theme

```ruby
# lib/kiso/themes/skeleton.rb
Kiso::Themes::Skeleton = ClassVariants.build(
  base: "animate-pulse rounded-md bg-elevated"
)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| `data-slot` | `"skeleton"` |

Skeleton is a decorative element with no semantic role. Screen readers
skip it automatically since it contains no text content.
