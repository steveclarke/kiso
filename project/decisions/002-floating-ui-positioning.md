# ADR-002: Floating UI for Positioned Elements

**Status:** Accepted
**Date:** 2026-03-02
**Issue:** [#93](https://github.com/steveclarke/kiso/issues/93)

## Context

Kiso's `positionBelow()` utility positions dropdown content below an anchor
element using `offsetTop`/`offsetLeft` (relative to `offsetParent`) mixed
with `getBoundingClientRect()` (relative to viewport). In scroll containers
like the dashboard sidebar, these coordinate systems diverge — causing
dropdowns to clip at the viewport edge instead of flipping above the anchor.

Four controllers depend on this utility: `select`, `combobox`, `popover`,
and `dropdown_menu`. The dropdown_menu controller also has a separate
`_positionSubContent()` method with rudimentary fixed-position flip logic
for sub-menus.

## Decision

Replace `positionBelow()` with **Floating UI** (`@floating-ui/dom`, ~3KB
gzipped) as the positioning engine for all floating elements.

## Alternatives Considered

### CSS Anchor Positioning (native browser API)

```css
.trigger { anchor-name: --my-anchor; }
.dropdown {
  position: fixed;
  position-anchor: --my-anchor;
  position-area: bottom span-left;
  position-try-fallbacks: flip-block, flip-inline;
}
```

**Rejected.** Firefox still behind a flag (145+). No major component library
(Radix, Headless UI, Ark UI) has adopted it yet — signals real-world maturity
concerns. Limited to one scroll ancestor. Fixed offsets only (no dynamic
calculation). Would require maintaining two code paths (CSS + JS fallback).
Revisit when Firefox ships unflagged and libraries start adopting.

### Fix the hand-rolled utility

Switch `positionBelow()` to use `getBoundingClientRect()` consistently with
`position: fixed`, then add flip/shift logic manually.

**Rejected.** Reinvents what Floating UI already solves. Edge cases
accumulate over time: nested scroll containers, RTL layouts, iframe contexts,
`offsetParent` quirks. Every new positioned component adds surface area.
The dropdown_menu sub-content positioning already demonstrates the complexity
creep — it has its own separate positioning method.

## Why Floating UI

- **Industry standard** — used by shadcn (via Radix), Nuxt UI (via Radix
  Vue), Headless UI v2, Alpine Anchor plugin. These are our two source-of-truth
  libraries.
- **~3KB gzipped**, fully tree-shakeable. Only imported middleware ships.
- **Framework-agnostic** — `computePosition(reference, floating, options)`
  returns `{ x, y }`. Works directly in Stimulus controllers.
- **Middleware architecture** — `flip()`, `shift()`, `offset()`, `size()`,
  `autoUpdate()`. Compose only what you need.
- **Scroll container awareness** — resolves `offsetParent` correctly,
  detects clipping rects across nested scroll contexts.
- **`autoUpdate()`** — repositions on scroll, resize, and layout shift
  via `ResizeObserver`. Returns a cleanup function for Stimulus `disconnect()`.

## Integration

### Import strategy

Pin `@floating-ui/dom` ESM build from CDN for importmap apps. npm `exports`
handle bundler apps. Same dual-path as Stimulus and other Kiso JS deps.

```ruby
# config/importmap.rb (host app)
pin "@floating-ui/core", to: "https://cdn.jsdelivr.net/npm/@floating-ui/core@1/+esm"
pin "@floating-ui/dom", to: "https://cdn.jsdelivr.net/npm/@floating-ui/dom@1/+esm"
pin "@floating-ui/utils", to: "https://cdn.jsdelivr.net/npm/@floating-ui/utils@0/+esm"
pin "@floating-ui/utils/dom", to: "https://cdn.jsdelivr.net/npm/@floating-ui/utils@0/dom/+esm"
```

### Positioning utility

Replace `positioning.js` with a thin wrapper around Floating UI that provides
Kiso-specific defaults:

```javascript
import { computePosition, flip, shift, offset, autoUpdate } from "@floating-ui/dom"

export function positionContent(reference, floating, options = {}) { ... }
export { autoUpdate }
```

### Stimulus lifecycle

Controllers call `autoUpdate()` on open and the returned cleanup function
on close/disconnect. This handles scroll and resize repositioning.

## Consequences

- **New runtime dependency** — `@floating-ui/dom` (~3KB). Acceptable for
  what it solves. Host apps that don't use positioned components can
  tree-shake it away.
- **importmap setup** — host apps using importmap-rails need CDN pins.
  Document in Getting Started guide and install generator.
- **All 4 controllers get flip/shift** — select, combobox, popover,
  dropdown_menu. Sub-menu positioning in dropdown_menu also uses Floating UI.
- **`autoUpdate` cleanup** — must be managed in Stimulus `disconnect()` and
  on close. Straightforward pattern but must not be forgotten.
- **Positioning props** — components can expose `placement` and `offset`
  via `data-` attributes, matching shadcn/Radix patterns.
