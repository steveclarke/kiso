# Component Creation Guide

How to build a Kiso UI component from start to finish.

## Before writing any code

Read these files in order:

1. `project/design-system.md` — compound variant formulas, token table, spatial system
2. `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/{name}.tsx` — **structural source of truth**. Copy div-for-div, class-for-class.
3. `vendor/shadcn-ui/apps/v4/content/docs/components/radix/{name}.mdx` — docs page. Lists all demos to replicate in Lookbook.
4. `vendor/shadcn-ui/apps/v4/examples/radix/{name}-*.tsx` — demo implementations. Translate to ERB for Lookbook previews. Use the same icons, text, and layout.
5. `vendor/nuxt-ui/src/theme/{name}.ts` — **theming source of truth**. Color x variant compounds.
6. An existing Kiso component as reference — read `lib/kiso/themes/card.rb` and `app/views/kiso/components/_card.html.erb` for the exact patterns.

## Naming rules

- Component name **must match shadcn exactly**. Check the shadcn file name and its exported component names.
- Sub-part names **must match shadcn exactly**. If shadcn exports `FieldLabel`, the sub-part is `:label` under `:field`.
- Files: `lib/kiso/themes/{name}.rb`, `app/views/kiso/components/_{name}.html.erb`
- Sub-parts: `app/views/kiso/components/{name}/_{part}.html.erb`

## Implementation steps

### 1. Create the theme module

File: `lib/kiso/themes/{name}.rb`

```ruby
module Kiso
  module Themes
    # shadcn: [paste the shadcn classes as a comment]
    ComponentName = ClassVariants.build(
      base: "...",
      variants: { ... },
      defaults: { ... }
    )
  end
end
```

- Copy Tailwind classes from shadcn for layout, spacing, typography
- For colored components: copy the compound variant block VERBATIM from `lib/kiso/themes/badge.rb` — only change the `base:` string
- Replace `border` with `ring ring-inset ring-border` for outline variants
- Replace raw colors (`bg-card`, `text-destructive`) with Kiso tokens (`bg-background`, `text-error`)
- Include a comment showing the original shadcn classes for reference

### 2. Register the theme

Add `require "kiso/themes/{name}"` to `lib/kiso.rb` (before the `require "kiso/icons"` line).

### 3. Create ERB partials

Main partial: `app/views/kiso/components/_{name}.html.erb`

```erb
<%# locals: (variant: :outline, css_classes: "", **component_options) %>
<%= content_tag :div,
    class: Kiso::Themes::ComponentName.render(variant: variant, class: css_classes),
    data: kiso_prepare_options(component_options, slot: "component-name"),
    **component_options do %>
  <%= yield %>
<% end %>
```

Sub-part partial: `app/views/kiso/components/{name}/_{part}.html.erb`

```erb
<%# locals: (css_classes: "", **component_options) %>
<%= content_tag :div,
    class: Kiso::Themes::ComponentNamePart.render(class: css_classes),
    data: kiso_prepare_options(component_options, slot: "component-name-part"),
    **component_options do %>
  <%= yield %>
<% end %>
```

Rules:
- `text-foreground` on every container component root
- Strict locals on every partial
- `css_classes: ""` and `**component_options` on every partial
- Use `kiso_prepare_options(slot: "kebab-case-name")` for data-slot identity
- Match the HTML element shadcn uses (`<div>`, `<label>`, `<fieldset>`, etc.)
- **Never use `block_given?` in ERB partials** — it's always `true` due to
  Rails internals. For default content with optional block override, use:
  ```erb
  <%= capture { yield }.presence || kiso_component_icon(:chevron_right) %>
  ```
- **Use `kiso_component_icon(:semantic_name)` for all default icons** — never
  hardcode `kiso_icon("icon-name")` in component partials. This lets host
  apps swap icons globally via `Kiso.config.icons`. If your component needs
  a new default icon, add the semantic name to `lib/kiso/configuration.rb`
  first. `kiso_icon("name")` is only for user-specified icons in app templates.

### 4. Create Lookbook previews

File: `test/components/previews/kiso/{name}_preview.rb`
Templates: `test/components/previews/kiso/{name}_preview/*.html.erb`

Preview class pattern:
```ruby
module Kiso
  # @label ComponentName
  class ComponentNamePreview < Lookbook::Preview
    # @label Playground
    def playground
      render_with_template
    end
  end
end
```

See **Lookbook preview rules** below for content requirements.

### 5. Create docs page

File: `docs/src/components/{name}.md`

Follow the Card docs format (`docs/src/components/card.md`):
- Frontmatter with title, layout: docs, description, category, source
- Quick Start code example
- Locals table
- Sub-parts table
- Anatomy tree
- Usage examples for each variant/feature
- Theme section (abbreviated)
- Accessibility notes

**Do NOT repeat an `# Title` heading** — the `docs` layout renders the title
from frontmatter automatically. Start with `## Quick Start`.

**Escape ERB in code examples** — Bridgetown processes ERB, so fenced code
blocks containing `<%=` will be executed. Escape the tag as `<%%=` so it
renders as literal code.

Add to navigation: `docs/src/_data/navigation.yml` (alphabetical order in
Components section).

### 6. Update skills reference

Create a new file at `skills/kiso/references/components/{name}.md` with the
component's API reference (locals, defaults, sub-parts, usage examples, theme
modules). Follow any existing component file as a template.

Then add a row to the appropriate table in `skills/kiso/references/components.md`
(Layout, Forms, or Element) linking to the new file.

### 7. Write Playwright E2E tests

File: `test/e2e/components/{name}.spec.js`

Read `project/testing-strategy.md` to determine the component's tier, then
write tests covering all required categories for that tier.

```javascript
import { test, expect } from "@playwright/test"
import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/{name}"

test.describe("{ComponentName} component", () => {
  // Tier 1: Renders, Content, Variants, Composition, Accessibility
  // Tier 2: + State, Disabled
  // Tier 3: + Open/Close, Keyboard, Focus, ARIA state, Selection
})
```

Rules:
- Assert behavior, not CSS classes (`data-slot`, `aria-*`, visibility, text)
- Use Lookbook playground + named scenarios via URL
- Parameterize variant tests via query params when supported
- Always include an axe WCAG 2.1 AA scan as the last test
- For Stimulus components: test open/close, Escape, click outside, keyboard
  nav (Arrow keys, Enter/Space), and ARIA state changes
- **When tests discover component issues** (a11y violations, broken keyboard
  nav, unexpected behavior): report them — never silently exclude rules or
  remove failing tests. See `project/testing-strategy.md` for the full policy.

### 8. Add to dark mode E2E tests

Add the component to the `COMPONENTS` array in `test/e2e/dark-mode.spec.js`.

### 9. Lint and test

```bash
bundle exec standardrb --fix
npm run lint && npm run fmt
bundle exec rake test
npm run test:unit
npm run test:e2e
```

---

## Lookbook preview rules

**Lookbook previews must be exact visual replicas of shadcn demos.**

Do NOT invent content, layouts, or styling for previews. Copy from shadcn:

1. **Read every shadcn demo file** at `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/{name}-*.tsx`
   (or `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/radix/{name}-*.tsx`).
2. **Use the same content** — same text, same headings, same placeholder data.
   If shadcn says "@peduarte starred 3 repositories", write that. Don't invent
   "Order #4189".
3. **Use the same Tailwind classes** — if shadcn uses `rounded-md border`, use
   `rounded-md border`. Don't substitute `ring ring-inset ring-border` in demos.
   (Ring is for Kiso's variant system in theme modules, not for demo layouts.)
4. **Use `color: :neutral` on all buttons in demos** — shadcn buttons default
   to neutral. Kiso buttons default to `color: :primary` (blue). Every
   `kui(:button)` in a preview must explicitly set `color: :neutral` to match
   the shadcn monochrome aesthetic.
5. **No CSS animations unless shadcn has them** — check the shadcn source. If
   they don't animate it, we don't animate it. Don't add height transitions,
   opacity fades, or other effects that aren't in the original.
6. **Match the exact demo list** — create one Lookbook preview per shadcn demo.
   Don't skip demos, don't add extras.

The goal: a Kiso Lookbook preview should be visually indistinguishable from
the corresponding shadcn demo page.

---

## Colored component template

> Copy-paste template. See `project/design-system.md` for the authoritative
> formula table.

**Every colored component uses this exact compound variant block.** Copy it
verbatim. Only change the `base:` string and any additional variant axes
(like `size:` for Badge).

```ruby
module Kiso
  module Themes
    MyComponent = ClassVariants.build(
      base: "...",  # ONLY THIS LINE CHANGES PER COMPONENT
      variants: {
        variant: {
          solid: "",
          outline: "ring ring-inset",
          soft: "",
          subtle: "ring ring-inset"
        },
        color: COLORS.index_with { "" }
      },
      compound_variants: [
        # -- solid --
        {color: :primary, variant: :solid, class: "bg-primary text-primary-foreground"},
        {color: :secondary, variant: :solid, class: "bg-secondary text-secondary-foreground"},
        {color: :success, variant: :solid, class: "bg-success text-success-foreground"},
        {color: :info, variant: :solid, class: "bg-info text-info-foreground"},
        {color: :warning, variant: :solid, class: "bg-warning text-warning-foreground"},
        {color: :error, variant: :solid, class: "bg-error text-error-foreground"},
        {color: :neutral, variant: :solid, class: "bg-inverted text-inverted-foreground"},

        # -- outline --
        {color: :primary, variant: :outline, class: "text-primary ring-primary/50"},
        {color: :secondary, variant: :outline, class: "text-secondary ring-secondary/50"},
        {color: :success, variant: :outline, class: "text-success ring-success/50"},
        {color: :info, variant: :outline, class: "text-info ring-info/50"},
        {color: :warning, variant: :outline, class: "text-warning ring-warning/50"},
        {color: :error, variant: :outline, class: "text-error ring-error/50"},
        {color: :neutral, variant: :outline, class: "text-foreground bg-background ring-accented"},

        # -- soft --
        {color: :primary, variant: :soft, class: "bg-primary/10 text-primary"},
        {color: :secondary, variant: :soft, class: "bg-secondary/10 text-secondary"},
        {color: :success, variant: :soft, class: "bg-success/10 text-success"},
        {color: :info, variant: :soft, class: "bg-info/10 text-info"},
        {color: :warning, variant: :soft, class: "bg-warning/10 text-warning"},
        {color: :error, variant: :soft, class: "bg-error/10 text-error"},
        {color: :neutral, variant: :soft, class: "text-foreground bg-elevated"},

        # -- subtle --
        {color: :primary, variant: :subtle, class: "bg-primary/10 text-primary ring-primary/25"},
        {color: :secondary, variant: :subtle, class: "bg-secondary/10 text-secondary ring-secondary/25"},
        {color: :success, variant: :subtle, class: "bg-success/10 text-success ring-success/25"},
        {color: :info, variant: :subtle, class: "bg-info/10 text-info ring-info/25"},
        {color: :warning, variant: :subtle, class: "bg-warning/10 text-warning ring-warning/25"},
        {color: :error, variant: :subtle, class: "bg-error/10 text-error ring-error/25"},
        {color: :neutral, variant: :subtle, class: "text-foreground bg-elevated ring-accented"}
      ],
      defaults: {color: :primary, variant: :soft}
    )
  end
end
```

---

## Partial patterns

### Props-driven with yield fallback

The target pattern for components with internal structure. Self-rendering
components accept `ui: {}` so callers can customize inner elements:

```erb
<%# locals: (title: nil, description: nil, icon: nil, color: :primary,
             variant: :soft, ui: {}, css_classes: "", **component_options) %>
<% content = capture { yield }.presence %>
<%= content_tag :div,
    class: Kiso::Themes::Alert.render(color: color, variant: variant, class: css_classes),
    data: kiso_prepare_options(component_options, slot: "alert"),
    **component_options do %>
  <% if content %>
    <%# Full override — user controls everything %>
    <%= content %>
  <% else %>
    <%# Props-driven layout — component handles structure %>
    <%# Inner elements apply ui[:slot_name] overrides: %>
    <%# class: Kiso::Themes::AlertWrapper.render(class: ui[:wrapper]) %>
  <% end %>
<% end %>
```

### Default content with optional block override

When a component renders default content (like an icon) but allows the caller
to replace it with a block:

```erb
<%# One-liner — default with inline fallback %>
<%= capture { yield }.presence || kiso_component_icon(:chevron_right, class: "size-3.5") %>

<%# Multi-line — assign first, then branch %>
<% content = capture { yield }.presence %>
<% if content %>
  <%= content %>
<% else %>
  <%# default content here %>
<% end %>
```

### Sub-part partials

For composed usage via `kui(:component, :part)`:

```erb
<%# app/views/kiso/components/alert/_title.html.erb %>
<%# locals: (css_classes: "", **component_options) %>
<%= content_tag :div,
    class: Kiso::Themes::AlertTitle.render(class: css_classes),
    data: kiso_prepare_options(component_options, slot: "alert-title"),
    **component_options do %>
  <%= yield %>
<% end %>
```

---

## Stimulus controller conventions

Follow all JS conventions in `CLAUDE.md` (bare specifier imports, JSDoc, event
listener cleanup, disabled attributes, tag helpers for Stimulus data attrs).

### Shared utilities

Before writing positioning, highlighting, or keyboard navigation code, use
existing utilities:

- **`kiso-ui/utils/positioning`** — `positionBelow(anchor, content, options)`
- **`kiso-ui/utils/highlight`** — `highlightItem(clearItems, items, index)`,
  `wrapIndex(current, direction, length)`
- **`kiso-ui/utils/focusable`** — `FOCUSABLE_SELECTOR` constant

Never reimplement these patterns inline. Import with bare specifiers:

```javascript
import { highlightItem, wrapIndex } from "kiso-ui/utils/highlight"
import { positionBelow } from "kiso-ui/utils/positioning"
import { FOCUSABLE_SELECTOR } from "kiso-ui/utils/focusable"
```

### Shared theme constants

Use `Shared::SVG_BASE`, `ITEM_SEPARATOR`, `MENU_LABEL`, `MENU_SHORTCUT`,
`CHECKABLE_ITEM` from `lib/kiso/themes/shared.rb` when class strings are
byte-for-byte identical. Keep component-specific variations inline.

### Field preview integration

If this component is a form control, check issue #11 for the Field preview
mapping table. Update the corresponding Field preview template at
`test/components/previews/kiso/field_preview/` to use the real Kiso component
instead of the plain HTML placeholder.

---

## Quality checklist

Verify before committing:

- [ ] Lookbook previews are exact replicas of shadcn demos (same content, same classes, same colors — NO invented content)
- [ ] All buttons in previews use `color: :neutral` (shadcn aesthetic, not Kiso blue)
- [ ] No animations unless shadcn has them (check shadcn CSS — if no animation exists, don't add one)
- [ ] Self-rendering partials accept `ui: {}` and apply `class: ui[:slot_name]` to inner themed elements
- [ ] Component name matches shadcn exactly
- [ ] Sub-part names match shadcn exactly
- [ ] HTML elements match shadcn (div, label, fieldset, etc.)
- [ ] Tailwind classes match shadcn for layout/spacing/typography
- [ ] Colored components use identical compound variant formulas (copied from Badge)
- [ ] `text-foreground` on container component roots
- [ ] Description text inside colored components inherits parent color (not `text-muted-foreground`)
- [ ] `ring ring-inset` for outline/subtle (not `border`)
- [ ] Semantic tokens only (no raw palette shades, no `dark:` prefixes)
- [ ] Default icons use `kiso_component_icon(:name)`, not `kiso_icon("name")` — new icons registered in `lib/kiso/configuration.rb`
- [ ] No arbitrary Tailwind values
- [ ] E2E test file: `test/e2e/components/{name}.spec.js` covering correct tier (see `project/testing-strategy.md`)
- [ ] All files: theme, require in kiso.rb, partials, previews, E2E tests, docs page, nav entry, skills ref
- [ ] `Closes #N` in PR body
- [ ] Stimulus controllers have full JSDoc (class, methods, properties, events)
- [ ] Lint passes
- [ ] Tests pass
- [ ] All previews return 200

---

## Code conventions quick reference

> Full details in `CLAUDE.md`, `project/design-system.md`, and
> `project/component-strategy.md`.

| Convention | Rule |
|------------|------|
| Compound variants | **Identical across all colored components.** Copy from Badge. |
| Description text | Inherits parent color at full opacity inside colored components. Never `text-muted-foreground`. |
| Ring vs border | `ring ring-inset` for outline/subtle variants. Never `border`. |
| Semantic tokens | `bg-primary`, `text-foreground` — never raw palette shades. |
| No `dark:` prefixes | Tokens flip automatically via CSS variables (`.dark {}` block). |
| `text-foreground` on containers | Every component root that displays text must set `text-foreground`. Browser default is black and won't flip in dark mode. |
| Foreground pairing | Every color has `-foreground`. Including `inverted-foreground`. |
| Heights | `h-9` default interactive. Scale: `h-6` (xs), `h-8` (sm), `h-9` (md), `h-10` (lg). |
| Gaps | `gap-2` default. `gap-1` tight lists, `gap-4` sections, `gap-6` card-level. |
| Font sizes | `text-sm` body, `text-xs` labels, `text-lg` modal titles. **Never below `text-xs`.** |
| Font weights | `font-medium` interactive/labels, `font-semibold` headings. |
| Border radius | `rounded-md` interactive, `rounded-xl` containers, `rounded-full` pills. **No per-size variation.** |
| Icon sizing | `size-4` standard, `size-3` compact, `size-5` larger. No arbitrary values. |
| Container padding | `p-6` large (Card, Dialog), `p-4` medium (Sheet, Popover), `p-2` compact. |
| No arbitrary values | Never use `text-[8px]`, `h-[1.15rem]`, etc. Use standard Tailwind classes only. |
| Sub-part naming | `kui(:alert, :title)` — **never** `kui(:alert_title)`. Files: `alert/_title.html.erb`. Slot: `data-slot="alert-title"`. |
| Default icons | Use `kiso_component_icon(:semantic_name)` for built-in icons. Never hardcode `kiso_icon("name")`. Add new names to `lib/kiso/configuration.rb`. |
| No `block_given?` in ERB | Rails makes `block_given?` always true in partials. Use `capture { yield }.presence` for default-with-override. |
| Tag helpers for data attrs | Always use `tag.*` helpers with `data:` hash for Stimulus attributes. Never write raw `data-kiso--*` attributes in HTML. |
| Strict locals | Every partial: `<%# locals: (color: :primary, ...) %>` |
| Data slot | `data-slot="alert"` for identity (shadcn v4 convention). Kebab-case. |
| `css_classes:` override | Single override point for root element, merged via tailwind_merge. |
| `ui:` prop | Per-slot class overrides. Self-rendering partials declare `ui: {}`. Composed sub-parts inherit via context stack. See `project/decisions/004-per-slot-ui-prop.md`. |
| Lookbook previews | **Exact replicas of shadcn demos.** Same content, same classes, same aesthetic. |
| Lookbook dark mode | Preview wrapper `div`s must include `text-foreground` so text/icons are visible in dark mode. |
| Update docs | `skills/kiso/references/components.md` + docs page. |
| JSDoc on all JS | Every Stimulus controller, method, property, and event. `@example`, `@property`, `@fires`, `@param`, `@returns`, `@private`. |
| Bare specifier imports | **Never use relative imports** (`./utils/...`). Use bare specifiers: `"kiso-ui/utils/positioning"`. |
| Shared JS utils | Use `positionBelow()`, `highlightItem()`/`wrapIndex()`, `FOCUSABLE_SELECTOR`. Never reimplement. |
| Shared theme constants | Use `Shared::SVG_BASE`, `ITEM_SEPARATOR`, etc. from `lib/kiso/themes/shared.rb`. |
| Template cloning for dynamic DOM | Use `<template>` elements in ERB. Never hardcode Tailwind classes in JS. |
| Icon system in JS | Never use `innerHTML` with SVG. Render server-side, toggle `hidden` in JS. |
| Disabled attribute | Use `data-disabled="true"` (value-based). Check with `dataset.disabled === "true"`. |
| Event listener cleanup | Named handlers in `connect()`, removed in `disconnect()`. No anonymous arrow functions. |
| Scoped vs global listeners | Prefer scoped. Only use `document.addEventListener` when truly needed. Remove global listeners in `disconnect()`. |
| E2E tests | Every component: `test/e2e/components/{name}.spec.js`. See `project/testing-strategy.md` for tiers. |
| Test-discovered issues | Report bugs — never silently exclude axe rules or remove failing tests. |
| Lint before commit | `bundle exec standardrb --fix` + `npm run lint && npm run fmt:check` |
