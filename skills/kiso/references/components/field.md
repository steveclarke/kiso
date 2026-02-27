# Field

Composable form field wrapper. Provides accessible structure for labels,
descriptions, errors, and layout orientation.

**Locals:** `orientation:` (vertical, horizontal, responsive), `invalid:` (true/false), `disabled:` (true/false), `css_classes:`, `**component_options`

**Defaults:** `orientation: :vertical, invalid: false, disabled: false`

**Sub-parts:** `kiso(:field, :label)`, `kiso(:field, :content)`, `kiso(:field, :title)`, `kiso(:field, :description)`, `kiso(:field, :error)`, `kiso(:field, :separator)`

```erb
<%# Vertical field (default) %>
<%= kiso(:field) do %>
  <%= kiso(:field, :label, for: :email) { "Email" } %>
  <%= kiso(:input, id: :email, name: :email) %>
  <%= kiso(:field, :description) { "We'll never share your email." } %>
  <%= kiso(:field, :error, errors: @user.errors[:email]) %>
<% end %>

<%# Horizontal (checkbox/switch layout) %>
<%= kiso(:field, orientation: :horizontal) do %>
  <%= kiso(:checkbox, id: :terms) %>
  <%= kiso(:field, :label, for: :terms) { "Accept terms" } %>
<% end %>
```

**FieldError:** Only renders when content is present. Accepts `errors:` array (Rails model errors) or block content. Multiple errors render as a bulleted list.

**Theme modules:** `Kiso::Themes::Field`, `FieldContent`, `FieldLabel`, `FieldTitle`, `FieldDescription`, `FieldError`, `FieldSeparator`, `FieldSeparatorText` (`lib/kiso/themes/field.rb`)

## FieldGroup

Stacks multiple fields with `gap-7` spacing. Provides `@container/field-group` scope for responsive Field orientation.

```erb
<%= kiso(:field_group) do %>
  <%= kiso(:field) do %>...<% end %>
  <%= kiso(:field) do %>...<% end %>
<% end %>
```

**Theme module:** `Kiso::Themes::FieldGroup` (`lib/kiso/themes/field_group.rb`)

## FieldSet

Semantic `<fieldset>` for grouping related controls.

**Sub-parts:** `kiso(:field_set, :legend)` — accepts `variant:` (legend, label)

```erb
<%= kiso(:field_set) do %>
  <%= kiso(:field_set, :legend) { "Notifications" } %>
  <%= kiso(:field, orientation: :horizontal) do %>
    <%= kiso(:checkbox, id: :email_notifs) %>
    <%= kiso(:field, :label, for: :email_notifs) { "Email" } %>
  <% end %>
<% end %>
```

**Theme modules:** `Kiso::Themes::FieldSet`, `FieldLegend` (`lib/kiso/themes/field_set.rb`)
