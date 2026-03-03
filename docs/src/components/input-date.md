---
title: Input Date
layout: docs
description: A segmented date input with individual month, day, and year fields.
category: Form
source: lib/kiso/themes/input_date.rb
---

## Quick Start

```erb
<%%= kui(:input_date, name: "birth_date") %>
```

## Locals

| Local | Type | Default |
|-------|------|---------|
| `value:` | `String` (ISO 8601) | `nil` |
| `name:` | `String` | `nil` |
| `variant:` | `:outline` \| `:soft` \| `:ghost` | `:outline` |
| `size:` | `:sm` \| `:md` \| `:lg` | `:md` |
| `required:` | `Boolean` | `false` |
| `disabled:` | `Boolean` | `false` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

### Basic

```erb
<%%= kui(:input_date, name: "date") %>
```

### With Value

```erb
<%%= kui(:input_date, value: "2026-03-15", name: "date") %>
```

### In a Form

```erb
<%%= kui(:field) do %>
  <%%= kui(:field, :label) { "Birth Date" } %>
  <%%= kui(:input_date, name: "person[birth_date]", required: true) %>
  <%%= kui(:field, :description) { "Enter your date of birth." } %>
<%% end %>
```

### Sizes

```erb
<%%= kui(:input_date, size: :sm) %>
<%%= kui(:input_date, size: :md) %>
<%%= kui(:input_date, size: :lg) %>
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Arrow Up | Increment segment value |
| Arrow Down | Decrement segment value |
| Arrow Right | Move to next segment |
| Arrow Left | Move to previous segment |
| Number keys | Type value (auto-advances when complete) |
| Backspace | Clear segment |
| Tab | Move to next segment (browser native) |

## How It Works

Each segment (MM, DD, YYYY) is an independent `<span>` with
`role="spinbutton"` and full ARIA attributes. A Stimulus controller
handles keyboard input, validates ranges, and syncs the combined ISO 8601
value to a hidden `<input>` for form submission.
