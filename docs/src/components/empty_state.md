---
title: Empty State
layout: docs
description: Centered placeholder for empty content areas — no data, no results, no uploads.
category: Layout
source: lib/kiso/themes/empty_state.rb
---

## Quick Start

```erb
<%%= kiso(:empty_state) do %>
  <%%= kiso(:empty_state, :header) do %>
    <%%= kiso(:empty_state, :media, variant: :icon) do %>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><path d="M2 10h20"/></svg>
    <%% end %>
    <%%= kiso(:empty_state, :title) { "No Projects Yet" } %>
    <%%= kiso(:empty_state, :description) { "Get started by creating your first project." } %>
  <%% end %>
<%% end %>
```

<%= render "component_preview", component: "kiso/empty_state", scenario: "playground", height: "450px" %>

## Locals

The root `empty_state` has no variant axis — it renders a centered flex container.

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

## Sub-parts

| Part | Usage | Purpose |
|------|-------|---------|
| `:header` | `kiso(:empty_state, :header)` | Groups media, title, and description |
| `:media` | `kiso(:empty_state, :media)` | Icon or image container |
| `:title` | `kiso(:empty_state, :title)` | Heading text |
| `:description` | `kiso(:empty_state, :description)` | Muted description text |
| `:content` | `kiso(:empty_state, :content)` | Action area (buttons, links) |

All sub-parts accept `css_classes:` and `**component_options`.

## Anatomy

```
Empty State
├── Header
│   ├── Media (icon or image)
│   ├── Title
│   └── Description
└── Content (actions)
```

All sub-parts are optional. Use any combination.

## Usage

### Media Variants

The `:media` sub-part has a `variant:` local to control how icons are displayed.

```erb
<%%= kiso(:empty_state, :media) do %>
  <svg>...</svg>
<%% end %>

<%%= kiso(:empty_state, :media, variant: :icon) do %>
  <svg>...</svg>
<%% end %>
```

| Variant | Appearance |
|---------|------------|
| `default` | Transparent background, bare icon |
| `icon` | Muted background, rounded container, auto-sized SVG |

### With Actions

Use the `:content` sub-part for buttons and links below the header.

```erb
<%%= kiso(:empty_state) do %>
  <%%= kiso(:empty_state, :header) do %>
    <%%= kiso(:empty_state, :media, variant: :icon) do %>
      <svg>...</svg>
    <%% end %>
    <%%= kiso(:empty_state, :title) { "No Projects Yet" } %>
    <%%= kiso(:empty_state, :description) { "Get started by creating your first project." } %>
  <%% end %>
  <%%= kiso(:empty_state, :content) do %>
    <div class="flex gap-2">
      <%%= kiso(:button) { "Create Project" } %>
      <%%= kiso(:button, variant: :outline) { "Import Project" } %>
    </div>
  <%% end %>
<%% end %>
```

### With Dashed Border

The base includes `border-dashed` (style only). Add `border` via `css_classes:`
to show the dashed outline — useful for drop zones and upload areas.

```erb
<%%= kiso(:empty_state, css_classes: "border border-dashed") do %>
  <%%= kiso(:empty_state, :header) do %>
    <%%= kiso(:empty_state, :title) { "Upload Files" } %>
    <%%= kiso(:empty_state, :description) { "Drag and drop files here." } %>
  <%% end %>
<%% end %>
```

### Inside a Card

Empty states work well nested inside Card content areas. Override `flex-1`
with `flex-none` when the empty state shouldn't expand to fill the container.

```erb
<%%= kiso(:card) do %>
  <%%= kiso(:card, :header) do %>
    <%%= kiso(:card, :title) { "Recent Activity" } %>
  <%% end %>
  <%%= kiso(:card, :content) do %>
    <%%= kiso(:empty_state, css_classes: "flex-none") do %>
      <%%= kiso(:empty_state, :header) do %>
        <%%= kiso(:empty_state, :title) { "No Activity" } %>
        <%%= kiso(:empty_state, :description) { "Activity will show up here." } %>
      <%% end %>
    <%% end %>
  <%% end %>
<%% end %>
```

## Theme

```ruby
Kiso::Themes::EmptyState = ClassVariants.build(
  base: "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12"
)

EmptyStateHeader      = ClassVariants.build(base: "flex max-w-sm flex-col items-center gap-2 text-center")
EmptyStateMedia       = ClassVariants.build(
  base: "flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  variants: { variant: { default: "bg-transparent", icon: "bg-muted text-foreground size-10 rounded-lg ..." } },
  defaults: { variant: :default }
)
EmptyStateTitle       = ClassVariants.build(base: "text-lg font-medium tracking-tight")
EmptyStateDescription = ClassVariants.build(base: "text-muted-foreground text-sm/relaxed ...")
EmptyStateContent     = ClassVariants.build(base: "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance")
```

## Accessibility

Empty State renders as a `<div>` with `data-component="empty_state"`. Sub-parts
use `data-empty-state-part` attributes for identity.

For semantic meaning, use `component_options` to set a role:

```erb
<%%= kiso(:empty_state, role: :status, "aria-label": "No results") do %>
  ...
<%% end %>
```
