---
title: Tooltip
layout: docs
description: A popup that displays contextual information on hover or focus.
category: Element
source: lib/kiso/themes/tooltip.rb
---

## Quick Start

```erb
<%%= kui(:tooltip, text: "Add to library") do %>
  <%%= kui(:button, variant: :outline) { "Hover me" } %>
<%% end %>
```

<%= render "component_preview", component: "kiso/tooltip", scenario: "playground" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `text:` | `String` | `nil` |
| `kbds:` | `Array<String>` | `nil` |
| `side:` | `Symbol` | `:top` |
| `align:` | `Symbol` | `:center` |
| `delay:` | `Integer` | `0` |
| `ui:` | `Hash` | `{}` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

### Simple Text

The `text:` shorthand renders the tooltip content automatically. The block
is the trigger element.

```erb
<%%= kui(:tooltip, text: "Settings") do %>
  <%%= kui(:button, variant: :ghost) { "⚙️" } %>
<%% end %>
```

### Positioning

Use `side:` to control where the tooltip appears. Floating UI automatically
flips to the opposite side if there isn't enough space.

```erb
<%%= kui(:tooltip, text: "Top", side: :top) do %>
  <%%= kui(:button, variant: :outline) { "Top" } %>
<%% end %>

<%%= kui(:tooltip, text: "Right", side: :right) do %>
  <%%= kui(:button, variant: :outline) { "Right" } %>
<%% end %>
```

<%= render "component_preview", component: "kiso/tooltip", scenario: "positions" %>

### Keyboard Shortcuts

The `kbds:` prop displays keyboard shortcut badges inside the tooltip.
Hidden on mobile, visible on `lg:` screens and up.

```erb
<%%= kui(:tooltip, text: "Bold", kbds: ["⌘", "B"]) do %>
  <%%= kui(:button, variant: :outline) { "Bold" } %>
<%% end %>
```

<%= render "component_preview", component: "kiso/tooltip", scenario: "with_kbds" %>

### Rich Content

For custom HTML content, compose the trigger and content sub-parts manually:

```erb
<%%= kui(:tooltip) do %>
  <%%= kui(:tooltip, :trigger) do %>
    <a href="/users/steve">@steve</a>
  <%% end %>
  <%%= kui(:tooltip, :content) do %>
    <p>Custom tooltip content with <strong>HTML</strong></p>
  <%% end %>
<%% end %>
```

<%= render "component_preview", component: "kiso/tooltip", scenario: "rich_content" %>

### Delay

Add a delay (in milliseconds) before the tooltip appears:

```erb
<%%= kui(:tooltip, text: "Delayed tooltip", delay: 500) do %>
  <%%= kui(:button, variant: :outline) { "Hover (500ms delay)" } %>
<%% end %>
```

## Sub-parts

| Part | Data slot | Notes |
|------|-----------|-------|
| root | `tooltip` | Wrapper with Stimulus controller |
| trigger | `tooltip-trigger` | Activates on hover/focus |
| content | `tooltip-content` | Floating panel with inverted colors, `[popover]` |
| arrow | `tooltip-arrow` | CSS arrow pointing to trigger |

## Theme

```ruby
# lib/kiso/themes/tooltip.rb
Kiso::Themes::TooltipContent = ClassVariants.build(
  base: "bg-inverted text-inverted-foreground px-3 py-1.5 text-xs rounded-md " \
        "flex items-center gap-1.5 select-none w-max max-w-xs"
)

Kiso::Themes::TooltipArrow = ClassVariants.build(
  base: "absolute size-2 rotate-45 bg-inverted"
)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| `role` | `"tooltip"` (on content) |
| `aria-describedby` | Links trigger to tooltip content |
| `data-slot` | `"tooltip"`, `"tooltip-trigger"`, `"tooltip-content"`, `"tooltip-arrow"` |

The tooltip uses `[popover="manual"]` for top-layer rendering, ensuring it
always appears above other content regardless of stacking context.
