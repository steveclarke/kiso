---
title: Page
layout: docs
description: Layout and content components for traditional web pages — headers, sections, grids, and cards.
category: Layout
source: lib/kiso/themes/page.rb
---

## Quick Start

```erb
<%%= kui(:page_header, title: "Documentation", description: "Everything you need to build.") %>

<%%= kui(:page_body) do %>
  <p>Your page content here.</p>
<%% end %>
```

<%= render "component_preview", component: "kiso/page/page", scenario: "playground", height: "300px" %>

## Page Layout

Use `page` with `left`, `center`, and `right` sub-parts for sidebar layouts. The grid uses 10 columns — sidebars take 2 each, center adjusts automatically.

```erb
<%%= kui(:page) do %>
  <%%= kui(:page, :left) do %>
    <%# Left sidebar content %>
  <%% end %>
  <%%= kui(:page, :center) do %>
    <%# Main content %>
  <%% end %>
  <%%= kui(:page, :right) do %>
    <%# Right sidebar content %>
  <%% end %>
<%% end %>
```

<%= render "component_preview", component: "kiso/page/page", scenario: "with_sidebars", height: "400px" %>

## Page Header

Section header with title, description, headline, and action links. Accepts props for common usage or yields for full control.

### With Props

```erb
<%%= kui(:page_header,
    headline: "Components",
    title: "Page Header",
    description: "A section header for page-level content.") %>
```

### Composed with Sub-Parts

```erb
<%%= kui(:page_header) do %>
  <div>
    <%%= kui(:page_header, :headline) { "Guide" } %>
    <%%= kui(:page_header, :title) { "Custom Header" } %>
    <%%= kui(:page_header, :description) { "Full control over layout." } %>
  </div>
  <%%= kui(:page_header, :links) do %>
    <%%= kui(:button, size: :sm) { "Action" } %>
  <%% end %>
<%% end %>
```

<%= render "component_preview", component: "kiso/page/page", scenario: "header_with_props", height: "400px" %>

## Page Body

Main content wrapper with vertical spacing (`mt-8 pb-24 space-y-12`).

```erb
<%%= kui(:page_body) do %>
  <%# Content sections get consistent vertical spacing %>
<%% end %>
```

## Page Section

Content section with consistent vertical spacing. Supports horizontal (side-by-side) and vertical (centered) orientations.

### Horizontal

```erb
<%%= kui(:page_section, orientation: :horizontal) do %>
  <%%= kui(:page_section, :wrapper) do %>
    <%%= kui(:page_section, :title, orientation: :horizontal) { "Title" } %>
    <%%= kui(:page_section, :description, orientation: :horizontal) { "Description text." } %>
  <%% end %>
  <%%= kui(:page_section, :body) do %>
    <%# Right column content %>
  <%% end %>
<%% end %>
```

<%= render "component_preview", component: "kiso/page/page", scenario: "section_horizontal", height: "500px" %>

### Vertical

```erb
<%%= kui(:page_section, orientation: :vertical) do %>
  <%%= kui(:page_section, :wrapper) do %>
    <%%= kui(:page_section, :title, orientation: :vertical) { "Centered Title" } %>
    <%%= kui(:page_section, :description, orientation: :vertical) { "Centered description." } %>
  <%% end %>
  <%%= kui(:page_section, :body) do %>
    <%%= kui(:page_grid) do %>
      <%# Cards here %>
    <%% end %>
  <%% end %>
<%% end %>
```

<%= render "component_preview", component: "kiso/page/page", scenario: "section_vertical", height: "600px" %>

## Page Grid

Responsive grid for cards and features. Defaults to 1 column on mobile, 2 on tablet, 3 on desktop.

```erb
<%%= kui(:page_grid) do %>
  <%%= kui(:page_card, title: "Card 1", description: "Description.") %>
  <%%= kui(:page_card, title: "Card 2", description: "Description.") %>
  <%%= kui(:page_card, title: "Card 3", description: "Description.") %>
<%% end %>
```

<%= render "component_preview", component: "kiso/page/page", scenario: "grid_with_cards", height: "400px" %>

## Page Card

Content card for grid layouts. Supports outline, soft, subtle, and ghost variants.

### With Props

```erb
<%%= kui(:page_card,
    variant: :outline,
    icon: "zap",
    title: "Fast",
    description: "Zero JavaScript by default.") %>
```

### Card Variants

<%= render "component_preview", component: "kiso/page/page", scenario: "card_variants", height: "800px" %>

### Composed with Sub-Parts

```erb
<%%= kui(:page_card, variant: :outline) do %>
  <%%= kui(:page_card, :icon) { kiso_icon("zap") } %>
  <%%= kui(:page_card, :title) { "Custom Card" } %>
  <%%= kui(:page_card, :description) { "Full control." } %>
  <%%= kui(:page_card, :body) do %>
    <p>Additional body content.</p>
  <%% end %>
  <%%= kui(:page_card, :footer) do %>
    <%%= kui(:button, size: :sm, variant: :outline) { "Learn More" } %>
  <%% end %>
<%% end %>
```

## Locals

### Page

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | String | `""` |

### Page Header

| Local | Type | Default |
|-------|------|---------|
| `headline:` | String | `nil` |
| `title:` | String | `nil` |
| `description:` | String | `nil` |
| `ui:` | Hash | `{}` |
| `css_classes:` | String | `""` |

**`ui:` slots:** `wrapper`, `headline`, `title`, `description`

### Page Body

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | String | `""` |

### Page Section

| Local | Type | Default |
|-------|------|---------|
| `orientation:` | `:horizontal` \| `:vertical` | `:horizontal` |
| `ui:` | Hash | `{}` |
| `css_classes:` | String | `""` |

**`ui:` slots:** `container`

### Page Grid

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | String | `""` |

### Page Card

| Local | Type | Default |
|-------|------|---------|
| `variant:` | `:outline` \| `:soft` \| `:subtle` \| `:ghost` | `:outline` |
| `icon:` | String | `nil` |
| `title:` | String | `nil` |
| `description:` | String | `nil` |
| `ui:` | Hash | `{}` |
| `css_classes:` | String | `""` |

**`ui:` slots:** `container`, `wrapper`, `icon`, `title`, `description`

## Sub-Parts

| Component | Sub-Part | Slot |
|-----------|----------|------|
| `page` | `left` | `page-left` |
| `page` | `center` | `page-center` |
| `page` | `right` | `page-right` |
| `page_header` | `headline` | `page-header-headline` |
| `page_header` | `title` | `page-header-title` |
| `page_header` | `description` | `page-header-description` |
| `page_header` | `links` | `page-header-links` |
| `page_section` | `wrapper` | `page-section-wrapper` |
| `page_section` | `header` | `page-section-header` |
| `page_section` | `headline` | `page-section-headline` |
| `page_section` | `title` | `page-section-title` |
| `page_section` | `description` | `page-section-description` |
| `page_section` | `body` | `page-section-body` |
| `page_section` | `links` | `page-section-links` |
| `page_card` | `icon` | `page-card-icon` |
| `page_card` | `title` | `page-card-title` |
| `page_card` | `description` | `page-card-description` |
| `page_card` | `header` | `page-card-header` |
| `page_card` | `body` | `page-card-body` |
| `page_card` | `footer` | `page-card-footer` |
