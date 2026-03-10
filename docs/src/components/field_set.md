---
title: FieldSet
layout: docs
description: Semantic fieldset grouping for related form controls like checkbox and radio groups.
category: Form
source: lib/kiso/themes/field_set.rb
---

## Quick Start

```erb
<%%= kui(:field_set) do %>
  <%%= kui(:field_set, :legend) { "Notifications" } %>
  <%%= kui(:checkbox, name: "email_notifications") { "Email" } %>
  <%%= kui(:checkbox, name: "sms_notifications") { "SMS" } %>
<%% end %>
```

## Locals

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

## Sub-parts

| Part | Usage | Purpose |
|------|-------|---------|
| `:legend` | `kui(:field_set, :legend)` | Heading for the fieldset |

### Legend Locals

| Local | Type | Default |
|-------|------|---------|
| `variant:` | `:legend` \| `:label` | `:legend` |
| `css_classes:` | String | `""` |

## Usage

### With Checkbox Group

FieldSet automatically tightens gap when containing checkbox or radio groups:

```erb
<%%= kui(:field_set) do %>
  <%%= kui(:field_set, :legend) { "Preferences" } %>
  <%%= tag.div data: { slot: "checkbox-group" } do %>
    <%%= kui(:checkbox, name: "dark_mode") { "Dark mode" } %>
    <%%= kui(:checkbox, name: "notifications") { "Notifications" } %>
  <%% end %>
<%% end %>
```

### With Radio Group

```erb
<%%= kui(:field_set) do %>
  <%%= kui(:field_set, :legend) { "Plan" } %>
  <%%= kui(:radio_group, name: "plan", color: :primary) do %>
    <%%= kui(:radio_group, :item, value: "free") { "Free" } %>
    <%%= kui(:radio_group, :item, value: "pro") { "Pro" } %>
  <%% end %>
<%% end %>
```

### Label-Sized Legend

Use `variant: :label` for a smaller legend that matches form label sizing:

```erb
<%%= kui(:field_set, :legend, variant: :label) { "Options" } %>
```

## Theme

```ruby
Kiso::Themes::FieldSet = ClassVariants.build(
  base: "flex flex-col gap-6 " \
        "has-[>[data-slot=checkbox-group]]:gap-3 " \
        "has-[>[data-slot=radio-group]]:gap-3"
)

Kiso::Themes::FieldLegend = ClassVariants.build(
  base: "mb-3 font-medium",
  variants: {
    variant: {
      legend: "text-base",
      label: "text-sm"
    }
  },
  defaults: { variant: :legend }
)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| Element | Native `<fieldset>` |
| `data-slot` | `"field-set"` |
| Legend | Rendered via `:legend` sub-part |
