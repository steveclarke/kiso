---
title: Slider
layout: docs
description: An input where the user selects a value from within a given range.
category: Form
source: lib/kiso/themes/slider.rb
---

## Quick Start

```erb
<%%= kui(:slider, value: 75, max: 100, step: 1) %>
```

<%= render "component_preview", component: "kiso/form/slider", scenario: "playground", height: "100px" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `min:` | Integer | `0` |
| `max:` | Integer | `100` |
| `step:` | Integer | `1` |
| `value:` | Integer | `nil` (uses `min`) |
| `name:` | String | `nil` |
| `id:` | String | `nil` |
| `disabled:` | Boolean | `false` |
| `size:` | `:sm` \| `:md` \| `:lg` | `:md` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

## Anatomy

```
Slider (root)
├── input[type=range]    (hidden, form submission)
├── Slider Track         (background track)
│   └── Slider Range     (filled portion)
└── Slider Thumb         (draggable handle)
```

## Usage

### Size

Use the `size:` local to change the track height and thumb size.

```erb
<%%= kui(:slider, size: :sm, value: 50) %>
<%%= kui(:slider, size: :md, value: 50) %>
<%%= kui(:slider, size: :lg, value: 50) %>
```

| Size | Track height | Thumb size |
|------|-------------|------------|
| `:sm` | `h-1` | `size-3` |
| `:md` (default) | `h-1.5` | `size-4` |
| `:lg` | `h-2` | `size-5` |

### Step Values

Use `min:`, `max:`, and `step:` to control the range and precision.

```erb
<%%= kui(:slider, min: 0, max: 1, step: 0.1, value: 0.5) %>
```

### Disabled

Use `disabled: true` to prevent interaction. The slider appears at 50% opacity.

```erb
<%%= kui(:slider, value: 50, disabled: true) %>
```

### With Field

Compose with a Field and Label for form usage.

```erb
<%%= kui(:field) do %>
  <%%= kui(:field, :label, for: :volume) { "Volume" } %>
  <%%= kui(:slider, id: :volume, name: :volume, value: 33) %>
<%% end %>
```

### Form Submission

Include `name:` to submit the value with a form. The hidden `<input type="range">`
carries the value.

```erb
<%%= form_with url: "/settings" do |f| %>
  <%%= kui(:slider, name: "settings[brightness]", value: 80, min: 0, max: 100) %>
<%% end %>
```

## Theme

```ruby
Kiso::Themes::Slider = ClassVariants.build(
  base: "relative flex w-full touch-none items-center select-none"
)

SliderTrack = ClassVariants.build(
  base: "relative grow cursor-pointer overflow-hidden rounded-full bg-muted w-full",
  variants: { size: { sm: "h-1", md: "h-1.5", lg: "h-2" } },
  defaults: { size: :md }
)

SliderRange = ClassVariants.build(
  base: "absolute h-full bg-primary"
)

SliderThumb = ClassVariants.build(
  base: "block shrink-0 rounded-full border border-primary bg-white shadow-sm ...",
  variants: { size: { sm: "size-3", md: "size-4", lg: "size-5" } },
  defaults: { size: :md }
)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| `role` | `slider` (on thumb) |
| `aria-valuemin` | Minimum value |
| `aria-valuemax` | Maximum value |
| `aria-valuenow` | Current value |
| `data-slot` | `"slider"` |

### Keyboard

| Key | Action |
|-----|--------|
| `ArrowRight` / `ArrowUp` | Increase by step |
| `ArrowLeft` / `ArrowDown` | Decrease by step |
| `PageUp` | Increase by 10x step |
| `PageDown` | Decrease by 10x step |
| `Home` | Jump to minimum |
| `End` | Jump to maximum |

The slider dispatches a `kiso--slider:change` custom event with `{ value }` detail
on every value change. Use Stimulus actions to react to changes.
