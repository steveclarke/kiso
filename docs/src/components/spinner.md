---
title: Spinner
layout: docs
description: A spinning loading indicator with accessibility attributes.
category: Element
source: lib/kiso/themes/spinner.rb
---

## Quick Start

```erb
<%%= kui(:spinner) %>
```

<%= render "component_preview", component: "kiso/spinner", scenario: "playground" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `label:` | `String` | `"Loading"` (i18n) |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

Spinner has no variants. It inherits `currentColor` from its parent, so it
adapts to any context — buttons, badges, empty states — without a color prop.

### Sizes

Control size with `css_classes:`. Default is `size-4`.

```erb
<%%= kui(:spinner, css_classes: "size-3") %>
<%%= kui(:spinner) %>
<%%= kui(:spinner, css_classes: "size-6") %>
<%%= kui(:spinner, css_classes: "size-8") %>
```

<%= render "component_preview", component: "kiso/spinner", scenario: "sizes" %>

### Inside a Button

```erb
<%%= kui(:button, disabled: true) do %>
  <%%= kui(:spinner, css_classes: "size-3") %>
  Loading…
<%% end %>
```

<%= render "component_preview", component: "kiso/spinner", scenario: "inside_button" %>

### Custom Label

Override the ARIA label for specific contexts:

```erb
<%%= kui(:spinner, label: "Saving changes") %>
```

## Theme

```ruby
# lib/kiso/themes/spinner.rb
Kiso::Themes::Spinner = ClassVariants.build(
  base: "animate-spin size-4"
)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| `role` | `"status"` |
| `aria-label` | `"Loading"` (i18n: `kiso.spinner.loading`) |
| `data-slot` | `"spinner"` |

The spinner icon is registered as `kiso_component_icon(:spinner)`. Host apps
can swap it globally:

```ruby
Kiso.configure do |config|
  config.icons[:spinner] = "heroicons:arrow-path"
end
```
