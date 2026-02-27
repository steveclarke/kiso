---
title: Field
layout: docs
description: Composable form field wrappers for labels, descriptions, errors, and layout.
category: Forms
source: lib/kiso/themes/field.rb
---

## Quick Start

```erb
<%%= kiso(:field) do %>
  <%%= kiso(:field, :label, for: :email) { "Email address" } %>
  <%%= kiso(:input, type: :email, id: :email, name: :email) %>
  <%%= kiso(:field, :description) { "We'll never share your email." } %>
  <%%= kiso(:field, :error) { @user.errors[:email].first } %>
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
| `:label` | `kiso(:field, :label)` | `<label>` | Accessible label (wraps Label component) |
| `:content` | `kiso(:field, :content)` | `<div>` | Groups label + description in a flex column |
| `:title` | `kiso(:field, :title)` | `<div>` | Lightweight title (alternative to label) |
| `:description` | `kiso(:field, :description)` | `<p>` | Helper text below field |
| `:error` | `kiso(:field, :error)` | `<div role="alert">` | Error message (only renders when content present) |
| `:separator` | `kiso(:field, :separator)` | `<div>` | Visual divider with optional text |

FieldSet sub-parts:

| Part | Usage | Element | Purpose |
|------|-------|---------|---------|
| `:legend` | `kiso(:field_set, :legend)` | `<legend>` | Semantic legend with variant styling |

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
<%%= kiso(:field) do %>
  <%%= kiso(:field, :label, for: :name) { "Full name" } %>
  <%%= kiso(:input, id: :name, name: :name) %>
  <%%= kiso(:field, :description) { "As it appears on your ID." } %>
<%% end %>
```

### Horizontal

Label and control side by side — ideal for checkboxes, radios, and switches.

```erb
<%%= kiso(:field, orientation: :horizontal) do %>
  <%%= kiso(:checkbox, id: :dark_mode, name: :dark_mode) %>
  <%%= kiso(:field, :label, for: :dark_mode) { "Enable dark mode" } %>
<%% end %>
```

With description using FieldContent:

```erb
<%%= kiso(:field, orientation: :horizontal) do %>
  <%%= kiso(:checkbox, id: :newsletter, name: :newsletter) %>
  <%%= kiso(:field, :content) do %>
    <%%= kiso(:field, :label, for: :newsletter) { "Newsletter" } %>
    <%%= kiso(:field, :description) { "Receive weekly updates." } %>
  <%% end %>
<%% end %>
```

### Responsive

Stacks vertically on mobile, switches to horizontal at the `@md` container
query breakpoint. Requires a parent FieldGroup for the container query scope.

```erb
<%%= kiso(:field_group) do %>
  <%%= kiso(:field, orientation: :responsive) do %>
    <%%= kiso(:field, :label, for: :company) { "Company" } %>
    <%%= kiso(:input, id: :company, name: :company) %>
  <%% end %>
<%% end %>
```

### Validation Errors

Set `invalid: true` on the field to apply error styling. Use FieldError to
display messages — it only renders when content is present.

```erb
<%%= kiso(:field, invalid: true) do %>
  <%%= kiso(:field, :label, for: :email) { "Email" } %>
  <%%= kiso(:input, id: :email, name: :email) %>
  <%%= kiso(:field, :error) { "Please enter a valid email." } %>
<%% end %>
```

Pass Rails model errors directly via the `errors:` prop. Single errors render
as text; multiple errors render as a bulleted list:

```erb
<%%= kiso(:field, :error, errors: @user.errors[:email]) %>
```

### FieldGroup

Stacks multiple fields with consistent `gap-7` spacing.

```erb
<%%= kiso(:field_group) do %>
  <%%= kiso(:field) do %>
    <%%= kiso(:field, :label, for: :first_name) { "First name" } %>
    <%%= kiso(:input, id: :first_name, name: :first_name) %>
  <%% end %>
  <%%= kiso(:field) do %>
    <%%= kiso(:field, :label, for: :last_name) { "Last name" } %>
    <%%= kiso(:input, id: :last_name, name: :last_name) %>
  <%% end %>
<%% end %>
```

### FieldSet

Semantic `<fieldset>` for grouping related controls (checkboxes, radios).

```erb
<%%= kiso(:field_set) do %>
  <%%= kiso(:field_set, :legend) { "Notifications" } %>
  <%%= kiso(:field, orientation: :horizontal) do %>
    <%%= kiso(:checkbox, id: :email_notifs, name: "notifs[]", value: "email") %>
    <%%= kiso(:field, :label, for: :email_notifs) { "Email" } %>
  <%% end %>
  <%%= kiso(:field, orientation: :horizontal) do %>
    <%%= kiso(:checkbox, id: :sms_notifs, name: "notifs[]", value: "sms") %>
    <%%= kiso(:field, :label, for: :sms_notifs) { "SMS" } %>
  <%% end %>
<%% end %>
```

### FieldSeparator

Visual divider between fields, with optional centered text.

```erb
<%%= kiso(:field, :separator) { "Or continue with" } %>
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
