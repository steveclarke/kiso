---
title: Dark Mode & Theming
layout: docs
description: How Kiso handles dark mode through CSS variable swapping and semantic tokens.
---

## How it works

Kiso uses **CSS variable swapping** for dark mode. Adding a `.dark` class to
your `<html>` element activates the dark palette:

```html
<html class="dark">
```

All semantic tokens (`bg-primary`, `text-foreground`, `bg-muted`, etc.) resolve
to CSS custom properties. In the `.dark {}` block, those properties are
reassigned to dark-appropriate values. Components don't need to know which
mode is active — they just use tokens, and the tokens do the right thing.

If you've used shadcn's dark mode approach (CSS variables in `:root` and
`.dark`), this is the same system.

## No `dark:` prefixes

Unlike many Tailwind projects, Kiso components never use Tailwind's `dark:`
prefix. You won't see `dark:bg-zinc-900` or `dark:text-white` in any
component.

Instead:

| Tailwind `dark:` pattern | Kiso equivalent |
|--------------------------|-----------------|
| `bg-white dark:bg-zinc-900` | `bg-background` |
| `text-zinc-900 dark:text-zinc-100` | `text-foreground` |
| `border-zinc-200 dark:border-zinc-800` | `border-border` |

This keeps component code clean and means dark mode works automatically when
you toggle the `.dark` class.

## Foreground pairing

Every color token has a `-foreground` companion that provides accessible
contrast:

| Background | Text |
|------------|------|
| `bg-primary` | `text-primary-foreground` |
| `bg-secondary` | `text-secondary-foreground` |
| `bg-success` | `text-success-foreground` |
| `bg-muted` | `text-muted-foreground` |
| `bg-inverted` | `text-inverted-foreground` |

Kiso's compound variants always pair these correctly. When you use
`color: :primary, variant: :solid`, the theme applies both `bg-primary` and
`text-primary-foreground` together.

## Customizing the palette

Override CSS custom properties in your Tailwind stylesheet to match your
brand:

```css
@import "tailwindcss";
@import "../builds/tailwind/kiso";

@theme {
  --color-primary: var(--color-violet-600);
  --color-primary-foreground: var(--color-white);
}
```

Every component that uses `bg-primary` or `text-primary` will pick up your
overrides automatically.

## Base body styles

Kiso automatically applies `bg-background text-foreground antialiased` to
`<body>` via `@layer base`. You don't need to add these classes manually —
they switch automatically when `.dark` is toggled.

If you're building custom containers with their own background color,
set `text-foreground` on them so children inherit the correct text color:

```erb
<div class="bg-muted text-foreground">
  <%% # Children will inherit correct text color in dark mode %>
</div>
```
