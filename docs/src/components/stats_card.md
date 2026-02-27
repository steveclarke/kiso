---
title: Stats Card
layout: docs
description: Dashboard metric card for displaying KPIs with label, value, and trend description.
category: Data
source: lib/kiso/themes/stats_card.rb
---

## Quick Start

```erb
<%%= kui(:stats_card) do %>
  <%%= kui(:stats_card, :label) { "Total Revenue" } %>
  <%%= kui(:stats_card, :value) { "$45,231.89" } %>
  <%%= kui(:stats_card, :description) { "+20.1% from last month" } %>
<%% end %>
```

<%= render "component_preview", component: "kiso/stats_card", scenario: "playground", height: "350px" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `variant:` | `:outline` \| `:soft` \| `:subtle` | `:outline` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

## Sub-parts

| Part | Usage | Purpose |
|------|-------|---------|
| `:header` | `kui(:stats_card, :header)` | Flex row for label + icon |
| `:label` | `kui(:stats_card, :label)` | Metric name (small muted text) |
| `:value` | `kui(:stats_card, :value)` | Big metric number (tabular-nums) |
| `:description` | `kui(:stats_card, :description)` | Trend text or subtitle |

All sub-parts accept `css_classes:` and `**component_options`.

## Anatomy

```
Stats Card
├── Header (optional — only needed for label + icon)
│   ├── Label
│   └── Icon (SVG)
├── Label (if no header)
├── Value
└── Description
```

Use `:header` only when you need a label + icon row. Otherwise, place
`:label` directly inside the stats card.

## Usage

### Variant

Same visual variants as Card — matches when used alongside cards in dashboards.

```erb
<%%= kui(:stats_card, variant: :outline) do %>...<%% end %>
<%%= kui(:stats_card, variant: :soft) do %>...<%% end %>
<%%= kui(:stats_card, variant: :subtle) do %>...<%% end %>
```

| Variant | Appearance |
|---------|------------|
| `outline` (default) | White background, border, subtle shadow |
| `soft` | Elevated background, no border |
| `subtle` | Elevated background with border |

### With Icon

Wrap `:label` and an SVG inside `:header` to position them side by side.

```erb
<%%= kui(:stats_card) do %>
  <%%= kui(:stats_card, :header) do %>
    <%%= kui(:stats_card, :label) { "Total Revenue" } %>
    <svg class="size-4 text-muted-foreground">...</svg>
  <%% end %>
  <%%= kui(:stats_card, :value) { "$45,231.89" } %>
  <%%= kui(:stats_card, :description) { "+20.1% from last month" } %>
<%% end %>
```

### Stats Grid

Use `kui(:stats_grid)` to arrange stats cards in a responsive grid.

```erb
<%%= kui(:stats_grid, columns: 4) do %>
  <%%= kui(:stats_card) do %>
    <%%= kui(:stats_card, :label) { "Revenue" } %>
    <%%= kui(:stats_card, :value) { "$45,231" } %>
    <%%= kui(:stats_card, :description) { "+20.1%" } %>
  <%% end %>
  <%%= kui(:stats_card) do %>
    <%%= kui(:stats_card, :label) { "Subscribers" } %>
    <%%= kui(:stats_card, :value) { "+2,350" } %>
    <%%= kui(:stats_card, :description) { "+180.1%" } %>
  <%% end %>
  <%%= kui(:stats_card) do %>
    <%%= kui(:stats_card, :label) { "Active Now" } %>
    <%%= kui(:stats_card, :value) { "+573" } %>
    <%%= kui(:stats_card, :description) { "+201 this hour" } %>
  <%% end %>
  <%%= kui(:stats_card) do %>
    <%%= kui(:stats_card, :label) { "Growth" } %>
    <%%= kui(:stats_card, :value) { "4.5%" } %>
    <%%= kui(:stats_card, :description) { "+0.5%" } %>
  <%% end %>
<%% end %>
```

| Columns | Breakpoints |
|---------|-------------|
| `2` | 1 col → 2 col at `sm` |
| `3` | 1 col → 3 col at `sm` |
| `4` (default) | 1 col → 2 col at `sm` → 4 col at `lg` |

**Stats Grid locals:** `columns:` (2, 3, 4), `css_classes:`, `**component_options`

## Theme

```ruby
Kiso::Themes::StatsCard = ClassVariants.build(
  base: "flex flex-col gap-2 rounded-xl p-4 text-foreground",
  variants: {
    variant: {
      outline: "bg-background ring ring-inset ring-border shadow-sm",
      soft: "bg-elevated/50",
      subtle: "bg-elevated/50 ring ring-inset ring-border"
    }
  },
  defaults: { variant: :outline }
)

StatsCardHeader      = ClassVariants.build(base: "flex items-center justify-between gap-2")
StatsCardLabel       = ClassVariants.build(base: "text-sm font-medium text-muted-foreground")
StatsCardValue       = ClassVariants.build(base: "text-2xl font-semibold tabular-nums")
StatsCardDescription = ClassVariants.build(base: "text-xs text-muted-foreground")

StatsGrid = ClassVariants.build(
  base: "grid grid-cols-1 gap-4",
  variants: { columns: { 2 => "sm:grid-cols-2", 3 => "sm:grid-cols-3", 4 => "sm:grid-cols-2 lg:grid-cols-4" } },
  defaults: { columns: 4 }
)
```

## Accessibility

Stats Card renders as a `<div>` with `data-slot="stats-card"`. Sub-parts
use `data-slot` attributes (e.g., `data-slot="stats-card-header"`).
