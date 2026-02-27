---
title: Textarea
layout: docs
description: Multi-line text field for forms.
category: Form
source: lib/kiso/themes/textarea.rb
---

## Quick Start

```erb
<%%= kui(:textarea, placeholder: "Tell us more...") %>
```

<%= render "component_preview", component: "kiso/textarea", scenario: "playground", height: "300px" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `variant:` | `:outline` \| `:soft` \| `:ghost` | `:outline` |
| `size:` | `:sm` \| `:md` \| `:lg` | `:md` |
| `disabled:` | `Boolean` | `false` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

All standard HTML textarea attributes (`placeholder:`, `name:`, `id:`, `rows:`,
`required:`, etc.) pass through via `**component_options`.

## Usage

### Variant

```erb
<%%= kui(:textarea, variant: :outline, placeholder: "Outline (default)") %>
<%%= kui(:textarea, variant: :soft, placeholder: "Soft") %>
<%%= kui(:textarea, variant: :ghost, placeholder: "Ghost") %>
```

### Size

Controls padding and font size. Height is automatic via `field-sizing-content`
with a minimum of `min-h-16`.

```erb
<%%= kui(:textarea, size: :sm, placeholder: "Small") %>
<%%= kui(:textarea, size: :md, placeholder: "Medium") %>
<%%= kui(:textarea, size: :lg, placeholder: "Large") %>
```

### With Field

```erb
<%%= kui(:field) do %>
  <%%= kui(:field, :label, for: :feedback) { "Feedback" } %>
  <%%= kui(:textarea, id: :feedback, name: :feedback,
      placeholder: "Tell us what you think...", rows: 4) %>
  <%%= kui(:field, :description) { "Your feedback helps us improve." } %>
<%% end %>
```

### Disabled

```erb
<%%= kui(:textarea, placeholder: "Disabled", disabled: true) %>
```

### With Rails Form Helpers

```erb
<%%= f.text_area :bio,
    class: Kiso::Themes::Textarea.render(variant: :outline, size: :md),
    placeholder: "Tell us about yourself...", rows: 4 %>
```

## Theme

```ruby
# lib/kiso/themes/textarea.rb
Kiso::Themes::Textarea = ClassVariants.build(
  base: "text-foreground w-full rounded-md outline-none
         transition-[color,box-shadow] min-h-16 field-sizing-content
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
      sm: "px-2.5 py-2 text-sm",
      md: "px-3 py-2 text-base md:text-sm",
      lg: "px-3 py-2 text-base"
    }
  },
  defaults: { variant: :outline, size: :md }
)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| `data-slot` | `"textarea"` |
| `aria-invalid` | Set when validation fails |
| `disabled` | Native attribute |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | Moves focus to/from the textarea. |
