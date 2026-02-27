# RadioGroup

A group of radio buttons for selecting one option from a set. Container uses
`role="radiogroup"`, items are native `<input type="radio">`.

**Locals (RadioGroupItem):** `color:` (7 colors), `css_classes:`, `**component_options`

**Defaults:** `color: :primary`

**Sub-parts:** `kiso(:radio_group, :item)`

```erb
<%= kiso(:radio_group, name: :plan) do %>
  <div class="flex items-center gap-3">
    <%= kiso(:radio_group, :item, value: "free", id: :plan_free) %>
    <%= kiso(:field, :label, for: :plan_free) { "Free" } %>
  </div>
  <div class="flex items-center gap-3">
    <%= kiso(:radio_group, :item, value: "pro", id: :plan_pro) %>
    <%= kiso(:field, :label, for: :plan_pro) { "Pro" } %>
  </div>
<% end %>

<%# With Rails form helpers %>
<%= f.radio_button :plan, "free",
    class: Kiso::Themes::RadioGroupItem.render(color: :primary) %>
```

**Theme modules:** `Kiso::Themes::RadioGroup`, `RadioGroupItem` (`lib/kiso/themes/radio_group.rb`)
