---
title: Label
layout: docs
description: Styled label element for form controls with automatic disabled state handling.
category: Form
source: lib/kiso/themes/label.rb
---

## Quick Start

```erb
<%%= kui(:label, for: "email") { "Email address" } %>
```

## Locals

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

## Usage

Label is typically used inside a Field rather than standalone:

```erb
<%%= kui(:field) do %>
  <%%= kui(:field, :label) { "Name" } %>
  <%%= kui(:input, name: "name") %>
<%% end %>
```

For standalone use, pass `for:` to associate with a form control:

```erb
<%%= kui(:label, for: "email") { "Email address" } %>
<%%= kui(:input, id: "email", name: "email") %>
```

### Disabled State

Label automatically dims when its associated control is disabled, using
`peer-disabled` and `group-data-[disabled]` selectors.

## Theme

```ruby
Kiso::Themes::Label = ClassVariants.build(
  base: "flex items-center gap-2 text-sm leading-none font-medium select-none " \
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 " \
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| Element | Native `<label>` |
| `data-slot` | `"label"` |
| `for` | Associates with form control via `for:` local or `component_options` |
