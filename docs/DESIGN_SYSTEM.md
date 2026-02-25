# Design System

Strict rules for visual consistency across all Kiso components. Aesthetic
follows shadcn/ui; color theming follows Nuxt UI's two-axis compound variant
system. **Read this before building or modifying any component.**

---

## Compound Variant Formulas

These formulas are **identical** across every colored component (Badge, Button,
Alert, etc.). Only base/layout classes change per component. No exceptions.

### Variant axis (shared by all colored components)

```ruby
variant: {
  solid: "",
  outline: "ring ring-inset",
  soft: "",
  subtle: "ring ring-inset"
}
```

`ring ring-inset` lives on the variant axis. Never repeat it in compound
variants.

### Colored compound variants

For each color in `COLORS` (primary, secondary, success, info, warning, error):

```ruby
{ color: :primary, variant: :solid,   class: "bg-primary text-primary-foreground" }
{ color: :primary, variant: :outline, class: "text-primary ring-primary/50" }
{ color: :primary, variant: :soft,    class: "bg-primary/10 text-primary" }
{ color: :primary, variant: :subtle,  class: "bg-primary/10 text-primary ring-primary/25" }
```

| Variant | Formula |
|---------|---------|
| solid | `bg-{color} text-{color}-foreground` |
| outline | `text-{color} ring-{color}/50` |
| soft | `bg-{color}/10 text-{color}` |
| subtle | `bg-{color}/10 text-{color} ring-{color}/25` |

### Neutral compound variants

```ruby
{ color: :neutral, variant: :solid,   class: "bg-inverted text-inverted-foreground" }
{ color: :neutral, variant: :outline, class: "text-foreground bg-background ring-accented" }
{ color: :neutral, variant: :soft,    class: "text-foreground bg-elevated" }
{ color: :neutral, variant: :subtle,  class: "text-foreground bg-elevated ring-accented" }
```

| Variant | Neutral formula |
|---------|-----------------|
| solid | `bg-inverted text-inverted-foreground` |
| outline | `text-foreground bg-background ring-accented` |
| soft | `text-foreground bg-elevated` |
| subtle | `text-foreground bg-elevated ring-accented` |

---

## Semantic Color Tokens

Components use these tokens exclusively. Never use raw Tailwind palette
shades (`zinc-500`, `blue-600`). Never use `dark:` prefixes.

### Brand colors (7 palettes)

Each has a `-foreground` companion for accessible text on that background.

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `primary` / `-foreground` | blue-600 / white | blue-400 / zinc-950 | Primary actions |
| `secondary` / `-foreground` | teal-600 / white | teal-400 / zinc-950 | Secondary actions |
| `success` / `-foreground` | green-600 / white | green-400 / zinc-950 | Positive feedback |
| `info` / `-foreground` | sky-600 / white | sky-400 / zinc-950 | Informational |
| `warning` / `-foreground` | amber-500 / amber-950 | amber-400 / zinc-950 | Caution (dark text for contrast) |
| `error` / `-foreground` | red-600 / white | red-400 / zinc-950 | Destructive / errors |

### Surface tokens

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `background` | white | zinc-950 | Page background |
| `foreground` | zinc-950 | zinc-50 | Primary text |
| `muted` | zinc-100 | zinc-800 | Subtle section backgrounds |
| `muted-foreground` | zinc-500 | zinc-400 | Secondary text, descriptions |
| `elevated` | zinc-100 | zinc-800 | Cards, raised surfaces |
| `inverted` | zinc-900 | white | Inverted backgrounds |
| `inverted-foreground` | white | zinc-950 | Text on inverted backgrounds |
| `accented` | zinc-300 | zinc-700 | Accented rings / borders |
| `border` | zinc-200 | zinc-800 | Default borders |

### Token mapping from Nuxt UI

When referencing Nuxt UI source code, use this translation:

| Nuxt UI token | Kiso token |
|---------------|------------|
| `text-inverted` | `text-inverted-foreground` |
| `text-highlighted` | `text-foreground` |
| `text-default` | `text-foreground` |
| `text-muted` | `text-muted-foreground` |
| `bg-default` | `bg-background` |
| `bg-elevated` | `bg-elevated` |
| `bg-inverted` | `bg-inverted` |
| `ring-accented` | `ring-accented` |
| `ring-default` | `ring-border` |

---

## Rules

1. **Compound variant formulas are identical across components.** Badge, Alert,
   Button — same 28 compound variants (7 colors x 4 variants). Only base
   classes differ.

2. **Description / secondary text uses `opacity-90`**, not `text-muted-foreground`.
   Opacity is relative to the parent's text color, so it works on colored
   solid backgrounds. `text-muted-foreground` is an absolute color (zinc-500)
   that breaks on non-white backgrounds.

3. **`ring ring-inset` goes on the variant axis.** DRY — defined once, not
   repeated in each compound variant entry.

4. **Per-color foregrounds for solid.** We use `text-{color}-foreground` (not
   Nuxt UI's single `text-inverted`) because per-color foregrounds give
   better accessibility control (e.g., warning uses dark text on amber).

5. **7 colors, 4 core variants.** Colors: primary, secondary, success, info,
   warning, error, neutral. Core variants: solid, outline, soft, subtle.
   Interactive components (Button) may add ghost and link variants with
   their own compound formulas, but the core 4 remain identical.

6. **No `border` for outline/subtle variants.** Use `ring ring-inset` +
   `ring-{color}/50` (outline) or `ring-{color}/25` (subtle). `border` is
   reserved for components that need actual CSS borders (tables, separators).

7. **Opacity conventions:**
   - `/50` — outline ring opacity
   - `/25` — subtle ring opacity
   - `/10` — soft/subtle background tint
   - `opacity-90` — secondary/description text

8. **Interactive components extend base formulas with states.** Button adds
   hover/active/focus-visible classes to the same base color tokens. Pattern:
   - Solid hover: `hover:bg-{color}/90 active:bg-{color}/80`
   - Soft/subtle/ghost hover: `hover:bg-{color}/15 active:bg-{color}/20`
   - Outline hover: `hover:bg-{color}/10 active:bg-{color}/15`
   - Focus: `focus-visible:outline-{color}` (solid/soft/ghost/link) or
     `focus-visible:ring-2 focus-visible:ring-{color}` (outline/subtle)
