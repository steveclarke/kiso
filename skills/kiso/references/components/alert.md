# Alert

Contextual feedback message with optional icon, title, and description. Composition-based — use sub-parts for structure.

**Locals:** `color:` (primary, secondary, success, info, warning, error, neutral), `variant:` (solid, outline, soft, subtle), `css_classes:`, `**component_options`

**Sub-parts:** `kiso(:alert, :title)`, `kiso(:alert, :description)`

**Defaults:** `color: :primary, variant: :soft`

```erb
<%# Default: primary soft %>
<%= kiso(:alert) do %>
  <%= kiso(:alert, :title) { "Heads up!" } %>
  <%= kiso(:alert, :description) { "You can add components using the CLI." } %>
<% end %>

<%# With icon — SVG is sized/aligned automatically by the grid %>
<%= kiso(:alert, color: :error, variant: :solid) do %>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">...</svg>
  <%= kiso(:alert, :title) { "Error" } %>
  <%= kiso(:alert, :description) { "Something went wrong." } %>
<% end %>

<%# Neutral outline %>
<%= kiso(:alert, color: :neutral, variant: :outline) do %>
  <%= kiso(:alert, :title) { "New feature available" } %>
  <%= kiso(:alert, :description) { "Dark mode is now supported." } %>
<% end %>
```

**Note:** Description uses `opacity-90` (relative to parent text color), not `text-muted-foreground`.

**Theme modules:** `Kiso::Themes::Alert`, `AlertTitle`, `AlertDescription` (`lib/kiso/themes/alert.rb`)
