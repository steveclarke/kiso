# Components

Rails ERB components powered by Tailwind CSS and class_variants. Each component is a partial rendered via the `kiso()` helper. Theme definitions live in `lib/kiso/themes/`.

All colored components use **identical compound variant formulas** — see `project/DESIGN_SYSTEM.md`.

## Layout

| Component | Key locals |
|---|---|
| `card` | `variant` (outline/soft/subtle) |
| `empty` | No variants on root. Media sub-part has `variant` (default/icon) |
| `stats_card` | `variant` (outline/soft/subtle) |
| `stats_grid` | `columns` (2/3/4) |
| `separator` | `orientation` (horizontal/vertical), `decorative` (true/false) |
| `table` | No variants. 7 sub-parts: header, body, footer, row, head, cell, caption |

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

## Forms

| Component | Key locals |
|---|---|
| `field` | `orientation` (vertical/horizontal/responsive), `invalid`, `disabled` |
| `field_group` | No variants. Container for stacking fields with gap-7 spacing |
| `field_set` | No variants. Semantic `<fieldset>` for checkbox/radio groups |
| `label` | No variants. Styled `<label>` element |
| `input` | `variant` (outline/soft/ghost), `size` (sm/md/lg), `type`, `disabled` |
| `textarea` | `variant` (outline/soft/ghost), `size` (sm/md/lg), `disabled` |
| `input_group` | No variants. Wraps input + addons with shared ring |
| `checkbox` | `color` (7 colors), `checked` |
| `radio_group` | `color` (7 colors). Sub-part: item |
| `switch` | `color` (7 colors), `size` (sm/md), `checked` |

### Field

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

### FieldGroup

Stacks multiple fields with `gap-7` spacing. Provides `@container/field-group` scope for responsive Field orientation.

```erb
<%= kiso(:field_group) do %>
  <%= kiso(:field) do %>...<% end %>
  <%= kiso(:field) do %>...<% end %>
<% end %>
```

**Theme module:** `Kiso::Themes::FieldGroup` (`lib/kiso/themes/field_group.rb`)

### FieldSet

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

### Label

Styled `<label>` element with disabled state handling. Used internally by FieldLabel.

```erb
<%= kiso(:label, for: :email) { "Email address" } %>
```

**Theme module:** `Kiso::Themes::Label` (`lib/kiso/themes/label.rb`)

### Input

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

### Textarea

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

### InputGroup

Wraps an input with inline prefix/suffix addons. Provides a shared ring — child input strips its own border.

**Locals:** `css_classes:`, `**component_options`

**Sub-parts:** `kiso(:input_group, :addon)` — accepts `align:` (start, end)

```erb
<%# Prefix text %>
<%= kiso(:input_group) do %>
  <%= kiso(:input_group, :addon) { "https://" } %>
  <%= kiso(:input, type: :text, placeholder: "example.com") %>
<% end %>

<%# Suffix icon %>
<%= kiso(:input_group) do %>
  <%= kiso(:input, type: :search, placeholder: "Search...") %>
  <%= kiso(:input_group, :addon, align: :end) do %>
    <svg>...</svg>
  <% end %>
<% end %>

<%# Both %>
<%= kiso(:input_group) do %>
  <%= kiso(:input_group, :addon) { "$" } %>
  <%= kiso(:input, type: :number, placeholder: "0.00") %>
  <%= kiso(:input_group, :addon, align: :end) { "USD" } %>
<% end %>
```

**Theme modules:** `Kiso::Themes::InputGroup`, `InputGroupAddon` (`lib/kiso/themes/input_group.rb`)

### Checkbox

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

### RadioGroup

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

### Switch

A binary toggle for on/off states. Uses a native `<input type="checkbox">` with `role="switch"` inside a `<label>` that doubles as the track.

**Locals:** `color:` (7 colors), `size:` (sm, md), `checked:` (true/false), `css_classes:`, `**component_options`

**Defaults:** `color: :primary, size: :md`

```erb
<%= kiso(:switch) %>
<%= kiso(:switch, color: :success, checked: true) %>
<%= kiso(:switch, size: :sm) %>

<%# With Field %>
<%= kiso(:field, orientation: :horizontal) do %>
  <%= kiso(:switch, id: :dark_mode, name: :dark_mode, value: "1") %>
  <%= kiso(:field, :label, for: :dark_mode) { "Dark mode" } %>
<% end %>
```

**Theme modules:** `Kiso::Themes::SwitchTrack`, `SwitchThumb` (`lib/kiso/themes/switch.rb`)

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

### Empty

Centered placeholder for empty content areas (no data, no results, empty uploads).
Composed from sub-parts like Card. No color axis.

**Locals:** `css_classes:`, `**component_options`

**Sub-parts:** `kiso(:empty, :header)`, `kiso(:empty, :media)`, `kiso(:empty, :title)`, `kiso(:empty, :description)`, `kiso(:empty, :content)`

**Media variants:** `variant:` (default, icon) — `:icon` renders a muted rounded container for SVG icons.

```erb
<%= kiso(:empty) do %>
  <%= kiso(:empty, :header) do %>
    <%= kiso(:empty, :media, variant: :icon) do %>
      <svg>...</svg>
    <% end %>
    <%= kiso(:empty, :title) { "No Projects Yet" } %>
    <%= kiso(:empty, :description) { "Get started by creating your first project." } %>
  <% end %>
  <%= kiso(:empty, :content) do %>
    <%= kiso(:button) { "Create Project" } %>
  <% end %>
<% end %>

<%# With dashed border %>
<%= kiso(:empty, css_classes: "border border-dashed") do %>
  ...
<% end %>
```

**Theme modules:** `Kiso::Themes::Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, `EmptyContent` (`lib/kiso/themes/empty.rb`)

### Stats Card

Dashboard metric card for displaying KPIs. Specialized Card layout with
tighter spacing and sub-parts optimized for stats.

**Locals:** `variant:` (outline, soft, subtle), `css_classes:`, `**component_options`

**Sub-parts:** `kiso(:stats_card, :header)`, `kiso(:stats_card, :label)`, `kiso(:stats_card, :value)`, `kiso(:stats_card, :description)`

**Defaults:** `variant: :outline`

```erb
<%# Simple — label, value, description %>
<%= kiso(:stats_card) do %>
  <%= kiso(:stats_card, :label) { "Total Revenue" } %>
  <%= kiso(:stats_card, :value) { "$45,231.89" } %>
  <%= kiso(:stats_card, :description) { "+20.1% from last month" } %>
<% end %>

<%# With icon — use header to position label + icon %>
<%= kiso(:stats_card) do %>
  <%= kiso(:stats_card, :header) do %>
    <%= kiso(:stats_card, :label) { "Total Revenue" } %>
    <svg class="size-4 text-muted-foreground">...</svg>
  <% end %>
  <%= kiso(:stats_card, :value) { "$45,231.89" } %>
  <%= kiso(:stats_card, :description) { "+20.1% from last month" } %>
<% end %>
```

**Theme modules:** `Kiso::Themes::StatsCard`, `StatsCardHeader`, `StatsCardLabel`, `StatsCardValue`, `StatsCardDescription` (`lib/kiso/themes/stats_card.rb`)

### Stats Grid

Responsive grid wrapper for stats cards.

**Locals:** `columns:` (2, 3, 4), `css_classes:`, `**component_options`

**Defaults:** `columns: 4`

```erb
<%= kiso(:stats_grid, columns: 4) do %>
  <%= kiso(:stats_card) do %>...<%  end %>
  <%= kiso(:stats_card) do %>...<%  end %>
  <%= kiso(:stats_card) do %>...<%  end %>
  <%= kiso(:stats_card) do %>...<%  end %>
<% end %>
```

**Theme module:** `Kiso::Themes::StatsGrid` (`lib/kiso/themes/stats_card.rb`)

### Table

Data table with semantic HTML elements. Scrollable container wrapper with
7 sub-parts mapping to native table elements.

**Locals:** `css_classes:`, `**component_options`

**Sub-parts:** `kiso(:table, :header)` (thead), `kiso(:table, :body)` (tbody), `kiso(:table, :footer)` (tfoot), `kiso(:table, :row)` (tr), `kiso(:table, :head)` (th), `kiso(:table, :cell)` (td), `kiso(:table, :caption)` (caption)

```erb
<%= kiso(:table) do %>
  <%= kiso(:table, :caption) { "A list of recent invoices." } %>
  <%= kiso(:table, :header) do %>
    <%= kiso(:table, :row) do %>
      <%= kiso(:table, :head) { "Invoice" } %>
      <%= kiso(:table, :head) { "Status" } %>
      <%= kiso(:table, :head, css_classes: "text-right") { "Amount" } %>
    <% end %>
  <% end %>
  <%= kiso(:table, :body) do %>
    <%= kiso(:table, :row) do %>
      <%= kiso(:table, :cell, css_classes: "font-medium") { "INV001" } %>
      <%= kiso(:table, :cell) { "Paid" } %>
      <%= kiso(:table, :cell, css_classes: "text-right") { "$250.00" } %>
    <% end %>
  <% end %>
<% end %>
```

**Theme modules:** `Kiso::Themes::Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption` (`lib/kiso/themes/table.rb`)

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
