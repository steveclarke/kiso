# Kiso Dashboard Layout Strategy

**Status**: Decided
**Date**: 2026-02-28
**Context**: Adversarial review of four competing layout strategies for the Kiso dashboard shell

---

## Decision

The recommended architecture is a hybrid: **CSS Grid on the layout shell driven by a single `data-sidebar` attribute on a wrapping element, with Stimulus values for state management and cookie persistence, and Rails `content_for` as the slot system**. The layout shell is NOT a `kui()` component — it is an ERB frame. The sidebar content area IS fed through a `with_sidebar` builder block. The Fizzy CSS-Grid-first approach wins the layout question; the Kiso-Native approach wins the state and override API question; ShadCN wins on FOUC prevention; Nuxt UI's `grow min-w-0 overflow-hidden` primitive is adopted verbatim.

---

## Rejected Approaches

### `margin-left` transition (ShadCN v4)

Rejected outright. `margin-left` transitions trigger layout reflow on every animation frame because the browser must recalculate positions of all elements in the normal flow. CSS Grid column width transitions or `transform` transitions use the compositor thread. There is no argument for `margin-left` here — ShadCN uses it because React portals and DOM structure force it. We do not have that constraint.

### Full component hierarchy for layout (Nuxt UI 4)

Rejected for layout shells. `kui(:dashboard_group)`, `kui(:dashboard_sidebar)`, `kui(:dashboard_panel)`, `kui(:dashboard_navbar)` — four nested component calls for what is fundamentally a frame. The frame does not change. A developer adding a new page should write zero component calls to get the frame; they should only fill named slots. The Nuxt UI semantic naming is correct as a *design vocabulary* but wrong as an *implementation strategy* at the layout layer. `DashboardGroup` rendered as a flex container is just a div with `flex h-screen` — that is not worth the abstraction cost. However, Nuxt UI's identification of `grow min-w-0 overflow-hidden` as the canonical Panel primitive is the single most important CSS insight from the debate and is adopted directly.

### Plain ERB with no component layer at all (Fizzy CSS-First, taken to its extreme)

Partially rejected. The Fizzy argument that "layout is a frame, not a component" is correct. The argument that `content_for :sidebar` is sufficient is also correct — for the slot system. But bare ERB provides no enforcement, no defaults, and no upgrade path. When the sidebar changes from 240px to 280px default, updating one Stimulus value in a component is one change; hunting down every layout file is not. The component holds the defaults. ERB fills the slots. These are different things.

### Flat `data-sidebar="*"` namespace (ShadCN v4)

Rejected. `data-sidebar="sidebar"`, `data-sidebar="menu"`, `data-sidebar="trigger"` — the same attribute name identifies both the element role and the state. This conflates two concerns. State (`open/collapsed`) lives on the wrapper. Identity (`sidebar`, `panel`, `trigger`) lives on `data-slot`. Mixing them into one attribute creates a lookup table in your head.

---

## Recommended Architecture

### The Core Insight: What Goes Where

| Concern | Mechanism |
|---|---|
| Layout geometry | CSS Grid, defined in layout ERB |
| Sidebar state | Single `data-sidebar-open` attribute on the grid wrapper |
| State persistence | Stimulus values + cookie |
| FOUC prevention | Server reads cookie, renders initial state as HTML attribute |
| Content injection | `content_for :sidebar`, `content_for :topbar`, `yield` |
| Element identity / override API | `data-slot` attributes |
| Design tokens | CSS custom properties on the wrapper, Tailwind v4 `@theme` |

### State Attribute Convention

Use `data-sidebar-open="true"` / `data-sidebar-open="false"` on the dashboard wrapper element. This wins over `data-state="expanded/collapsed"` (too generic — every popover in the system uses `data-state`) and `data-collapsed="true"` (negative naming — you must track absence of an attribute). A boolean attribute with a named subject reads clearly:

```css
[data-sidebar-open="true"] [data-slot="sidebar"] { /* expanded state */ }
[data-sidebar-open="false"] [data-slot="sidebar"] { /* collapsed state */ }
```

This is "a sentence". The selector tells you everything.

### Layout Geometry: CSS Grid

```css
/* In application.css or a dashboard layer */
[data-slot="dashboard"] {
  display: grid;
  grid-template-columns: var(--sidebar-width, 16rem) 1fr;
  grid-template-rows: auto 1fr;
  height: 100dvh;
  transition: grid-template-columns 200ms ease;
}

[data-slot="dashboard"][data-sidebar-open="false"] {
  grid-template-columns: var(--sidebar-collapsed-width, 4rem) 1fr;
}

/* On mobile: sidebar overlays via transform, grid is single column */
@media (max-width: 768px) {
  [data-slot="dashboard"] {
    grid-template-columns: 1fr;
  }
}
```

Grid wins over flexbox at the container level for one reason: the parent tracks the column. When the sidebar collapses, `grid-template-columns` changes and the browser reflows the content area correctly without any CSS on the content element itself. With flexbox, the Panel element must know about the sidebar width or use `min-w-0` tricks to behave. With grid, the Panel is just `grid-column: 2 / -1` — it occupies whatever space the grid gives it. The content area is genuinely independent.

The `transition: grid-template-columns` is GPU-composited via the compositor thread in modern browsers (Chrome 107+, Safari 16.4+, Firefox 117+). This is not `margin-left`.

### Mobile: Same Attribute, Different CSS

Mobile uses `transform` (GPU-composited) on the sidebar element, not a grid column change:

```css
@media (max-width: 768px) {
  [data-slot="sidebar"] {
    position: fixed;
    inset-block: 0;
    inset-inline-start: 0;
    z-index: 40;
    transform: translateX(-100%);
    transition: transform 200ms ease;
  }

  [data-sidebar-open="true"] [data-slot="sidebar"] {
    transform: translateX(0);
  }

  [data-slot="sidebar-scrim"] {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 39;
    background: rgb(0 0 0 / 0.4);
  }

  [data-sidebar-open="true"] [data-slot="sidebar-scrim"] {
    display: block;
  }
}
```

The Stimulus controller handles the scrim click (`data-action="click->dashboard#close"` on the scrim element). Zero additional JavaScript — same controller, same `data-sidebar-open` attribute. The Fizzy team proved this pattern in production; it is not theoretical.

### The Layout ERB (app/views/layouts/dashboard.html.erb)

```erb
<%# FOUC prevention: read sidebar state from cookie before first render %>
<% sidebar_open = cookies[:sidebar_open] != "false" %>

<!DOCTYPE html>
<html>
  <head>
    <%= render "layouts/head" %>
  </head>
  <body>
    <div
      data-slot="dashboard"
      data-sidebar-open="<%= sidebar_open %>"
      data-controller="dashboard"
      data-dashboard-open-value="<%= sidebar_open %>"
    >
      <%# Topbar: spans full width, grid row 1 %>
      <header data-slot="topbar" class="col-span-full flex items-center border-b bg-white px-4 h-14">
        <button
          data-action="click->dashboard#toggle"
          data-slot="sidebar-trigger"
          class="..."
          aria-label="Toggle sidebar"
        >
          <%# hamburger icon %>
        </button>
        <%= yield :topbar %>
      </header>

      <%# Sidebar: grid column 1, row 2 %>
      <nav data-slot="sidebar" class="flex flex-col border-r bg-white overflow-y-auto">
        <%= yield :sidebar %>
      </nav>

      <%# Main content: grid column 2, row 2 %>
      <main data-slot="main" class="grow min-w-0 overflow-hidden overflow-y-auto">
        <%= yield %>
      </main>

      <%# Mobile scrim %>
      <div data-slot="sidebar-scrim" data-action="click->dashboard#close"></div>
    </div>
  </body>
</html>
```

Note `grow min-w-0 overflow-hidden` on the main element — borrowed directly from Nuxt UI. This is the correct flex/grid primitive for a content area that must not blow out its grid track.

### The Stimulus Controller (app/javascript/controllers/dashboard_controller.js)

```javascript
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { open: Boolean }

  toggle() {
    this.openValue = !this.openValue
  }

  close() {
    this.openValue = false
  }

  openValueChanged(value) {
    this.element.dataset.sidebarOpen = value
    document.cookie = `sidebar_open=${value}; path=/; max-age=${60 * 60 * 24 * 365}`
  }
}
```

This is the entirety of the JavaScript. Stimulus values handle the reactive update. The cookie write is synchronous and immediate. No event bus, no shared state object, no provider context. The Kiso-Native argument that "Stimulus values + cookies = exactly the right amount of JavaScript" is correct.

The `data-controller` is on the same element as `data-sidebar-open`, so `openValueChanged` can write directly to `this.element.dataset`. No traversal, no querySelector.

### Slot System: `content_for`, Not `with_sidebar`

Pages fill slots with `content_for`:

```erb
<%# app/views/approvals/index.html.erb %>
<% content_for :sidebar do %>
  <%= render "shared/sidebar_nav", active: :approvals %>
<% end %>

<% content_for :topbar do %>
  <span class="text-sm font-medium text-gray-900">Approvals</span>
  <div class="ml-auto flex items-center gap-2">
    <%= render "approvals/filters" %>
  </div>
<% end %>

<%# The body of yield — the main content area %>
<div class="p-6">
  <%# page content %>
</div>
```

`content_for :sidebar` wins over a `with_sidebar` builder block because `content_for` can be called from *any nested partial*, not just the top-level view. A partial three levels deep can add to the topbar. A component can add a sidebar section. Rails solved this in 2007. The `with_sidebar` block requires the consumer to know the shape of the layout at the top-level view — it couples the call site to the hierarchy.

### Override API: `data-slot` on Every Named Element

Every named element in the dashboard gets `data-slot`. Consumers style via slot selectors without knowing DOM structure:

```css
/* App-level override: make the sidebar navy */
[data-slot="dashboard"] [data-slot="sidebar"] {
  @apply bg-navy-900 text-white border-navy-800;
}

/* Override just the trigger in a specific context */
[data-slot="sidebar-trigger"] {
  @apply rounded-lg hover:bg-gray-100;
}
```

This is the Kiso-Native insight applied correctly: the slot name is the public API. The DOM structure is an implementation detail.

---

## Why This Combination

The four advocates each identified one genuinely correct thing:

**ShadCN identified the FOUC problem correctly.** Reading the cookie server-side and rendering the initial `data-sidebar-open` attribute into the HTML is the only solution that eliminates FOUC without a flash-prevention script. Every other approach either flashes or runs blocking JavaScript.

**Nuxt UI identified the Panel primitive correctly.** `grow min-w-0 overflow-hidden` on the content area is the canonical solution to a flex/grid child that must fill available space without overflowing. This shows up in Nuxt UI's design because their engineers spent time on the problem. We adopt it.

**Fizzy CSS-First identified the correct axis.** CSS Grid at the parent level is the right tool. The grid parent tracks the sidebar column; the content child knows nothing. The `data-attribute`-on-wrapper pattern with CSS selectors responding to it is the correct coupling model. The production proof (kanban with drag-and-drop) validates it.

**Kiso-Native identified the correct override API.** `data-slot` on every named element is the right public contract. It survives DOM restructuring, it reads like documentation, and it gives consumers a stable target.

The `margin-left` approach is discarded. The full component hierarchy at the layout level is discarded. The bare-ERB-with-no-abstraction extreme is discarded. The flat `data-sidebar="*"` namespace is discarded.

---

## Developer Ergonomics

### Adding a New Page

A developer adding an "Invoices" page:

1. Create `app/views/invoices/index.html.erb`
2. Set the layout in the controller: `layout "dashboard"` (or it inherits from ApplicationController)
3. Fill slots and write content:

```erb
<% content_for :topbar do %>
  <h1 class="text-sm font-semibold">Invoices</h1>
  <div class="ml-auto">
    <%= link_to "New Invoice", new_invoice_path, class: "btn btn-primary" %>
  </div>
<% end %>

<% content_for :sidebar do %>
  <%= render "shared/sidebar_nav", active: :invoices %>
<% end %>

<div class="p-6 space-y-4">
  <%= render @invoices %>
</div>
```

That's it. The developer writes zero layout code. The sidebar opens and closes. State persists across Turbo navigations (the controller is on the persistent body element wrapper; Turbo morphs the inner content, not the wrapper). The cookie is read on the next server-rendered page.

### Customizing Sidebar Width

In the consuming app's CSS:

```css
[data-slot="dashboard"] {
  --sidebar-width: 20rem;
  --sidebar-collapsed-width: 5rem;
}
```

One declaration. The grid reacts. The Stimulus controller does not change.

### Adding a Second Sidebar (Right Panel)

```css
[data-slot="dashboard"] {
  grid-template-columns: var(--sidebar-width, 16rem) 1fr var(--panel-width, 0rem);
}

[data-panel-open="true"] [data-slot="dashboard"] {
  --panel-width: 20rem;
}
```

The grid extends naturally. No component changes. A separate Stimulus controller (or the same one with an additional value) manages `data-panel-open`.

---

## Implementation Checklist

- [ ] `dashboard_controller.js` with `openValue`, `toggle`, `close`, `openValueChanged`
- [ ] `layouts/dashboard.html.erb` with grid wrapper, topbar, sidebar, main, scrim
- [ ] Cookie read in layout: `cookies[:sidebar_open] != "false"`
- [ ] CSS in `dashboard.css` (or Tailwind layer): grid geometry, mobile transform, scrim visibility
- [ ] `data-slot` on all named elements: `dashboard`, `topbar`, `sidebar`, `sidebar-trigger`, `main`, `sidebar-scrim`
- [ ] Tailwind v4 `@theme` block for `--sidebar-width` and `--sidebar-collapsed-width` defaults
- [ ] Touch/pointer media query: `@media (any-hover: none)` for mobile behavior (Fizzy production pattern)
- [ ] System test: sidebar state persists across two Turbo navigations
- [ ] System test: no FOUC on page load with collapsed state cookie set
