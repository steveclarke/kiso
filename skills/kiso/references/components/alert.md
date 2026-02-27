# Alert

Contextual feedback message with optional icon, title, and description. Composition-based — use sub-parts for structure.

**Locals:** `color:` (primary, secondary, success, info, warning, error, neutral), `variant:` (solid, outline, soft, subtle), `css_classes:`, `**component_options`

**Sub-parts:** `kui(:alert, :title)`, `kui(:alert, :description)`

**Defaults:** `color: :primary, variant: :soft`

```erb
<%# Default: primary soft %>
<%= kui(:alert) do %>
  <%= kui(:alert, :title) { "Heads up!" } %>
  <%= kui(:alert, :description) { "You can add components using the CLI." } %>
<% end %>

<%# With icon — SVG is sized/aligned automatically by the grid %>
<%= kui(:alert, color: :error, variant: :solid) do %>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">...</svg>
  <%= kui(:alert, :title) { "Error" } %>
  <%= kui(:alert, :description) { "Something went wrong." } %>
<% end %>

<%# Neutral outline %>
<%= kui(:alert, color: :neutral, variant: :outline) do %>
  <%= kui(:alert, :title) { "New feature available" } %>
  <%= kui(:alert, :description) { "Dark mode is now supported." } %>
<% end %>
```

**Note:** Description uses `opacity-90` (relative to parent text color), not `text-muted-foreground`.

**Theme modules:** `Kiso::Themes::Alert`, `AlertTitle`, `AlertDescription` (`lib/kiso/themes/alert.rb`)
