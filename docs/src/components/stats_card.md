---
title: Stats Card
layout: docs
description: Dashboard metric card for displaying KPIs with label, value, and trend description.
category: Data
source: lib/kiso/themes/stats_card.rb
---

## Quick Start

```erb
<%%= kiso(:stats_card) do %>
  <%%= kiso(:stats_card, :label) { "Total Revenue" } %>
  <%%= kiso(:stats_card, :value) { "$45,231.89" } %>
  <%%= kiso(:stats_card, :description) { "+20.1% from last month" } %>
<%% end %>
```

[Lookbook playground →](/lookbook/inspect/kiso/stats_card/playground)

## Locals

| Local | Type | Default |
|-------|------|---------|
| `variant:` | `:outline` \| `:soft` \| `:subtle` | `:outline` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

## Sub-parts

| Part | Usage | Purpose |
|------|-------|---------|
| `:header` | `kiso(:stats_card, :header)` | Flex row for label + icon |
| `:label` | `kiso(:stats_card, :label)` | Metric name (small muted text) |
| `:value` | `kiso(:stats_card, :value)` | Big metric number (tabular-nums) |
| `:description` | `kiso(:stats_card, :description)` | Trend text or subtitle |

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
<%%= kiso(:stats_card, variant: :outline) do %>...<%% end %>
<%%= kiso(:stats_card, variant: :soft) do %>...<%% end %>
<%%= kiso(:stats_card, variant: :subtle) do %>...<%% end %>
```

| Variant | Appearance |
|---------|------------|
| `outline` (default) | White background, border, subtle shadow |
| `soft` | Elevated background, no border |
| `subtle` | Elevated background with border |

### With Icon

Wrap `:label` and an SVG inside `:header` to position them side by side.

```erb
<%%= kiso(:stats_card) do %>
  <%%= kiso(:stats_card, :header) do %>
    <%%= kiso(:stats_card, :label) { "Total Revenue" } %>
    <svg class="size-4 text-muted-foreground">...</svg>
  <%% end %>
  <%%= kiso(:stats_card, :value) { "$45,231.89" } %>
  <%%= kiso(:stats_card, :description) { "+20.1% from last month" } %>
<%% end %>
```

### Stats Grid

Use `kiso(:stats_grid)` to arrange stats cards in a responsive grid.

```erb
<%%= kiso(:stats_grid, columns: 4) do %>
  <%%= kiso(:stats_card) do %>
    <%%= kiso(:stats_card, :label) { "Revenue" } %>
    <%%= kiso(:stats_card, :value) { "$45,231" } %>
    <%%= kiso(:stats_card, :description) { "+20.1%" } %>
  <%% end %>
  <%%= kiso(:stats_card) do %>
    <%%= kiso(:stats_card, :label) { "Subscribers" } %>
    <%%= kiso(:stats_card, :value) { "+2,350" } %>
    <%%= kiso(:stats_card, :description) { "+180.1%" } %>
  <%% end %>
  <%%= kiso(:stats_card) do %>
    <%%= kiso(:stats_card, :label) { "Active Now" } %>
    <%%= kiso(:stats_card, :value) { "+573" } %>
    <%%= kiso(:stats_card, :description) { "+201 this hour" } %>
  <%% end %>
  <%%= kiso(:stats_card) do %>
    <%%= kiso(:stats_card, :label) { "Growth" } %>
    <%%= kiso(:stats_card, :value) { "4.5%" } %>
    <%%= kiso(:stats_card, :description) { "+0.5%" } %>
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

Stats Card renders as a `<div>` with `data-component="stats_card"`. Sub-parts
use `data-stats-card-part` attributes for identity.
