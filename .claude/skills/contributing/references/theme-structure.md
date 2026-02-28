# Theme Structure

Theme files define component styling using ClassVariants + TailwindMerge.

## File Location

Themes live in `lib/kiso/themes/` with snake_case naming (e.g., `badge.rb`, `toggle_group.rb`).

## Simple Component (Flat Variants)

For components with one styling axis:

```ruby
# lib/kiso/themes/separator.rb
module Kiso
  module Themes
    Separator = ClassVariants.build(
      base: "shrink-0 bg-border",
      variants: {
        orientation: {
          horizontal: "h-px w-full",
          vertical: "h-full w-px"
        }
      },
      defaults: { orientation: :horizontal }
    )
  end
end
```

## Colored Component (Compound Variants)

For components with `color:` + `variant:` axes. **All colored components use
the same compound variant formulas.** See `project/design-system.md` for the
authoritative reference.

```ruby
module Kiso
  module Themes
    MyComponent = ClassVariants.build(
      base: "...",  # Only base/layout classes change per component
      variants: {
        variant: {
          solid: "",
          outline: "ring ring-inset",
          soft: "",
          subtle: "ring ring-inset"
        },
        color: COLORS.index_with { "" }
      },
      compound_variants: [
        # Colored: same formula for every component
        { color: :primary, variant: :solid, class: "bg-primary text-primary-foreground" },
        { color: :primary, variant: :outline, class: "text-primary ring-primary/50" },
        { color: :primary, variant: :soft, class: "bg-primary/10 text-primary" },
        { color: :primary, variant: :subtle, class: "bg-primary/10 text-primary ring-primary/25" },
        # ... repeat for secondary, success, info, warning, error

        # Neutral: special tokens
        { color: :neutral, variant: :solid, class: "bg-inverted text-inverted-foreground" },
        { color: :neutral, variant: :outline, class: "text-foreground bg-background ring-accented" },
        { color: :neutral, variant: :soft, class: "text-foreground bg-elevated" },
        { color: :neutral, variant: :subtle, class: "text-foreground bg-elevated ring-accented" },
      ],
      defaults: { color: :primary, variant: :soft }
    )
  end
end
```

## Colors Constant

All semantic colors are defined once in `lib/kiso/themes/badge.rb` (will move to a shared location):

```ruby
Kiso::Themes::COLORS = %i[primary secondary success info warning error neutral].freeze
```

## Compound Variant Patterns

These are **identical across all colored components**. No per-component deviations.

| Variant | Colored | Neutral |
|---|---|---|
| solid | `bg-{color} text-{color}-foreground` | `bg-inverted text-inverted-foreground` |
| outline | `text-{color} ring-{color}/50` | `text-foreground bg-background ring-accented` |
| soft | `bg-{color}/10 text-{color}` | `text-foreground bg-elevated` |
| subtle | `bg-{color}/10 text-{color} ring-{color}/25` | `text-foreground bg-elevated ring-accented` |

`ring ring-inset` is on the variant axis (outline, subtle) — not repeated in compounds.

## Semantic Colors

Always use semantic tokens, never Tailwind palette colors:

### Text
- `text-foreground` — primary text
- `text-muted-foreground` — secondary text (outside colored components)
- `text-inverted-foreground` — text on inverted backgrounds
- `text-{color}` — colored text (primary, success, etc.)
- `text-{color}-foreground` — text on colored backgrounds

### Background
- `bg-background` — page background
- `bg-elevated` — cards, raised surfaces, neutral soft/subtle
- `bg-inverted` — dark surfaces (neutral solid)
- `bg-{color}` — colored backgrounds (solid variant)
- `bg-{color}/10` — tinted backgrounds (soft/subtle variants)

### Border / Ring
- `ring-accented` — neutral outline/subtle ring color
- `ring-{color}/50` — colored outline ring (50% opacity)
- `ring-{color}/25` — colored subtle ring (25% opacity)
- `border-border` — default borders (tables, separators)

### Description text
- Use `opacity-90` for secondary text inside colored components (inherits parent color)
- Use `text-muted-foreground` only outside colored components (absolute zinc-500)

## Using the Theme in ERB

```erb
<%# locals: (color: :primary, variant: :soft, size: :md, css_classes: "", **component_options) %>
<%= content_tag :span,
    class: Kiso::Themes::Badge.render(color: color, variant: variant, size: size, class: css_classes),
    data: { component: :badge },
    **component_options do %>
  <%= yield %>
<% end %>
```

The `class:` keyword on `.render()` appends user classes and tailwind_merge deduplicates conflicts.
