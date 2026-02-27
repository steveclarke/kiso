# Button

Interactive button with smart tag selection. Renders `<button>` by default,
`<a>` when `href:` is present.

**Locals:** `color:`, `variant:` (solid, outline, soft, subtle, ghost, link), `size:` (xs-xl), `block:` (true/false), `disabled:` (true/false), `type:` (button, submit, reset), `href:` (string), `css_classes:`, `**component_options`

**Defaults:** `color: :primary, variant: :solid, size: :md`

```erb
<%= kiso(:button) { "Click me" } %>
<%= kiso(:button, color: :error) { "Delete" } %>
<%= kiso(:button, href: "/settings", variant: :outline) { "Settings" } %>
<%= kiso(:button, variant: :ghost) { "Cancel" } %>
<%= kiso(:button, block: true, type: :submit) { "Save" } %>

<%# With inline icon %>
<%= kiso(:button, variant: :outline) do %>
  <svg class="size-4">...</svg>
  Download
<% end %>
```

**Theme module:** `Kiso::Themes::Button` (`lib/kiso/themes/button.rb`)
