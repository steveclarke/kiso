---
title: InputGroup
layout: docs
description: Wraps an input with inline prefix/suffix addons.
category: Form
source: lib/kiso/themes/input_group.rb
---

## Quick Start

```erb
<%%= kui(:input_group) do %>
  <%%= kui(:input_group, :addon) { "https://" } %>
  <%%= kui(:input, type: :text, placeholder: "example.com") %>
<%% end %>
```

<%= render "component_preview", component: "kiso/input_group", scenario: "playground", height: "300px" %>

## Structure

InputGroup is the outer wrapper with a shared ring. The inner input strips its
own border so the group ring provides the visual boundary.

```
InputGroup [ring ring-inset ring-accented rounded-md]
+-- Addon [start] -- text-muted-foreground ps-3
+-- Input [border-0 shadow-none ring-0 bg-transparent flex-1]
+-- Addon [end] -- text-muted-foreground pe-3
```

## Locals

### InputGroup

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

### Addon

| Local | Type | Default |
|-------|------|---------|
| `align:` | `:start` \| `:end` | `:start` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

### Prefix Text

```erb
<%%= kui(:input_group) do %>
  <%%= kui(:input_group, :addon) { "https://" } %>
  <%%= kui(:input, type: :text, placeholder: "example.com") %>
<%% end %>
```

### Suffix Icon

```erb
<%%= kui(:input_group) do %>
  <%%= kui(:input, type: :search, placeholder: "Search...") %>
  <%%= kui(:input_group, :addon, align: :end) do %>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
      <path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" />
    </svg>
  <%% end %>
<%% end %>
```

### Prefix and Suffix

```erb
<%%= kui(:input_group) do %>
  <%%= kui(:input_group, :addon) { "$" } %>
  <%%= kui(:input, type: :number, placeholder: "0.00") %>
  <%%= kui(:input_group, :addon, align: :end) { "USD" } %>
<%% end %>
```

## Theme

```ruby
# lib/kiso/themes/input_group.rb
Kiso::Themes::InputGroup = ClassVariants.build(
  base: "relative flex w-full items-center rounded-md text-foreground
         ring ring-inset ring-accented shadow-xs
         h-9 min-w-0 has-[>textarea]:h-auto
         has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary
         has-[[aria-invalid]]:ring-error
         [&_input]:flex-1 [&_input]:rounded-none [&_input]:border-0
         [&_input]:shadow-none [&_input]:ring-0 [&_input]:bg-transparent
         [&_textarea]:flex-1 [&_textarea]:rounded-none [&_textarea]:border-0
         [&_textarea]:shadow-none [&_textarea]:ring-0 [&_textarea]:bg-transparent",
  variants: {},
  defaults: {}
)

Kiso::Themes::InputGroupAddon = ClassVariants.build(
  base: "text-muted-foreground flex items-center justify-center gap-2
         py-1.5 text-sm font-medium select-none
         [&_svg:not([class*='size-'])]:size-4",
  variants: {
    align: { start: "ps-3", end: "pe-3" }
  },
  defaults: { align: :start }
)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| `role` | `"group"` on the container |
| `data-slot` | `"input-group"` |

Focus and error states bubble up from the child input via `has-[:focus-visible]`
and `has-[[aria-invalid]]` selectors on the container.
