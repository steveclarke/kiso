---
title: Pagination
layout: docs
description: Navigation controls for moving between pages of content.
category: Navigation
source: lib/kiso/themes/pagination.rb
---

## Quick Start

```erb
<%%= kiso(:pagination) do %>
  <%%= kiso(:pagination_content) do %>
    <%%= kiso(:pagination_previous, href: "#") %>
    <%%= kiso(:pagination_item) { kiso(:pagination_link, href: "#") { "1" } } %>
    <%%= kiso(:pagination_item) { kiso(:pagination_link, href: "#", active: true) { "2" } } %>
    <%%= kiso(:pagination_item) { kiso(:pagination_link, href: "#") { "3" } } %>
    <%%= kiso(:pagination_next, href: "#") %>
  <%% end %>
<%% end %>
```

<%= render "component_preview", component: "kiso/pagination", scenario: "default", height: "100px" %>

## Locals

### `pagination`

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

### `pagination_content`

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

### `pagination_item`

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

### `pagination_link`

| Local | Type | Default |
|-------|------|---------|
| `href:` | `String` | `"#"` |
| `active:` | `Boolean` | `false` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

### `pagination_previous` / `pagination_next`

| Local | Type | Default |
|-------|------|---------|
| `href:` | `String` | `"#"` |
| `active:` | `Boolean` | `false` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

### `pagination_ellipsis`

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

Pagination provides pure building blocks. Wire up your own pagination library
by iterating over its series output.

### With a custom pagination helper

```erb
<%# app/helpers/pagy_pagination_helper.rb %>
module PagyPaginationHelper
  def kiso_pagy_nav(pagy)
    kiso(:pagination) do
      kiso(:pagination_content) do
        concat kiso(:pagination_previous, href: pagy.prev ? pagy_url(pagy.prev) : nil)
        pagy.series.each do |item|
          concat(
            case item
            when :gap
              kiso(:pagination_item) { kiso(:pagination_ellipsis) }
            when String # current page (Pagy stringifies the current page)
              kiso(:pagination_item) { kiso(:pagination_link, href: "#", active: true) { item } }
            when Integer
              kiso(:pagination_item) { kiso(:pagination_link, href: pagy_url(item)) { item.to_s } }
            end
          )
        end
        concat kiso(:pagination_next, href: pagy.next ? pagy_url(pagy.next) : nil)
      end
    end
  end
end
```

### First and last page states

Pass `href: nil` to disable prev/next links when at the boundary.

```erb
<%%= kiso(:pagination) do %>
  <%%= kiso(:pagination_content) do %>
    <%%= kiso(:pagination_previous, href: nil) %> <%# disabled on first page %>
    <%%= kiso(:pagination_item) { kiso(:pagination_link, href: "#", active: true) { "1" } } %>
    <%%= kiso(:pagination_item) { kiso(:pagination_link, href: "#") { "2" } } %>
    <%%= kiso(:pagination_item) { kiso(:pagination_ellipsis) } %>
    <%%= kiso(:pagination_item) { kiso(:pagination_link, href: "#") { "10" } } %>
    <%%= kiso(:pagination_next, href: "#") %>
  <%% end %>
<%% end %>
```

### Prev / Next only

Omit page numbers entirely for simple sequential navigation.

```erb
<%%= kiso(:pagination) do %>
  <%%= kiso(:pagination_content) do %>
    <%%= kiso(:pagination_previous, href: "#") %>
    <%%= kiso(:pagination_next, href: "#") %>
  <%% end %>
<%% end %>
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| `data-component` | `"pagination"` |
| `role` on nav | `"navigation"` |
| `aria-label` on nav | `"pagination"` |
| `aria-current` on active link | `"page"` |
| `aria-label` on previous | `"Go to previous page"` |
| `aria-label` on next | `"Go to next page"` |
| `aria-hidden` on ellipsis | `true` |
