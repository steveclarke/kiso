# Component Documentation Template

Use this template when writing docs for any Kiso component. Copy this
structure exactly — consistency across all component pages is critical.

---

````markdown
---
title: ComponentName
description: One sentence describing what the component does.
category: Element | Form | Layout | Data | Navigation | Overlay
source: lib/kiso/themes/component_name.rb
---

# ComponentName

One sentence description (same as frontmatter).

## Quick Start

```erb
<%= kui(:component_name) { "Content" } %>
```

[Link to Lookbook playground →](/lookbook/inspect/kiso/component_name/playground)

## Locals

| Local | Type | Default |
|-------|------|---------|
| `color:` | `:primary` \| `:secondary` \| `:success` \| `:info` \| `:warning` \| `:error` \| `:neutral` | `:primary` |
| `variant:` | `:solid` \| `:outline` \| `:soft` \| `:subtle` | `:soft` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

### Color

Use the `color:` local to change the color.

```erb
<%= kui(:component_name, color: :primary) { "Primary" } %>
<%= kui(:component_name, color: :error) { "Error" } %>
```

### Variant

Use the `variant:` local to change the visual style.

```erb
<%= kui(:component_name, variant: :solid) { "Solid" } %>
<%= kui(:component_name, variant: :outline) { "Outline" } %>
```

<!-- Repeat for each variant axis: size, icon, block, disabled, etc. -->

## Anatomy

<!-- Only for compound components with sub-parts. Skip for simple ones. -->

```erb
<%= kui(:alert, color: :info) do %>
  <svg class="size-5 shrink-0">...</svg>
  <div class="flex-1">
    <%= kui(:alert, :title) { "Title" } %>
    <%= kui(:alert, :description) { "Description text." } %>
  </div>
<% end %>
```

### Sub-parts

| Part | Description |
|------|-------------|
| `:title` | Bold heading text. |
| `:description` | Supporting text at `opacity-90`. |

## Examples

### With Custom Classes

Use `css_classes:` to override styles. Conflicts are resolved by TailwindMerge.

```erb
<%= kui(:component_name, css_classes: "rounded-full") { "Custom" } %>
```

<!-- Add 2-4 real-world examples showing common patterns. -->

## Theme

The theme module defines all variant classes. Override with `css_classes:`.

```ruby
# lib/kiso/themes/component_name.rb
Kiso::Themes::ComponentName = ClassVariants.build(
  base: "...",
  variants: { ... },
  compound_variants: [ ... ],
  defaults: { ... }
)
```

## Accessibility

<!-- Include when relevant. -->

| Attribute | Value |
|-----------|-------|
| `role` | `alert` |
| `data-component` | `"alert"` |

### Keyboard

| Key | Action |
|-----|--------|
| `Enter` | Activates the button. |
| `Space` | Activates the button. |
````

## Guidelines

- **"Locals" not "Props"** — ERB partials have locals, not props.
- **Ruby symbols for types** — `:primary | :secondary`, not `"primary" | "secondary"`.
- **Visual-first** — show what it looks like, then the code.
- **One section per feature** — each local/axis gets its own `###` heading.
- **Side-by-side variants** — show all colors or sizes in one code block.
- **Theme source is documentation** — the Ruby module IS the reference.
- **Anatomy for compound components only** — Badge doesn't need it, Alert does.
- **Lookbook is the playground** — link to it, don't recreate it.
