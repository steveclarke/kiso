# Stats Card

Dashboard metric card for displaying KPIs. Specialized Card layout with
tighter spacing and sub-parts optimized for stats.

**Locals:** `variant:` (outline, soft, subtle), `css_classes:`, `**component_options`

**Sub-parts:** `kiso(:stats_card, :header)`, `kiso(:stats_card, :label)`, `kiso(:stats_card, :value)`, `kiso(:stats_card, :description)`

**Defaults:** `variant: :outline`

```erb
<%# Simple — label, value, description %>
<%= kiso(:stats_card) do %>
  <%= kiso(:stats_card, :label) { "Total Revenue" } %>
  <%= kiso(:stats_card, :value) { "$45,231.89" } %>
  <%= kiso(:stats_card, :description) { "+20.1% from last month" } %>
<% end %>

<%# With icon — use header to position label + icon %>
<%= kiso(:stats_card) do %>
  <%= kiso(:stats_card, :header) do %>
    <%= kiso(:stats_card, :label) { "Total Revenue" } %>
    <svg class="size-4 text-muted-foreground">...</svg>
  <% end %>
  <%= kiso(:stats_card, :value) { "$45,231.89" } %>
  <%= kiso(:stats_card, :description) { "+20.1% from last month" } %>
<% end %>
```

**Theme modules:** `Kiso::Themes::StatsCard`, `StatsCardHeader`, `StatsCardLabel`, `StatsCardValue`, `StatsCardDescription` (`lib/kiso/themes/stats_card.rb`)

## Stats Grid

Responsive grid wrapper for stats cards.

**Locals:** `columns:` (2, 3, 4), `css_classes:`, `**component_options`

**Defaults:** `columns: 4`

```erb
<%= kiso(:stats_grid, columns: 4) do %>
  <%= kiso(:stats_card) do %>...<%  end %>
  <%= kiso(:stats_card) do %>...<%  end %>
  <%= kiso(:stats_card) do %>...<%  end %>
  <%= kiso(:stats_card) do %>...<%  end %>
<% end %>
```

**Theme module:** `Kiso::Themes::StatsGrid` (`lib/kiso/themes/stats_card.rb`)
