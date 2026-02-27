# Textarea

Multi-line text field. Same variant/size axes as Input. Uses `field-sizing-content` for auto-height with `min-h-16` minimum.

**Locals:** `variant:` (outline, soft, ghost), `size:` (sm, md, lg), `disabled:` (true/false), `css_classes:`, `**component_options`

**Defaults:** `variant: :outline, size: :md`

```erb
<%= kiso(:textarea, placeholder: "Tell us more...", rows: 4) %>

<%# With Field %>
<%= kiso(:field) do %>
  <%= kiso(:field, :label, for: :bio) { "Bio" } %>
  <%= kiso(:textarea, id: :bio, name: :bio, placeholder: "Tell us about yourself...") %>
<% end %>
```

**Theme module:** `Kiso::Themes::Textarea` (`lib/kiso/themes/textarea.rb`)
