# Tailwind Theming Patterns for Kiso

Patterns extracted from **Nuxt UI**, **shadcn/ui**, and **Fizzy** (37signals),
adapted for Rails ERB partials with data-attribute selectors. Kiso takes the
best of all three: shadcn's simplicity (flat variants, single `css_classes`
override), Nuxt UI's dark mode discipline (pure CSS custom properties, zero
`dark:` prefixes), and Fizzy's production Rails patterns (theme switching,
native HTML5, CSS custom property APIs).

## Table of Contents

- [Core Libraries](#core-libraries)
- [shadcn vs Nuxt UI Comparison](#shadcn-vs-nuxt-ui-comparison)
- [Dark Mode via CSS Custom Properties](#dark-mode-via-css-custom-properties)
- [Semantic Color Token System](#semantic-color-token-system)
- [Component Theme Definitions](#component-theme-definitions)
- [Override System](#override-system)
- [Class Deduplication](#class-deduplication)
- [Kiso Implementation Recipes](#kiso-implementation-recipes)
- [Patterns from Unio (Prior Art)](#patterns-from-unio-prior-art)
- [Patterns from Fizzy (37signals Prior Art)](#patterns-from-fizzy-37signals-prior-art)

---

## Core Libraries

Both shadcn and Nuxt UI use tailwind-merge for class deduplication. They
differ in variant management — shadcn uses `cva` (flat), Nuxt UI uses
`tailwind-variants` (slots + compounds). The Ruby gem `class_variants`
supports both styles.

| JS Library | Used By | Ruby Equivalent |
|------------|---------|-----------------|
| [cva](https://cva.style) | shadcn | [class_variants](https://github.com/avo-hq/class_variants) (hash style) |
| [tailwind-variants](https://www.tailwind-variants.org/) | Nuxt UI | [class_variants](https://github.com/avo-hq/class_variants) (block style with slots) |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | Both | [tailwind_merge](https://github.com/gjtorikian/tailwind_merge) gem |
| [clsx](https://github.com/lukeed/clsx) | shadcn | Not needed — `class_variants` handles conditionals |

`class_variants` + `tailwind_merge` covers both shadcn's flat approach and
Nuxt UI's compound variant approach. One gem pair, both patterns.

### Gem Setup

```ruby
# kiso.gemspec
spec.add_dependency "tailwind_merge", "~> 1.3"   # v1.3.3+, supports Tailwind v4
spec.add_dependency "class_variants", "~> 1.1"
```

```ruby
# lib/kiso/engine.rb or config/initializers/kiso.rb
ClassVariants.configure do |config|
  merger = TailwindMerge::Merger.new
  config.process_classes_with { |classes| merger.merge(classes) }
end
```

This single configuration means every `ClassVariants.build` instance
automatically deduplicates conflicting classes — just like tailwind-variants
does in JS.

---

## shadcn vs Nuxt UI Comparison

Both libraries solve the same problem — Tailwind-themed component variants —
but with very different philosophies. Kiso cherry-picks from each.

### How shadcn Does It

**Stack**: `class-variance-authority` (cva) + `clsx` + `tailwind-merge`,
wrapped in a `cn()` utility:

```typescript
// shadcn's cn() — the whole thing
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Variant definitions are flat** — each variant value is a self-contained
class string. No slots, no dynamic generation:

```typescript
// shadcn Button — complete variant definition
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium
   transition-all disabled:pointer-events-none disabled:opacity-50 ...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90
                      dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent
                  dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground
                dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)
```

**Customization is just `className`** — users pass a class string, `cn()`
deduplicates conflicts:

```tsx
<Button className="rounded-full px-8 bg-indigo-600">Custom</Button>
// cn() ensures bg-indigo-600 wins over bg-primary
```

**Color tokens use OKLCH** (not Tailwind palette references):

```css
:root {
  --background: oklch(1 0 0);
  --primary: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
}
.dark {
  --background: oklch(0.145 0 0);
  --primary: oklch(0.922 0 0);
}
```

**Dark mode is hybrid** — CSS variables for semantic tokens, but `dark:`
prefixes scattered through variant strings for component-specific tweaks.

### Side-by-Side

| Aspect | shadcn/ui | Nuxt UI |
|--------|-----------|---------|
| Variant library | cva (flat, simple) | tailwind-variants (slots, compounds) |
| Class merging | `cn()` = clsx + twMerge | Built into `tv()` |
| Color format | OKLCH values | Tailwind palette refs (`var(--color-blue-600)`) |
| Dark mode | CSS vars + `dark:` prefixes | Pure CSS vars, zero `dark:` prefixes |
| Compound variants | None — each value is self-contained | Dynamic, generated from color list |
| Slots | None — one class string per component | Multiple slots (base, label, icon) |
| Customization | `className` prop, that's it | 4 layers: theme < appConfig < context < prop |
| Token count | ~30 semantic tokens | ~15 semantic + extended (dimmed, elevated, etc.) |
| Theme registry | 24 themes x 4 bases x 5 styles | Runtime appConfig color mapping |

### What Kiso Takes from Each

**From shadcn — simplicity**:
- Flat variant values where possible (most components don't need slots)
- Self-contained variant strings you can read at a glance
- Single `css_classes` override — no multi-layer config system
- ~30 semantic tokens is the right scope
- Use compound variants only when the color x variant matrix demands it

**From Nuxt UI — dark mode discipline**:
- Pure CSS custom properties, zero `dark:` prefixes in variant definitions
- Define enough semantic tokens that components never need to think about
  dark mode — if shadcn needs `dark:bg-input/30` it means the token set is
  incomplete
- Foreground pairing convention (`--primary` / `--primary-foreground`)
- Tailwind palette references for color values (not raw OKLCH) — simpler to
  reason about, easier to swap brand colors

**From Nuxt UI — compound variants for Button-like components**:
- When a component has both `color` and `variant` axes, compound variants
  keep things composable — adding a color is one entry, not touching every
  variant string
- Use `class_variants`'s `compound_variants:` for this, but only where the
  matrix is real (Button, Badge, Alert)

---

## Dark Mode via CSS Custom Properties

**The key insight**: Nuxt UI components never use `dark:` prefixes. Instead,
semantic CSS custom properties resolve to different shades based on a `.dark`
class on the root element. Components just reference the semantic token and
dark mode happens automatically.

### How It Works

```css
/* theme.css — define semantic tokens that flip with color scheme */
@theme {
  --color-primary: var(--color-blue-600);
  --color-primary-foreground: var(--color-white);

  --color-background: var(--color-white);
  --color-foreground: var(--color-zinc-950);

  --color-muted: var(--color-zinc-100);
  --color-muted-foreground: var(--color-zinc-500);

  --color-border: var(--color-zinc-200);
}

.dark {
  --color-primary: var(--color-blue-400);
  --color-primary-foreground: var(--color-zinc-950);

  --color-background: var(--color-zinc-950);
  --color-foreground: var(--color-zinc-50);

  --color-muted: var(--color-zinc-800);
  --color-muted-foreground: var(--color-zinc-400);

  --color-border: var(--color-zinc-800);
}
```

### In Components

```erb
<%# This button works in both light and dark mode with zero conditional logic %>
<button class="bg-primary text-primary-foreground hover:bg-primary/90">
  Save
</button>
```

Or in component CSS:

```css
[data-slot="button"] {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
}
```

### Why This Beats `dark:` Prefixes

1. **Components are simpler** — no `dark:bg-zinc-800 dark:text-zinc-100` on
   every element. Just `bg-background text-foreground`.
2. **One change point** — update the CSS variable, every component updates.
3. **Supports more than two modes** — add `.dim`, `.high-contrast`, etc. by
   defining another block of variable overrides.
4. **Brand theming is trivial** — swap `--color-blue-600` to
   `--color-orange-600` and every `bg-primary` in the app changes.

### Shade Selection Convention

Nuxt UI uses a consistent pattern for which shade to use in light vs dark:

| Token Purpose | Light Mode | Dark Mode |
|---------------|-----------|-----------|
| Primary action | `-600` | `-400` |
| Backgrounds | white / `-50` | `-950` / `-900` |
| Foreground text | `-950` / `-900` | `-50` / `-100` |
| Muted/secondary | `-100` | `-800` |
| Borders | `-200` | `-800` |
| Muted text | `-500` | `-400` |

The pattern: light mode uses the 500-700 range for vivid colors and 100-200
for backgrounds. Dark mode mirrors by using 300-400 for vivid colors and
800-950 for backgrounds.

---

## Semantic Color Token System

### Full Token Set

These are the semantic tokens Kiso should define. Each one aliases a Tailwind
palette color and flips in dark mode:

```
Primary        — brand actions (buttons, links, focus rings)
Secondary      — secondary actions, subtle backgrounds
Muted          — disabled states, placeholder backgrounds
Accent         — hover highlights, active states
Destructive    — delete, error actions
Success        — success states, confirmations
Warning        — caution states, pending
Background     — page/card backgrounds
Foreground     — primary text color
Border         — default border color
Ring           — focus ring color
Card           — card surfaces (may differ from background)
Input          — form input borders
```

### Foreground Pairing Convention

Every background token gets a `-foreground` companion:

```css
--color-primary: var(--color-blue-600);
--color-primary-foreground: var(--color-white);

--color-destructive: var(--color-red-600);
--color-destructive-foreground: var(--color-white);

--color-muted: var(--color-zinc-100);
--color-muted-foreground: var(--color-zinc-500);
```

This guarantees accessible contrast. A button says `bg-primary
text-primary-foreground` and the pairing is always correct regardless of which
palette is assigned to `primary`.

### Nuxt UI's Extended Tokens

Beyond the shadcn-style tokens above, Nuxt UI also defines these semantic
names (useful for richer component variants):

```
text-default       — standard text
text-dimmed        — de-emphasized text (lighter than muted)
text-muted         — secondary text
text-inverted      — text on inverted backgrounds

bg-default         — standard background
bg-elevated        — raised surfaces (cards, dropdowns)
bg-inverted        — inverted background (dark on light, light on dark)

ring-default       — standard ring
ring-accented      — emphasized ring
```

---

## Component Theme Definitions

### Two Approaches

**shadcn style — flat, self-contained variants** (preferred for most
components):

Each variant value contains ALL the classes it needs. You read one string and
know exactly what it does. No cross-referencing compound variant tables.

```
base:     "rounded-md font-medium inline-flex items-center ..."
variants:
  variant:
    default:     "bg-primary text-primary-foreground hover:bg-primary/90"
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
    outline:     "border bg-background hover:bg-accent hover:text-accent-foreground"
    secondary:   "bg-secondary text-secondary-foreground hover:bg-secondary/80"
    ghost:       "hover:bg-accent hover:text-accent-foreground"
    link:        "text-primary underline-offset-4 hover:underline"
  size:
    sm: "h-8 px-3 text-xs"
    md: "h-9 px-4 py-2 text-sm"
    lg: "h-10 px-6 text-base"
defaults: variant: default, size: md
```

**Nuxt UI style — compound variants** (use when a component has both
`color` and `variant` axes):

Individual `color` and `variant` values are empty. The actual styling comes
from their **combination**:

```
variants:
  color:    primary | secondary | destructive | success | warning
  variant:  solid | outline | soft | ghost | link
compoundVariants:
  { color: primary, variant: solid }   -> "bg-primary text-primary-foreground hover:bg-primary/90"
  { color: primary, variant: outline } -> "text-primary ring ring-primary/50 hover:bg-primary/10"
  { color: primary, variant: soft }    -> "text-primary bg-primary/10 hover:bg-primary/20"
defaults: color: primary, variant: solid, size: md
```

### When to Use Which

**Flat variants** (shadcn style) — the default for Kiso:
- Component has one styling axis (`variant` only, or `size` only)
- Badge with `variant: default | secondary | destructive | outline`
- Input, Card, Separator, Label, Skeleton
- Simpler to read, simpler to maintain

**Compound variants** (Nuxt UI style) — when the matrix demands it:
- Component has `color` AND `variant` axes (5 colors x 5 variants = 25
  combos)
- Button, Alert, Badge (if you want per-color control)
- Adding a new color is one entry, not touching every variant string
- Use programmatic generation to avoid repetition (see Recipe 4)

---

## Override System

Kiso uses **three layers**, inspired by Nuxt UI's `app.config.ts` pattern:

```
Layer 1: Component theme default     (Kiso gem — ClassVariants.build)
Layer 2: Global config override      (host app — Kiso.configure)
Layer 3: Instance override           (call site — css_classes param)
```

### How It Works

**Layer 1 — Theme Default** (defined by Kiso):
```ruby
Kiso::Themes::Button = ClassVariants.build(
  base: "rounded-md font-medium inline-flex items-center ...",
  variants: { ... },
  defaults: { variant: :default, size: :md }
)
```

**Layer 2 — Global Config Override** (host app initializer):
```ruby
# config/initializers/kiso.rb
Kiso.configure do |config|
  config.theme[:button] = { base: "rounded-full", defaults: { variant: :outline } }
  config.theme[:card_header] = { base: "p-8 sm:p-10" }
end
```

Override hashes accept the same kwargs as `ClassVariants.build`: `base:`,
`variants:`, `compound_variants:`, `defaults:`. Applied once at boot via
`ClassVariants::Instance#merge` — zero per-render cost.

Snake_case keys map to PascalCase constants: `:card_header` →
`Kiso::Themes::CardHeader`.

**Layer 3 — Instance Override** (at the call site):
```erb
<%= kui(:button, css_classes: "rounded-full px-8") { "Click" } %>
```

### Merge Strategy

All three layers feed through tailwind-merge. Conflicting classes resolve —
last wins:

```
Theme:    "rounded-md px-2.5 py-1.5 font-medium"
Global:   "rounded-full"
Instance: "px-8"
Result:   "rounded-full px-8 py-1.5 font-medium"
```

**How merge works internally:**
- `base:` — appended to the base class list (tailwind-merge deduplicates)
- `variants:` — appended variant entries (tailwind-merge deduplicates)
- `compound_variants:` — appended alongside existing compounds
- `defaults:` — replaced via `Hash#merge!` (changes default variant selection)

### Why Not More Layers?

- **No theme context wrapper** — ERB partials don't have Vue/React's
  provide/inject. You could build this with `content_for` or view locals, but
  the complexity isn't worth it for most apps.

---

## Class Deduplication

### The Problem

Without deduplication, overriding a single utility requires knowing and
removing the original:

```erb
<%# BAD: "rounded-md" from theme AND "rounded-lg" from override both apply %>
<%# Browser uses the one that appears later in the CSS, which is unpredictable %>
<button class="rounded-md font-medium rounded-lg">
```

### The Solution: tailwind-merge

tailwind-merge understands Tailwind's class groups. It knows that `rounded-md`
and `rounded-lg` conflict, and keeps the last one:

```ruby
# Ruby (tailwind_merge gem)
merger = TailwindMerge::Merger.new
merger.merge("rounded-md font-medium rounded-lg")
#=> "font-medium rounded-lg"
```

### What It Resolves

- **Spacing**: `px-2 px-4` -> `px-4`
- **Colors**: `bg-blue-500 bg-red-500` -> `bg-red-500`
- **Borders**: `rounded-md rounded-lg` -> `rounded-lg`
- **States**: `hover:bg-blue-500 hover:bg-red-500` -> `hover:bg-red-500`
- **Sizing**: `w-4 w-8` -> `w-8`
- **Arbitrary**: `text-[14px] text-[16px]` -> `text-[16px]`

### Kiso Integration Point

With `class_variants` configured to use `tailwind_merge` (see Core Libraries),
deduplication is automatic. Every `.render()` call returns clean classes:

```ruby
button = ClassVariants.build(
  base: "rounded-md px-2.5",
  variants: { size: { lg: "px-4" } },
  defaults: { size: :lg }
)

button.render(size: :lg)
#=> "rounded-md px-4"  (px-2.5 removed automatically)
```

For ad-hoc merging outside of class_variants (rare), keep a `tw` helper:

```ruby
# app/helpers/kiso/tailwind_helper.rb
module Kiso::TailwindHelper
  def tw(*classes)
    @_tw_merger ||= TailwindMerge::Merger.new
    @_tw_merger.merge(classes.flatten.compact.join(" "))
  end
end
```

---

## Kiso Implementation Recipes

All recipes use `class_variants` + `tailwind_merge`. See Core Libraries for
the one-time setup.

### Recipe 1: Simple Component (No Slots)

For components with a single root element (Badge, Separator, Label):

```ruby
# lib/kiso/themes/badge.rb
module Kiso::Themes
  Badge = ClassVariants.build(
    base: "inline-flex items-center rounded-md font-medium ring-1 ring-inset",
    variants: {
      color: {
        primary: "bg-primary/10 text-primary ring-primary/20",
        secondary: "bg-secondary text-secondary-foreground ring-secondary-foreground/10",
        destructive: "bg-destructive/10 text-destructive ring-destructive/20",
        success: "bg-success/10 text-success ring-success/20",
        warning: "bg-warning/10 text-warning ring-warning/20"
      },
      size: {
        sm: "px-1.5 py-0.5 text-xs",
        md: "px-2 py-0.5 text-xs",
        lg: "px-2.5 py-1 text-sm"
      }
    },
    defaults: { color: :primary, size: :md }
  )
end
```

```erb
<%# app/views/components/_badge.html.erb %>
<%# locals: (color: :primary, size: :md, css_classes: "", **component_options) %>
<% merged_data = (component_options.delete(:data) || {}).merge(
    component: :badge
  ).compact %>
<%= content_tag :span,
    class: Kiso::Themes::Badge.render(color: color, size: size, class: css_classes),
    data: merged_data, **component_options do %>
  <%= yield %>
<% end %>
```

The `class:` keyword on `.render()` appends user classes and tailwind_merge
deduplicates any conflicts.

### Recipe 2: Slotted Component

For components with multiple styled sub-elements (Button with base, label,
icon slots):

```ruby
# lib/kiso/themes/button.rb
module Kiso::Themes
  Button = ClassVariants.build do
    base do
      slot :base, class: "rounded-md font-medium inline-flex items-center justify-center
                          focus-visible:outline-2 focus-visible:outline-offset-2
                          disabled:opacity-50 disabled:cursor-not-allowed"
      slot :label, class: "truncate"
      slot :icon, class: "shrink-0"
    end

    variant color: :primary
    variant color: :secondary
    variant color: :destructive
    variant color: :success
    variant color: :warning

    variant variant: :solid
    variant variant: :outline
    variant variant: :soft
    variant variant: :ghost
    variant variant: :link

    variant size: :sm, base: "px-2 py-1 text-xs gap-1", icon: "size-4"
    variant size: :md, base: "px-2.5 py-1.5 text-sm gap-1.5", icon: "size-5"
    variant size: :lg, base: "px-3 py-2 text-base gap-2", icon: "size-5"

    # Compound variants: color x variant
    compound color: :primary, variant: :solid,
      base: "bg-primary text-primary-foreground hover:bg-primary/90"
    compound color: :primary, variant: :outline,
      base: "text-primary border border-primary/50 hover:bg-primary/10"
    compound color: :primary, variant: :soft,
      base: "text-primary bg-primary/10 hover:bg-primary/20"
    compound color: :primary, variant: :ghost,
      base: "text-primary hover:bg-primary/10"
    compound color: :primary, variant: :link,
      base: "text-primary underline-offset-4 hover:underline"

    compound color: :destructive, variant: :solid,
      base: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
    compound color: :destructive, variant: :outline,
      base: "text-destructive border border-destructive/50 hover:bg-destructive/10"
    # ... more color x variant combos

    defaults color: :primary, variant: :solid, size: :md
  end
end
```

```erb
<%# app/views/components/_button.html.erb %>
<%# locals: (variant: :solid, color: :primary, size: :md, css_classes: "", **component_options) %>
<% merged_data = (component_options.delete(:data) || {}).merge(
    component: :button, variant: variant, size: size
  ).compact %>
<%= content_tag :button,
    class: Kiso::Themes::Button.render(:base,
             color: color, variant: variant, size: size, class: css_classes),
    data: merged_data, **component_options do %>
  <span class="<%= Kiso::Themes::Button.render(:label, color: color, variant: variant, size: size) %>">
    <%= yield %>
  </span>
<% end %>
```

Render a specific slot with `.render(:slot_name, **variants)`. Without a
slot name, it renders the default (base) classes.

### Recipe 3: Hash-Style Definition (Alternative)

If you prefer hashes over the block DSL — equivalent to Recipe 2:

```ruby
# lib/kiso/themes/button.rb
module Kiso::Themes
  Button = ClassVariants.build(
    base: "rounded-md font-medium inline-flex items-center justify-center
           focus-visible:outline-2 focus-visible:outline-offset-2
           disabled:opacity-50 disabled:cursor-not-allowed",
    variants: {
      color: {
        primary: "",
        secondary: "",
        destructive: "",
        success: "",
        warning: ""
      },
      variant: {
        solid: "",
        outline: "",
        soft: "",
        ghost: "",
        link: ""
      },
      size: {
        sm: "px-2 py-1 text-xs gap-1",
        md: "px-2.5 py-1.5 text-sm gap-1.5",
        lg: "px-3 py-2 text-base gap-2"
      }
    },
    compound_variants: [
      { color: :primary, variant: :solid,
        class: "bg-primary text-primary-foreground hover:bg-primary/90" },
      { color: :primary, variant: :outline,
        class: "text-primary border border-primary/50 hover:bg-primary/10" },
      { color: :primary, variant: :soft,
        class: "text-primary bg-primary/10 hover:bg-primary/20" },
      { color: :primary, variant: :ghost,
        class: "text-primary hover:bg-primary/10" },
      { color: :primary, variant: :link,
        class: "text-primary underline-offset-4 hover:underline" },
      { color: :destructive, variant: :solid,
        class: "bg-destructive text-destructive-foreground hover:bg-destructive/90" },
      # ... more color x variant combos
    ],
    defaults: { color: :primary, variant: :solid, size: :md }
  )
end
```

Both styles produce the same result. Hash style is more compact; block style
is more explicit about slots.

### Recipe 4: Generating Compound Variants Programmatically

Nuxt UI generates compound variants dynamically from a color list. This
avoids writing repetitive entries:

```ruby
# lib/kiso/themes/button.rb
module Kiso::Themes
  COLORS = %i[primary secondary destructive success warning].freeze

  VARIANT_STYLES = {
    solid:   ->(c) { "bg-#{c} text-#{c}-foreground hover:bg-#{c}/90" },
    outline: ->(c) { "text-#{c} border border-#{c}/50 hover:bg-#{c}/10" },
    soft:    ->(c) { "text-#{c} bg-#{c}/10 hover:bg-#{c}/20" },
    ghost:   ->(c) { "text-#{c} hover:bg-#{c}/10" },
    link:    ->(c) { "text-#{c} underline-offset-4 hover:underline" }
  }.freeze

  BUTTON_COMPOUNDS = COLORS.flat_map do |color|
    VARIANT_STYLES.map do |variant, class_fn|
      { color: color, variant: variant, class: class_fn.call(color) }
    end
  end.freeze

  Button = ClassVariants.build(
    base: "rounded-md font-medium inline-flex items-center justify-center
           disabled:opacity-50 disabled:cursor-not-allowed",
    variants: {
      color: COLORS.index_with { "" },
      variant: VARIANT_STYLES.keys.index_with { "" },
      size: {
        sm: "px-2 py-1 text-xs gap-1",
        md: "px-2.5 py-1.5 text-sm gap-1.5",
        lg: "px-3 py-2 text-base gap-2"
      }
    },
    compound_variants: BUTTON_COMPOUNDS,
    defaults: { color: :primary, variant: :solid, size: :md }
  )
end
```

**Important**: When generating classes dynamically like `bg-#{color}`, you
must configure Tailwind's content scanning to find these classes. Either:
- Use a safelist in `tailwind.config.js`
- Use `@source` comments pointing to the Ruby theme files
- Keep a static list of all generated class strings in a comment block

### Recipe 5: Component Helper for Clean ERB

Wrap `.render()` calls in a helper so partials stay readable:

```ruby
# app/helpers/kiso/component_helper.rb
module Kiso::ComponentHelper
  def kiso_classes(component, *args, css_classes: nil, **variants)
    theme = Kiso::Themes.const_get(component.to_s.classify)
    theme.render(*args, **variants, class: css_classes)
  end
end
```

```erb
<%# Clean partial usage %>
<button class="<%= kiso_classes(:button, color: color, variant: variant, size: size,
                                css_classes: css_classes) %>">
```

Or skip the helper and call the theme directly — it's already clean:

```erb
<button class="<%= Kiso::Themes::Button.render(color: color, variant: variant,
                     size: size, class: css_classes) %>">
```

### Recipe 6: Data-Attribute CSS + class_variants Hybrid

Kiso uses data-attribute selectors for variants. This coexists with
class_variants — use data attributes for CSS that must live in stylesheets,
and class_variants for the classes in ERB:

```css
/* app/assets/stylesheets/button.css */
/* Transitions, animations — things hard to express in ERB */
[data-slot="button"] {
  @apply transition-colors duration-150;
}

[data-slot="button"]:focus-visible {
  @apply outline-2 outline-offset-2 outline-ring;
}
```

```erb
<%# ERB handles variant classes — the bulk of the styling %>
<%= content_tag :button,
    class: Kiso::Themes::Button.render(color: color, variant: variant,
               size: size, class: css_classes),
    data: kiso_prepare_options(component_options, slot: "button"),
    **component_options do %>
  <%= yield %>
<% end %>
```

The data attributes serve as **hooks for CSS that's awkward in ERB** (pseudo-
states, transitions, keyframes) while class_variants handles the main
styling in markup.

### Recipe 7: Inheriting and Extending Themes

For component variants that share a base (e.g., Input, Textarea, Select all
share form field styling):

```ruby
# lib/kiso/themes/field.rb
module Kiso::Themes
  FIELD_BASE = "flex w-full rounded-md border border-input bg-background
                text-foreground placeholder:text-muted-foreground
                focus-visible:outline-2 focus-visible:outline-ring
                disabled:opacity-50 disabled:cursor-not-allowed"

  FIELD_SIZES = {
    sm: "h-8 px-2.5 text-xs",
    md: "h-9 px-3 text-sm",
    lg: "h-10 px-4 text-base"
  }.freeze
end

# lib/kiso/themes/input.rb
module Kiso::Themes
  Input = ClassVariants.build(
    base: FIELD_BASE,
    variants: {
      size: FIELD_SIZES,
      type: {
        file: "file:border-0 file:bg-transparent file:text-sm file:font-medium"
      }
    },
    defaults: { size: :md }
  )
end

# lib/kiso/themes/textarea.rb
module Kiso::Themes
  Textarea = ClassVariants.build(
    base: "#{FIELD_BASE} min-h-[60px] py-2",
    variants: {
      size: {
        sm: "px-2.5 text-xs",
        md: "px-3 text-sm",
        lg: "px-4 text-base"
      }
    },
    defaults: { size: :md }
  )
end
```

Shared constants + string interpolation give you the `extend` behavior that
tailwind-variants has in JS, without any extra machinery.

### Recipe 8: shadcn-Style Flat Button (No Color Axis)

If your button doesn't need a separate `color` axis — just named variants
like shadcn does — this is the simplest approach:

```ruby
# lib/kiso/themes/button.rb
module Kiso::Themes
  Button = ClassVariants.build(
    base: "inline-flex items-center justify-center gap-2 rounded-md text-sm
           font-medium transition-colors focus-visible:outline-2
           focus-visible:outline-offset-2 focus-visible:outline-ring
           disabled:pointer-events-none disabled:opacity-50",
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        sm: "h-8 rounded-md px-3 text-xs",
        md: "h-9 px-4 py-2",
        lg: "h-10 rounded-md px-6",
        icon: "size-9"
      }
    },
    defaults: { variant: :default, size: :md }
  )
end
```

```erb
<%# Usage — dead simple %>
<%= content_tag :button,
    class: Kiso::Themes::Button.render(variant: variant, size: size,
                                       class: css_classes),
    data: { component: :button, variant: variant, size: size },
    **component_options do %>
  <%= yield %>
<% end %>
```

No compound variants, no empty color entries, no programmatic generation.
Each variant value is self-contained. You read `destructive:` and see
exactly what classes it applies.

**When to choose this over Recipe 3/4**: When you don't need independent
`color` and `variant` axes. shadcn's Button has 6 named variants
(default, destructive, outline, secondary, ghost, link) where each one is
a complete visual style. If your app only uses `primary` and `destructive`
buttons, this is simpler than a 5-color x 5-variant compound matrix.

---

## Patterns from Unio (Prior Art)

The Unio Hotwire app (`ua740-unio-hotwire`) is a Rails 7 + ViewComponent +
Stimulus app with a mature component library. Several patterns validated
Kiso's direction and a few are worth carrying forward directly.

### What Validated Kiso's Approach

**`class_mappings` DSL** — Unio independently built the same concept as
cva/class_variants. Components define variant-to-class-string maps:

```ruby
# Unio's approach (ViewComponent + custom DSL)
class_mappings :scheme do
  map :primary, "bg-sky-600 text-white border-sky-600 hover:bg-sky-700"
  map :danger, "bg-white text-red-400 border-red-400 hover:bg-red-50"
  default :basic
end
```

This maps directly to Kiso's `ClassVariants.build(variants: { variant: { ... } })`.
The difference: Unio lacks tailwind-merge deduplication and uses hardcoded
colors instead of semantic tokens. Kiso fixes both.

### Patterns to Carry Forward

#### Smart Tag Selection

Unio's ButtonComponent auto-switches `<button>` to `<a>` when `href:` is
present. Both shadcn (`asChild`) and Nuxt UI (`ULinkBase`) do the same.
Kiso should adopt this:

```erb
<%# app/views/components/_button.html.erb %>
<%# locals: (tag: :button, href: nil, ..., **component_options) %>
<% tag_name = href.present? ? :a : tag %>
<% component_options[:href] = href if href.present? %>
<%= content_tag tag_name, ... %>
```

#### `**component_options` Splat for Attribute Forwarding

Unio's `merge_options(**component_options)` pattern lets callers pass
arbitrary HTML attributes (data attrs, aria attrs, etc.) through to the
rendered element. Kiso already does this with `**component_options` in
strict locals:

```erb
<%# locals: (variant: :default, css_classes: "", **component_options) %>
<%= content_tag :div, ..., **component_options do %>
```

The key insight from Unio: enforce `css_classes` as the name for the class
override param, and raise if someone passes `class:` directly. This
prevents confusion since `class` is a Ruby reserved word in some contexts
and `content_tag` expects it as a keyword:

```ruby
# In a helper or the partial itself
raise ArgumentError, "Use css_classes:, not class:" if component_options.key?(:class)
```

#### Test Selectors (Non-Production)

Unio adds `data-test-selector` attributes that are stripped in production.
Cheap and useful for integration tests:

```erb
<%# In component partials %>
<% unless Rails.env.production? %>
  <% component_options[:data] = (component_options[:data] || {}).merge(
       test_selector: "button"
     ) %>
<% end %>
```

Or as a helper:

```ruby
# app/helpers/kiso/test_helper.rb
module Kiso::TestHelper
  def test_selector(name, data = {})
    return data if Rails.env.production?
    data.merge(test_selector: name)
  end
end
```

#### Conditional Stimulus Wiring

Unio components inject Stimulus `data-controller` in the initializer based
on props. For example, ActionButtonComponent adds a tooltip controller only
when `title:` is present:

```ruby
# Unio pattern
if title.present?
  component_options["data-controller"] = "tooltip"
  component_options["data-tooltip-content"] = title
end
```

In Kiso ERB partials, the same pattern:

```erb
<%# locals: (title: nil, **component_options) %>
<% if title.present? %>
  <% component_options[:data] = (component_options[:data] || {}).merge(
       controller: "kiso--tooltip",
       "kiso--tooltip-content-value": title
     ) %>
<% end %>
```

#### Component Data Helper

Unio's `merge_attributes` deep-merges data hashes with space-concatenation
for string values (so multiple Stimulus controllers don't clobber each
other). Kiso should have a `component_data` helper for this:

```ruby
# app/helpers/kiso/component_helper.rb
module Kiso::ComponentHelper
  # Merge component data attributes without clobbering
  #   component_data({ controller: "tooltip" }, { controller: "dropdown" })
  #   #=> { controller: "tooltip dropdown" }
  def component_data(*hashes)
    hashes.compact.reduce({}) do |merged, hash|
      hash.each do |key, value|
        if merged[key] && value.is_a?(String) && merged[key].is_a?(String)
          merged[key] = "#{merged[key]} #{value}"
        else
          merged[key] = value
        end
      end
      merged
    end
  end
end
```

### What to Leave Behind

- **BEM naming** (`unio-button--scheme-primary`) — Kiso uses
  `data-slot` attributes (shadcn v4 convention) instead. Same purpose
  (CSS hooks, debugging, test selectors), less class noise.
- **Hardcoded colors** (`bg-sky-600`, `text-gray-500`) — Kiso uses
  semantic tokens (`bg-primary`, `text-muted-foreground`). No dark mode
  support without them.
- **ViewComponent class overhead** — For simple components (Badge, Label,
  Separator), a Ruby class + ERB template is more machinery than an ERB
  partial with strict locals.
- **Duplicate style definitions** — Unio defines button styles in both
  `class_mappings` (Ruby) and `components/button.css` (`@apply`). These
  drift. Kiso defines variants in one place (theme module).
- **No class deduplication** — `class_names()` concatenates but doesn't
  deduplicate. `tailwind_merge` fixes this.

---

## Patterns from Fizzy (37signals Prior Art)

Fizzy is a production Rails app from 37signals (DHH's team). It ships **no
Tailwind CSS at all** — pure handcrafted CSS with custom properties. This is
the opposite end of the spectrum from shadcn/Nuxt UI, and provides useful
contrast for Kiso's decisions.

### Architecture: CSS Cascade Layers

Fizzy organizes all CSS with `@layer` precedence:

```css
@layer reset, base, components, modules, utilities, native, platform;
```

Each layer has a clear responsibility:
- **reset** — box-sizing, margin normalization
- **base** — body/typography defaults, focus rings, link styles
- **components** — `.btn`, `.panel`, `.card`, `.input`, `.dialog`, `.flash`
- **utilities** — animation keyframes (`.shake`, etc.)
- **native/platform** — native mobile app overrides via `[data-platform~=native]`

**Takeaway for Kiso**: `@layer` is a good mental model even within Tailwind.
Kiso's CSS files (for transitions, pseudo-states) should declare their layer
explicitly. Not needed today, but worth knowing the pattern if component CSS
grows.

### Color System: OKLCH, Not Tailwind Palette

Fizzy uses a **hand-tuned OKLCH color system** — the perceptually uniform
color space. Every color family has 7 shades (darkest through lightest) defined
as raw OKLCH triplets:

```css
:root {
  --lch-blue-darkest: 26% 0.126 264;
  --lch-blue-darker: 40% 0.166 262;
  --lch-blue-dark: 57.02% 0.1895 260.46;
  --lch-blue-medium: 66% 0.196 257.82;
  --lch-blue-light: 84.04% 0.0719 255.29;
  --lch-blue-lighter: 92% 0.026 254;
  --lch-blue-lightest: 96% 0.016 252;
}
```

Named colors then wrap these:

```css
--color-link: oklch(var(--lch-blue-dark));
--color-negative: oklch(var(--lch-red-dark));
--color-positive: oklch(var(--lch-green-dark));
```

**10 color families**: ink, uncolor (warm gray), red, yellow, lime, green,
aqua, blue, violet, purple, pink. Each has 7 shades = 70+ base color tokens.

**Contrast with Kiso**: Kiso uses `var(--color-blue-600)` — Tailwind's
built-in palette. This is simpler to reason about ("just pick a Tailwind
shade") but less perceptually uniform. Fizzy's approach gives finer control
over perceived brightness but requires manual tuning of every shade.

**Kiso's choice is right for an engine gem** — host apps already have Tailwind
installed with its palette. Asking them to learn OKLCH triplets would be a
barrier. But Fizzy proves that pure CSS custom properties (no framework) can
scale to a full production app.

### Semantic Token Design

Fizzy's semantic layer is minimal and intentional:

```css
--color-canvas       /* Page/card background */
--color-ink          /* Primary text (darkest shade of ink family) */
--color-ink-inverted /* Text on dark backgrounds */
--color-link         /* Interactive/link blue */
--color-negative     /* Error/destructive red */
--color-positive     /* Success green */
--color-selected     /* Selection highlight (blue lighter) */
--color-highlight    /* Yellow highlight */
```

Plus a **full ink shade scale** (`--color-ink-darkest` through
`--color-ink-lightest`) used directly in components for subtle grays.

**Key difference from shadcn**: No `-foreground` pairing convention. Fizzy
uses `--color-ink-inverted` as a universal "text on colored backgrounds" token.
This works because their button variants explicitly set both background AND
text color via CSS custom properties on each variant.

**What Kiso should note**: Fizzy's `--color-ink-inverted` is clever — one
token for "white text on dark bg in light mode, dark text on light bg in dark
mode." Kiso achieves the same with per-token `-foreground` pairs, which is
more explicit but more verbose.

### Dark Mode: The Gold Standard

Fizzy's dark mode implementation is the most thorough of all the apps
analyzed. Three layers:

**1. FOUC prevention** — inline script in `<head>` before any CSS loads:

```erb
<%# layouts/_theme_preference.html.erb %>
<%= javascript_tag nonce: true do %>
  const theme = localStorage.getItem("theme")
  if (theme && theme !== "auto") {
    document.documentElement.dataset.theme = theme
  }
<% end %>
```

**2. Explicit theme via `data-theme` attribute**:

```css
html[data-theme="dark"] {
  --lch-canvas: 20% 0.0195 232.58;
  --lch-ink-darkest: 96.02% 0.0034 260;
  /* Every single shade in every color family is redefined */
}
```

**3. System preference fallback** when no explicit choice:

```css
@media (prefers-color-scheme: dark) {
  html:not([data-theme]) {
    /* Same dark overrides as html[data-theme="dark"] */
  }
}
```

**4. Stimulus controller** with View Transitions for smooth switching:

```javascript
// theme_controller.js
set #theme(theme) {
  localStorage.setItem("theme", theme)
  const applyTheme = () => {
    if (theme === "auto") {
      document.documentElement.removeAttribute("data-theme")
    } else {
      document.documentElement.setAttribute("data-theme", theme)
    }
  }
  if (animate && document.startViewTransition) {
    document.startViewTransition(applyTheme)
  } else {
    applyTheme()
  }
}
```

**What's impressive**: Every single OKLCH shade is redefined in dark mode.
The "darkest" shade in light mode (low lightness) becomes the "darkest" shade
in dark mode (high lightness). The entire scale inverts. This means
`--color-ink-dark` always means "moderately de-emphasized text" regardless
of mode — you never need to think about which shade to pick for dark mode.

**Takeaway for Kiso**: Fizzy's `data-theme` + `@media` fallback pattern
should be adopted. It gives users three choices (light/dark/auto) while
respecting system preference as default. Kiso should:
1. Use `.dark` class (Tailwind convention) instead of `data-theme="dark"`
2. Include a FOUC-prevention script recipe in docs
3. Document a Stimulus theme controller pattern
4. Use View Transitions for theme switching (progressive enhancement)

### Component Variant Pattern: CSS Custom Property Overrides

This is where Fizzy diverges most from the Tailwind world. Instead of
class-based variants (cva, class_variants), Fizzy uses **CSS custom property
cascading** for variants:

```css
/* Base button — all styling via custom properties with defaults */
.btn {
  background-color: var(--btn-background, var(--color-canvas));
  border: var(--btn-border-size, 1px) solid var(--btn-border-color, var(--color-ink-light));
  color: var(--btn-color, var(--color-ink));
  padding: var(--btn-padding, 0.5em 1.1em);
  border-radius: var(--btn-border-radius, 99rem);
}

/* Variants just override the custom properties */
.btn--link {
  --btn-background: var(--color-link);
  --btn-border-color: var(--color-canvas);
  --btn-color: var(--color-ink-inverted);
}

.btn--negative {
  --btn-background: var(--color-negative);
  --btn-border-color: var(--color-negative);
  --btn-color: var(--color-ink-inverted);
}

.btn--plain {
  --btn-background: transparent;
  --btn-border-radius: 0;
  --btn-border-size: 0;
  --btn-padding: 0;
}
```

**Usage in ERB** — just compose class names:

```erb
<%= button_to card_pin_path(card), method: :delete,
      class: "btn btn--reversed",
      data: { controller: "tooltip hotkey" } do %>
  <%= icon_tag "pinned" %>
<% end %>
```

**Advantages of this approach**:
- **One source of truth** — all button styles live in `buttons.css`. No
  parallel definitions in Ruby theme modules.
- **CSS-native cascading** — a parent can set `--btn-background` and all
  child buttons inherit it. No prop drilling.
- **Smaller ERB** — partials just add class names, no Ruby theme lookups.
- **Dark mode is free** — hover uses `filter: brightness()` with a dark-mode
  override on just one property (`--btn-hover-brightness: 1.25`).

**Disadvantages vs Kiso's approach**:
- **No class deduplication** — if you add `class="btn btn--link"` and also
  inline `background-color: red`, there's no tailwind-merge to resolve it.
- **No override escape hatch** — can't easily say "this one button should be
  rounded-none" without inline styles or a new modifier class.
- **Harder to customize per-instance** — Tailwind's `css_classes` override
  with tailwind-merge gives finer-grained control.
- **Requires writing real CSS** — Tailwind's utility-first approach means
  most developers never open a CSS file.

### Form Helpers: Stimulus Controller Composition

Fizzy's form helpers show a clean pattern for composing Stimulus controllers:

```ruby
# forms_helper.rb
def auto_submit_form_with(**attributes, &)
  data = attributes.delete(:data) || {}
  data[:controller] = "auto-submit #{data[:controller]}".strip
  form_with **attributes, data: data, &
end
```

This prepends a controller name to whatever controllers the caller already
specified. Same pattern as Kiso's `component_data` helper idea, but applied
at the form level.

**Takeaway for Kiso**: Fizzy validates the "controller concatenation" pattern
documented in Unio section. Kiso's `component_data` helper should use this
same `"#{existing} #{new}".strip` approach.

### Panel/Card/Dialog Composition

Fizzy's approach to compound components is pure CSS:

```css
/* Panel base with CSS custom property API */
.panel {
  background-color: var(--panel-bg, var(--color-canvas));
  border: var(--panel-border-size, 1px) solid var(--panel-border-color, var(--color-ink-lighter));
  border-radius: var(--panel-border-radius, 1em);
  padding: var(--panel-padding, var(--block-space));
}

.panel--centered {
  --panel-border-size: 0;
  --panel-size: 100%;
}
```

Dialogs compose with panels:

```css
.dialog.panel {
  max-inline-size: calc(100vw - var(--inline-space-double) * 2);
}
```

**Cards use `color-mix()`** for derived colors from a single `--card-color`:

```css
.card {
  --card-bg-color: color-mix(in srgb, var(--card-color) 4%, var(--color-canvas));
  --card-content-color: color-mix(in srgb, var(--card-color) 30%, var(--color-ink));
}
```

This is genuinely clever — set one color and get a coordinated background,
text, and border. Kiso could use Tailwind's opacity modifiers (`bg-primary/10`)
to achieve a similar effect, though less dynamically.

### Native HTML5 Elements

Fizzy validates Kiso's "native HTML5 first" principle:

- **`<dialog>`** — used for modals with CSS `transition` and `@starting-style`
  for enter/exit animations. No JS animation library.
- **`html:has(dialog:modal)` → `overflow: hidden`** — prevents background
  scroll when dialog is open. Pure CSS, no Stimulus.
- **CSS `field-sizing: content`** — used for auto-growing textareas, with
  `@supports` fallback. Progressive enhancement, not a Stimulus controller.
- **`:has()` selectors** — heavily used for state-based styling (`:has(input:checked)`,
  `:has(:focus-visible)`). Reduces need for JS state management.

**Takeaway for Kiso**: Fizzy proves that `<dialog>` with CSS transitions and
`@starting-style` is production-ready. Kiso's dialog component should use
this approach — no Stimulus controller for open/close animation.

### What Kiso Should Carry Forward from Fizzy

**1. FOUC-prevention script pattern** — critical for dark mode. A small inline
script in `<head>` that reads localStorage and sets the theme attribute
before CSS loads.

**2. Three-way theme switching** — light / dark / auto (system preference).
`data-theme` attribute for explicit choice, `@media (prefers-color-scheme)`
for auto mode, with `.dark` class in Kiso's case.

**3. View Transitions for theme switching** — `document.startViewTransition()`
with `prefers-reduced-motion` respect.

**4. CSS custom property defaults with fallbacks** — Fizzy's
`var(--btn-background, var(--color-canvas))` pattern is useful for Kiso's
data-attribute CSS. Component CSS files can use this for transitions and
pseudo-states that are awkward in ERB.

**5. `color-mix()` for derived colors** — when a component needs "lighter
version of its color", `color-mix(in srgb, var(--card-color) 10%, white)` is
cleaner than maintaining separate tokens. Kiso can use this in the CSS layer.

**6. `:has()` selectors for state** — `:has(input:checked)`,
`:has(:focus-visible)` reduce Stimulus controller needs. Kiso should prefer
these over JS state management for toggle/focus/checked behaviors.

**7. `@starting-style` for dialog animations** — CSS-only enter/exit
transitions for `<dialog>`. No animation JS needed.

### What to Leave Behind

- **No Tailwind** — Fizzy writes all CSS by hand. This works for a single
  product team but doesn't suit an engine gem where host apps already use
  Tailwind. Kiso's utility-first approach is correct for the distribution
  model.

- **OKLCH color values** — Hand-tuning OKLCH triplets for 70+ shades across
  10 color families is a significant investment. Tailwind's built-in palette
  is good enough and universally understood.

- **BEM-ish class naming** (`.btn--link`, `.panel--centered`) — Kiso uses
  `data-slot` attributes (shadcn v4 convention), which serve the same purpose
  without class noise. Though Fizzy's naming is clean and consistent.

- **CSS-only variant system** — Fizzy's "override custom properties for
  variants" is elegant in CSS but doesn't give host apps the `css_classes`
  escape hatch. Kiso needs class_variants + tailwind_merge for the override
  model to work.

- **Duplicated dark mode blocks** — Fizzy duplicates the entire dark mode
  override block for both `html[data-theme="dark"]` and
  `@media (prefers-color-scheme: dark) { html:not([data-theme]) }`. This is
  ~200 lines of duplication. Kiso avoids this by using Tailwind's `.dark`
  class with a single `@theme` block.

---

## Summary: Kiso's Approach

Kiso combines the best of shadcn/ui, Nuxt UI, Fizzy, and proven patterns from Unio:

| Pattern | Source | Kiso Approach |
|---------|--------|---------------|
| Variant definitions | shadcn | Flat, self-contained variant strings by default |
| Compound variants | Nuxt UI | Only for color x variant matrix (Button, Alert) |
| Dark mode | Nuxt UI + Fizzy | Pure CSS custom properties, zero `dark:` prefixes |
| Theme switching | Fizzy | Three-way (light/dark/auto) with FOUC prevention |
| View Transitions | Fizzy | Smooth theme switching with `startViewTransition()` |
| Semantic tokens | Both | ~30 tokens with `-foreground` pairing (shadcn's scope) |
| Color values | Nuxt UI | Tailwind palette refs, not raw OKLCH |
| Class merging | shadcn | `class_variants` + `tailwind_merge` (Ruby `cn()`) |
| Override model | shadcn | Single `css_classes` param, no multi-layer config |
| Theme inheritance | Nuxt UI | Shared Ruby constants for field/form base classes |
| CSS property defaults | Fizzy | `var(--prop, var(--fallback))` in component CSS |
| Derived colors | Fizzy | `color-mix()` / opacity modifiers for lighter variants |
| `:has()` selectors | Fizzy | CSS state management over JS where possible |
| Dialog animations | Fizzy | `@starting-style` + CSS transitions, no animation JS |
| Smart tag selection | Unio | `<button>` auto-switches to `<a>` when `href:` present |
| Attribute forwarding | Unio | `**component_options` splat in strict locals |
| Test selectors | Unio | `data-test-selector` in non-production |
| Stimulus wiring | Unio + Fizzy | Conditional controller injection, string concatenation |
| Data merging | Unio | `component_data` helper for non-clobbering data attrs |

### Design Principles

1. **Flat variants by default** — each variant value is a complete, readable
   class string. Use compound variants only when the color x variant matrix
   makes flat definitions repetitive.

2. **Zero `dark:` prefixes in variant definitions** — if a component needs
   `dark:bg-input/30`, the token set is incomplete. Add a semantic token
   instead. This is where Kiso improves on shadcn.

3. **Single override point** — `css_classes` parameter, merged via
   tailwind_merge. No global config, no theme context. Start simple.

4. **Foreground pairing** — every background token gets a `-foreground`
   companion. `bg-primary text-primary-foreground` is always accessible.

5. **Tailwind palette references** — `var(--color-blue-600)` not
   `oklch(0.546 0.245 262.881)`. Easier to reason about, easier to swap
   brand colors ("my primary is indigo" = one word change).
