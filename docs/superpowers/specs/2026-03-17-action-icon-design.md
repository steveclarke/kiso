# ActionIcon Component Design

**Issue:** #247
**Date:** 2026-03-17

## Summary

A small, inline icon-only action trigger for use in table cells, card headers,
text rows, and anywhere a full Button is too heavy. Renders as a quiet
`text-muted-foreground` icon that brightens on hover with a subtle background.
No fixed height — flows inline with surrounding text without overflow.

Separate from Button because it serves a fundamentally different purpose:
Button is a deliberate, visible control with fixed heights and a full variant
system. ActionIcon is a quiet, contextual trigger that sits unobtrusively
inside content.

**Origin:** Outport app built `appui(:icon_action)` as a workaround for
Button's `:xs` size (28px) overflowing `text-sm` rows. This design
promotes that pattern to a first-class Kiso component.

## API

```erb
<%# Basic — edit action in a table row %>
<%= kui(:action_icon, icon: "pencil", title: "Edit") %>

<%# Sizes — xs for dense tables, sm (default), md for headers %>
<%= kui(:action_icon, icon: "copy", title: "Copy", size: :xs) %>
<%= kui(:action_icon, icon: "pencil", title: "Edit", size: :sm) %>
<%= kui(:action_icon, icon: "ellipsis", title: "More", size: :md) %>

<%# Destructive override via css_classes %>
<%= kui(:action_icon, icon: "trash", title: "Delete",
    css_classes: "text-error hover:text-error") %>

<%# Link (renders as <a>) %>
<%= kui(:action_icon, icon: "external-link", title: "Open",
    href: "/page", target: "_blank") %>

<%# Non-GET link (renders as button_to form) %>
<%= kui(:action_icon, icon: "trash", title: "Delete",
    href: "/items/1", method: :delete,
    data: { turbo_confirm: "Delete this item?" }) %>

<%# Disabled %>
<%= kui(:action_icon, icon: "pencil", title: "Edit", disabled: true) %>

<%# With Stimulus %>
<%= kui(:action_icon, icon: "clipboard", title: "Copy to clipboard",
    data: { action: "click->clipboard#copy" }) %>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | String | (required) | Icon name passed to `kiso_icon` |
| `size` | Symbol | `:sm` | `:xs`, `:sm`, `:md` |
| `title` | String | `nil` | Tooltip text and `aria-label` |
| `href` | String | `nil` | Renders as `<a>` (or `button_to` with `method:`) |
| `method` | Symbol | `nil` | HTTP method for `button_to` (requires `href:`) |
| `disabled` | Boolean | `false` | Disabled state |
| `css_classes` | String | `""` | Override classes via tailwind_merge |
| `**component_options` | Hash | `{}` | Passed through to the HTML element |

## What it doesn't have

- **No color axis** — always muted-foreground → foreground. One-off color
  overrides use `css_classes:`. This keeps the component opinionated about
  its quiet personality.
- **No variant axis** — always ghost-like (transparent background, hover
  reveals).
- **No `block:`, `loading:`, `loading_auto:`** — those are Button concerns.
- **No `type:` prop** — always `type="button"` (or `type="submit"` in the
  `button_to` case, which Rails handles). If you need `type="submit"`, pass
  it via `component_options`.
- **No `form:` prop** — Button accepts `form: {}` for extra form params in
  `button_to`. ActionIcon omits this — unlikely to be needed.
- **No yield block** — always renders a single icon. If you need text, use
  Button.
- **No `ui:` prop** — single element, no sub-parts.

## HTML Structure

```html
<!-- Default: <button> -->
<button type="button"
        class="inline-flex items-center justify-center ..."
        data-slot="action-icon"
        title="Edit"
        aria-label="Edit">
  <svg><!-- icon --></svg>
</button>

<!-- With href: <a> -->
<a href="/page"
   class="inline-flex items-center justify-center ..."
   data-slot="action-icon"
   title="Open"
   aria-label="Open">
  <svg><!-- icon --></svg>
</a>

<!-- With href + method: button_to -->
<form class="contents" action="/items/1" method="post">
  <input type="hidden" name="_method" value="delete">
  <button type="submit"
          class="inline-flex items-center justify-center ..."
          data-slot="action-icon"
          title="Delete"
          aria-label="Delete">
    <svg><!-- icon --></svg>
  </button>
</form>
```

## Theme Module

```ruby
# lib/kiso/themes/action_icon.rb
module Kiso
  module Themes
    # Inline icon-only action trigger for table cells, card headers,
    # and text rows.
    #
    # Quiet by default — muted foreground that brightens on hover with
    # a subtle background. No fixed height; flows inline with
    # surrounding text.
    #
    # @example
    #   ActionIcon.render(size: :sm)
    #
    # Variants:
    # - +size+ — :xs, :sm (default), :md
    #
    # shadcn base: n/a (no shadcn equivalent — inspired by Mantine ActionIcon
    # and Outport's appui(:icon_action))
    ActionIcon = ClassVariants.build(
      base: "inline-flex items-center justify-center " \
            "text-muted-foreground hover:text-foreground " \
            "hover:bg-accent rounded-md " \
            "cursor-pointer transition-colors duration-150 " \
            "disabled:pointer-events-none disabled:opacity-50 " \
            "aria-disabled:cursor-not-allowed aria-disabled:opacity-50 " \
            "focus-visible:outline-2 focus-visible:outline-offset-2 " \
            "focus-visible:outline-inverted " \
            "#{Shared::SVG_BASE}",
      variants: {
        size: {
          xs: "p-0.5 [&_svg:not([class*='size-'])]:size-3",
          sm: "p-1 [&_svg:not([class*='size-'])]:size-3.5",
          md: "p-1.5 [&_svg:not([class*='size-'])]:size-4"
        }
      },
      defaults: { size: :sm }
    )
  end
end
```

### Size scale rationale

| Size | Padding | Icon | Approximate touch target | Use case |
|------|---------|------|--------------------------|----------|
| `:xs` | `p-0.5` (2px) | 12px | ~16px | Dense table rows, `text-xs` context |
| `:sm` | `p-1` (4px) | 14px | ~22px | Standard inline actions, `text-sm` context |
| `:md` | `p-1.5` (6px) | 16px | ~28px | Card headers, larger text contexts |

All sizes use `h-auto` (implicit — no fixed height set). The rendered
height is icon size + (2 × padding), which stays within the line height of
its surrounding text context.

### SVG handling

Uses `Shared::SVG_BASE` for the base SVG classes (`pointer-events-none`,
`shrink-0`, default `size-4`). Per-size variants override the default icon
size via `[&_svg:not([class*='size-'])]` — same pattern as Button. The
per-size selector wins via tailwind_merge since it's more specific.

## Accessibility

- `title:` prop sets both `aria-label` and the `title` HTML attribute.
  `aria-label` is the reliable accessible name for icon-only controls —
  some browser/screen reader combinations don't expose `title` as the
  accessible name, so `aria-label` ensures consistent behavior. The
  `title` attribute provides the visual tooltip on hover.
- Since there's no visible text, `title:` should always be provided.
  The partial will fall back to `t("kiso.action_icon.action")` if omitted,
  but a descriptive label is strongly recommended.
- `disabled` attribute on `<button>`. For `<a>` tags: `aria-disabled="true"`
  is set and the `href` is preserved (consistent with Button). Host apps
  should use CSS/JS to prevent navigation on disabled links if needed.
- Focus ring via `focus-visible:outline-*` tokens

## Design Notes

**`text-muted-foreground` vs `text-foreground/50`:** ColorModeButton and
dashboard icon buttons use `text-foreground/50`. ActionIcon uses
`text-muted-foreground` intentionally. Dashboard chrome buttons live in the
sidebar/navbar where `text-foreground/50` integrates with the chrome
aesthetic. ActionIcon lives inside content areas (table cells, card
headers) where `text-muted-foreground` is the standard secondary text
token — matching descriptions, captions, and other de-emphasized content.

**No `active:` state:** ColorModeButton and dashboard icon buttons have no
active state. ActionIcon follows the same pattern — these are small,
contextual triggers that don't need the tactile pressed feedback of a
full Button. The hover state alone provides sufficient interaction
feedback.

**`focus-visible:outline-inverted`:** Matches Button's neutral ghost
pattern rather than Badge's `outline-ring`, since ActionIcon is
behaviorally a neutral ghost interactive element.

**`transition-colors duration-150`:** Matches ColorModeButton's transition
timing for consistent animation speed across the icon-button family.

## Dark Mode

All classes use semantic tokens — no `dark:` prefixes needed:

- `text-muted-foreground` → zinc-500 (light) / zinc-400 (dark)
- `text-foreground` → zinc-950 (light) / zinc-50 (dark)
- `bg-accent` → resolves per mode (hover/active surface)
- `outline-inverted` → zinc-900 (light) / white (dark)

No CSS file needed — no animations, pseudo-states, or transitions beyond
what Tailwind utilities express.

## Presets

Since `rounded-md` is on the base (not per-size), presets use the base key:

```ruby
# rounded.rb
action_icon: { base: "rounded-full" }

# sharp.rb
action_icon: { base: "rounded-none" }
```

## Deliverables

1. Theme module: `lib/kiso/themes/action_icon.rb`
2. ERB partial: `app/views/kiso/components/_action_icon.html.erb`
3. Require in `lib/kiso.rb`
4. Lookbook preview
5. Docs page: `docs/src/components/action-icon.md`
6. Navigation entry in `docs/src/_data/navigation.yml`
7. Entry in `skills/kiso/references/components.md`
8. Preset entries in `rounded.rb` and `sharp.rb`
9. i18n fallback in `config/locales/en.yml`
10. E2E dark mode entry in `test/e2e/dark-mode.spec.js`
