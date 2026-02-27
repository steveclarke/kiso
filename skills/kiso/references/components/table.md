# Table

Data table with semantic HTML elements. Scrollable container wrapper with
7 sub-parts mapping to native table elements.

**Locals:** `css_classes:`, `**component_options`

**Sub-parts:** `kiso(:table, :header)` (thead), `kiso(:table, :body)` (tbody), `kiso(:table, :footer)` (tfoot), `kiso(:table, :row)` (tr), `kiso(:table, :head)` (th), `kiso(:table, :cell)` (td), `kiso(:table, :caption)` (caption)

```erb
<%= kiso(:table) do %>
  <%= kiso(:table, :caption) { "A list of recent invoices." } %>
  <%= kiso(:table, :header) do %>
    <%= kiso(:table, :row) do %>
      <%= kiso(:table, :head) { "Invoice" } %>
      <%= kiso(:table, :head) { "Status" } %>
      <%= kiso(:table, :head, css_classes: "text-right") { "Amount" } %>
    <% end %>
  <% end %>
  <%= kiso(:table, :body) do %>
    <%= kiso(:table, :row) do %>
      <%= kiso(:table, :cell, css_classes: "font-medium") { "INV001" } %>
      <%= kiso(:table, :cell) { "Paid" } %>
      <%= kiso(:table, :cell, css_classes: "text-right") { "$250.00" } %>
    <% end %>
  <% end %>
<% end %>
```

**Theme modules:** `Kiso::Themes::Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption` (`lib/kiso/themes/table.rb`)
