---
title: Date Picker
layout: docs
description: A button that opens a calendar popover for date selection.
category: Form
source: lib/kiso/themes/date_picker.rb
---

## Quick Start

```erb
<%%= kui(:date_picker, name: "event_date") %>
```

## Locals

| Local | Type | Default |
|-------|------|---------|
| `value:` | `String` (ISO 8601) | `nil` |
| `placeholder:` | `String` | `"Pick a date"` |
| `name:` | `String` | `nil` |
| `required:` | `Boolean` | `false` |
| `color:` | `:primary` \| `:secondary` \| `:success` \| `:info` \| `:warning` \| `:error` \| `:neutral` | `:primary` |
| `variant:` | `:solid` \| `:outline` \| `:soft` \| `:subtle` | `:solid` |
| `size:` | `:sm` \| `:md` \| `:lg` | `:md` |
| `min:` | `String` (ISO 8601) | `nil` |
| `max:` | `String` (ISO 8601) | `nil` |
| `locale:` | `String` | `nil` |
| `months:` | `Integer` | `1` |
| `mode:` | `:single` \| `:range` | `:single` |
| `button_variant:` | Symbol | `:outline` |
| `button_size:` | Symbol | `:md` |
| `show_outside_days:` | `Boolean` | `true` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

### Basic

```erb
<%%= kui(:date_picker, name: "date") %>
```

### With Pre-selected Value

```erb
<%%= kui(:date_picker, value: Date.today.iso8601, name: "start_date") %>
```

### In a Form

```erb
<%%= kui(:field) do %>
  <%%= kui(:field, :label) { "Event Date" } %>
  <%%= kui(:date_picker, name: "event[date]", required: true) %>
  <%%= kui(:field, :description) { "Choose when the event takes place." } %>
<%% end %>
```

### With Constraints

```erb
<%%= kui(:date_picker, name: "booking_date",
    min: Date.today.iso8601,
    max: (Date.today + 90).iso8601) %>
```

## How It Works

Date Picker composes three existing primitives:

1. **Button** — trigger with calendar icon and date display
2. **Popover** — native `[popover]` API with Floating UI positioning
3. **Calendar** — Cally web component for date grid

When a date is selected, the popover closes automatically and the button
updates to show the formatted date. The ISO 8601 value is synced to a
hidden `<input>` for form submission.
