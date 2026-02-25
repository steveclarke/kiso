# Components

Rails ERB components powered by Tailwind CSS and class_variants. Each component is a partial rendered via the `kiso()` helper. Theme definitions live in `lib/kiso/themes/`.

All colored components use **identical compound variant formulas** — see `project/DESIGN_SYSTEM.md`.

## Layout

| Component | Key locals |
|---|---|
| `card` | `variant` (outline/soft/subtle) |
| `empty_state` | No variants on root. Media sub-part has `variant` (default/icon) |
| `separator` | `orientation` (horizontal/vertical), `decorative` (true/false) |

### Separator

A visual divider between content sections. Renders as a 1px line, horizontal
or vertical.

**Locals:** `orientation:` (horizontal, vertical), `decorative:` (true/false), `css_classes:`, `**component_options`

**Defaults:** `orientation: :horizontal, decorative: true`

```erb
<%# Horizontal (default) %>
<%= kiso(:separator) %>

<%# With spacing %>
<%= kiso(:separator, css_classes: "my-4") %>

<%# Vertical — parent needs height + flex %>
<div class="flex h-5 items-center space-x-4 text-sm">
  <div>Blog</div>
  <%= kiso(:separator, orientation: :vertical) %>
  <div>Docs</div>
</div>

<%# Non-decorative (adds role="separator" + aria-orientation) %>
<%= kiso(:separator, decorative: false) %>
```

**Theme module:** `Kiso::Themes::Separator` (`lib/kiso/themes/separator.rb`)

## Element

| Component | Key locals |
|---|---|
| `badge` | `color`, `variant` (solid/outline/soft/subtle), `size` (xs-xl) |
| `alert` | `color`, `variant` (solid/outline/soft/subtle) |
| `button` | `color`, `variant` (solid/outline/soft/subtle/ghost/link), `size` (xs-xl) |

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
  <%= kiso(:alert, :title) { "Heads up!" } %>
  <%= kiso(:alert, :description) { "You can add components using the CLI." } %>
<% end %>

<%# With icon — SVG is sized/aligned automatically by the grid %>
<%= kiso(:alert, color: :error, variant: :solid) do %>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">...</svg>
  <%= kiso(:alert, :title) { "Error" } %>
  <%= kiso(:alert, :description) { "Something went wrong." } %>
<% end %>

<%# Neutral outline %>
<%= kiso(:alert, color: :neutral, variant: :outline) do %>
  <%= kiso(:alert, :title) { "New feature available" } %>
  <%= kiso(:alert, :description) { "Dark mode is now supported." } %>
<% end %>
```

**Note:** Description uses `opacity-90` (relative to parent text color), not `text-muted-foreground`.

**Theme modules:** `Kiso::Themes::Alert`, `AlertTitle`, `AlertDescription` (`lib/kiso/themes/alert.rb`)

### Button

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

### Card

Container component for grouping related content. Composed from sub-parts:
Header, Title, Description, Content, Footer.

**Locals:** `variant:` (outline, soft, subtle), `css_classes:`, `**component_options`

**Sub-parts:** `kiso(:card, :header)`, `kiso(:card, :title)`, `kiso(:card, :description)`, `kiso(:card, :content)`, `kiso(:card, :footer)`

**Defaults:** `variant: :outline`

```erb
<%= kiso(:card) do %>
  <%= kiso(:card, :header) do %>
    <%= kiso(:card, :title) { "Card Title" } %>
    <%= kiso(:card, :description) { "Card description goes here." } %>
  <% end %>
  <%= kiso(:card, :content) do %>
    <p>Your content here.</p>
  <% end %>
  <%= kiso(:card, :footer) do %>
    <%= kiso(:button, variant: :outline) { "Cancel" } %>
    <%= kiso(:button) { "Save" } %>
  <% end %>
<% end %>

<%# Soft variant, no footer %>
<%= kiso(:card, variant: :soft) do %>
  <%= kiso(:card, :header) do %>
    <%= kiso(:card, :title) { "Notifications" } %>
    <%= kiso(:card, :description) { "You have 3 unread messages." } %>
  <% end %>
  <%= kiso(:card, :content) do %>
    <%# list items here %>
  <% end %>
<% end %>
```

**Theme modules:** `Kiso::Themes::Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` (`lib/kiso/themes/card.rb`)

### Empty State

Centered placeholder for empty content areas (no data, no results, empty uploads).
Composed from sub-parts like Card. No color axis.

**Locals:** `css_classes:`, `**component_options`

**Sub-parts:** `kiso(:empty_state, :header)`, `kiso(:empty_state, :media)`, `kiso(:empty_state, :title)`, `kiso(:empty_state, :description)`, `kiso(:empty_state, :content)`

**Media variants:** `variant:` (default, icon) — `:icon` renders a muted rounded container for SVG icons.

```erb
<%= kiso(:empty_state) do %>
  <%= kiso(:empty_state, :header) do %>
    <%= kiso(:empty_state, :media, variant: :icon) do %>
      <svg>...</svg>
    <% end %>
    <%= kiso(:empty_state, :title) { "No Projects Yet" } %>
    <%= kiso(:empty_state, :description) { "Get started by creating your first project." } %>
  <% end %>
  <%= kiso(:empty_state, :content) do %>
    <%= kiso(:button) { "Create Project" } %>
  <% end %>
<% end %>

<%# With dashed border %>
<%= kiso(:empty_state, css_classes: "border border-dashed") do %>
  ...
<% end %>
```

**Theme modules:** `Kiso::Themes::EmptyState`, `EmptyStateHeader`, `EmptyStateMedia`, `EmptyStateTitle`, `EmptyStateDescription`, `EmptyStateContent` (`lib/kiso/themes/empty_state.rb`)

---

## Compound Variant Reference

All colored components share these exact formulas (see `project/DESIGN_SYSTEM.md`):

| Variant | Colored | Neutral |
|---|---|---|
| solid | `bg-{color} text-{color}-foreground` | `bg-inverted text-inverted-foreground` |
| outline | `text-{color} ring-{color}/50` | `text-foreground bg-background ring-accented` |
| soft | `bg-{color}/10 text-{color}` | `text-foreground bg-elevated` |
| subtle | `bg-{color}/10 text-{color} ring-{color}/25` | `text-foreground bg-elevated ring-accented` |

`ring ring-inset` is on the variant axis (outline, subtle), not in compound variants.
