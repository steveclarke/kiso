---
title: Calendar
layout: docs
description: Displays a date grid for date selection, powered by Cally web components.
category: Form
source: lib/kiso/themes/calendar.rb
---

## Quick Start

```erb
<%%= kui(:calendar, value: Date.today.iso8601) %>
```

## Locals

| Local | Type | Default |
|-------|------|---------|
| `mode:` | `:single` \| `:range` | `:single` |
| `value:` | `String` (ISO 8601) | `nil` |
| `min:` | `String` (ISO 8601) | `nil` |
| `max:` | `String` (ISO 8601) | `nil` |
| `color:` | `:primary` \| `:secondary` \| `:success` \| `:info` \| `:warning` \| `:error` \| `:neutral` | `:primary` |
| `variant:` | `:solid` \| `:outline` \| `:soft` \| `:subtle` | `:solid` |
| `size:` | `:sm` \| `:md` \| `:lg` | `:md` |
| `locale:` | `String` | `nil` (browser default) |
| `show_outside_days:` | `Boolean` | `true` |
| `months:` | `Integer` | `1` |
| `first_day_of_week:` | `Integer` (0=Sun, 1=Mon) | `nil` (Cally default) |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

### Color

```erb
<%%= kui(:calendar, color: :success, value: "2026-03-15") %>
<%%= kui(:calendar, color: :error, value: "2026-03-15") %>
```

### Variant

```erb
<%%= kui(:calendar, variant: :solid, value: "2026-03-15") %>
<%%= kui(:calendar, variant: :outline, value: "2026-03-15") %>
<%%= kui(:calendar, variant: :soft, value: "2026-03-15") %>
<%%= kui(:calendar, variant: :subtle, value: "2026-03-15") %>
```

### Range Selection

```erb
<%%= kui(:calendar, mode: :range, months: 2) %>
```

### Multiple Months

```erb
<%%= kui(:calendar, months: 3, value: "2026-03-15") %>
```

### Min / Max Constraints

```erb
<%%= kui(:calendar, min: "2026-03-01", max: "2026-03-31") %>
```

## Dependencies

Calendar wraps [Cally](https://wicky.nillia.ms/cally/) web components.
The Cally library is vendored in the engine — no additional installation
needed for importmap apps. Bundler apps should install `cally` as a peer
dependency.
