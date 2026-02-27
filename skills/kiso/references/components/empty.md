# Empty

Centered placeholder for empty content areas (no data, no results, empty uploads).
Composed from sub-parts like Card. No color axis.

**Locals:** `css_classes:`, `**component_options`

**Sub-parts:** `kiso(:empty, :header)`, `kiso(:empty, :media)`, `kiso(:empty, :title)`, `kiso(:empty, :description)`, `kiso(:empty, :content)`

**Media variants:** `variant:` (default, icon) — `:icon` renders a muted rounded container for SVG icons.

```erb
<%= kiso(:empty) do %>
  <%= kiso(:empty, :header) do %>
    <%= kiso(:empty, :media, variant: :icon) do %>
      <svg>...</svg>
    <% end %>
    <%= kiso(:empty, :title) { "No Projects Yet" } %>
    <%= kiso(:empty, :description) { "Get started by creating your first project." } %>
  <% end %>
  <%= kiso(:empty, :content) do %>
    <%= kiso(:button) { "Create Project" } %>
  <% end %>
<% end %>
```

**Theme modules:** `Kiso::Themes::Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, `EmptyContent` (`lib/kiso/themes/empty.rb`)
