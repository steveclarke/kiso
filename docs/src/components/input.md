---
title: Input
layout: docs
description: Single-line text field for forms.
category: Form
source: lib/kiso/themes/input.rb
---

## Quick Start

```erb
<%%= kiso(:input, placeholder: "Email address") %>
```

<%= render "component_preview", component: "kiso/input", scenario: "playground", height: "300px" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `variant:` | `:outline` \| `:soft` \| `:ghost` | `:outline` |
| `size:` | `:sm` \| `:md` \| `:lg` | `:md` |
| `type:` | `:text` \| `:email` \| `:password` \| `:search` \| `:number` \| `:file` \| etc. | `:text` |
| `disabled:` | `Boolean` | `false` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

All standard HTML input attributes (`placeholder:`, `name:`, `id:`, `value:`,
`required:`, `autofocus:`, etc.) pass through via `**component_options`.

## Usage

### Variant

```erb
<%%= kiso(:input, variant: :outline, placeholder: "Outline (default)") %>
<%%= kiso(:input, variant: :soft, placeholder: "Soft") %>
<%%= kiso(:input, variant: :ghost, placeholder: "Ghost") %>
```

### Size

```erb
<%%= kiso(:input, size: :sm, placeholder: "Small") %>
<%%= kiso(:input, size: :md, placeholder: "Medium") %>
<%%= kiso(:input, size: :lg, placeholder: "Large") %>
```

### With Field

Wrap in a Field for label, description, and error support.

```erb
<%%= kiso(:field) do %>
  <%%= kiso(:field, :label, for: :username) { "Username" } %>
  <%%= kiso(:input, id: :username, name: :username, placeholder: "shadcn") %>
  <%%= kiso(:field, :description) { "This is your public display name." } %>
<%% end %>
```

### Validation

Set `aria-invalid` on the input and `invalid: true` on the Field.

```erb
<%%= kiso(:field, invalid: true) do %>
  <%%= kiso(:field, :label, for: :password) { "Password" } %>
  <%%= kiso(:input, type: :password, id: :password, "aria-invalid": true) %>
  <%%= kiso(:field, :error, errors: ["Must be at least 8 characters"]) %>
<%% end %>
```

### File Input

```erb
<%%= kiso(:field) do %>
  <%%= kiso(:field, :label, for: :avatar) { "Avatar" } %>
  <%%= kiso(:input, type: :file, id: :avatar, name: :avatar) %>
  <%%= kiso(:field, :description) { "Upload a profile picture. Max 5MB." } %>
<%% end %>
```

### Disabled

```erb
<%%= kiso(:input, placeholder: "Disabled", disabled: true) %>
```

### With Rails Form Helpers

Use the theme module directly with Rails form builders:

```erb
<%%= f.text_field :email,
    class: Kiso::Themes::Input.render(variant: :outline, size: :md),
    placeholder: "you@example.com" %>
```

## Theme

```ruby
# lib/kiso/themes/input.rb
Kiso::Themes::Input = ClassVariants.build(
  base: "text-foreground w-full min-w-0 rounded-md outline-none
         transition-[color,box-shadow]
         placeholder:text-muted-foreground
         selection:bg-primary selection:text-primary-foreground
         disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
         focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary
         aria-invalid:ring-error aria-invalid:focus-visible:ring-error",
  variants: {
    variant: {
      outline: "bg-background ring ring-inset ring-accented shadow-xs",
      soft:    "bg-elevated/50 hover:bg-elevated focus:bg-elevated",
      ghost:   "bg-transparent hover:bg-elevated focus:bg-elevated"
    },
    size: {
      sm: "h-8 px-2.5 py-1 text-sm",
      md: "h-9 px-3 py-1 text-base md:text-sm",
      lg: "h-10 px-3 py-2 text-base"
    }
  },
  defaults: { variant: :outline, size: :md }
)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| `data-component` | `"input"` |
| `aria-invalid` | Set when validation fails |
| `disabled` | Native attribute |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | Moves focus to/from the input. |
