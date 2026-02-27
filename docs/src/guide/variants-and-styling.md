---
title: Variants & Styling
layout: docs
description: How Kiso's variant system works — class_variants, color × variant axes, and style overrides.
---

## If you know cva, you know class_variants

React's [cva](https://cva.style) (class-variance-authority) and Vue's
[Tailwind Variants](https://www.tailwind-variants.org/) let you define
component styles as variant maps. Kiso uses
[class_variants](https://github.com/mati365/class_variants) — the same
concept in Ruby:

<div class="grid gap-6 sm:grid-cols-2 not-prose my-6">
  <div>
    <p class="text-sm font-medium text-foreground mb-2">cva (JS)</p>
    <pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>const badge = cva("inline-flex items-center", {
  variants: {
    size: {
      sm: "px-2.5 text-xs",
      md: "px-3 text-xs",
    }
  },
  defaultVariants: { size: "md" }
})</code></pre>
  </div>
  <div>
    <p class="text-sm font-medium text-foreground mb-2">class_variants (Ruby)</p>
    <pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>Badge = ClassVariants.build(
  base: "inline-flex items-center",
  variants: {
    size: {
      sm: "px-2.5 text-xs",
      md: "px-3 text-xs",
    }
  },
  defaults: { size: :md }
)</code></pre>
  </div>
</div>

Theme modules live in `lib/kiso/themes/` and are called from partials:

```erb
class: Kiso::Themes::Badge.render(color: color, variant: variant, size: size, class: css_classes)
```

`.render()` resolves the variant values, concatenates the matching classes,
and merges any overrides through `tailwind_merge` (so conflicting classes are
resolved automatically, not duplicated).

## The two-axis system

Colored components in Kiso use two variant axes, borrowed from
[Nuxt UI](https://ui.nuxt.com):

- **`color:`** — what color: `primary`, `secondary`, `success`, `info`,
  `warning`, `error`, `neutral`
- **`variant:`** — how it's rendered: `solid`, `outline`, `soft`, `subtle`

```erb
<%%= kui(:badge, color: :success, variant: :solid) { "Shipped" } %>
<%%= kui(:badge, color: :error, variant: :outline) { "Failed" } %>
<%%= kui(:badge, color: :info, variant: :soft) { "Pending" } %>
```

Every color × variant combination is defined as a **compound variant** in the
theme module. The formulas are identical across all colored components — Badge,
Alert, and Button all produce the same styles for `:success` + `:solid`.

## Semantic tokens, not raw colors

Components never use Tailwind palette shades like `bg-blue-600` or
`text-red-500`. Instead, they use semantic tokens:

| Token | Purpose |
|-------|---------|
| `bg-primary` | Brand primary background |
| `text-primary-foreground` | Accessible text on primary background |
| `bg-muted` | Subtle background |
| `text-muted-foreground` | Secondary text |
| `bg-elevated` | Raised surface |
| `border` | Default border |

These tokens map to CSS custom properties that flip automatically in dark
mode. See the [Design System](/design-system) page for the full token table.

## Overriding styles with `css_classes:`

Every component accepts `css_classes:` — a string of Tailwind classes that
gets merged into the component's computed classes:

```erb
<%%= kui(:badge, css_classes: "rounded-none text-base") { "Custom" } %>
```

This is similar to React's `className` or Vue's `:class` binding, but with a
key difference: **conflicts are resolved automatically** via `tailwind_merge`.
If the badge defaults to `rounded-full` and you pass `rounded-none`, the
output will contain only `rounded-none` — no duplication, no specificity
battle.

```erb
<%% # Override padding and add a shadow %>
<%%= kui(:card, css_classes: "p-8 shadow-lg") do %>
  Spacious card
<%% end %>
```
