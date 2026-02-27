# Badge

Inline label for status, categories, or counts.

**Locals:** `color:` (primary, secondary, success, info, warning, error, neutral), `variant:` (solid, outline, soft, subtle), `size:` (xs, sm, md, lg, xl), `css_classes:`, `**component_options`

**Defaults:** `color: :primary, variant: :soft, size: :md`

```erb
<%= kiso(:badge, color: :success, variant: :soft) { "Active" } %>
<%= kiso(:badge, color: :error, variant: :solid, size: :sm) { "Failed" } %>
<%= kiso(:badge, color: :neutral, variant: :outline) { "Draft" } %>
```

**Theme module:** `Kiso::Themes::Badge` (`lib/kiso/themes/badge.rb`)
