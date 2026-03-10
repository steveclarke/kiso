---
title: FieldGroup
layout: docs
description: Groups multiple Field elements with consistent vertical spacing.
category: Form
source: lib/kiso/themes/field_group.rb
---

## Quick Start

```erb
<%%= kui(:field_group) do %>
  <%%= kui(:field) do %>
    <%%= kui(:field, :label) { "First name" } %>
    <%%= kui(:input, name: "first_name") %>
  <%% end %>
  <%%= kui(:field) do %>
    <%%= kui(:field, :label) { "Last name" } %>
    <%%= kui(:input, name: "last_name") %>
  <%% end %>
<%% end %>
```

## Locals

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

## Usage

### Basic Form

Wrap fields in a FieldGroup for consistent `gap-7` spacing:

```erb
<%%= kui(:field_group) do %>
  <%%= kui(:field) do %>
    <%%= kui(:field, :label) { "Email" } %>
    <%%= kui(:input, name: "email", type: "email") %>
  <%% end %>
  <%%= kui(:field) do %>
    <%%= kui(:field, :label) { "Password" } %>
    <%%= kui(:input, name: "password", type: "password") %>
  <%% end %>
<%% end %>
```

### Nested Groups

Inner FieldGroups automatically use tighter `gap-4` spacing:

```erb
<%%= kui(:field_group) do %>
  <%%= kui(:field_group) do %>
    <%%= kui(:field) do %>
      <%%= kui(:field, :label) { "Street" } %>
      <%%= kui(:input, name: "street") %>
    <%% end %>
    <%%= kui(:field) do %>
      <%%= kui(:field, :label) { "City" } %>
      <%%= kui(:input, name: "city") %>
    <%% end %>
  <%% end %>
<%% end %>
```

## Theme

```ruby
Kiso::Themes::FieldGroup = ClassVariants.build(
  base: "group/field-group @container/field-group flex w-full flex-col gap-7 " \
        "[&>[data-slot=field-group]]:gap-4"
)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| Element | `<div>` |
| `data-slot` | `"field-group"` |

FieldGroup is a layout wrapper with no semantic role. For grouping
related controls semantically (e.g., checkbox or radio groups), use
[FieldSet](/components/field_set) instead.
