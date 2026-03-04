---
title: Collapsible
layout: docs
description: An interactive component which expands/collapses a panel.
category: Element
source: lib/kiso/themes/collapsible.rb
---

## Quick Start

```erb
<%%= kui(:collapsible) do %>
  <%%= kui(:collapsible, :trigger) do %>
    Can I use this in my project?
  <%% end %>
  <%%= kui(:collapsible, :content) do %>
    <p>Yes. Free to use for personal and commercial projects.</p>
  <%% end %>
<%% end %>
```

<%%= render "component_preview", component: "kiso/collapsible", scenario: "playground", height: "300px" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `open:` | Boolean | `false` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

## Sub-parts

| Part | Usage | Purpose |
|------|-------|---------|
| `:trigger` | `kui(:collapsible, :trigger)` | Button that toggles the panel |
| `:content` | `kui(:collapsible, :content)` | Expandable/collapsible content area |

All sub-parts accept `css_classes:` and `**component_options`.

## Anatomy

```
Collapsible
├── Collapsible Trigger
└── Collapsible Content
```

## Usage

### Default (Closed)

By default, the collapsible starts closed.

```erb
<%%= kui(:collapsible) do %>
  <%%= kui(:collapsible, :trigger) do %>
    Show more
  <%% end %>
  <%%= kui(:collapsible, :content) do %>
    <p>Hidden content revealed on toggle.</p>
  <%% end %>
<%% end %>
```

### Initially Open

Use the `open:` local to render the collapsible in an expanded state.

```erb
<%%= kui(:collapsible, open: true) do %>
  <%%= kui(:collapsible, :trigger) do %>
    Hide details
  <%% end %>
  <%%= kui(:collapsible, :content) do %>
    <p>This content is visible on page load.</p>
  <%% end %>
<%% end %>
```

### With a Button Trigger

The trigger sub-part renders a plain `<button>`. For styled triggers,
use a `kui(:button)` with `data-action` and `data-kiso--collapsible-target`
instead:

```erb
<%%= kui(:collapsible) do %>
  <%%= kui(:button, variant: :ghost,
        data: { action: "kiso--collapsible#toggle",
                kiso__collapsible_target: "trigger" }) do %>
    Toggle
    <%%= kiso_icon("chevrons-up-down") %>
  <%% end %>
  <%%= kui(:collapsible, :content) do %>
    <p>Content here.</p>
  <%% end %>
<%% end %>
```

### Nested Collapsibles

Collapsibles can be nested for hierarchical structures like file trees.
Each collapsible manages its own state independently.

```erb
<%%= kui(:collapsible) do %>
  <%%= kui(:button, variant: :ghost, size: :sm,
        css_classes: "group w-full justify-start",
        data: { action: "kiso--collapsible#toggle",
                kiso__collapsible_target: "trigger" }) do %>
    <%%= kiso_icon("chevron-right",
          class: "transition-transform group-data-[state=open]:rotate-90") %>
    <%%= kiso_icon("folder") %>
    src
  <%% end %>
  <%%= kui(:collapsible, :content, css_classes: "ml-5") do %>
    <%%= kui(:collapsible) do %>
      <%# Nested collapsible... %>
    <%% end %>
  <%% end %>
<%% end %>
```

## Stimulus Controller

The `kiso--collapsible` controller manages open/close state and animations.

**Values:**

| Value | Type | Default | Description |
|-------|------|---------|-------------|
| `open` | Boolean | `false` | Whether the collapsible is expanded |

**Actions:**

| Action | Description |
|--------|-------------|
| `toggle` | Toggles between open and closed |
| `open` | Opens the collapsible |
| `close` | Closes the collapsible |

**Events:**

| Event | Description |
|-------|-------------|
| `kiso--collapsible:open` | Dispatched when opened |
| `kiso--collapsible:close` | Dispatched when closed |

**Targets:**

| Target | Element | Description |
|--------|---------|-------------|
| `content` | Content panel | The expandable area (animated) |
| `trigger` | Trigger button | Gets `data-state` and `aria-expanded` |

## Theme

```ruby
Kiso::Themes::Collapsible        = ClassVariants.build(base: "")
Kiso::Themes::CollapsibleTrigger = ClassVariants.build(base: "")
Kiso::Themes::CollapsibleContent = ClassVariants.build(base: "overflow-hidden")
```

The collapsible is intentionally unstyled -- it is a structural component.
Layout classes are added via `css_classes:` at the usage site.

## Accessibility

- The trigger button renders with `type="button"` and `aria-expanded`
  (managed by the Stimulus controller).
- `data-state="open"` / `data-state="closed"` is set on the root, trigger,
  and content elements for CSS targeting.
- Animations respect `prefers-reduced-motion: reduce` via CSS media query.
