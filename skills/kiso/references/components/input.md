# Input

Single-line text field. Non-colored component (no `color:` axis).

**Locals:** `variant:` (outline, soft, ghost), `size:` (sm, md, lg), `type:` (text, email, password, search, number, file, etc.), `disabled:` (true/false), `css_classes:`, `**component_options`

**Defaults:** `variant: :outline, size: :md, type: :text`

All standard HTML input attributes (`placeholder:`, `name:`, `id:`, `value:`, `required:`) pass through via `**component_options`.

```erb
<%= kiso(:input, placeholder: "Email address") %>
<%= kiso(:input, variant: :soft, size: :sm) %>
<%= kiso(:input, type: :file, id: :avatar) %>

<%# With Field %>
<%= kiso(:field) do %>
  <%= kiso(:field, :label, for: :email) { "Email" } %>
  <%= kiso(:input, type: :email, id: :email, name: :email, placeholder: "you@example.com") %>
  <%= kiso(:field, :description) { "We'll never share your email." } %>
<% end %>

<%# With Rails form helpers %>
<%= f.text_field :email, class: Kiso::Themes::Input.render(variant: :outline, size: :md) %>
```

**Theme module:** `Kiso::Themes::Input` (`lib/kiso/themes/input.rb`)
