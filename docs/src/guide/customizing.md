---
title: Customizing Components
layout: docs
description: Override styles, wrap components with app defaults, and theme your app.
---

## Override styles per-instance

The simplest customization is `css_classes:` on a single usage:

```erb
<%%= kui(:button, css_classes: "w-full") do %>
  Full-width button
<%% end %>
```

`tailwind_merge` ensures your classes win over the component defaults without
duplication. This is the equivalent of passing `className` in React or
`:class` in Vue.

## Wrap components with your defaults

If you find yourself repeating the same props, create a thin wrapper partial
in your app:

```erb
<%% # app/views/shared/_primary_button.html.erb %>
<%% # locals: (css_classes: "", **rest) %>
<%%= kui(:button, variant: :solid, color: :primary, css_classes: css_classes, **rest) do %>
  <%%= yield %>
<%% end %>
```

```erb
<%% # Usage — your app's conventions, Kiso's rendering %>
<%%= render "shared/primary_button" do %>
  Get started
<%% end %>
```

This is the same pattern as wrapping a shadcn component in your own React
component to bake in project defaults. The Kiso component handles styling and
structure; your wrapper handles your app's conventions.

## Theme your app with CSS variables

Kiso's semantic tokens (`bg-primary`, `text-foreground`, etc.) resolve to CSS
custom properties. Override them in your Tailwind stylesheet to match your
brand:

```css
@import "tailwindcss";
@import "../builds/tailwind/kiso";

@theme {
  --color-primary: var(--color-violet-600);
  --color-primary-foreground: var(--color-white);
  --color-secondary: var(--color-pink-600);
  --color-secondary-foreground: var(--color-white);
}
```

Every component automatically picks up your overrides — no changes to
individual component calls needed. This is similar to overriding a design
token system in Chakra UI or shadcn's `globals.css` approach.

## Dark mode

Kiso uses CSS variable swapping for dark mode. A `.dark` class on your
`<html>` or `<body>` element activates the dark palette:

```html
<html class="dark">
```

Components don't use Tailwind's `dark:` prefix. Instead, the CSS variables
change value inside `.dark {}`, and every `bg-primary`, `text-foreground`,
`bg-muted` etc. automatically resolves to its dark equivalent. You don't need
to do anything per-component.

## Pass HTML attributes through

`**component_options` forwards any extra locals to the root element. Use this
for `id`, `data-*`, `aria-*`, and Stimulus attributes:

```erb
<%%= kui(:button,
    id: "delete-btn",
    data: { action: "click->confirm#show" },
    aria: { label: "Delete item" }) do %>
  Delete
<%% end %>
```

This is equivalent to React's `{...rest}` spread or Vue's `v-bind="$attrs"`.
