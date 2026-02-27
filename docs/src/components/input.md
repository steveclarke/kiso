---
title: Input
layout: docs
description: Single-line text field for forms.
category: Form
source: lib/kiso/themes/input.rb
---

## Quick Start

```erb
<%%= kui(:input, placeholder: "Email address") %>
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
<%%= kui(:input, variant: :outline, placeholder: "Outline (default)") %>
<%%= kui(:input, variant: :soft, placeholder: "Soft") %>
<%%= kui(:input, variant: :ghost, placeholder: "Ghost") %>
```

### Size

```erb
<%%= kui(:input, size: :sm, placeholder: "Small") %>
<%%= kui(:input, size: :md, placeholder: "Medium") %>
<%%= kui(:input, size: :lg, placeholder: "Large") %>
```

### With Field

Wrap in a Field for label, description, and error support.

```erb
<%%= kui(:field) do %>
  <%%= kui(:field, :label, for: :username) { "Username" } %>
  <%%= kui(:input, id: :username, name: :username, placeholder: "shadcn") %>
  <%%= kui(:field, :description) { "This is your public display name." } %>
<%% end %>
```

### Validation

Set `aria-invalid` on the input and `invalid: true` on the Field.

```erb
<%%= kui(:field, invalid: true) do %>
  <%%= kui(:field, :label, for: :password) { "Password" } %>
  <%%= kui(:input, type: :password, id: :password, "aria-invalid": true) %>
  <%%= kui(:field, :error, errors: ["Must be at least 8 characters"]) %>
<%% end %>
```

### File Input

```erb
<%%= kui(:field) do %>
  <%%= kui(:field, :label, for: :avatar) { "Avatar" } %>
  <%%= kui(:input, type: :file, id: :avatar, name: :avatar) %>
  <%%= kui(:field, :description) { "Upload a profile picture. Max 5MB." } %>
<%% end %>
```

### Disabled

```erb
<%%= kui(:input, placeholder: "Disabled", disabled: true) %>
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
| `data-slot` | `"input"` |
| `aria-invalid` | Set when validation fails |
| `disabled` | Native attribute |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | Moves focus to/from the input. |
