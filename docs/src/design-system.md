---
title: Design System
layout: docs
description: Spatial scales, typography, color tokens, and structural patterns extracted from shadcn/ui.
---

## Color Tokens

Kiso uses semantic tokens that flip automatically in dark mode via CSS custom
properties. Components never use raw palette shades or `dark:` prefixes.

### Brand Colors

<div class="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
  <div class="space-y-1.5">
    <div class="h-12 rounded-lg" style="background: #2563eb;"></div>
    <p class="text-xs font-medium text-foreground">primary</p>
    <p class="text-xs text-muted-foreground">blue-600 / blue-400</p>
  </div>
  <div class="space-y-1.5">
    <div class="h-12 rounded-lg" style="background: #0d9488;"></div>
    <p class="text-xs font-medium text-foreground">secondary</p>
    <p class="text-xs text-muted-foreground">teal-600 / teal-400</p>
  </div>
  <div class="space-y-1.5">
    <div class="h-12 rounded-lg" style="background: #16a34a;"></div>
    <p class="text-xs font-medium text-foreground">success</p>
    <p class="text-xs text-muted-foreground">green-600 / green-400</p>
  </div>
  <div class="space-y-1.5">
    <div class="h-12 rounded-lg" style="background: #0284c7;"></div>
    <p class="text-xs font-medium text-foreground">info</p>
    <p class="text-xs text-muted-foreground">sky-600 / sky-400</p>
  </div>
  <div class="space-y-1.5">
    <div class="h-12 rounded-lg" style="background: #f59e0b;"></div>
    <p class="text-xs font-medium text-foreground">warning</p>
    <p class="text-xs text-muted-foreground">amber-500 / amber-400</p>
  </div>
  <div class="space-y-1.5">
    <div class="h-12 rounded-lg" style="background: #dc2626;"></div>
    <p class="text-xs font-medium text-foreground">error</p>
    <p class="text-xs text-muted-foreground">red-600 / red-400</p>
  </div>
  <div class="space-y-1.5">
    <div class="h-12 rounded-lg border border-border" style="background: #18181b;"></div>
    <p class="text-xs font-medium text-foreground">neutral</p>
    <p class="text-xs text-muted-foreground">zinc-900 / white</p>
  </div>
</div>

Every color has a `-foreground` companion for accessible text on that
background: `bg-primary text-primary-foreground`.

### Surface Tokens

<div class="not-prose grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
  <div class="space-y-1.5">
    <div class="h-10 rounded-lg border border-border" style="background: #ffffff;"></div>
    <p class="text-xs font-medium text-foreground">background</p>
    <p class="text-xs text-muted-foreground">white / zinc-950</p>
  </div>
  <div class="space-y-1.5">
    <div class="h-10 rounded-lg" style="background: #09090b;"></div>
    <p class="text-xs font-medium text-foreground">foreground</p>
    <p class="text-xs text-muted-foreground">zinc-950 / zinc-50</p>
  </div>
  <div class="space-y-1.5">
    <div class="h-10 rounded-lg border border-border" style="background: #f4f4f5;"></div>
    <p class="text-xs font-medium text-foreground">muted</p>
    <p class="text-xs text-muted-foreground">zinc-100 / zinc-800</p>
  </div>
  <div class="space-y-1.5">
    <div class="h-10 rounded-lg border border-border" style="background: #f4f4f5;"></div>
    <p class="text-xs font-medium text-foreground">elevated</p>
    <p class="text-xs text-muted-foreground">zinc-100 / zinc-800</p>
  </div>
  <div class="space-y-1.5">
    <div class="h-10 rounded-lg" style="background: #18181b;"></div>
    <p class="text-xs font-medium text-foreground">inverted</p>
    <p class="text-xs text-muted-foreground">zinc-900 / white</p>
  </div>
  <div class="space-y-1.5">
    <div class="h-10 rounded-lg border border-border" style="background: #e4e4e7;"></div>
    <p class="text-xs font-medium text-foreground">border</p>
    <p class="text-xs text-muted-foreground">zinc-200 / zinc-800</p>
  </div>
</div>

---

## Typography

All body text is `text-sm`. Titles use `font-semibold` or `font-medium`.
Never go below `text-xs` (12px).

<div class="not-prose space-y-4 my-6 rounded-lg border border-border p-6">
  <div class="flex items-baseline gap-4">
    <code class="shrink-0 text-xs text-muted-foreground w-20">text-lg</code>
    <span class="text-lg font-semibold text-foreground">Dialog Title — The quick brown fox</span>
  </div>
  <div class="flex items-baseline gap-4">
    <code class="shrink-0 text-xs text-muted-foreground w-20">text-base</code>
    <span class="text-base text-foreground">Input text on mobile — The quick brown fox</span>
  </div>
  <div class="flex items-baseline gap-4">
    <code class="shrink-0 text-xs text-muted-foreground w-20">text-sm</code>
    <span class="text-sm text-foreground">Standard body text — The quick brown fox jumps over the lazy dog</span>
  </div>
  <div class="flex items-baseline gap-4">
    <code class="shrink-0 text-xs text-muted-foreground w-20">text-xs</code>
    <span class="text-xs text-foreground">Labels and captions — The quick brown fox jumps over the lazy dog</span>
  </div>
</div>

### Font Weights

<div class="not-prose space-y-3 my-6 rounded-lg border border-border p-6">
  <div class="flex items-baseline gap-4">
    <code class="shrink-0 text-xs text-muted-foreground w-28">font-semibold</code>
    <span class="text-sm font-semibold text-foreground">Primary headings — Card, Dialog, Sheet titles</span>
  </div>
  <div class="flex items-baseline gap-4">
    <code class="shrink-0 text-xs text-muted-foreground w-28">font-medium</code>
    <span class="text-sm font-medium text-foreground">Interactive elements — Buttons, badges, labels, alert titles</span>
  </div>
  <div class="flex items-baseline gap-4">
    <code class="shrink-0 text-xs text-muted-foreground w-28">font-normal</code>
    <span class="text-sm font-normal text-foreground">Body text — Descriptions, content, paragraphs</span>
  </div>
</div>

### Typography Hierarchy

The same title/description pattern repeats across all container components:

| Context | Title | Description |
|---------|-------|-------------|
| Card | `font-semibold leading-none` | `text-sm text-muted-foreground` |
| Dialog / Sheet | `text-lg font-semibold` | `text-sm text-muted-foreground` |
| Alert | `font-medium tracking-tight` | `text-sm text-muted-foreground` |
| Empty state | `text-lg font-medium tracking-tight` | `text-sm text-muted-foreground` |
| Form fields | `text-sm font-medium` | `text-sm text-muted-foreground` |

Inside colored components, description uses `opacity-90` instead of
`text-muted-foreground`.

---

## Heights

Standard interactive height is `h-9`. Scale by 1 in each direction.

<div class="not-prose space-y-3 my-6 rounded-lg border border-border p-6">
  <div class="flex items-center gap-4">
    <code class="shrink-0 text-xs text-muted-foreground w-12">h-6</code>
    <div class="h-6 flex-1 rounded-md bg-primary/15 flex items-center px-3">
      <span class="text-xs text-primary font-medium">xs — 24px</span>
    </div>
  </div>
  <div class="flex items-center gap-4">
    <code class="shrink-0 text-xs text-muted-foreground w-12">h-8</code>
    <div class="h-8 flex-1 rounded-md bg-primary/15 flex items-center px-3">
      <span class="text-xs text-primary font-medium">sm — 32px</span>
    </div>
  </div>
  <div class="flex items-center gap-4">
    <code class="shrink-0 text-xs text-muted-foreground w-12">h-9</code>
    <div class="h-9 flex-1 rounded-md bg-primary/20 flex items-center px-3 ring-2 ring-primary/30">
      <span class="text-sm text-primary font-medium">md (default) — 36px</span>
    </div>
  </div>
  <div class="flex items-center gap-4">
    <code class="shrink-0 text-xs text-muted-foreground w-12">h-10</code>
    <div class="h-10 flex-1 rounded-md bg-primary/15 flex items-center px-3">
      <span class="text-sm text-primary font-medium">lg — 40px</span>
    </div>
  </div>
</div>

---

## Spacing

### Gaps

`gap-2` is the default. Use larger gaps for container-level divisions.

<div class="not-prose space-y-4 my-6 rounded-lg border border-border p-6">
  <div class="flex items-start gap-6">
    <code class="shrink-0 text-xs text-muted-foreground w-14 pt-1">gap-1</code>
    <div class="flex-1">
      <div class="flex gap-1">
        <div class="h-6 w-14 rounded bg-primary/20 flex items-center justify-center"><span class="text-xs text-primary/70">item</span></div>
        <div class="h-6 w-14 rounded bg-primary/20 flex items-center justify-center"><span class="text-xs text-primary/70">item</span></div>
        <div class="h-6 w-14 rounded bg-primary/20 flex items-center justify-center"><span class="text-xs text-primary/70">item</span></div>
      </div>
      <p class="text-xs text-muted-foreground mt-1.5">Tight lists — sidebar menus, accordion</p>
    </div>
  </div>

  <div class="flex items-start gap-6">
    <code class="shrink-0 text-xs text-muted-foreground w-14 pt-1">gap-2</code>
    <div class="flex-1">
      <div class="flex gap-2">
        <div class="h-6 w-14 rounded bg-primary/30 ring-2 ring-primary/30 flex items-center justify-center"><span class="text-xs text-primary/80">item</span></div>
        <div class="h-6 w-14 rounded bg-primary/30 ring-2 ring-primary/30 flex items-center justify-center"><span class="text-xs text-primary/80">item</span></div>
        <div class="h-6 w-14 rounded bg-primary/30 ring-2 ring-primary/30 flex items-center justify-center"><span class="text-xs text-primary/80">item</span></div>
      </div>
      <p class="text-xs text-muted-foreground mt-1.5"><strong>The default</strong> — most sibling elements</p>
    </div>
  </div>

  <div class="flex items-start gap-6">
    <code class="shrink-0 text-xs text-muted-foreground w-14 pt-1">gap-4</code>
    <div class="flex-1">
      <div class="flex gap-4">
        <div class="h-6 w-14 rounded bg-primary/20 flex items-center justify-center"><span class="text-xs text-primary/70">item</span></div>
        <div class="h-6 w-14 rounded bg-primary/20 flex items-center justify-center"><span class="text-xs text-primary/70">item</span></div>
        <div class="h-6 w-14 rounded bg-primary/20 flex items-center justify-center"><span class="text-xs text-primary/70">item</span></div>
      </div>
      <p class="text-xs text-muted-foreground mt-1.5">Between major sections inside a container</p>
    </div>
  </div>

  <div class="flex items-start gap-6">
    <code class="shrink-0 text-xs text-muted-foreground w-14 pt-1">gap-6</code>
    <div class="flex-1">
      <div class="flex gap-6">
        <div class="h-6 w-14 rounded bg-primary/20 flex items-center justify-center"><span class="text-xs text-primary/70">item</span></div>
        <div class="h-6 w-14 rounded bg-primary/20 flex items-center justify-center"><span class="text-xs text-primary/70">item</span></div>
        <div class="h-6 w-14 rounded bg-primary/20 flex items-center justify-center"><span class="text-xs text-primary/70">item</span></div>
      </div>
      <p class="text-xs text-muted-foreground mt-1.5">Top-level container divisions — Card header / content / footer</p>
    </div>
  </div>
</div>

### Padding

<div class="not-prose space-y-4 my-6">
  <div class="flex items-start gap-4">
    <code class="shrink-0 text-xs text-muted-foreground w-20 pt-3">p-2</code>
    <div class="p-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 flex-1">
      <div class="rounded bg-primary/15 p-3 text-xs text-primary font-medium">Compact — Sidebar sections</div>
    </div>
  </div>
  <div class="flex items-start gap-4">
    <code class="shrink-0 text-xs text-muted-foreground w-20 pt-4">p-4</code>
    <div class="p-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 flex-1">
      <div class="rounded bg-primary/15 p-3 text-xs text-primary font-medium">Medium — Sheet, Popover, Drawer</div>
    </div>
  </div>
  <div class="flex items-start gap-4">
    <code class="shrink-0 text-xs text-muted-foreground w-20 pt-6">p-6</code>
    <div class="p-6 rounded-lg border border-dashed border-primary/40 bg-primary/5 flex-1">
      <div class="rounded bg-primary/15 p-3 text-xs text-primary font-medium">Large — Card, Dialog</div>
    </div>
  </div>
</div>

---

## Border Radius

<div class="not-prose grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
  <div class="space-y-2 text-center">
    <div class="h-16 w-full rounded-md bg-primary/15 border border-primary/30"></div>
    <code class="text-xs text-muted-foreground">rounded-md</code>
    <p class="text-xs text-muted-foreground">Interactive elements</p>
  </div>
  <div class="space-y-2 text-center">
    <div class="h-16 w-full rounded-lg bg-primary/15 border border-primary/30"></div>
    <code class="text-xs text-muted-foreground">rounded-lg</code>
    <p class="text-xs text-muted-foreground">Medium containers</p>
  </div>
  <div class="space-y-2 text-center">
    <div class="h-16 w-full rounded-xl bg-primary/15 border border-primary/30"></div>
    <code class="text-xs text-muted-foreground">rounded-xl</code>
    <p class="text-xs text-muted-foreground">Major containers</p>
  </div>
  <div class="space-y-2 text-center">
    <div class="h-16 w-full rounded-full bg-primary/15 border border-primary/30"></div>
    <code class="text-xs text-muted-foreground">rounded-full</code>
    <p class="text-xs text-muted-foreground">Pills &amp; circles</p>
  </div>
</div>

No per-size variation. A button is `rounded-md` at every size.

| Value | Component type | Examples |
|-------|---------------|----------|
| `rounded-xl` | Major containers | Card |
| `rounded-lg` | Medium containers | Alert, Dialog, Empty state |
| `rounded-md` | Interactive elements | Button, Input, Select, Toggle |
| `rounded-full` | Pills & circles | Badge, Avatar, Switch |

---

## Icon Sizing

<div class="not-prose flex items-end gap-8 my-6 rounded-lg border border-border p-6">
  <div class="text-center space-y-2">
    <div class="flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-3 text-foreground">
        <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd" />
      </svg>
    </div>
    <code class="text-xs text-muted-foreground">size-3</code>
    <p class="text-xs text-muted-foreground">12px</p>
    <p class="text-xs text-muted-foreground">Compact</p>
  </div>
  <div class="text-center space-y-2">
    <div class="flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4 text-foreground">
        <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd" />
      </svg>
    </div>
    <code class="text-xs text-muted-foreground">size-4</code>
    <p class="text-xs text-muted-foreground">16px</p>
    <p class="text-xs text-muted-foreground"><strong>Standard</strong></p>
  </div>
  <div class="text-center space-y-2">
    <div class="flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5 text-foreground">
        <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd" />
      </svg>
    </div>
    <code class="text-xs text-muted-foreground">size-5</code>
    <p class="text-xs text-muted-foreground">20px</p>
    <p class="text-xs text-muted-foreground">Larger</p>
  </div>
</div>

Default selector: `[&_svg:not([class*='size-'])]:size-4` — provides a
`size-4` fallback while allowing explicit overrides.

---

## Container Patterns

These internal spacing patterns are consistent across all container components.

### Card

<div class="not-prose my-6">
  <div class="rounded-xl border border-border shadow-sm py-6 flex flex-col gap-6 bg-background">
    <div class="px-6 flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold text-foreground">CardTitle</span>
        <code class="text-xs text-muted-foreground">font-semibold leading-none</code>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted-foreground">CardDescription</span>
        <code class="text-xs text-muted-foreground">text-sm text-muted-foreground</code>
      </div>
    </div>
    <div class="px-6">
      <div class="h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
        <span class="text-xs text-muted-foreground">CardContent — px-6</span>
      </div>
    </div>
    <div class="px-6 flex items-center">
      <div class="h-9 flex-1 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
        <span class="text-xs text-muted-foreground">CardFooter — px-6, flex, items-center</span>
      </div>
    </div>
  </div>
  <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
    <span>Card: <code>py-6, gap-6, rounded-xl, border, shadow-sm</code></span>
    <span>Header: <code>px-6, gap-2</code></span>
    <span>Content: <code>px-6</code></span>
    <span>Footer: <code>px-6</code></span>
  </div>
</div>

### Dialog

<div class="not-prose my-6">
  <div class="rounded-lg border border-border shadow-lg p-6 flex flex-col gap-4 bg-background max-w-md">
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <span class="text-lg font-semibold text-foreground">DialogTitle</span>
        <code class="text-xs text-muted-foreground">text-lg font-semibold</code>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted-foreground">DialogDescription</span>
        <code class="text-xs text-muted-foreground">text-sm text-muted-foreground</code>
      </div>
    </div>
    <div class="h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
      <span class="text-xs text-muted-foreground">Body content</span>
    </div>
    <div class="flex justify-end gap-2">
      <div class="h-9 px-4 rounded-md border border-border flex items-center justify-center">
        <span class="text-sm text-muted-foreground font-medium">Cancel</span>
      </div>
      <div class="h-9 px-4 rounded-md flex items-center justify-center" style="background: #2563eb;">
        <span class="text-sm text-white font-medium">Confirm</span>
      </div>
    </div>
  </div>
  <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
    <span>Dialog: <code>p-6, gap-4, rounded-lg</code></span>
    <span>Header: <code>gap-2</code></span>
    <span>Footer: <code>gap-2</code></span>
  </div>
</div>

### Sheet / Drawer

<div class="not-prose my-6">
  <div class="rounded-lg border border-border shadow-lg flex flex-col gap-4 bg-background max-w-sm">
    <div class="p-4 flex flex-col gap-1.5 border-b border-border">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold text-foreground">SheetTitle</span>
        <code class="text-xs text-muted-foreground">font-semibold</code>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted-foreground">SheetDescription</span>
        <code class="text-xs text-muted-foreground">text-sm</code>
      </div>
    </div>
    <div class="px-4 flex-1">
      <div class="h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
        <span class="text-xs text-muted-foreground">Body content</span>
      </div>
    </div>
    <div class="p-4 flex justify-end gap-2 border-t border-border mt-auto">
      <div class="h-9 px-4 rounded-md border border-border flex items-center justify-center">
        <span class="text-sm text-muted-foreground font-medium">Close</span>
      </div>
    </div>
  </div>
  <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
    <span>Sheet: <code>gap-4</code></span>
    <span>Header: <code>p-4, gap-1.5</code></span>
    <span>Footer: <code>p-4, gap-2, mt-auto</code></span>
  </div>
</div>

---

## Compound Variants

Every colored component uses identical compound variant formulas. Only base
classes change per component.

### The Four Variant Axes

<div class="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
  <div class="space-y-2 text-center">
    <div class="h-9 rounded-md flex items-center justify-center text-sm font-medium text-white" style="background: #2563eb;">Solid</div>
    <code class="text-xs text-muted-foreground block">bg-{color}</code>
    <code class="text-xs text-muted-foreground block">text-{color}-foreground</code>
  </div>
  <div class="space-y-2 text-center">
    <div class="h-9 rounded-md flex items-center justify-center text-sm font-medium ring ring-inset" style="color: #2563eb; --tw-ring-color: rgb(37 99 235 / 0.5);">Outline</div>
    <code class="text-xs text-muted-foreground block">text-{color}</code>
    <code class="text-xs text-muted-foreground block">ring-{color}/50</code>
  </div>
  <div class="space-y-2 text-center">
    <div class="h-9 rounded-md flex items-center justify-center text-sm font-medium" style="background: rgb(37 99 235 / 0.1); color: #2563eb;">Soft</div>
    <code class="text-xs text-muted-foreground block">bg-{color}/10</code>
    <code class="text-xs text-muted-foreground block">text-{color}</code>
  </div>
  <div class="space-y-2 text-center">
    <div class="h-9 rounded-md flex items-center justify-center text-sm font-medium ring ring-inset" style="background: rgb(37 99 235 / 0.1); color: #2563eb; --tw-ring-color: rgb(37 99 235 / 0.25);">Subtle</div>
    <code class="text-xs text-muted-foreground block">bg-{color}/10</code>
    <code class="text-xs text-muted-foreground block">ring-{color}/25</code>
  </div>
</div>

### Opacity Conventions

| Value | Usage |
|-------|-------|
| `/50` | Outline ring opacity |
| `/25` | Subtle ring opacity |
| `/10` | Soft/subtle background tint |
| `opacity-90` | Secondary/description text inside colored components |

---

## Size Variant Reference

When Kiso adds size variants that shadcn doesn't have, use values from the
established scales. This table is the reference for xs through xl:

| Size | Padding | Font | Icon | Gap | Radius |
|------|---------|------|------|-----|--------|
| xs | `px-2 py-0.5` | `text-xs` | `size-3` | `gap-1` | (component default) |
| sm | `px-2.5 py-0.5` | `text-xs` | `size-3` | `gap-1` | (component default) |
| md | `px-3 py-1` | `text-xs` | `size-3.5` | `gap-1.5` | (component default) |
| lg | `px-3.5 py-1` | `text-sm` | `size-4` | `gap-1.5` | (component default) |
| xl | `px-4 py-1.5` | `text-sm` | `size-4` | `gap-2` | (component default) |

Not every component needs all 5 sizes. Most should match shadcn and use a
single size or 2-3 variants (sm, default, lg).
