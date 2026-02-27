---
title: Card
layout: docs
description: Container for grouping related content with header, content, and footer sections.
category: Layout
source: lib/kiso/themes/card.rb
---

## Quick Start

```erb
<%%= kui(:card) do %>
  <%%= kui(:card, :header) do %>
    <%%= kui(:card, :title) { "Card Title" } %>
    <%%= kui(:card, :description) { "Card description." } %>
  <%% end %>
  <%%= kui(:card, :content) do %>
    <p>Your content here.</p>
  <%% end %>
<%% end %>
```

<%= render "component_preview", component: "kiso/card", scenario: "playground", height: "400px" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `variant:` | `:outline` \| `:soft` \| `:subtle` | `:outline` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

## Sub-parts

| Part | Usage | Purpose |
|------|-------|---------|
| `:header` | `kui(:card, :header)` | Contains title and description |
| `:title` | `kui(:card, :title)` | Semibold heading text |
| `:description` | `kui(:card, :description)` | Muted description text |
| `:content` | `kui(:card, :content)` | Main body area |
| `:footer` | `kui(:card, :footer)` | Action area (flex row) |

All sub-parts accept `css_classes:` and `**component_options`.

## Anatomy

```
Card
├── Card Header
│   ├── Card Title
│   └── Card Description
├── Card Content
└── Card Footer
```

All sub-parts are optional. Use any combination.

## Usage

### Variant

Use the `variant:` local to change the card's visual style.

```erb
<%%= kui(:card, variant: :outline) do %>...<%% end %>
<%%= kui(:card, variant: :soft) do %>...<%% end %>
<%%= kui(:card, variant: :subtle) do %>...<%% end %>
```

| Variant | Appearance |
|---------|------------|
| `outline` (default) | White background, border, subtle shadow |
| `soft` | Elevated background, no border |
| `subtle` | Elevated background with border |

### With Footer

```erb
<%%= kui(:card) do %>
  <%%= kui(:card, :header) do %>
    <%%= kui(:card, :title) { "Create project" } %>
    <%%= kui(:card, :description) { "Deploy your new project in one click." } %>
  <%% end %>
  <%%= kui(:card, :content) do %>
    <%# form fields here %>
  <%% end %>
  <%%= kui(:card, :footer, css_classes: "justify-between") do %>
    <%%= kui(:button, variant: :outline) { "Cancel" } %>
    <%%= kui(:button) { "Deploy" } %>
  <%% end %>
<%% end %>
```

### Content Only

Card uses `gap-6` and `py-6` for vertical spacing, so sub-parts only need
horizontal padding. Any combination of sub-parts works without extra spacing:

```erb
<%%= kui(:card) do %>
  <%%= kui(:card, :content) do %>
    <p>Simple card with content only.</p>
  <%% end %>
<%% end %>
```

## Theme

```ruby
Kiso::Themes::Card = ClassVariants.build(
  base: "flex flex-col gap-6 rounded-xl py-6 text-foreground",
  variants: {
    variant: {
      outline: "bg-background ring ring-inset ring-border shadow-sm",
      soft: "bg-elevated/50",
      subtle: "bg-elevated/50 ring ring-inset ring-border"
    }
  },
  defaults: { variant: :outline }
)

CardHeader      = ClassVariants.build(base: "flex flex-col gap-1.5 px-6")
CardTitle       = ClassVariants.build(base: "font-semibold leading-none")
CardDescription = ClassVariants.build(base: "text-sm text-muted-foreground")
CardContent     = ClassVariants.build(base: "px-6")
CardFooter      = ClassVariants.build(base: "flex items-center px-6")
```

## Accessibility

Card renders a `<div>` with `data-slot="card"`. Sub-parts use
`data-slot` attributes (e.g., `data-slot="card-header"`).

For semantic meaning, use `component_options` to set a role:

```erb
<%%= kui(:card, role: :region, "aria-label": "User profile") do %>
  ...
<%% end %>
```
