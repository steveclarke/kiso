# Components

Rails ERB components powered by Tailwind CSS and class_variants. Each component is a partial rendered via the `kiso()` helper. Theme definitions live in `lib/kiso/themes/`.

## Element

| Component | Key locals |
|---|---|
| `badge` | `color`, `variant` (solid/outline/soft/subtle), `size` (xs-xl) |

### Badge

Inline label for status, categories, or counts.

**Locals:** `color:` (primary, secondary, success, info, warning, error, neutral), `variant:` (solid, outline, soft, subtle), `size:` (xs, sm, md, lg, xl), `css_classes:`, `**component_options`

**Defaults:** `color: :primary, variant: :soft, size: :md`

```erb
<%= kiso(:badge, color: :success, variant: :soft) { "Active" } %>
<%= kiso(:badge, color: :error, variant: :solid, size: :sm) { "Failed" } %>
<%= kiso(:badge, color: :neutral, variant: :outline) { "Draft" } %>
```

**Variant styles per color:**

| Variant | Colored | Neutral |
|---|---|---|
| solid | `bg-{color} text-{color}-foreground` | `bg-inverted text-inverted` |
| outline | `text-{color} ring ring-inset ring-{color}/50` | `ring-accented text-foreground bg-background` |
| soft | `bg-{color}/10 text-{color}` | `text-foreground bg-muted` |
| subtle | `bg-{color}/10 text-{color} ring ring-inset ring-{color}/25` | `ring-accented text-foreground bg-muted` |

**Theme module:** `Kiso::Themes::Badge` (`lib/kiso/themes/badge.rb`)
