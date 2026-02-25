# Theming

## Semantic colors

| Color | Default | Purpose |
|---|---|---|
| `primary` | blue | CTAs, active states, brand |
| `secondary` | teal | Secondary actions |
| `success` | green | Success messages |
| `info` | sky | Informational |
| `warning` | amber | Warnings |
| `error` | red | Errors, destructive actions |
| `neutral` | zinc | Text, borders, surfaces |

## CSS utilities

### Text

| Class | Use | Light value | Dark value |
|---|---|---|---|
| `text-foreground` | Body text | `zinc-950` | `zinc-50` |
| `text-muted-foreground` | Secondary text | `zinc-500` | `zinc-400` |
| `text-inverted` | On dark/light backgrounds | `zinc-900` | `white` |

### Background

| Class | Use | Light value | Dark value |
|---|---|---|---|
| `bg-background` | Page background | `white` | `zinc-950` |
| `bg-muted` | Subtle sections | `zinc-100` | `zinc-800` |
| `bg-elevated` | Cards, modals | `zinc-100` | `zinc-800` |
| `bg-inverted` | Inverted sections | `zinc-900` | `white` |

### Border

| Class | Use | Light value | Dark value |
|---|---|---|---|
| `border-border` | Default borders | `zinc-200` | `zinc-800` |
| `border-accented` | Emphasized borders | `zinc-300` | `zinc-700` |

### Semantic color utilities

Each semantic color is available as a Tailwind utility: `text-primary`, `bg-primary`, `border-primary`, `ring-primary`, plus opacity modifiers like `bg-primary/10`.

Foreground pairing: `text-primary-foreground` for accessible text on `bg-primary`.

## Configuring brand colors

Override semantic colors in your app's Tailwind CSS:

```css
@theme inline {
  --color-primary: var(--color-orange-600);
  --color-primary-foreground: white;
}

.dark {
  --color-primary: var(--color-orange-400);
  --color-primary-foreground: var(--color-zinc-950);
}
```

## Component theme architecture

Variant definitions live in Ruby theme modules (`lib/kiso/themes/`), not CSS files. Components compute Tailwind class strings at render time using `class_variants` + `tailwind_merge`.

- **Flat variants** — for single-axis components (Label, Separator)
- **Compound variants** — for color × variant matrix (Badge, Button, Alert)
- **`css_classes:` override** — instance-level class override, deduped by tailwind_merge

See `docs/COMPONENT_STRATEGY.md` for the full architecture reference.
