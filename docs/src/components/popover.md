---
title: Popover
layout: docs
description: Floating panel anchored to a trigger element for displaying rich content.
category: Overlay
source: lib/kiso/themes/popover.rb
---

## Quick Start

```erb
<%%= kui(:popover) do %>
  <%%= kui(:popover, :trigger) do %>
    <%%= kui(:button, variant: :outline) { "Open Popover" } %>
  <%% end %>
  <%%= kui(:popover, :content) do %>
    <%%= kui(:popover, :header) do %>
      <%%= kui(:popover, :title) { "Title" } %>
      <%%= kui(:popover, :description) { "Description text here." } %>
    <%% end %>
  <%% end %>
<%% end %>
```

<%= render "component_preview", component: "kiso/popover", scenario: "playground", height: "400px" %>

## Locals

### Root

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

### Content

| Local | Type | Default |
|-------|------|---------|
| `align:` | `:start` \| `:center` \| `:end` | `:center` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

## Sub-parts

| Part | Usage | Purpose |
|------|-------|---------|
| `:trigger` | `kui(:popover, :trigger)` | Button that opens/closes the popover |
| `:content` | `kui(:popover, :content)` | Floating panel |
| `:anchor` | `kui(:popover, :anchor)` | Alternate positioning reference |
| `:header` | `kui(:popover, :header)` | Title + description wrapper |
| `:title` | `kui(:popover, :title)` | Heading text |
| `:description` | `kui(:popover, :description)` | Description text |

All sub-parts accept `css_classes:` and `**component_options`.

## Anatomy

```
Popover
├── Popover Trigger
├── Popover Content
│   ├── Popover Header
│   │   ├── Popover Title
│   │   └── Popover Description
│   └── (body content)
└── Popover Anchor (optional)
```

## Usage

### Basic

A simple popover with a header, title, and description.

```erb
<%%= kui(:popover) do %>
  <%%= kui(:popover, :trigger) do %>
    <%%= kui(:button, variant: :outline) { "Open Popover" } %>
  <%% end %>
  <%%= kui(:popover, :content, align: :start) do %>
    <%%= kui(:popover, :header) do %>
      <%%= kui(:popover, :title) { "Dimensions" } %>
      <%%= kui(:popover, :description) { "Set the dimensions for the layer." } %>
    <%% end %>
  <%% end %>
<%% end %>
```

### Align

Use the `align:` local on the content sub-part to control horizontal alignment
relative to the trigger. Options: `:start`, `:center` (default), `:end`.

```erb
<%%= kui(:popover, :content, align: :start) do %>...<%% end %>
<%%= kui(:popover, :content, align: :center) do %>...<%% end %>
<%%= kui(:popover, :content, align: :end) do %>...<%% end %>
```

### With Form

Place form fields inside the popover content for inline editing.

```erb
<%%= kui(:popover) do %>
  <%%= kui(:popover, :trigger) do %>
    <%%= kui(:button, variant: :outline) { "Open Popover" } %>
  <%% end %>
  <%%= kui(:popover, :content, css_classes: "w-64", align: :start) do %>
    <%%= kui(:popover, :header) do %>
      <%%= kui(:popover, :title) { "Dimensions" } %>
      <%%= kui(:popover, :description) { "Set the dimensions for the layer." } %>
    <%% end %>
    <div class="mt-4 grid gap-4">
      <%%= kui(:field, orientation: :horizontal) do %>
        <%%= kui(:field, :label, for: "width", css_classes: "w-1/2") { "Width" } %>
        <%%= kui(:input, id: "width", value: "100%") %>
      <%% end %>
      <%%= kui(:field, orientation: :horizontal) do %>
        <%%= kui(:field, :label, for: "height", css_classes: "w-1/2") { "Height" } %>
        <%%= kui(:input, id: "height", value: "25px") %>
      <%% end %>
    </div>
  <%% end %>
<%% end %>
```

### Anchor

Use the anchor sub-part to position the popover relative to a different element
than the trigger.

```erb
<%%= kui(:popover) do %>
  <%%= kui(:popover, :anchor) do %>
    <div>The popover will be positioned relative to this element.</div>
  <%% end %>
  <%%= kui(:popover, :trigger) do %>
    <%%= kui(:button, variant: :outline) { "Open" } %>
  <%% end %>
  <%%= kui(:popover, :content) do %>
    <p>Positioned relative to the anchor, not the trigger.</p>
  <%% end %>
<%% end %>
```

## Theme

```ruby
PopoverContent     = ClassVariants.build(
  base: "bg-background text-foreground z-50 w-72 rounded-md " \
        "ring ring-inset ring-border p-4 shadow-md outline-hidden"
)
PopoverHeader      = ClassVariants.build(base: "flex flex-col gap-1 text-sm")
PopoverTitle       = ClassVariants.build(base: "font-medium")
PopoverDescription = ClassVariants.build(base: "text-muted-foreground")
```

## Stimulus Controller

The popover uses a `kiso--popover` Stimulus controller for:

- Toggle open/close on trigger click
- Click outside to dismiss
- Escape key to close
- Focus trap inside content when open
- Positioning relative to trigger (or anchor if present)
- Alignment control via `data-align` attribute

Register via `KisoUi.start(application)` or manually:

```javascript
import { KisoPopoverController } from "kiso-ui"
application.register("kiso--popover", KisoPopoverController)
```

## Accessibility

- Trigger gets `aria-haspopup="dialog"` and `aria-expanded` (toggled by controller)
- Content has `role="dialog"`
- Escape key closes the popover
- Focus is trapped inside the content when open
- Focus returns to trigger on close
- Click outside dismisses the popover
