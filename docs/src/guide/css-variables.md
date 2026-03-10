---
title: CSS Variables Reference
layout: docs
description: Every overridable CSS custom property in Kiso, organized by category.
---

Kiso defines semantic CSS custom properties that components resolve through.
Override any of them in your Tailwind stylesheet to customize the framework
without touching component code.

```css
@import "tailwindcss";
@import "../builds/tailwind/kiso";

@theme {
  --color-primary: var(--color-violet-600);
  --color-primary-foreground: var(--color-white);
  --kiso-radius: 0.375rem;
}
```

## Structural

Framework-level layout and geometry tokens. Defined in `engine.css`.

| Variable | Default | Purpose |
|----------|---------|---------|
| `--kiso-radius` | `0.25rem` | Base radius unit (scales the entire border-radius system) |
| `--kiso-container` | `80rem` | Max content width for Container component |

## Radius Scale

Computed from `--kiso-radius` using multipliers. Changing the base shifts
every `rounded-*` utility proportionally. At the default `0.25rem`, values
match Tailwind's built-in defaults.

| Variable | Multiplier | Default | Tailwind utility |
|----------|------------|---------|------------------|
| `--radius-xs` | × 0.5 | `0.125rem` | `rounded-xs` |
| `--radius-sm` | × 1 | `0.25rem` | `rounded-sm` |
| `--radius-md` | × 1.5 | `0.375rem` | `rounded-md` |
| `--radius-lg` | × 2 | `0.5rem` | `rounded-lg` |
| `--radius-xl` | × 3 | `0.75rem` | `rounded-xl` |
| `--radius-2xl` | × 4 | `1rem` | `rounded-2xl` |
| `--radius-3xl` | × 6 | `1.5rem` | `rounded-3xl` |
| `--radius-4xl` | × 8 | `2rem` | `rounded-4xl` |

```css
@theme {
  --kiso-radius: 0.375rem;  /* rounder — 1.5× default */
  --kiso-radius: 0;         /* sharp — no rounding */
}
```

## Typography

Font family tokens. Defined in `engine.css`.

| Variable | Default | Purpose |
|----------|---------|---------|
| `--font-sans` | Geist, system stack | Default sans-serif font |
| `--font-mono` | Geist Mono, monospace stack | Monospace font |

```css
@theme inline {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}
```

## Semantic Colors

Purpose-named color tokens that flip automatically in dark mode. Components
use `bg-primary`, `text-foreground`, etc. — never raw palette shades.

### Brand Colors

Each has a `-foreground` companion for accessible text on that background.

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `--color-primary` | rose-500 | rose-400 | Primary actions, brand |
| `--color-primary-foreground` | white | zinc-950 | Text on primary |
| `--color-secondary` | teal-600 | teal-400 | Secondary actions |
| `--color-secondary-foreground` | white | zinc-950 | Text on secondary |
| `--color-success` | green-600 | green-400 | Positive feedback |
| `--color-success-foreground` | white | zinc-950 | Text on success |
| `--color-info` | sky-600 | sky-400 | Informational |
| `--color-info-foreground` | white | zinc-950 | Text on info |
| `--color-warning` | amber-500 | amber-400 | Caution |
| `--color-warning-foreground` | amber-950 | zinc-950 | Text on warning |
| `--color-error` | red-600 | red-400 | Errors, destructive |
| `--color-error-foreground` | white | zinc-950 | Text on error |

### Surface Colors

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `--color-background` | white | zinc-950 | Page background |
| `--color-foreground` | zinc-950 | zinc-50 | Default text |
| `--color-muted` | zinc-100 | zinc-800 | Muted surface |
| `--color-muted-foreground` | zinc-500 | zinc-400 | Muted text |
| `--color-accent` | zinc-100 | zinc-800 | Hover/accent surface |
| `--color-accent-foreground` | zinc-900 | zinc-50 | Text on accent |
| `--color-inverted` | zinc-900 | white | Inverted surface |
| `--color-inverted-foreground` | white | zinc-950 | Text on inverted |
| `--color-elevated` | zinc-100 | zinc-800 | Elevated surface (soft variant) |
| `--color-accented` | zinc-300 | zinc-700 | Accented border/ring |

### Border & Ring

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `--color-border` | zinc-200 | zinc-800 | Default border |
| `--color-border-accented` | zinc-300 | zinc-700 | Stronger border |
| `--color-ring` | zinc-400 | zinc-600 | Focus ring |

### Customizing brand colors

Two approaches — override the semantic token directly, or define a full shade
scale and let Kiso auto-wire it:

```css
/* Approach 1: Direct override */
@theme {
  --color-primary: oklch(0.55 0.10 237);
  --color-primary-foreground: white;
}

/* Approach 2: Define shade scale (Kiso auto-wires 500/400/50/950) */
@theme {
  --color-primary-50:  oklch(...);
  --color-primary-400: oklch(...);
  --color-primary-500: oklch(...);
  --color-primary-950: oklch(...);
}
```

## Dashboard Layout

Defined in `dashboard.css`. Only present when dashboard layout components are
used.

### Geometry

| Variable | Default | Purpose |
|----------|---------|---------|
| `--sidebar-width` | `16rem` | Sidebar panel width |
| `--topbar-height` | `3.5rem` | Top navigation bar height |
| `--sidebar-duration` | `220ms` | Sidebar open/close animation duration |

### Sidebar Surface

| Variable | Light | Dark | Purpose |
|----------|-------|------|---------|
| `--sidebar-background` | white | zinc-950 | Sidebar surface |
| `--sidebar-foreground` | zinc-900 | zinc-100 | Sidebar text |
| `--sidebar-border` | zinc-200 | zinc-800 | Sidebar divider |
| `--sidebar-accent` | zinc-100 | zinc-800 | Sidebar hover/active surface |
| `--sidebar-accent-foreground` | zinc-700 | zinc-300 | Sidebar hover/active text |

```css
@theme {
  --sidebar-width: 18rem;
  --topbar-height: 4rem;
  --sidebar-background: var(--color-zinc-900);
  --sidebar-foreground: var(--color-zinc-100);
}
```
