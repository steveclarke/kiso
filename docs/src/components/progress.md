---
title: Progress
layout: docs
description: A visual progress bar showing task completion with color, size, and animation variants.
category: Element
source: lib/kiso/themes/progress.rb
---

## Quick Start

```erb
<%%= kui(:progress, value: 33) %>
```

<%= render "component_preview", component: "kiso/progress", scenario: "playground" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `value:` | `Integer` or `nil` | `nil` (indeterminate) |
| `max:` | `Integer` or `Array` | `100` |
| `status:` | `Boolean` | `false` |
| `color:` | `Symbol` | `:primary` |
| `size:` | `Symbol` | `:md` |
| `animation:` | `Symbol` | `:carousel` |
| `orientation:` | `Symbol` | `:horizontal` |
| `inverted:` | `Boolean` | `false` |
| `ui:` | `Hash` | `{}` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

### Color

```erb
<%%= kui(:progress, value: 60, color: :primary) %>
<%%= kui(:progress, value: 60, color: :success) %>
<%%= kui(:progress, value: 60, color: :error) %>
```

<%= render "component_preview", component: "kiso/progress", scenario: "colors" %>

### Size

```erb
<%%= kui(:progress, value: 60, size: :xs) %>
<%%= kui(:progress, value: 60, size: :md) %>
<%%= kui(:progress, value: 60, size: :xl) %>
```

<%= render "component_preview", component: "kiso/progress", scenario: "sizes" %>

### Indeterminate

Omit `value:` for an animated indeterminate state. Choose from four animation styles.

```erb
<%%= kui(:progress) %>
<%%= kui(:progress, animation: :swing) %>
<%%= kui(:progress, animation: :elastic) %>
```

<%= render "component_preview", component: "kiso/progress", scenario: "indeterminate" %>

### Status Text

Show percentage above the bar with `status: true`.

```erb
<%%= kui(:progress, value: 60, status: true) %>
```

<%= render "component_preview", component: "kiso/progress", scenario: "status" %>

### Steps

Pass an array to `max:` to show step labels. The `value:` is the current step index.

```erb
<%%= kui(:progress, value: 1, max: ["Sign Up", "Profile", "Complete"]) %>
```

<%= render "component_preview", component: "kiso/progress", scenario: "steps" %>

## Theme

```ruby
# lib/kiso/themes/progress.rb
Kiso::Themes::ProgressTrack = ClassVariants.build(
  base: "relative overflow-hidden rounded-full bg-accented",
  # ...orientation × size compound variants
)

Kiso::Themes::ProgressIndicator = ClassVariants.build(
  base: "rounded-full size-full transition-transform duration-200 ease-out",
  variants: {
    color: {
      primary: "bg-primary",
      # ...
    }
  }
)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| `role` | `"progressbar"` (on track) |
| `aria-valuenow` | Current value (omitted when indeterminate) |
| `aria-valuemin` | `0` |
| `aria-valuemax` | Numeric max |
| `aria-label` | `"Progress"` (i18n: `kiso.progress.label`) |
| `data-state` | `"indeterminate"` or `"loading"` |
