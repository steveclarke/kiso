# InputGroup

Wraps an input with inline prefix/suffix addons. Provides a shared ring — child input strips its own border.

**Locals:** `css_classes:`, `**component_options`

**Sub-parts:** `kiso(:input_group, :addon)` — accepts `align:` (start, end)

```erb
<%# Prefix text %>
<%= kiso(:input_group) do %>
  <%= kiso(:input_group, :addon) { "https://" } %>
  <%= kiso(:input, type: :text, placeholder: "example.com") %>
<% end %>

<%# Suffix icon %>
<%= kiso(:input_group) do %>
  <%= kiso(:input, type: :search, placeholder: "Search...") %>
  <%= kiso(:input_group, :addon, align: :end) do %>
    <svg>...</svg>
  <% end %>
<% end %>

<%# Both %>
<%= kiso(:input_group) do %>
  <%= kiso(:input_group, :addon) { "$" } %>
  <%= kiso(:input, type: :number, placeholder: "0.00") %>
  <%= kiso(:input_group, :addon, align: :end) { "USD" } %>
<% end %>
```

**Theme modules:** `Kiso::Themes::InputGroup`, `InputGroupAddon` (`lib/kiso/themes/input_group.rb`)
