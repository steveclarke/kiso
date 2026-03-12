# Progress Component Design

**Issue:** #152
**Date:** 2026-03-12

## Summary

A visual progress bar showing task completion percentage, with optional status
text and step labels. Modeled after Nuxt UI's full-featured Progress with
shadcn aesthetics. Div-based structure (not native `<progress>`) for full
Tailwind control. Pure CSS — no Stimulus controller.

## API

```erb
<%# Basic %>
<%= kui(:progress, value: 33) %>

<%# Color + size %>
<%= kui(:progress, value: 75, color: :success, size: :lg) %>

<%# Indeterminate (no value) %>
<%= kui(:progress) %>

<%# With status percentage text %>
<%= kui(:progress, value: 60, status: true) %>

<%# With step labels (max as array) %>
<%= kui(:progress, value: 1, max: ["Sign Up", "Profile", "Complete"]) %>

<%# Inverted fill direction %>
<%= kui(:progress, value: 40, inverted: true) %>

<%# Animation variant for indeterminate %>
<%= kui(:progress, animation: :swing) %>
```

## HTML Structure

```html
<!-- Root wrapper -->
<div data-slot="progress" data-orientation="horizontal">

  <!-- Status text (conditional: when status: true and not indeterminate) -->
  <div data-slot="progress-status" style="width: 60%">
    60%
  </div>

  <!-- Track bar (role on track, not root, because root wraps non-progressbar
       content like status text and step labels) -->
  <div data-slot="progress-track"
       role="progressbar"
       aria-valuenow="60"
       aria-valuemin="0"
       aria-valuemax="100">
    <!-- Indicator (fill) -->
    <div data-slot="progress-indicator"
         data-state="loading"
         style="transform: translateX(-40%)">
    </div>
  </div>

  <!-- Steps (conditional: when max is an array) -->
  <div data-slot="progress-steps">
    <div data-slot="progress-step">Sign Up</div>
    <div data-slot="progress-step">Profile</div>
    <div data-slot="progress-step">Complete</div>
  </div>
</div>
```

Indeterminate state: omit `value:`, set `data-state="indeterminate"` on the
indicator, omit `aria-valuenow`.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | Integer or nil | nil | 0–max. nil = indeterminate |
| `max` | Integer or Array | 100 | Numeric max or array of step labels |
| `status` | Boolean | false | Show percentage text above bar |
| `color` | Symbol | :primary | primary, secondary, success, info, warning, error, neutral |
| `size` | Symbol | :md | xs, sm, md, lg, xl |
| `animation` | Symbol | :carousel | carousel, carousel_inverse, swing, elastic (Ruby snake_case; CSS keyframes use kebab-case) |
| `orientation` | Symbol | :horizontal | horizontal, vertical |
| `inverted` | Boolean | false | Reverse fill direction |
| `ui` | Hash | {} | Per-slot class overrides |
| `css_classes` | String | "" | Root element override |

## Theme Module

Six constants in `lib/kiso/themes/progress.rb`:

### Progress (root)

```ruby
# shadcn base: (no direct equivalent — shadcn wraps in Radix ProgressRoot)
Progress = ClassVariants.build(
  base: "text-foreground gap-2",
  variants: {
    orientation: {
      horizontal: "w-full flex flex-col",
      vertical: "h-full flex flex-row-reverse"
    }
  },
  defaults: { orientation: :horizontal }
)
```

### ProgressTrack

```ruby
# shadcn base: bg-primary/20 relative h-2 w-full overflow-hidden rounded-full
ProgressTrack = ClassVariants.build(
  base: "relative overflow-hidden rounded-full bg-accented",
  variants: {
    orientation: {
      horizontal: "w-full",
      vertical: "h-full"
    },
    size: {
      xs: "", sm: "", md: "", lg: "", xl: ""
    }
  },
  compound_variants: [
    # horizontal sizes (height)
    { orientation: :horizontal, size: :xs, class: "h-0.5" },
    { orientation: :horizontal, size: :sm, class: "h-1" },
    { orientation: :horizontal, size: :md, class: "h-2" },
    { orientation: :horizontal, size: :lg, class: "h-3" },
    { orientation: :horizontal, size: :xl, class: "h-4" },
    # vertical sizes (width)
    { orientation: :vertical, size: :xs, class: "w-0.5" },
    { orientation: :vertical, size: :sm, class: "w-1" },
    { orientation: :vertical, size: :md, class: "w-2" },
    { orientation: :vertical, size: :lg, class: "w-3" },
    { orientation: :vertical, size: :xl, class: "w-4" }
  ],
  defaults: { orientation: :horizontal, size: :md }
)
```

### ProgressIndicator

```ruby
# shadcn base: bg-primary h-full w-full flex-1 transition-all
ProgressIndicator = ClassVariants.build(
  base: "rounded-full size-full transition-transform duration-200 ease-out",
  variants: {
    color: {
      primary: "bg-primary",
      secondary: "bg-secondary",
      success: "bg-success",
      info: "bg-info",
      warning: "bg-warning",
      error: "bg-error",
      neutral: "bg-inverted"
    }
  },
  defaults: { color: :primary }
)
```

No compound variant matrix needed — Progress doesn't have a variant axis
(solid/outline/soft/subtle). Colors map directly to `bg-{color}`.

### ProgressStatus

```ruby
ProgressStatus = ClassVariants.build(
  base: "flex text-muted-foreground transition-[width] duration-200",
  variants: {
    orientation: {
      horizontal: "flex-row items-center justify-end min-w-fit",
      vertical: "flex-col justify-end min-h-fit"
    },
    size: {
      xs: "text-xs", sm: "text-xs", md: "text-sm", lg: "text-sm", xl: "text-base"
    }
  },
  defaults: { orientation: :horizontal, size: :md }
)
```

### ProgressSteps

```ruby
ProgressSteps = ClassVariants.build(
  base: "grid items-end",
  variants: {
    color: {
      primary: "text-primary",
      secondary: "text-secondary",
      success: "text-success",
      info: "text-info",
      warning: "text-warning",
      error: "text-error",
      # text-inverted (not text-inverted-foreground) — step labels sit on the
      # page background, so we want dark-on-light / light-on-dark text.
      neutral: "text-inverted"
    },
    size: {
      xs: "text-xs", sm: "text-xs", md: "text-sm", lg: "text-sm", xl: "text-base"
    }
  },
  defaults: { color: :primary, size: :md }
)
```

### ProgressStep

```ruby
ProgressStep = ClassVariants.build(
  base: "truncate text-end row-start-1 col-start-1 transition-opacity",
  variants: {
    step: {
      active: "opacity-100",
      first: "opacity-100 opacity-50",  # inherits parent text-{color} at reduced opacity
      other: "opacity-0",
      last: ""
    }
  },
  defaults: { step: :other }
)
```

Steps stack in the same grid cell via `row-start-1 col-start-1`. Only the
active step is visible (opacity-100), others are hidden (opacity-0). This
ensures the grid cell is always sized to the widest label.

## Indeterminate Animations (CSS)

File: `app/assets/tailwind/kiso/progress.css`

10 `@keyframes` definitions:

1. `carousel` (horizontal LTR)
2. `carousel-rtl` (horizontal RTL)
3. `carousel-vertical`
4. `carousel-inverse` (horizontal LTR)
5. `carousel-inverse-rtl` (horizontal RTL)
6. `carousel-inverse-vertical`
7. `swing` (horizontal)
8. `swing-vertical`
9. `elastic` (horizontal)
10. `elastic-vertical`

Applied via compound variants in the indicator theme when
`data-state="indeterminate"`.

The ERB partial adds animation classes to the indicator only when value is
nil. Animation class format:
`data-[state=indeterminate]:animate-[carousel_2s_ease-in-out_infinite]`

These classes are added as compound variants in ProgressIndicator based on
orientation × animation. Since Tailwind v4 handles `@keyframes` in CSS
files, the animation names just need to be defined in progress.css.

## Inverted Behavior

When `inverted: true`:
- Indicator transform: `translateX(+N%)` instead of `translateX(-N%)`
  (or `translateY` for vertical)
- Status: `self-end` + reversed flex direction
- Steps: reversed text alignment

Implemented via compound variants on orientation × inverted.

## ARIA

- `role="progressbar"` on the track (`progress-track`)
- `aria-valuenow` = current value (omitted when indeterminate)
- `aria-valuemin` = 0
- `aria-valuemax` = numeric max
- `aria-label` passed through from prop

## i18n

```yaml
en:
  kiso:
    progress:
      label: "Progress"
```

Minimal — the component is primarily visual. Label used as fallback
`aria-label` when none is provided.

## Presets

- **rounded**: no change needed (already `rounded-full`)
- **sharp**: `rounded-full` → `rounded-none` on track + indicator

## Deliverables

1. Theme module: `lib/kiso/themes/progress.rb`
2. ERB partial: `app/views/kiso/components/_progress.html.erb`
3. CSS file: `app/assets/tailwind/kiso/progress.css`
4. Lookbook preview: `test/components/previews/kiso/progress_preview.rb`
5. Docs page: `docs/src/components/progress.md`
6. Presets: entries in `rounded.rb` and `sharp.rb`
7. i18n: entry in `config/locales/en.yml`
8. E2E: entry in dark-mode COMPONENTS array
9. Skills reference: entry in `skills/kiso/references/components.md`
10. Navigation: entry in `docs/src/_data/navigation.yml`

## Out of Scope (Follow-up)

- 2xs and 2xl sizes (Nuxt UI has 7, we use 5)
- RTL animation variants (add when RTL support is needed)
- Custom status slot content (yield block for status area)
- Vertical orientation rendering in Lookbook (preview with horizontal only initially; vertical theme classes ship but preview deferred)
