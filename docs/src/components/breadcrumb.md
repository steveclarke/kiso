---
title: Breadcrumb
layout: docs
description: Navigation breadcrumb trail showing the current page's location in the site hierarchy.
category: Navigation
source: lib/kiso/themes/breadcrumb.rb
---

## Quick Start

```erb
<%%= kui(:breadcrumb) do %>
  <%%= kui(:breadcrumb, :list) do %>
    <%%= kui(:breadcrumb, :item) do %>
      <%%= kui(:breadcrumb, :link, href: "/") { "Home" } %>
    <%% end %>
    <%%= kui(:breadcrumb, :separator) %>
    <%%= kui(:breadcrumb, :item) do %>
      <%%= kui(:breadcrumb, :link, href: "/components") { "Components" } %>
    <%% end %>
    <%%= kui(:breadcrumb, :separator) %>
    <%%= kui(:breadcrumb, :item) do %>
      <%%= kui(:breadcrumb, :page) { "Breadcrumb" } %>
    <%% end %>
  <%% end %>
<%% end %>
```

<%= render "component_preview", component: "kiso/breadcrumb", scenario: "playground" %>

## Locals

All sub-parts accept:

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

The `link` sub-part accepts any `<a>` attribute (e.g. `href:`, `target:`).

## Sub-parts

| Part | Usage | HTML | Purpose |
|------|-------|------|---------|
| `:list` | `kui(:breadcrumb, :list)` | `<ol>` | Ordered list container |
| `:item` | `kui(:breadcrumb, :item)` | `<li>` | Segment wrapper |
| `:link` | `kui(:breadcrumb, :link)` | `<a>` | Clickable ancestor link |
| `:page` | `kui(:breadcrumb, :page)` | `<span>` | Current page (non-interactive) |
| `:separator` | `kui(:breadcrumb, :separator)` | `<li>` | Chevron divider (customizable) |
| `:ellipsis` | `kui(:breadcrumb, :ellipsis)` | `<span>` | Truncation indicator |

## Anatomy

```
Breadcrumb (nav)
└── List (ol)
    ├── Item (li)
    │   └── Link (a) or Page (span)
    ├── Separator (li)
    ├── Item (li)
    │   └── Ellipsis (span)
    ├── Separator (li)
    └── Item (li)
        └── Page (span)
```

## Usage

### Default

The most common breadcrumb pattern: ancestor links followed by the current
page.

```erb
<%%= kui(:breadcrumb) do %>
  <%%= kui(:breadcrumb, :list) do %>
    <%%= kui(:breadcrumb, :item) do %>
      <%%= kui(:breadcrumb, :link, href: "/") { "Home" } %>
    <%% end %>
    <%%= kui(:breadcrumb, :separator) %>
    <%%= kui(:breadcrumb, :item) do %>
      <%%= kui(:breadcrumb, :link, href: "/components") { "Components" } %>
    <%% end %>
    <%%= kui(:breadcrumb, :separator) %>
    <%%= kui(:breadcrumb, :item) do %>
      <%%= kui(:breadcrumb, :page) { "Breadcrumb" } %>
    <%% end %>
  <%% end %>
<%% end %>
```

### With Ellipsis

Use the ellipsis sub-part to indicate truncated segments in deep hierarchies.

```erb
<%%= kui(:breadcrumb, :item) do %>
  <%%= kui(:breadcrumb, :ellipsis) %>
<%% end %>
```

<%= render "component_preview", component: "kiso/breadcrumb", scenario: "with_ellipsis" %>

### Custom Separator

Pass a block to the separator sub-part to replace the default chevron icon.

```erb
<%%= kui(:breadcrumb, :separator) do %>
  <%%= kiso_icon "slash", class: "size-3.5" %>
<%% end %>
```

<%= render "component_preview", component: "kiso/breadcrumb", scenario: "custom_separator" %>

## Theme

```ruby
Kiso::Themes::Breadcrumb          = ClassVariants.build(base: "")
Kiso::Themes::BreadcrumbList      = ClassVariants.build(base: "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5")
Kiso::Themes::BreadcrumbItem      = ClassVariants.build(base: "inline-flex items-center gap-1.5")
Kiso::Themes::BreadcrumbLink      = ClassVariants.build(base: "hover:text-foreground transition-colors")
Kiso::Themes::BreadcrumbPage      = ClassVariants.build(base: "text-foreground font-normal")
Kiso::Themes::BreadcrumbSeparator = ClassVariants.build(base: "[&>svg]:size-3.5")
Kiso::Themes::BreadcrumbEllipsis  = ClassVariants.build(base: "flex size-9 items-center justify-center")
```

## Accessibility

Breadcrumb renders a `<nav>` element with `aria-label="breadcrumb"`. The list
uses a semantic `<ol>` for proper ordering. Separators have `role="presentation"`
and `aria-hidden="true"` so screen readers skip them. The current page has
`aria-current="page"` and `aria-disabled="true"`.
