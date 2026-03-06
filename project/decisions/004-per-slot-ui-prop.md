# ADR-004: Per-Slot `ui:` Prop for Component Style Overrides

**Status:** Proposed
**Date:** 2026-03-06
**Issue:** [#168](https://github.com/steveclarke/kiso/issues/168)

## Context

Kiso's override system has three layers:

1. **Theme default** — `ClassVariants.build` in `lib/kiso/themes/`
2. **Global config** — `Kiso.configure { |c| c.theme[:button] = { base: "..." } }`
3. **Instance override** — `css_classes:` at the call site

`css_classes:` only targets the root element of each partial. This creates two
problems:

### Self-rendering components have unreachable inner elements

Components that render sub-parts internally (Alert renders AlertWrapper,
AlertClose; Dialog renders DialogContent; Slider renders SliderTrack,
SliderRange, SliderThumb) give callers no way to customize those inner
elements. The user can only hit the root with `css_classes:`.

**Affected components:**

| Component | Unreachable inner parts |
|-----------|------------------------|
| Alert | wrapper, close |
| AlertDialog | content |
| Avatar | fallback, image |
| ColorModeButton | icon containers |
| Dialog | content |
| SelectNative | wrapper, icon |
| Slider | track, range, thumb |
| Switch | track, thumb |
| Command Group | heading |
| Command Input | wrapper |
| Combobox Item | indicator |
| Nav Item | badge |
| Nav Section | title, content |
| Select Item | indicator |

### Composed components require verbose per-part overrides

For Card, Table, and other composed components, the user CAN reach sub-parts
(each is a separate `kui()` call) — but customizing multiple parts requires
passing `css_classes:` to each individually:

```erb
<%= kui(:card, css_classes: "shadow-xl") do %>
  <%= kui(:card, :header, css_classes: "p-8") do %>
    <%= kui(:card, :title, css_classes: "text-xl") { "Title" } %>
  <% end %>
<% end %>
```

Nuxt UI solves both problems with a single `:ui` prop — a hash keyed by slot
name that targets any sub-element.

## Decision

Add a `ui:` prop to `kui()` that accepts a hash of slot-name to class-string
overrides. Use a request-scoped context stack (analogous to Vue's
provide/inject) so composed sub-parts inherit overrides from the parent.

### API Design

**Instance-level (call site):**

```erb
<%# Self-rendering — ui: is the only way to reach inner elements %>
<%= kui(:alert, icon: "triangle-alert", color: :warning, ui: {
  title: "text-lg",
  icon: "size-6",
  close: "opacity-50"
}) do %>
  <%= kui(:alert, :title) { "Heads up" } %>
  <%= kui(:alert, :description) { "Something happened." } %>
<% end %>

<%# Composed — ui: flows down to sub-parts via context %>
<%= kui(:card, ui: { header: "p-8 bg-muted", title: "text-xl" }) do %>
  <%= kui(:card, :header) do %>
    <%= kui(:card, :title) { "Dashboard" } %>
  <% end %>
  <%= kui(:card, :content) { "..." } %>
<% end %>
```

**Global config (boot-time):**

```ruby
Kiso.configure do |config|
  # Existing format still works:
  config.theme[:card_header] = { base: "p-8" }

  # New: per-slot overrides on the parent component
  config.theme[:card] = { base: "rounded-xl", ui: { header: "p-8", footer: "px-8" } }
  config.theme[:alert] = { ui: { title: "font-bold", close: "opacity-50" } }
end
```

**Four layers (matching Nuxt UI):**

```
1. Theme default        (Kiso gem)
2. Global config        (host app initializer — base: + ui:)
3. Instance ui:         (call-site per-slot overrides)
4. Instance css_classes: (call-site root override — unchanged)
```

### Values are flat class strings

`ui: { header: "p-8" }` — not nested hashes. This matches Nuxt UI's most
common usage pattern. If per-slot variant overrides are needed later, nested
hashes can be added without breaking the flat string API (strings would be
shorthand for `{ base: "..." }`).

### Slot names match sub-part names

The keys in the `ui:` hash are the same symbols used in `kui(:component, :part)`:

```erb
kui(:card, ui: { header: "p-8" })
<%# :header matches kui(:card, :header) and data-slot="card-header" %>
```

For self-rendering components, slot names match the suffix of the theme
constant (AlertWrapper → `:wrapper`, AlertClose → `:close`, SliderThumb →
`:thumb`).

## Alternatives Considered

### Named `*_css_classes:` props per inner element

```erb
kui(:alert, title_css_classes: "text-lg", close_css_classes: "opacity-50")
```

Rejected: proliferates props, doesn't scale, not a general pattern. Every
component would need custom props for each inner element.

### CSS-only targeting via `[data-slot]` selectors

```css
[data-slot="alert"] [data-slot="alert-title"] { ... }
```

Works for global CSS but not for instance-level overrides in ERB. Requires
writing CSS instead of using Tailwind utilities inline.

### No change — rely on composition

Let users yield and compose sub-parts with individual `css_classes:`. Rejected
because self-rendering components (Alert, Dialog, Slider, Switch) render
sub-parts internally and can't be composed from outside.

## Consequences

- **Non-breaking** — `ui:` defaults to `{}`, existing code unchanged
- **Existing `config.theme[:card_header]` still works** alongside
  `config.theme[:card] = { ui: { header: "..." } }`
- Every compound component partial gains the ability to read slot overrides
- Self-rendering components must pass `ui:` overrides to their internally
  rendered sub-parts
- New infrastructure (context stack) must be thread-safe for concurrent
  requests
