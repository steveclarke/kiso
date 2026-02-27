---
title: Empty
layout: docs
description: Centered placeholder for empty content areas — no data, no results, no uploads.
category: Layout
source: lib/kiso/themes/empty.rb
---

## Quick Start

```erb
<%%= kiso(:empty) do %>
  <%%= kiso(:empty, :header) do %>
    <%%= kiso(:empty, :media, variant: :icon) do %>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><path d="M2 10h20"/></svg>
    <%% end %>
    <%%= kiso(:empty, :title) { "No Projects Yet" } %>
    <%%= kiso(:empty, :description) { "Get started by creating your first project." } %>
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
| `:header` | `kiso(:empty, :header)` | Groups media, title, and description |
| `:media` | `kiso(:empty, :media)` | Icon or image container |
| `:title` | `kiso(:empty, :title)` | Heading text |
| `:description` | `kiso(:empty, :description)` | Muted description text |
| `:content` | `kiso(:empty, :content)` | Action area (buttons, links) |

All sub-parts accept `css_classes:` and `**component_options`.

## Anatomy

```
Empty
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
<%%= kiso(:empty, :media) do %>
  <svg>...</svg>
<%% end %>

<%%= kiso(:empty, :media, variant: :icon) do %>
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
<%%= kiso(:empty) do %>
  <%%= kiso(:empty, :header) do %>
    <%%= kiso(:empty, :media, variant: :icon) do %>
      <svg>...</svg>
    <%% end %>
    <%%= kiso(:empty, :title) { "No Projects Yet" } %>
    <%%= kiso(:empty, :description) { "Get started by creating your first project." } %>
  <%% end %>
  <%%= kiso(:empty, :content) do %>
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
<%%= kiso(:empty, css_classes: "border border-dashed") do %>
  <%%= kiso(:empty, :header) do %>
    <%%= kiso(:empty, :title) { "Upload Files" } %>
    <%%= kiso(:empty, :description) { "Drag and drop files here." } %>
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
    <%%= kiso(:empty, css_classes: "flex-none") do %>
      <%%= kiso(:empty, :header) do %>
        <%%= kiso(:empty, :title) { "No Activity" } %>
        <%%= kiso(:empty, :description) { "Activity will show up here." } %>
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
EmptyContent     = ClassVariants.build(base: "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance")
```

## Accessibility

Empty renders as a `<div>` with `data-component="empty"`. Sub-parts
use `data-empty-part` attributes for identity.

For semantic meaning, use `component_options` to set a role:

```erb
<%%= kiso(:empty, role: :status, "aria-label": "No results") do %>
  ...
<%% end %>
```
