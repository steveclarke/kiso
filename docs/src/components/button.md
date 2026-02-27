---
title: Button
layout: docs
description: Interactive element that triggers an action or navigates to a URL.
category: Element
source: lib/kiso/themes/button.rb
---

## Quick Start

```erb
<%%= kui(:button) { "Click me" } %>
```

<%= render "component_preview", component: "kiso/button", scenario: "playground", height: "300px" %>

## Locals

| Local | Type | Default |
|-------|------|---------|
| `color:` | `:primary` \| `:secondary` \| `:success` \| `:info` \| `:warning` \| `:error` \| `:neutral` | `:primary` |
| `variant:` | `:solid` \| `:outline` \| `:soft` \| `:subtle` \| `:ghost` \| `:link` | `:solid` |
| `size:` | `:xs` \| `:sm` \| `:md` \| `:lg` \| `:xl` | `:md` |
| `block:` | `Boolean` | `false` |
| `disabled:` | `Boolean` | `false` |
| `type:` | `:button` \| `:submit` \| `:reset` | `:button` |
| `href:` | `String` \| `nil` | `nil` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Usage

### Color

```erb
<%%= kui(:button, color: :primary) { "Primary" } %>
<%%= kui(:button, color: :secondary) { "Secondary" } %>
<%%= kui(:button, color: :success) { "Success" } %>
<%%= kui(:button, color: :info) { "Info" } %>
<%%= kui(:button, color: :warning) { "Warning" } %>
<%%= kui(:button, color: :error) { "Error" } %>
<%%= kui(:button, color: :neutral) { "Neutral" } %>
```

### Variant

Six variants. The core four (solid, outline, soft, subtle) use the standard
compound variant formulas. Ghost and link are Button-only additions.

```erb
<%%= kui(:button, variant: :solid) { "Solid" } %>
<%%= kui(:button, variant: :outline) { "Outline" } %>
<%%= kui(:button, variant: :soft) { "Soft" } %>
<%%= kui(:button, variant: :subtle) { "Subtle" } %>
<%%= kui(:button, variant: :ghost) { "Ghost" } %>
<%%= kui(:button, variant: :link) { "Link" } %>
```

### Size

```erb
<%%= kui(:button, size: :xs) { "Extra Small" } %>
<%%= kui(:button, size: :sm) { "Small" } %>
<%%= kui(:button, size: :md) { "Medium" } %>
<%%= kui(:button, size: :lg) { "Large" } %>
<%%= kui(:button, size: :xl) { "Extra Large" } %>
```

### Smart Tag

When `href:` is present, renders `<a>` instead of `<button>`.

```erb
<%%# Renders <button> %>
<%%= kui(:button) { "Action" } %>

<%%# Renders <a href="/settings"> %>
<%%= kui(:button, href: "/settings") { "Settings" } %>
```

### Disabled

For `<button>`, sets the native `disabled` attribute. For `<a>`, sets
`aria-disabled="true"`.

```erb
<%%= kui(:button, disabled: true) { "Unavailable" } %>
<%%= kui(:button, href: "#", disabled: true) { "Disabled Link" } %>
```

### Block

Full-width button.

```erb
<%%= kui(:button, block: true) { "Full Width" } %>
```

### Submit

Defaults to `type: :button` for safety. Set `type: :submit` explicitly
for forms.

```erb
<%%= kui(:button, type: :submit, color: :primary) { "Save" } %>
```

### With Icon

Drop an SVG inside the yield block. The button's `gap` handles spacing.
SVGs without an explicit `size-*` class are auto-sized to match the button
size via `[&_svg:not([class*='size-'])]:size-4`.

```erb
<%%= kui(:button, variant: :outline) do %>
  <%%= kiso_icon("plus") %>
  Add Item
<%% end %>
```

## Examples

### Form Actions

```erb
<div class="flex gap-3">
  <%%= kui(:button, type: :submit) { "Save" } %>
  <%%= kui(:button, variant: :ghost, data: { action: "click->form#reset" }) { "Cancel" } %>
</div>
```

### Link Group

```erb
<div class="flex gap-2">
  <%%= kui(:button, href: "/dashboard", variant: :solid) { "Dashboard" } %>
  <%%= kui(:button, href: "/settings", variant: :outline) { "Settings" } %>
  <%%= kui(:button, href: "/help", variant: :ghost) { "Help" } %>
</div>
```

## Theme

```ruby
# lib/kiso/themes/button.rb
Kiso::Themes::Button = ClassVariants.build(
  base: "inline-flex items-center justify-center gap-2 font-medium
         whitespace-nowrap shrink-0 transition-all
         focus-visible:outline-2 focus-visible:outline-offset-2
         disabled:pointer-events-none disabled:opacity-50
         aria-disabled:cursor-not-allowed aria-disabled:opacity-50
         [&_svg:not([class*='size-'])]:size-4
         [&_svg]:pointer-events-none [&_svg]:shrink-0",
  variants: {
    variant: {
      solid: "", outline: "ring ring-inset", soft: "", subtle: "ring ring-inset",
      ghost: "", link: "underline-offset-4"
    },
    size: {
      xs: "h-7 px-2 py-1 text-xs rounded-md gap-1 has-[>svg]:px-1.5",
      sm: "h-8 px-3 py-1.5 text-xs rounded-md gap-1.5 has-[>svg]:px-2.5",
      md: "h-9 px-4 py-2 text-sm rounded-md gap-2 has-[>svg]:px-3",
      lg: "h-10 px-5 py-2.5 text-sm rounded-md gap-2 has-[>svg]:px-4",
      xl: "h-11 px-6 py-3 text-base rounded-lg gap-2.5 has-[>svg]:px-5"
    },
    color: COLORS.index_with { "" },
    block: { true => "w-full", false => "" }
  },
  compound_variants: [
    # Core 4 variants: same formulas as Badge/Alert + hover/active/focus states.
    # Ghost + link: Button-only additions.
    # See project/DESIGN_SYSTEM.md for base formulas.
  ],
  defaults: { color: :primary, variant: :solid, size: :md, block: false }
)
```

### Interactive States

Button extends the base compound variant formulas with hover, active, and
focus-visible states:

| Variant | Hover | Active | Focus |
|---------|-------|--------|-------|
| solid | `bg-{color}/90` | `bg-{color}/80` | `outline-{color}` |
| outline | `bg-{color}/10` | `bg-{color}/15` | `ring-2 ring-{color}` |
| soft | `bg-{color}/15` | `bg-{color}/20` | `outline-{color}` |
| subtle | `bg-{color}/15` | `bg-{color}/20` | `ring-2 ring-{color}` |
| ghost | `bg-{color}/10` | `bg-{color}/15` | `outline-{color}` |
| link | `text-{color}/75` | `text-{color}/75` | `outline-{color}` |

## Accessibility

| Attribute | Value |
|-----------|-------|
| `data-slot` | `"button"` |
| `type` | `"button"` (default, not `"submit"`) |
| `disabled` | Native attribute on `<button>` |
| `aria-disabled` | Set on `<a>` when `disabled: true` |

### Keyboard

| Key | Action |
|-----|--------|
| `Enter` | Activates the button. |
| `Space` | Activates the button. |
| `Tab` | Moves focus to the next focusable element. |
