---
title: Field
layout: docs
description: Composable form field wrappers for labels, descriptions, errors, and layout.
category: Forms
source: lib/kiso/themes/field.rb
---

## Quick Start

```erb
<%%= kui(:field) do %>
  <%%= kui(:field, :label, for: :email) { "Email address" } %>
  <%%= kui(:input, type: :email, id: :email, name: :email) %>
  <%%= kui(:field, :description) { "We'll never share your email." } %>
  <%%= kui(:field, :error) { @user.errors[:email].first } %>
<%% end %>
```

<%= render "component_preview", component: "kiso/field", scenario: "playground", height: "300px" %>

## Locals

### Field

| Local | Type | Default |
|-------|------|---------|
| `orientation:` | `:vertical` \| `:horizontal` \| `:responsive` | `:vertical` |
| `invalid:` | Boolean | `false` |
| `disabled:` | Boolean | `false` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

### FieldGroup

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

### FieldSet

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

### FieldLegend

| Local | Type | Default |
|-------|------|---------|
| `variant:` | `:legend` \| `:label` | `:legend` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

### FieldError

| Local | Type | Default |
|-------|------|---------|
| `errors:` | Array | `[]` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

## Sub-parts

| Part | Usage | Element | Purpose |
|------|-------|---------|---------|
| `:label` | `kui(:field, :label)` | `<label>` | Accessible label (wraps Label component) |
| `:content` | `kui(:field, :content)` | `<div>` | Groups label + description in a flex column |
| `:title` | `kui(:field, :title)` | `<div>` | Lightweight title (alternative to label) |
| `:description` | `kui(:field, :description)` | `<p>` | Helper text below field |
| `:error` | `kui(:field, :error)` | `<div role="alert">` | Error message (only renders when content present) |
| `:separator` | `kui(:field, :separator)` | `<div>` | Visual divider with optional text |

FieldSet sub-parts:

| Part | Usage | Element | Purpose |
|------|-------|---------|---------|
| `:legend` | `kui(:field_set, :legend)` | `<legend>` | Semantic legend with variant styling |

All sub-parts accept `css_classes:` and `**component_options`.

## Anatomy

```
FieldGroup
├── Field (vertical)
│   ├── Field Label
│   ├── <input>
│   ├── Field Description
│   └── Field Error
├── Field Separator
└── Field (horizontal)
    ├── <checkbox>
    └── Field Content
        ├── Field Label
        └── Field Description

FieldSet
├── FieldSet Legend
├── Field Description
└── Field (horizontal) × N
```

## Usage

### Vertical (default)

The standard layout — label above input, full width.

```erb
<%%= kui(:field) do %>
  <%%= kui(:field, :label, for: :name) { "Full name" } %>
  <%%= kui(:input, id: :name, name: :name) %>
  <%%= kui(:field, :description) { "As it appears on your ID." } %>
<%% end %>
```

### Horizontal

Label and control side by side — ideal for checkboxes, radios, and switches.

```erb
<%%= kui(:field, orientation: :horizontal) do %>
  <%%= kui(:checkbox, id: :dark_mode, name: :dark_mode) %>
  <%%= kui(:field, :label, for: :dark_mode) { "Enable dark mode" } %>
<%% end %>
```

With description using FieldContent:

```erb
<%%= kui(:field, orientation: :horizontal) do %>
  <%%= kui(:checkbox, id: :newsletter, name: :newsletter) %>
  <%%= kui(:field, :content) do %>
    <%%= kui(:field, :label, for: :newsletter) { "Newsletter" } %>
    <%%= kui(:field, :description) { "Receive weekly updates." } %>
  <%% end %>
<%% end %>
```

### Responsive

Stacks vertically on mobile, switches to horizontal at the `@md` container
query breakpoint. Requires a parent FieldGroup for the container query scope.

```erb
<%%= kui(:field_group) do %>
  <%%= kui(:field, orientation: :responsive) do %>
    <%%= kui(:field, :label, for: :company) { "Company" } %>
    <%%= kui(:input, id: :company, name: :company) %>
  <%% end %>
<%% end %>
```

### Validation Errors

Set `invalid: true` on the field to apply error styling. Use FieldError to
display messages — it only renders when content is present.

```erb
<%%= kui(:field, invalid: true) do %>
  <%%= kui(:field, :label, for: :email) { "Email" } %>
  <%%= kui(:input, id: :email, name: :email) %>
  <%%= kui(:field, :error) { "Please enter a valid email." } %>
<%% end %>
```

Pass Rails model errors directly via the `errors:` prop. Single errors render
as text; multiple errors render as a bulleted list:

```erb
<%%= kui(:field, :error, errors: @user.errors[:email]) %>
```

### FieldGroup

Stacks multiple fields with consistent `gap-7` spacing.

```erb
<%%= kui(:field_group) do %>
  <%%= kui(:field) do %>
    <%%= kui(:field, :label, for: :first_name) { "First name" } %>
    <%%= kui(:input, id: :first_name, name: :first_name) %>
  <%% end %>
  <%%= kui(:field) do %>
    <%%= kui(:field, :label, for: :last_name) { "Last name" } %>
    <%%= kui(:input, id: :last_name, name: :last_name) %>
  <%% end %>
<%% end %>
```

### FieldSet

Semantic `<fieldset>` for grouping related controls (checkboxes, radios).

```erb
<%%= kui(:field_set) do %>
  <%%= kui(:field_set, :legend) { "Notifications" } %>
  <%%= kui(:field, orientation: :horizontal) do %>
    <%%= kui(:checkbox, id: :email_notifs, name: "notifs[]", value: "email") %>
    <%%= kui(:field, :label, for: :email_notifs) { "Email" } %>
  <%% end %>
  <%%= kui(:field, orientation: :horizontal) do %>
    <%%= kui(:checkbox, id: :sms_notifs, name: "notifs[]", value: "sms") %>
    <%%= kui(:field, :label, for: :sms_notifs) { "SMS" } %>
  <%% end %>
<%% end %>
```

### FieldSeparator

Visual divider between fields, with optional centered text.

```erb
<%%= kui(:field, :separator) { "Or continue with" } %>
```

## Theme

```ruby
# Field — orientation variants
Kiso::Themes::Field = ClassVariants.build(
  base: "group/field flex w-full gap-3 text-foreground data-[invalid=true]:text-error",
  variants: {
    orientation: {
      vertical: "flex-col [&>*]:w-full [&>.sr-only]:w-auto",
      horizontal: "flex-row items-center ...",
      responsive: "flex-col ... @md/field-group:flex-row ..."
    }
  },
  defaults: { orientation: :vertical }
)

# FieldGroup — container query scope
Kiso::Themes::FieldGroup = ClassVariants.build(
  base: "group/field-group @container/field-group flex w-full flex-col gap-7 ..."
)

# FieldSet + FieldLegend
Kiso::Themes::FieldSet = ClassVariants.build(
  base: "flex flex-col gap-6 ..."
)

Kiso::Themes::FieldLegend = ClassVariants.build(
  base: "mb-3 font-medium",
  variants: { variant: { legend: "text-base", label: "text-sm" } },
  defaults: { variant: :legend }
)
```

## Accessibility

- Field renders `<div role="group">` with `data-orientation` attribute
- FieldLabel renders `<label>` with proper `for` attribute linking
- FieldError renders `<div role="alert">` for screen reader announcements
- FieldSet renders semantic `<fieldset>` with `<legend>`
- `invalid: true` sets `data-invalid="true"` which cascades error color
- `disabled: true` sets `data-disabled="true"` which dims labels via group styling
