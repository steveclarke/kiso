# Card

Container for grouping related content with optional header, content, and footer sections.

## Current API

```erb
<%= kui(:card, variant: :outline) do %>
  <%= kui(:card, :header) do %>
    <%= kui(:card, :title) { "Title" } %>
    <%= kui(:card, :description) { "Description" } %>
  <% end %>
  <%= kui(:card, :content) do %>
    ...
  <% end %>
  <%= kui(:card, :footer) do %>
    ...
  <% end %>
<% end %>
```

## Target API

Same as current. Card is a pure container — no color axis, no Stimulus.

Future additions (deferred):
- `as:` prop for rendering as `<article>`, `<section>`, etc.
- Collapsible card (requires Stimulus, Phase 2)

## Sub-parts

| Part | Theme module | Purpose |
|------|-------------|---------|
| `:header` | `CardHeader` | Contains title + description, `px-6` |
| `:title` | `CardTitle` | Semibold heading |
| `:description` | `CardDescription` | Muted text below title |
| `:content` | `CardContent` | Main body, `px-6` |
| `:footer` | `CardFooter` | Action area, flex row, `px-6` |

## Variants

| Variant | Classes | Use case |
|---------|---------|----------|
| `outline` (default) | `bg-background ring ring-inset ring-border shadow-sm` | Standard card with border |
| `soft` | `bg-elevated/50` | Subtle background, no border |
| `subtle` | `bg-elevated/50 ring ring-inset ring-border` | Background + border, no shadow |

## Design Decisions

- **No color axis.** Cards are containers, not semantic elements. Color comes
  from the content inside (badges, alerts, buttons).
- **No divide-y.** shadcn doesn't use dividers between card sections.
- **gap-6 + py-6 on Card, px-6 on children.** Matches shadcn exactly. The Card
  handles vertical spacing via gap and padding. Children only need horizontal
  padding. Any combination of sub-parts works without extra spacing.
- **shadow-sm on outline only.** Matches shadcn's aesthetic — bordered cards
  have a subtle shadow for depth.

## Dependencies

None. Pure CSS, no Stimulus.
