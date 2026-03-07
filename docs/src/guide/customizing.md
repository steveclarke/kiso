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

## Override styles globally

If you want *all* instances of a component to look different, use
`Kiso.configure` in an initializer instead of repeating `css_classes:` on
every call site:

```ruby
# config/initializers/kiso.rb
Kiso.configure do |config|
  config.theme[:button] = { base: "rounded-full" }
  config.theme[:card_header] = { base: "p-8 sm:p-10" }
  config.theme[:badge] = { defaults: { variant: :outline } }
end
```

Override hashes accept `base:`, `variants:`, `compound_variants:`,
`defaults:`, and `ui:` — the same structure as the component's theme
definition. Overrides are applied once at boot via
`ClassVariants::Instance#merge`, so there's zero per-render cost. Changes
require a server restart.

The `ui:` key targets inner sub-part elements globally:

```ruby
Kiso.configure do |config|
  config.theme[:card] = { base: "rounded-xl", ui: { header: "p-8", footer: "px-8" } }
  config.theme[:alert] = { ui: { close: "opacity-50" } }
end
```

**Layer order:** theme default &lt; global config (base + ui) &lt; instance
`ui:` &lt; instance `css_classes:`. Each layer wins over the previous.

## Override inner elements per-instance

`css_classes:` only reaches the root element. For inner sub-parts, use `ui:`:

```erb
<%%= kui(:card, ui: { header: "p-8 bg-muted", title: "text-xl" }) do %>
  <%%= kui(:card, :header) do %>
    <%%= kui(:card, :title) { "Dashboard" } %>
  <%% end %>
  <%%= kui(:card, :content) { "Body content" } %>
<%% end %>
```

Self-rendering components (Alert, Dialog, Slider, Switch, etc.) apply `ui:`
to their internal structure:

```erb
<%%= kui(:alert, icon: "triangle-alert", color: :warning, ui: {
  close: "opacity-50",
  wrapper: "gap-4"
}) do %>
  <%%= kui(:alert, :title) { "Heads up" } %>
  <%%= kui(:alert, :description) { "Something happened." } %>
<%% end %>

<%%= kui(:slider, ui: { track: "bg-muted", thumb: "bg-primary" }) %>
```

Available slot names match the sub-part names used in `kui(:component, :part)`.
See each component's docs page for its available slots.

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
