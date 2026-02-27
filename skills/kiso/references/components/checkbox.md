# Checkbox

A toggle control for boolean choices. Native `<input type="checkbox">` with color variants for the checked state.

**Locals:** `color:` (7 colors), `checked:` (true/false), `css_classes:`, `**component_options`

**Defaults:** `color: :primary`

```erb
<%= kiso(:checkbox, color: :primary) %>
<%= kiso(:checkbox, color: :success, checked: true) %>

<%# With Field %>
<%= kiso(:field, orientation: :horizontal) do %>
  <%= kiso(:checkbox, id: :terms) %>
  <%= kiso(:field, :label, for: :terms) { "Accept terms" } %>
<% end %>
```

**Theme module:** `Kiso::Themes::Checkbox` (`lib/kiso/themes/checkbox.rb`)
