---
title: Props
layout: docs
description: How component props work in Kiso — locals, defaults, and strict declarations.
---

## Locals are props

In Vue you declare props with `defineProps`. In React you destructure from the
function signature. In Kiso, the equivalent is a **strict locals** declaration
at the top of each partial:

<div class="grid gap-6 sm:grid-cols-2 not-prose my-6">
  <div>
    <p class="text-sm font-medium text-foreground mb-2">Vue</p>
    <pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>const props = withDefaults(
  defineProps&lt;{
    color: string
    variant: string
    size: string
  }&gt;(), {
    color: 'primary',
    variant: 'soft',
    size: 'md'
  }
)</code></pre>
  </div>
  <div>
    <p class="text-sm font-medium text-foreground mb-2">Kiso</p>
    <pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>&lt;%# locals: (color: :primary,
             variant: :soft,
             size: :md,
             css_classes: "",
             **component_options) %&gt;</code></pre>
  </div>
</div>

This line does three things:

1. **Declares** which locals the partial accepts
2. **Sets defaults** — `color: :primary` means `:primary` if the caller
   doesn't pass `color:`
3. **Raises errors** on unknown locals — pass `typo: :oops` and Rails will
   tell you immediately

## Passing props

Pass locals as keyword arguments to `kui()`:

```erb
<%%= kui(:badge, color: :success, variant: :solid, size: :lg) { "Active" } %>
```

Omit any local to use its default:

```erb
<%%= kui(:badge) { "Uses :primary, :soft, :md" } %>
```

## Common locals

Every Kiso component accepts these:

| Local | Purpose |
|-------|---------|
| `css_classes:` | Override or extend root element styles (see [Customizing](/guide/customizing)) |
| `ui:` | Override inner sub-part styles — `ui: { slot: "classes" }` (see [Customizing](/guide/customizing#override-inner-elements-per-instance)) |
| `**component_options` | Passed through to the root HTML element — use for `id:`, `data:`, `aria:`, etc. |

Component-specific locals vary. Check each component's docs page for its
locals table.

## The `**component_options` splat

The `**component_options` catch-all lets you pass any HTML attribute straight
through to the root element:

```erb
<%%= kui(:button, id: "submit-btn", data: { turbo_frame: "form" }) do %>
  Save
<%% end %>
```

This is equivalent to React's spread pattern (`<Button {...rest}>`) or Vue's
`v-bind="$attrs"`.
