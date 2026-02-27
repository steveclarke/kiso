# Card

Container component for grouping related content. Composed from sub-parts:
Header, Title, Description, Content, Footer.

**Locals:** `variant:` (outline, soft, subtle), `css_classes:`, `**component_options`

**Sub-parts:** `kiso(:card, :header)`, `kiso(:card, :title)`, `kiso(:card, :description)`, `kiso(:card, :content)`, `kiso(:card, :footer)`

**Defaults:** `variant: :outline`

```erb
<%= kiso(:card) do %>
  <%= kiso(:card, :header) do %>
    <%= kiso(:card, :title) { "Card Title" } %>
    <%= kiso(:card, :description) { "Card description goes here." } %>
  <% end %>
  <%= kiso(:card, :content) do %>
    <p>Your content here.</p>
  <% end %>
  <%= kiso(:card, :footer) do %>
    <%= kiso(:button, variant: :outline) { "Cancel" } %>
    <%= kiso(:button) { "Save" } %>
  <% end %>
<% end %>
```

**Theme modules:** `Kiso::Themes::Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` (`lib/kiso/themes/card.rb`)
