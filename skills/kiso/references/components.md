# Components

Rails ERB components powered by Tailwind CSS and class_variants. Each component is a partial rendered via the `kiso()` helper. Theme definitions live in `lib/kiso/themes/`.

All colored components use **identical compound variant formulas** — see `docs/DESIGN_SYSTEM.md`.

## Element

| Component | Key locals |
|---|---|
| `badge` | `color`, `variant` (solid/outline/soft/subtle), `size` (xs-xl) |
| `alert` | `color`, `variant` (solid/outline/soft/subtle) |

### Badge

Inline label for status, categories, or counts.

**Locals:** `color:` (primary, secondary, success, info, warning, error, neutral), `variant:` (solid, outline, soft, subtle), `size:` (xs, sm, md, lg, xl), `css_classes:`, `**component_options`

**Defaults:** `color: :primary, variant: :soft, size: :md`

```erb
<%= kiso(:badge, color: :success, variant: :soft) { "Active" } %>
<%= kiso(:badge, color: :error, variant: :solid, size: :sm) { "Failed" } %>
<%= kiso(:badge, color: :neutral, variant: :outline) { "Draft" } %>
```

**Theme module:** `Kiso::Themes::Badge` (`lib/kiso/themes/badge.rb`)

### Alert

Contextual feedback message with optional icon, title, and description. Composition-based — use sub-parts for structure.

**Locals:** `color:` (primary, secondary, success, info, warning, error, neutral), `variant:` (solid, outline, soft, subtle), `css_classes:`, `**component_options`

**Sub-parts:** `kiso(:alert, :title)`, `kiso(:alert, :description)`

**Defaults:** `color: :primary, variant: :soft`

```erb
<%# Default: primary soft %>
<%= kiso(:alert) do %>
  <div class="flex-1">
    <%= kiso(:alert, :title) { "Heads up!" } %>
    <%= kiso(:alert, :description) { "You can add components using the CLI." } %>
  </div>
<% end %>

<%# With icon %>
<%= kiso(:alert, color: :error, variant: :solid) do %>
  <svg class="size-5 shrink-0 mt-0.5" ...>...</svg>
  <div class="flex-1">
    <%= kiso(:alert, :title) { "Error" } %>
    <%= kiso(:alert, :description) { "Something went wrong." } %>
  </div>
<% end %>

<%# Neutral outline %>
<%= kiso(:alert, color: :neutral, variant: :outline) do %>
  <div class="flex-1">
    <%= kiso(:alert, :title) { "New feature available" } %>
    <%= kiso(:alert, :description) { "Dark mode is now supported." } %>
  </div>
<% end %>
```

**Note:** Description uses `opacity-90` (relative to parent text color), not `text-muted-foreground`.

**Theme modules:** `Kiso::Themes::Alert`, `AlertTitle`, `AlertDescription` (`lib/kiso/themes/alert.rb`)

---

## Compound Variant Reference

All colored components share these exact formulas (see `docs/DESIGN_SYSTEM.md`):

| Variant | Colored | Neutral |
|---|---|---|
| solid | `bg-{color} text-{color}-foreground` | `bg-inverted text-inverted-foreground` |
| outline | `text-{color} ring-{color}/50` | `text-foreground bg-background ring-accented` |
| soft | `bg-{color}/10 text-{color}` | `text-foreground bg-elevated` |
| subtle | `bg-{color}/10 text-{color} ring-{color}/25` | `text-foreground bg-elevated ring-accented` |

`ring ring-inset` is on the variant axis (outline, subtle), not in compound variants.
