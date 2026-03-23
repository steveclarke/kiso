# Code Documentation Standards

Every file type has documentation requirements. Comments should explain
**why**, not just **what** — if the code is self-evident, don't comment it.
But always document: non-obvious patterns, design decisions, variant/sub-part
inventories, and anything an agent or new contributor would need to understand
the file's role. Reference files for each format below.

## Ruby theme modules (`lib/kiso/themes/`)

Every theme module gets a YARD-style comment block at the top:

```ruby
# Clickable button with color, variant, and size axes.
#
# Renders as a +<button>+ by default; the partial switches to +<a>+ when
# +href:+ is provided (smart tag).
#
# @example
#   Button.render(color: :primary, variant: :solid, size: :md)
#
# Variants:
# - +color+ — :primary (default), :secondary, :success, :info, :warning, :error, :neutral
# - +variant+ — :solid (default), :outline, :soft, :subtle, :ghost, :link
# - +size+ — :xs, :sm, :md (default), :lg, :xl
```

Sub-part constants get a brief comment: what it styles, its HTML element,
and its `data-slot`. Compound variant sections use `# == solid ==` separators.
Reference: `lib/kiso/themes/button.rb`, `lib/kiso/themes/dashboard.rb`.

## Ruby helpers and infrastructure (`app/helpers/`, `lib/kiso/`)

Full YARD docs on all classes, modules, and public methods:
- `@param` with type and description
- `@return` with type
- `@yield` for block-accepting methods
- `@example` showing ERB template usage (helpers are the public API)
- `@note` for gotchas (CSP nonce, thread safety, placement requirements)
- `@see` cross-references to related methods/modules

Reference: `app/helpers/kiso/component_helper.rb`,
`app/helpers/kiso/icon_helper.rb`.

## ERB partials (`app/views/kiso/components/`)

After the `locals:` declaration, add a 1-3 line ERB comment explaining:
- What the component renders and its HTML element strategy
- Notable behavior (Stimulus controller, Floating UI, native `<dialog>`, etc.)
- Which sub-parts it composes with (if applicable)

```erb
<%# locals: (open: false, ui: {}, css_classes: "", **component_options) %>
<%# Native <dialog> with showModal(). Entry/exit CSS animations driven by
    data-state attribute. Managed by kiso--dialog Stimulus controller. %>
```

Also document non-obvious ERB patterns inline:
- `capture { yield }.presence` — explain the default-vs-override intent
- View context state sharing (e.g., `@_kiso_alert_dialog_id`)
- Complex conditional rendering branches

Simple leaf sub-parts (e.g., `card/_content`, `table/_row`) where the
component name is fully self-documenting don't need comments.
Reference: `app/views/kiso/components/_dialog.html.erb`,
`app/views/kiso/components/_button.html.erb`.

## CSS files (`app/assets/tailwind/kiso/`)

Every CSS file gets a header comment explaining:
- What the file does and **why CSS is needed** (ERB can't express it)
- The component's CSS mechanics (animations, pseudo-states, grid layout)

```css
/* ── Tooltip ──────────────────────────────────────────────────────────
 * Fixes popover UA stylesheet conflicts and provides entry/exit
 * animations via data-state attribute lifecycle.
 *
 * Why CSS: [popover] elements need UA display override and animation
 * keyframes that ERB can't express.
 * ──────────────────────────────────────────────────────────────────── */
```

Document non-obvious rules inline: UA stylesheet overrides, `@layer`
reasoning, `:where()` specificity strategies, `@custom-variant` usage,
animation lifecycles. Reference: `app/assets/tailwind/kiso/dashboard.css`,
`app/assets/tailwind/kiso/dialog.css`.

## JavaScript (`app/javascript/`)

Every Stimulus controller, method, property, and event must have JSDoc
comments. Class-level: `@example` with HTML usage, `@property` for
targets/values, `@fires` for dispatched events. Methods: `@param`,
`@returns`, `@private` as appropriate.

Additionally:
- `@module` tag on utility modules and the controller index
- Module-level description with `@example` blocks
- Stimulus values/targets: use correct lowercase types (`number`, `string`,
  `boolean` — not `Number`, `String`)

Reference: `app/javascript/controllers/kiso/select_controller.js`,
`app/javascript/kiso/utils/positioning.js`.
