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

2. **Description / secondary text inherits the parent's text color** inside
   colored components. Never use `text-muted-foreground` inside colored
   components — it's an absolute color (zinc-500) that breaks on non-white
   backgrounds.

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
   - (description text inherits parent color at full opacity)

8. **Interactive components extend base formulas with states.** Button adds
   hover/active/focus-visible classes to the same base color tokens. Pattern:
   - Solid hover: `hover:bg-{color}/90 active:bg-{color}/80`
   - Soft/subtle/ghost hover: `hover:bg-{color}/15 active:bg-{color}/20`
   - Outline hover: `hover:bg-{color}/10 active:bg-{color}/15`
   - Focus: `focus-visible:outline-{color}` (solid/soft/ghost/link) or
     `focus-visible:ring-2 focus-visible:ring-{color}` (outline/subtle)

---

## Spatial System

Extracted from shadcn/ui v4 source code. These values are the spatial
foundation — every component must draw from these scales. No arbitrary values
(`text-[8px]`, `h-[1.15rem]`). If Tailwind doesn't have a class for it, don't
use it.

### Heights (interactive elements)

Standard interactive height is `h-9`. Scale by 1 in each direction.

| Size | Height | Used for |
|------|--------|----------|
| xs | `h-6` | Extra-small buttons, icon buttons |
| sm | `h-8` | Small buttons, small inputs, tabs list |
| md (default) | `h-9` | Buttons, inputs, selects, toggles |
| lg | `h-10` | Large buttons, large avatars |

### Padding

#### Interactive elements (buttons, inputs)

| Size | Horizontal | Vertical | Notes |
|------|------------|----------|-------|
| xs | `px-2` | `py-1` | Compact |
| sm | `px-3` | `py-1.5` | — |
| md (default) | `px-3` | `py-2` | shadcn uses px-4 for buttons, px-3 for inputs |
| lg | `px-4` | `py-2` | — |

When a button contains only an icon, use square sizing (`size-6`, `size-8`,
`size-9`, `size-10`) matching the height scale.

#### Menu/list items (dropdown, select, command items)

Standard: `px-2 py-1.5` — consistent across all menu-like components.

#### Containers

| Container type | Padding | Examples |
|----------------|---------|----------|
| Large | `p-6` | Card, Dialog |
| Medium | `p-4` | Sheet header/footer, Popover, Drawer |
| Compact | `p-2` | Sidebar sections |
| Card sub-parts | `px-6` | CardHeader, CardContent, CardFooter (horizontal only — Card itself provides vertical via py-6 + gap-6) |

### Gaps

| Value | When to use |
|-------|-------------|
| `gap-1` | Tight lists — sidebar menus, accordion items |
| `gap-1.5` | Between small elements — breadcrumb items, compact tab triggers |
| `gap-2` | **The default.** Use between most sibling elements — dialog header items, button icon+text, form label+control |
| `gap-3` | Radio/checkbox groups, form field spacing within groups |
| `gap-4` | Between major sections inside a container — dialog body sections, sheet content |
| `gap-6` | Top-level container divisions — Card header/content/footer |

### Font sizes

| Value | Role | Examples |
|-------|------|----------|
| `text-xs` | Labels, captions, helper text | Badge text, tab triggers, tooltip content, dropdown labels |
| `text-sm` | **Standard body text.** Used almost everywhere. | Button text, alert text, descriptions, menu items, form labels |
| `text-base` | Input text on mobile | Input/textarea base size (with `md:text-sm` for desktop) |
| `text-lg` | Modal/overlay titles | Dialog title, sheet title, empty state title |

Never go below `text-xs` (12px). No `text-[8px]` or `text-[10px]`.

### Font weights

| Weight | Role |
|--------|------|
| `font-medium` | Interactive elements & secondary headings — buttons, badges, labels, alert titles |
| `font-semibold` | Primary headings — card titles, dialog titles, sheet titles |
| (normal/default) | Body text, descriptions |

### Border radius

| Value | Component type | Examples |
|-------|---------------|----------|
| `rounded-xl` | Major containers | Card |
| `rounded-lg` | Medium containers | Alert, Dialog, Empty state |
| `rounded-md` | **Interactive elements** (default) | Button, Input, Select, Toggle, Checkbox |
| `rounded-full` | Pills & circles | Badge, Avatar, Switch, Progress bar |

No per-size variation. A button is `rounded-md` at every size. Don't change
radius based on the size variant.

### Icon sizing

| Value | Context |
|-------|---------|
| `size-3` | Compact areas — xs buttons, breadcrumb separators |
| `size-4` | **Standard.** Used in buttons, alerts, menu items, toggles |
| `size-5` | Sidebar controls, larger action buttons |

Default selector pattern: `[&_svg:not([class*='size-'])]:size-4` — allows
explicit overrides while providing a sensible fallback.

### Container structure patterns

These internal spacing patterns are consistent across all container-type
components. Follow them exactly.

```
Card (py-6, gap-6, rounded-xl, border, shadow-sm)
├── CardHeader (px-6, gap-2)
│   ├── CardTitle (font-semibold, leading-none)
│   └── CardDescription (text-sm, text-muted-foreground)
├── CardContent (px-6)
└── CardFooter (px-6, flex, items-center)

Dialog (p-6, gap-4, rounded-lg)
├── DialogHeader (gap-2)
│   ├── DialogTitle (text-lg, font-semibold)
│   └── DialogDescription (text-sm, text-muted-foreground)
├── (body content)
└── DialogFooter (gap-2)

Sheet/Drawer (gap-4)
├── Header (p-4, gap-1.5)
│   ├── Title (font-semibold)
│   └── Description (text-sm, text-muted-foreground)
├── (body content)
└── Footer (p-4, gap-2, mt-auto)
```

### Typography hierarchy

Titles and descriptions follow the same pattern everywhere:

| Context | Title | Description |
|---------|-------|-------------|
| Card | `font-semibold leading-none` | `text-sm text-muted-foreground` |
| Dialog / Sheet / Drawer | `text-lg font-semibold` | `text-sm text-muted-foreground` |
| Alert | `font-medium tracking-tight` | `text-sm text-muted-foreground` |
| Empty state | `text-lg font-medium tracking-tight` | `text-sm text-muted-foreground` |
| Form fields | `text-sm font-medium` (label) | `text-sm text-muted-foreground` |

Description is always `text-sm text-muted-foreground` on neutral backgrounds.
Inside colored components (Alert with color variants), description inherits
the parent text color at full opacity (see Rule 2 above).

### Kiso size variants

When Kiso adds size variants that shadcn doesn't have (e.g., Badge sizes),
use the same scale values from the tables above. Pick from the established
values — don't invent new ones. Example for a component needing xs → xl:

| Size | Padding | Font | Icon | Gap | Radius |
|------|---------|------|------|-----|--------|
| xs | `px-2 py-0.5` | `text-xs` | `size-3` | `gap-1` | (component default) |
| sm | `px-2.5 py-0.5` | `text-xs` | `size-3` | `gap-1` | (component default) |
| md | `px-3 py-1` | `text-xs` | `size-3.5` | `gap-1.5` | (component default) |
| lg | `px-3.5 py-1` | `text-sm` | `size-4` | `gap-1.5` | (component default) |
| xl | `px-4 py-1.5` | `text-sm` | `size-4` | `gap-2` | (component default) |

This is a reference scale. Not every component needs all 5 sizes — most
should match shadcn and use a single size or 2–3 variants (sm, default, lg).
