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

For components with `color:` + `variant:` axes:

```ruby
# lib/kiso/themes/badge.rb
module Kiso
  module Themes
    Badge = ClassVariants.build(
      base: "inline-flex items-center font-medium transition-colors",
      variants: {
        variant: {
          solid: "",
          outline: "ring ring-inset",
          soft: "",
          subtle: "ring ring-inset"
        },
        size: {
          sm: "px-1.5 py-0.5 text-[10px]/3 rounded-sm gap-0.5",
          md: "px-2 py-0.5 text-xs rounded-md gap-1",
          lg: "px-2.5 py-1 text-sm rounded-md gap-1"
        },
        color: Kiso::Themes::COLORS.index_with { "" }
      },
      compound_variants: [
        { color: :primary, variant: :solid, class: "bg-primary text-primary-foreground" },
        { color: :primary, variant: :outline, class: "text-primary ring-primary/50" },
        { color: :primary, variant: :soft, class: "bg-primary/10 text-primary" },
        { color: :primary, variant: :subtle, class: "bg-primary/10 text-primary ring-primary/25" },
        # ... repeat for each color
        # Neutral has special values:
        { color: :neutral, variant: :solid, class: "bg-inverted text-inverted" },
        { color: :neutral, variant: :outline, class: "ring-accented text-foreground bg-background" },
        { color: :neutral, variant: :soft, class: "text-foreground bg-muted" },
        { color: :neutral, variant: :subtle, class: "ring-accented text-foreground bg-muted" },
      ],
      defaults: { color: :primary, variant: :soft, size: :md }
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

For each color, the four variant styles follow this pattern:

| Variant | Colored | Neutral |
|---|---|---|
| solid | `bg-{color} text-{color}-foreground` | `bg-inverted text-inverted` |
| outline | `text-{color} ring-{color}/50` | `ring-accented text-foreground bg-background` |
| soft | `bg-{color}/10 text-{color}` | `text-foreground bg-muted` |
| subtle | `bg-{color}/10 text-{color} ring-{color}/25` | `ring-accented text-foreground bg-muted` |

## Semantic Colors

Always use semantic tokens, never Tailwind palette colors:

### Text
- `text-foreground` — body text
- `text-muted-foreground` — secondary text
- `text-inverted` — text on inverted backgrounds
- `text-{color}` — colored text (primary, success, etc.)
- `text-{color}-foreground` — text on colored backgrounds

### Background
- `bg-background` — page background
- `bg-muted` — subtle sections
- `bg-elevated` — cards, modals
- `bg-inverted` — inverted sections
- `bg-{color}` — colored backgrounds
- `bg-{color}/10` — light tinted backgrounds

### Border / Ring
- `border-border` — default borders
- `ring-accented` — accented rings
- `ring-{color}/50` — colored rings with opacity
- `ring-{color}/25` — subtle colored rings

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
