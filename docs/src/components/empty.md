---
title: Empty
layout: docs
description: Centered placeholder for empty content areas — no data, no results, no uploads.
category: Layout
source: lib/kiso/themes/empty.rb
---

## Quick Start

```erb
<%%= kui(:empty) do %>
  <%%= kui(:empty, :header) do %>
    <%%= kui(:empty, :media, variant: :icon) do %>
      <%%= kiso_icon("folder") %>
    <%% end %>
    <%%= kui(:empty, :title) { "No Projects Yet" } %>
    <%%= kui(:empty, :description) { "Get started by creating your first project." } %>
  <%% end %>
<%% end %>
```

<%= render "component_preview", component: "kiso/empty", scenario: "playground", height: "450px" %>

## Locals

The root `empty` has no variant axis — it renders a centered flex container.

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

## Sub-parts

| Part | Usage | Purpose |
|------|-------|---------|
| `:header` | `kui(:empty, :header)` | Groups media, title, and description |
| `:media` | `kui(:empty, :media)` | Icon or image container |
| `:title` | `kui(:empty, :title)` | Heading text |
| `:description` | `kui(:empty, :description)` | Muted description text |
| `:actions` | `kui(:empty, :actions)` | Centered button group for CTAs |
| `:content` | `kui(:empty, :content)` | General content area (inputs, links) |

All sub-parts accept `css_classes:` and `**component_options`.

## Anatomy

```
Empty
├── Header
│   ├── Media (icon or image)
│   ├── Title
│   └── Description
├── Actions (CTA buttons)
└── Content (general content)
```

All sub-parts are optional. Use any combination.

## Usage

### Media Variants

The `:media` sub-part has a `variant:` local to control how icons are displayed.

```erb
<%%= kui(:empty, :media) do %>
  <svg>...</svg>
<%% end %>

<%%= kui(:empty, :media, variant: :icon) do %>
  <svg>...</svg>
<%% end %>
```

| Variant | Appearance |
|---------|------------|
| `default` | Transparent background, bare icon |
| `icon` | Muted background, rounded container, auto-sized SVG |

### With Actions

Use the `:actions` sub-part for call-to-action buttons below the header.
Buttons are automatically centered with `gap-2` spacing and wrap on narrow
screens.

```erb
<%%= kui(:empty) do %>
  <%%= kui(:empty, :header) do %>
    <%%= kui(:empty, :media, variant: :icon) do %>
      <svg>...</svg>
    <%% end %>
    <%%= kui(:empty, :title) { "No Projects Yet" } %>
    <%%= kui(:empty, :description) { "Get started by creating your first project." } %>
  <%% end %>
  <%%= kui(:empty, :actions) do %>
    <%%= kui(:button) { "Create Project" } %>
    <%%= kui(:button, variant: :outline) { "Import Project" } %>
  <%% end %>
<%% end %>
```

### With Dashed Border

The base includes `border-dashed` (style only). Add `border` via `css_classes:`
to show the dashed outline — useful for drop zones and upload areas.

```erb
<%%= kui(:empty, css_classes: "border border-dashed") do %>
  <%%= kui(:empty, :header) do %>
    <%%= kui(:empty, :title) { "Upload Files" } %>
    <%%= kui(:empty, :description) { "Drag and drop files here." } %>
  <%% end %>
<%% end %>
```

### Inside a Card

Empty states work well nested inside Card content areas. Override `flex-1`
with `flex-none` when the empty state shouldn't expand to fill the container.

```erb
<%%= kui(:card) do %>
  <%%= kui(:card, :header) do %>
    <%%= kui(:card, :title) { "Recent Activity" } %>
  <%% end %>
  <%%= kui(:card, :content) do %>
    <%%= kui(:empty, css_classes: "flex-none") do %>
      <%%= kui(:empty, :header) do %>
        <%%= kui(:empty, :title) { "No Activity" } %>
        <%%= kui(:empty, :description) { "Activity will show up here." } %>
      <%% end %>
    <%% end %>
  <%% end %>
<%% end %>
```

## Theme

```ruby
Kiso::Themes::Empty = ClassVariants.build(
  base: "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance text-foreground md:p-12"
)

EmptyHeader      = ClassVariants.build(base: "flex max-w-sm flex-col items-center gap-2 text-center")
EmptyMedia       = ClassVariants.build(
  base: "flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  variants: { variant: { default: "bg-transparent", icon: "bg-muted text-foreground size-10 rounded-lg ..." } },
  defaults: { variant: :default }
)
EmptyTitle       = ClassVariants.build(base: "text-lg font-medium tracking-tight")
EmptyDescription = ClassVariants.build(base: "text-muted-foreground text-sm/relaxed ...")
EmptyActions     = ClassVariants.build(base: "flex flex-wrap items-center justify-center gap-2")
EmptyContent     = ClassVariants.build(base: "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance")
```

## Accessibility

Empty renders as a `<div>` with `data-slot="empty"`. Sub-parts
use `data-slot` attributes (e.g., `data-slot="empty-header"`).

For semantic meaning, use `component_options` to set a role:

```erb
<%%= kui(:empty, role: :status, "aria-label": "No results") do %>
  ...
<%% end %>
```
