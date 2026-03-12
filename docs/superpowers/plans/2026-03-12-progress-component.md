# Progress Component Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a full-featured Progress bar component (#152) with color/size/animation/orientation axes, status text, step labels, and indeterminate animation.

**Architecture:** Div-based (shadcn structure) with Nuxt UI theming. Six theme constants, one ERB partial, one CSS file for indeterminate `@keyframes`. No Stimulus controller — pure CSS.

**Tech Stack:** Ruby (ClassVariants theme), ERB partial, Tailwind CSS v4, CSS keyframes

**Spec:** `docs/superpowers/specs/2026-03-12-progress-component-design.md`

---

## Chunk 1: Core (theme + partial + CSS)

### Task 1: Theme module

**Files:**
- Create: `lib/kiso/themes/progress.rb`
- Modify: `lib/kiso.rb` (add require)

- [ ] **Step 1: Create the theme module**

```ruby
# lib/kiso/themes/progress.rb
module Kiso
  module Themes
    # Visual progress bar with color, size, and orientation axes.
    #
    # Div-based structure (not native <progress>) for full Tailwind control.
    # Optional status percentage text and step labels (when +max:+ is an array).
    # Indeterminate animation when +value:+ is nil.
    #
    # @example
    #   Progress.render(orientation: :horizontal)
    #
    # Variants:
    # - +orientation+ — :horizontal (default), :vertical
    #
    # Sub-parts: {ProgressTrack}, {ProgressIndicator}, {ProgressStatus},
    #            {ProgressSteps}, {ProgressStep}
    #
    # shadcn base: (no direct equivalent — shadcn wraps in Radix ProgressRoot)
    Progress = ClassVariants.build(
      base: "text-foreground gap-2",
      variants: {
        orientation: {
          horizontal: "w-full flex flex-col",
          vertical: "h-full flex flex-row-reverse"
        }
      },
      defaults: {orientation: :horizontal}
    )

    # Track (bar background) with orientation × size compound variants.
    #
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
        # == horizontal sizes (height) ==
        {orientation: :horizontal, size: :xs, class: "h-0.5"},
        {orientation: :horizontal, size: :sm, class: "h-1"},
        {orientation: :horizontal, size: :md, class: "h-2"},
        {orientation: :horizontal, size: :lg, class: "h-3"},
        {orientation: :horizontal, size: :xl, class: "h-4"},
        # == vertical sizes (width) ==
        {orientation: :vertical, size: :xs, class: "w-0.5"},
        {orientation: :vertical, size: :sm, class: "w-1"},
        {orientation: :vertical, size: :md, class: "w-2"},
        {orientation: :vertical, size: :lg, class: "w-3"},
        {orientation: :vertical, size: :xl, class: "w-4"}
      ],
      defaults: {orientation: :horizontal, size: :md}
    )

    # Indicator (fill bar) — color axis maps directly to bg-{color}.
    # No variant axis (solid/outline/soft/subtle) — just direct color.
    #
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
      defaults: {color: :primary}
    )

    # Status text showing percentage above/beside the bar.
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
      defaults: {orientation: :horizontal, size: :md}
    )

    # Container for step labels — grid overlay technique.
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
          # text-inverted (not text-inverted-foreground) — step labels sit on
          # the page background, so we want dark-on-light / light-on-dark text.
          neutral: "text-inverted"
        },
        size: {
          xs: "text-xs", sm: "text-xs", md: "text-sm", lg: "text-sm", xl: "text-base"
        }
      },
      defaults: {color: :primary, size: :md}
    )

    # Individual step label — stacked in same grid cell via row/col-start-1.
    # Only the active step is visible (opacity-100), others hidden (opacity-0).
    ProgressStep = ClassVariants.build(
      base: "truncate text-end row-start-1 col-start-1 transition-opacity",
      variants: {
        step: {
          active: "opacity-100",
          first: "opacity-50",
          other: "opacity-0",
          last: ""
        }
      },
      defaults: {step: :other}
    )
  end
end
```

- [ ] **Step 2: Add require to lib/kiso.rb**

Add after the `require "kiso/themes/slider"` line:

```ruby
require "kiso/themes/progress"
```

- [ ] **Step 3: Verify theme loads**

Run: `bundle exec ruby -e "require 'kiso'; puts Kiso::Themes::Progress.render(orientation: :horizontal)"`
Expected: outputs class string containing `text-foreground gap-2 w-full flex flex-col`

- [ ] **Step 4: Commit**

```bash
git add lib/kiso/themes/progress.rb lib/kiso.rb
git commit -m "feat(progress): Add theme module with 6 constants

Progress, ProgressTrack, ProgressIndicator, ProgressStatus,
ProgressSteps, ProgressStep. Color/size/orientation axes with
compound variants for orientation × size on the track.

Part of #152"
```

### Task 2: ERB partial

**Files:**
- Create: `app/views/kiso/components/_progress.html.erb`

- [ ] **Step 1: Create the partial**

```erb
<%# locals: (value: nil, max: 100, status: false, color: :primary, size: :md, animation: :carousel, orientation: :horizontal, inverted: false, ui: {}, css_classes: "", **component_options) %>
<%# Div-based progress bar with optional status text and step labels.
    Indeterminate state when value: is nil (animated indicator via CSS).
    Steps mode when max: is an array of labels. %>
<% is_indeterminate = value.nil? %>
<% has_steps = max.is_a?(Array) %>
<% real_max = has_steps ? max.length - 1 : max %>
<% percent = is_indeterminate ? 0 : ((value.to_f / real_max) * 100).clamp(0, 100) %>
<%
  # Indeterminate animation class (applied to indicator via CSS data-state selector)
  animation_keyframes = {
    carousel: "carousel", carousel_inverse: "carousel-inverse",
    swing: "swing", elastic: "elastic"
  }
  anim_name = animation_keyframes[animation] || "carousel"
  vertical = orientation == :vertical

  # Indicator transform
  if is_indeterminate
    indicator_style = ""
  elsif vertical
    indicator_style = inverted ? "transform: translateY(#{100 - percent}%)" : "transform: translateY(-#{100 - percent}%)"
  else
    indicator_style = inverted ? "transform: translateX(#{100 - percent}%)" : "transform: translateX(-#{100 - percent}%)"
  end

  # Status style (width/height tracks the percentage)
  if vertical
    status_style = "height: #{percent}%"
  else
    status_style = "width: #{percent}%"
  end

  # Indeterminate animation class on indicator
  if is_indeterminate && vertical
    anim_class = "animate-[#{anim_name}-vertical_2s_ease-in-out_infinite]"
  elsif is_indeterminate
    anim_class = "animate-[#{anim_name}_2s_ease-in-out_infinite]"
  else
    anim_class = ""
  end
%>
<%= content_tag :div,
    class: Kiso::Themes::Progress.render(orientation: orientation, class: css_classes),
    data: kiso_prepare_options(component_options, slot: "progress", orientation: orientation),
    **component_options do %>
  <% unless is_indeterminate || !status %>
    <%= tag.div(
        class: Kiso::Themes::ProgressStatus.render(orientation: orientation, size: size, class: ui[:status]),
        style: status_style,
        data: {slot: "progress-status"}) do %>
      <%= "#{percent.round}%" %>
    <% end %>
  <% end %>
  <%= tag.div(
      class: Kiso::Themes::ProgressTrack.render(orientation: orientation, size: size, class: ui[:track]),
      role: "progressbar",
      aria: {
        valuenow: (is_indeterminate ? nil : value),
        valuemin: 0,
        valuemax: real_max,
        label: component_options.dig(:aria, :label) || t("kiso.progress.label")
      },
      style: "transform: translateZ(0)",
      data: {slot: "progress-track"}) do %>
    <%= tag.div(
        class: [Kiso::Themes::ProgressIndicator.render(color: color, class: ui[:indicator]), anim_class].compact_blank.join(" "),
        style: indicator_style.presence,
        data: {
          slot: "progress-indicator",
          state: is_indeterminate ? "indeterminate" : "loading"
        }) %>
  <% end %>
  <% if has_steps %>
    <%= tag.div(
        class: Kiso::Themes::ProgressSteps.render(color: color, size: size, class: ui[:steps]),
        data: {slot: "progress-steps"}) do %>
      <% max.each_with_index do |step_label, index| %>
        <%
          step_variant = if index == value && index == 0
            :first
          elsif index == value && index == real_max
            :last
          elsif index == value
            :active
          else
            :other
          end
        %>
        <%= tag.div(step_label,
            class: Kiso::Themes::ProgressStep.render(step: step_variant, class: ui[:step]),
            data: {slot: "progress-step"}) %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

- [ ] **Step 2: Verify partial renders**

Start Lookbook if not running: `bin/dev`
Test in Rails console:
```ruby
app.get "/lookbook"
# Should load without errors — partial isn't wired to a preview yet
```

- [ ] **Step 3: Commit**

```bash
git add app/views/kiso/components/_progress.html.erb
git commit -m "feat(progress): Add ERB partial

Div-based progress bar with status text, step labels,
indeterminate animation, and orientation support.

Part of #152"
```

### Task 3: CSS keyframes for indeterminate animations

**Files:**
- Create: `app/assets/tailwind/kiso/progress.css`
- Modify: `app/assets/tailwind/kiso/engine.css` (add import)

- [ ] **Step 1: Create progress.css**

```css
/* ── Progress ─────────────────────────────────────────────────────────
 * Indeterminate animation keyframes for the progress indicator.
 * 10 keyframes: 4 animation styles × horizontal/vertical (+2 RTL).
 *
 * Why CSS: @keyframes definitions and prefers-reduced-motion media
 * queries cannot be expressed in ERB/Tailwind utilities.
 * ──────────────────────────────────────────────────────────────────── */

/* === Carousel === */

@keyframes carousel {
  0%, 100% { width: 50%; transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}

@keyframes carousel-rtl {
  0%, 100% { width: 50%; transform: translateX(100%); }
  100% { transform: translateX(-200%); }
}

@keyframes carousel-vertical {
  0%, 100% { height: 50%; transform: translateY(-100%); }
  100% { transform: translateY(200%); }
}

/* === Carousel Inverse === */

@keyframes carousel-inverse {
  0%, 100% { width: 50%; transform: translateX(200%); }
  100% { transform: translateX(-100%); }
}

@keyframes carousel-inverse-rtl {
  0%, 100% { width: 50%; transform: translateX(-200%); }
  100% { transform: translateX(100%); }
}

@keyframes carousel-inverse-vertical {
  0%, 100% { height: 50%; transform: translateY(200%); }
  100% { transform: translateY(-100%); }
}

/* === Swing === */

@keyframes swing {
  0%, 100% { width: 50%; transform: translateX(-25%); }
  50% { transform: translateX(125%); }
}

@keyframes swing-vertical {
  0%, 100% { height: 50%; transform: translateY(-25%); }
  50% { transform: translateY(125%); }
}

/* === Elastic === */

@keyframes elastic {
  0%, 100% { width: 50%; margin-left: 25%; }
  50% { width: 90%; margin-left: 5%; }
}

@keyframes elastic-vertical {
  0%, 100% { height: 50%; margin-top: 25%; }
  50% { height: 90%; margin-top: 5%; }
}

/* === Reduced motion === */

@media (prefers-reduced-motion: reduce) {
  [data-slot="progress-indicator"][data-state="indeterminate"] {
    animation-duration: 0s !important;
  }
}
```

- [ ] **Step 2: Add import to engine.css**

Add after the `@import "./tooltip.css";` line in `app/assets/tailwind/kiso/engine.css`:

```css
@import "./progress.css";
```

- [ ] **Step 3: Commit**

```bash
git add app/assets/tailwind/kiso/progress.css app/assets/tailwind/kiso/engine.css
git commit -m "feat(progress): Add CSS keyframes for indeterminate animations

10 keyframes: carousel, carousel-inverse, swing, elastic in
horizontal + vertical. Includes prefers-reduced-motion safety.

Part of #152"
```

### Task 4: i18n, presets, require wiring

**Files:**
- Modify: `config/locales/en.yml`
- Modify: `lib/kiso/presets/sharp.rb`

- [ ] **Step 1: Add i18n entry**

Add to `config/locales/en.yml` after the `pagination:` block (alphabetical):

```yaml
    progress:
      label: "Progress"
```

- [ ] **Step 2: Add sharp preset entry**

Add to `lib/kiso/presets/sharp.rb` inside the `SHARP` hash (after the `slider_thumb` entry):

```ruby
      # Progress: rounded-full → rounded-none
      progress_track: {base: "rounded-none"},
      progress_indicator: {base: "rounded-none"},
```

No rounded preset entry needed — already `rounded-full`.

- [ ] **Step 3: Commit**

```bash
git add config/locales/en.yml lib/kiso/presets/sharp.rb
git commit -m "feat(progress): Add i18n label and sharp preset

Part of #152"
```

## Chunk 2: Previews, docs, and integration

### Task 5: Lookbook preview

**Files:**
- Create: `test/components/previews/kiso/progress_preview.rb`
- Create: `test/components/previews/kiso/progress_preview/playground.html.erb`
- Create: `test/components/previews/kiso/progress_preview/colors.html.erb`
- Create: `test/components/previews/kiso/progress_preview/sizes.html.erb`
- Create: `test/components/previews/kiso/progress_preview/indeterminate.html.erb`
- Create: `test/components/previews/kiso/progress_preview/status.html.erb`
- Create: `test/components/previews/kiso/progress_preview/steps.html.erb`

- [ ] **Step 1: Create preview class**

```ruby
# test/components/previews/kiso/progress_preview.rb
module Kiso
  # @label Progress
  class ProgressPreview < Lookbook::Preview
    # @label Playground
    # @param value range { min: 0, max: 100, step: 1 }
    # @param color select { choices: [primary, secondary, success, info, warning, error, neutral] }
    # @param size select { choices: [xs, sm, md, lg, xl] }
    # @param status toggle
    # @param animation select { choices: [carousel, carousel_inverse, swing, elastic] }
    def playground(value: 33, color: :primary, size: :md, status: false, animation: :carousel)
      render_with_template(locals: {
        value: value.to_i,
        color: color.to_sym,
        size: size.to_sym,
        status: ActiveModel::Type::Boolean.new.cast(status),
        animation: animation.to_sym
      })
    end

    # @label Colors
    def colors
      render_with_template
    end

    # @label Sizes
    def sizes
      render_with_template
    end

    # @label Indeterminate
    def indeterminate
      render_with_template
    end

    # @label Status
    def status
      render_with_template
    end

    # @label Steps
    def steps
      render_with_template
    end
  end
end
```

- [ ] **Step 2: Create preview templates**

`playground.html.erb`:
```erb
<div class="w-80">
  <%= kui(:progress, value: value, color: color, size: size, status: status, animation: animation) %>
</div>
```

`colors.html.erb`:
```erb
<div class="flex flex-col gap-6 w-80">
  <%= kui(:progress, value: 60, color: :primary) %>
  <%= kui(:progress, value: 60, color: :secondary) %>
  <%= kui(:progress, value: 60, color: :success) %>
  <%= kui(:progress, value: 60, color: :info) %>
  <%= kui(:progress, value: 60, color: :warning) %>
  <%= kui(:progress, value: 60, color: :error) %>
  <%= kui(:progress, value: 60, color: :neutral) %>
</div>
```

`sizes.html.erb`:
```erb
<div class="flex flex-col gap-6 w-80">
  <%= kui(:progress, value: 60, size: :xs) %>
  <%= kui(:progress, value: 60, size: :sm) %>
  <%= kui(:progress, value: 60, size: :md) %>
  <%= kui(:progress, value: 60, size: :lg) %>
  <%= kui(:progress, value: 60, size: :xl) %>
</div>
```

`indeterminate.html.erb`:
```erb
<div class="flex flex-col gap-6 w-80">
  <%= kui(:progress, animation: :carousel) %>
  <%= kui(:progress, animation: :carousel_inverse) %>
  <%= kui(:progress, animation: :swing) %>
  <%= kui(:progress, animation: :elastic) %>
</div>
```

`status.html.erb`:
```erb
<div class="flex flex-col gap-6 w-80">
  <%= kui(:progress, value: 25, status: true) %>
  <%= kui(:progress, value: 60, status: true, color: :success) %>
  <%= kui(:progress, value: 90, status: true, color: :warning, size: :lg) %>
</div>
```

`steps.html.erb`:
```erb
<div class="flex flex-col gap-6 w-80">
  <%= kui(:progress, value: 0, max: ["Sign Up", "Profile", "Complete"]) %>
  <%= kui(:progress, value: 1, max: ["Sign Up", "Profile", "Complete"], color: :success) %>
  <%= kui(:progress, value: 2, max: ["Sign Up", "Profile", "Complete"], color: :info) %>
</div>
```

- [ ] **Step 3: Verify in Lookbook**

Open: `http://localhost:4001/preview/kiso/progress/playground`
Verify: playground renders with range slider control, all scenarios render.

- [ ] **Step 4: Commit**

```bash
git add test/components/previews/kiso/progress_preview.rb test/components/previews/kiso/progress_preview/
git commit -m "feat(progress): Add Lookbook previews

Playground with controls, colors, sizes, indeterminate animations,
status text, and step labels scenarios.

Part of #152"
```

### Task 6: Docs page

**Files:**
- Create: `docs/src/components/progress.md`
- Modify: `docs/src/_data/navigation.yml`

- [ ] **Step 1: Create docs page**

```markdown
---
title: Progress
layout: docs
description: A visual progress bar showing task completion with color, size, and animation variants.
category: Element
source: lib/kiso/themes/progress.rb
---

## Quick Start

\```erb
<%%= kui(:progress, value: 33) %>
\```

<%%= render "component_preview", component: "kiso/progress", scenario: "playground" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `value:` | `Integer` or `nil` | `nil` (indeterminate) |
| `max:` | `Integer` or `Array` | `100` |
| `status:` | `Boolean` | `false` |
| `color:` | `Symbol` | `:primary` |
| `size:` | `Symbol` | `:md` |
| `animation:` | `Symbol` | `:carousel` |
| `orientation:` | `Symbol` | `:horizontal` |
| `inverted:` | `Boolean` | `false` |
| `ui:` | `Hash` | `{}` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

### Color

\```erb
<%%= kui(:progress, value: 60, color: :primary) %>
<%%= kui(:progress, value: 60, color: :success) %>
<%%= kui(:progress, value: 60, color: :error) %>
\```

<%%= render "component_preview", component: "kiso/progress", scenario: "colors" %>

### Size

\```erb
<%%= kui(:progress, value: 60, size: :xs) %>
<%%= kui(:progress, value: 60, size: :md) %>
<%%= kui(:progress, value: 60, size: :xl) %>
\```

<%%= render "component_preview", component: "kiso/progress", scenario: "sizes" %>

### Indeterminate

Omit `value:` for an animated indeterminate state. Choose from four animation styles.

\```erb
<%%= kui(:progress) %>
<%%= kui(:progress, animation: :swing) %>
<%%= kui(:progress, animation: :elastic) %>
\```

<%%= render "component_preview", component: "kiso/progress", scenario: "indeterminate" %>

### Status Text

Show percentage above the bar with `status: true`.

\```erb
<%%= kui(:progress, value: 60, status: true) %>
\```

<%%= render "component_preview", component: "kiso/progress", scenario: "status" %>

### Steps

Pass an array to `max:` to show step labels. The `value:` is the current step index.

\```erb
<%%= kui(:progress, value: 1, max: ["Sign Up", "Profile", "Complete"]) %>
\```

<%%= render "component_preview", component: "kiso/progress", scenario: "steps" %>

## Theme

\```ruby
# lib/kiso/themes/progress.rb
Kiso::Themes::ProgressTrack = ClassVariants.build(
  base: "relative overflow-hidden rounded-full bg-accented",
  # ...orientation × size compound variants
)

Kiso::Themes::ProgressIndicator = ClassVariants.build(
  base: "rounded-full size-full transition-transform duration-200 ease-out",
  variants: {
    color: {
      primary: "bg-primary",
      # ...
    }
  }
)
\```

## Accessibility

| Attribute | Value |
|-----------|-------|
| `role` | `"progressbar"` (on track) |
| `aria-valuenow` | Current value (omitted when indeterminate) |
| `aria-valuemin` | `0` |
| `aria-valuemax` | Numeric max |
| `aria-label` | `"Progress"` (i18n: `kiso.progress.label`) |
| `data-state` | `"indeterminate"` or `"loading"` |
```

**Important:** In the actual file, escape ERB tags with double `%` for Bridgetown:
- `<%%=` renders as `<%= ` in output
- Unescaped `<%= render ... %>` calls are intentional Bridgetown helpers

- [ ] **Step 2: Add to navigation.yml**

Add to the Components heading items, alphabetically after Pagination:

```yaml
      - title: Progress
        href: /components/progress
```

- [ ] **Step 3: Commit**

```bash
git add docs/src/components/progress.md docs/src/_data/navigation.yml
git commit -m "docs(progress): Add component docs page and navigation entry

Part of #152"
```

### Task 7: Skills reference, E2E entry, cleanup

**Files:**
- Modify: `skills/kiso/references/components.md`
- Modify: `test/e2e/dark-mode.spec.js`

- [ ] **Step 1: Add to skills reference**

Add to the Element section table in `skills/kiso/references/components.md`, alphabetically:

```markdown
| `progress` | `value`, `max` (int or array of step labels), `status`, `color`, `size` (xs-xl), `animation` (carousel/carousel_inverse/swing/elastic), `orientation`, `inverted`. Sub-parts: track, indicator, status, steps, step | [progress.md](components/progress.md) |
```

- [ ] **Step 2: Add E2E dark mode entry**

Add to the `COMPONENTS` array in `test/e2e/dark-mode.spec.js`, alphabetically:

```javascript
    { name: "progress", url: "/preview/kiso/progress/playground" },
```

- [ ] **Step 3: Run linters**

```bash
bundle exec standardrb --fix lib/kiso/themes/progress.rb lib/kiso/presets/sharp.rb
npm run lint
npm run fmt:check
```

- [ ] **Step 4: Run tests**

```bash
bundle exec rake test
```

- [ ] **Step 5: Visual verification in Lookbook**

Open each preview URL and verify:
- Colors render correct indicator backgrounds
- Sizes show different bar heights
- Indeterminate animations play smoothly
- Status text aligns and shows percentage
- Steps highlight active label
- Dark mode works (toggle in Lookbook)

- [ ] **Step 6: Commit**

```bash
git add skills/kiso/references/components.md test/e2e/dark-mode.spec.js
git commit -m "feat(progress): Add skills reference and E2E dark mode entry

Closes #152"
```
