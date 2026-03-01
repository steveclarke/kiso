# Kiso Dashboard Layout System: Technical Specification

## Part 1: Context and Goal

### What is Kiso?

Kiso is a Rails UI component framework built on four primitives that work together: ERB partials exposed via a `kui()` helper, the ClassVariants gem for variant-driven CSS class composition, Stimulus JS for lightweight browser-side behavior, and Tailwind CSS for utility-first styling. Components declare their semantic structure using `data-slot` attributes on their elements, which serve as stable CSS targeting hooks — the stable contract between the component and its styling. An outer stylesheet targets `[data-slot="nav-item-label"]` and the component implementation can restructure its internals freely as long as the slot attribute survives.

The `kui()` helper resolves to a component partial render. ClassVariants builds a class string from a base set of classes and named variants, keeping appearance decisions in a single location. Stimulus attaches behavior via `data-controller`, `data-action`, and `data-values` attributes without fighting the HTML. Tailwind v4 provides the design tokens via `@theme` blocks, which emit CSS custom properties that cascade normally through the document.

### The Goal

The goal is a standard dashboard layout system that any Kiso-based Rails application can adopt. The layout must include: a persistent sidebar for primary navigation, a topbar across the full content width for page-level actions and context, a collapsible mobile menu that overlays content without reflowing the page, and a scrollable content area that fills all remaining space.

Four constraints drive every decision in this document:

**Tailwind-based geometry.** All layout dimensions come from Tailwind utility classes or CSS custom properties declared in a Tailwind `@theme` block. No arbitrary pixel values scattered across partials.

**State persists across Turbo navigations.** Turbo Drive replaces the `<body>` on navigation. The sidebar's open/closed state must survive this. The solution is a cookie read by the server before the next render, so the `<body>` arrives at the browser already in the correct state.

**Code nesting mirrors visual nesting.** Reading the ERB layout file should produce a mental wireframe of the page. The sidebar element is a sibling of the main content element. The topbar is inside the main content area. This is exactly how they visually relate.

**Developer ergonomics are excellent.** A developer who knows Rails should be able to add a new dashboard page in under five minutes. They fill named content slots from their views, pick a layout, and write their content. No new mental models required beyond `content_for` and `yield`.

---

## Part 2: Research Phase — Four Frameworks Studied

### 2A: ShadCN v4 (React)

ShadCN v4 ships a full sidebar system built around React Context. `SidebarProvider` wraps the entire layout and manages two pieces of state: `open` (desktop sidebar open/closed) and `openMobile` (mobile drawer open/closed). Any component anywhere in the tree calls `useSidebar()` to read or set state — the context eliminates prop drilling.

`AppSidebar` is a component rendered inside the provider. `SidebarInset` is the main content area. Crucially, `SidebarInset` uses `margin-left: var(--sidebar-width)` to shift right when the sidebar opens, and transitions `margin-left` on open/close. The sidebar itself is `position: fixed` and does not participate in document flow.

`SidebarTrigger` is a button with zero internal logic: it calls `useSidebar().toggleSidebar()` and nothing else. State lives entirely in the context.

To prevent flash of unstyled content (FOUC) on initial render, ShadCN reads a cookie named `sidebar_state` server-side and renders the layout with the correct initial state before any JavaScript runs. The cookie is written whenever toggle is called.

Every element carries a `data-sidebar` attribute: `data-sidebar="sidebar"`, `data-sidebar="menu"`, `data-sidebar="trigger"`, `data-sidebar="inset"`. These are stable CSS hooks — the stylesheet targets them rather than class names, so internal restructuring doesn't break overrides.

CSS custom properties drive dimensions: `--sidebar-width: 16rem` and `--sidebar-width-collapsed: 3rem`.

On mobile, the sidebar becomes a Sheet component — a `position: fixed` drawer that slides in from the edge using CSS transform.

**What is worth borrowing from ShadCN:**

The cookie → server-render → correct-initial-attribute pattern is the right answer to FOUC and must be adopted wholesale. There is no better approach. Write the cookie on toggle, read it in a `before_action`, set the attribute in the layout template. The browser paints the correct state on first load every time.

The `data-*` attribute as a CSS hook (rather than class name) is also correct. Stable, semantic, readable in the stylesheet. `[data-sidebar="inset"]` tells you what the element is. `.ml-64` tells you nothing.

**What to avoid:**

The `margin-left` transition is the single worst decision in the ShadCN sidebar implementation, and it is inherited from virtually every prior dashboard pattern. When `margin-left` transitions, the browser must recalculate layout on every animation frame: the content element is simultaneously changing its left offset and its width, because `margin-left` affects both where the box starts and how wide the remaining space is. This is a layout reflow per frame. It is not GPU-composited. On low-end devices it jitters. CSS Grid eliminates this problem entirely — the content column expands and contracts as a grid track, which the browser can composite without reflowing content.

The flat `data-sidebar` namespace conflates two separate concepts: component hierarchy and element role. `data-sidebar="sidebar"` and `data-sidebar="menu"` and `data-sidebar="inset"` all share the same attribute name. This makes the CSS harder to read and makes attribute-based queries ambiguous.

Importing React Context as an architecture pattern into Rails ERB produces awkward results. There is no context. There is no component tree. There is an HTML document. The state belongs on the document root, not approximated through a Stimulus "provider" controller.

### 2B: Nuxt UI 4 (Vue/Nuxt)

Nuxt UI 4 implements its dashboard layout as a strict component hierarchy. `UDashboardGroup` is the outermost wrapper: `display: flex; flex-direction: row; height: 100%` — a pure flexbox row that holds everything. `UDashboardSidebar` is a flex child: `flex-shrink: 0; width: var(--ui-sidebar-width)` — it holds its own width and refuses to shrink. `UDashboardPanel` is the main content area: `flex-grow: 1; min-width: 0; overflow: hidden` — it fills all remaining horizontal space. `UDashboardNavbar` sits inside the panel as a flex child: `flex-shrink: 0; height: var(--ui-header-height); border-bottom` — the topbar.

A `useResizable` composable provides drag-to-resize: a drag handle updates `--sidebar-width` via `element.style.setProperty`, which flows to all consumers. On drag end, the value is persisted to a cookie and the server restores it on next request.

On mobile, `UDashboardSidebar` becomes a `USlideover` — `position: fixed`, off-canvas, animated with `translate-x`. Content never moves; the sidebar overlays it.

Vue's named slot syntax provides `<template #header>` and `<template #footer>` inside the sidebar component.

The `min-w-0` on the panel element is the critical detail. Without it, a flex child will not shrink below its intrinsic content width. A table or a wide pre-formatted code block inside the panel will cause the panel to overflow the container. `min-w-0` overrides the flex child's default `min-width: auto` to zero, allowing shrinking below content width. This sounds like a quirk, but it is in fact the correct flexbox model — the default exists for good reason in most contexts.

**What is worth borrowing from Nuxt UI:**

The semantic naming convention is excellent. `dashboard_group`, `dashboard_sidebar`, `dashboard_panel`, `dashboard_navbar` read like a wireframe. When you read the component hierarchy in ERB you see the layout. This naming discipline should be applied to the slot names in the Rails implementation.

The `grow min-w-0 overflow-hidden` combination on the main panel is the correct flex-child formula and must be adopted. The specific classes are right.

CSS custom properties for sidebar width are correct. All consumers — sidebar element, nav items, CSS transitions — read from one source of truth. Changing the sidebar width means changing one variable.

Mobile off-canvas via CSS transform (not JS-computed positioning) is the right technique. `translateX(-100%)` moves the sidebar off-screen without affecting document layout. `translateX(0)` brings it on-screen. Both are GPU-composited. No JavaScript measures the sidebar width at runtime.

**What to avoid:**

Vue's slot syntax inspired thinking about a procedural `with_sidebar` block API in ERB. That pattern adds ceremony. Rails `content_for`/`yield` is already the slot system, it is already built into the framework, and it is more powerful — a partial three levels deep in the render tree can fill a slot in the layout. Do not reinvent this.

The `flex-shrink: 0` sidebar combined with `flex-grow: 1` panel is correct but the component system must silently enforce `min-w-0` on the panel or it becomes a footgun. With CSS Grid, this footgun does not exist — grid tracks distribute space at the grid level, not the child level.

### 2C: Fizzy (Production Rails App by 37signals)

Fizzy is a kanban-style project management application — the codebase in this repository. It is a production Rails application, not a component library, which makes it more useful as a reference: it shows what patterns actually hold up under years of feature development.

Fizzy's body layout is a CSS Grid: `grid-template-rows: auto 1fr auto 9em` — header, main, footer, navigation bar. The page-level structure is owned by the parent grid. Children don't define their own sizes relative to each other; the grid allocates them.

`#global-container` uses `display: contents`. This is a technique for attaching Stimulus controllers or adding wrapper divs without interfering with the grid layout. A `display: contents` element is invisible to the layout algorithm — its children participate in the parent grid as if the wrapper didn't exist.

Fizzy's dark mode is a single `html[data-theme="dark"]` attribute swap. All colors are OKLCH custom properties defined under `:root`. The `data-theme="dark"` selector overrides them. Zero `dark:` Tailwind prefixes appear anywhere in the component tree. The cascade handles everything.

Touch detection uses `@media (any-hover: hover)` for pointer devices and `@media (any-hover: none)` for touch devices. This is more accurate than `max-width` breakpoints for adapting UI to interaction model — a tablet in landscape mode has a large viewport but touch interaction.

The most important Fizzy pattern for this specification: **state is a data attribute on the root element, and CSS cascade does the rest.** Fizzy sets one attribute. Fifty CSS rules respond. No JavaScript reads computed styles. No JavaScript measures element dimensions. The Stimulus controller sets the attribute and steps back.

Fizzy's kanban columns use a CSS Grid with `grid-template-columns: 1fr auto 1fr` and a `:has()` selector that changes the template when a column is expanded. Zero JavaScript for the layout change — only CSS.

Z-index is managed through CSS custom properties: `--z-nav: 20`, `--z-flash: 30`, `--z-bar: 50` defined in `:root`. No ad-hoc z-index values appear in component stylesheets.

**What is worth borrowing from Fizzy:**

CSS Grid for body layout — the parent owns the tracks, children participate without negotiating with each other. This is structurally correct.

The `data-attribute-on-root` state machine is the correct Rails/Stimulus pattern. It is Fizzy's central architectural contribution visible in this codebase. One attribute. CSS cascade. Everything responds. This document adopts it without modification.

`display: contents` for Stimulus attachment wrappers. This solves the real problem: you need to attach a Stimulus controller to an element, but inserting that element breaks your grid or flex layout. `display: contents` makes the wrapper invisible to layout while preserving the DOM attachment point.

`@media (any-hover)` for touch detection. More semantically correct than viewport-width breakpoints for interaction-model differences.

CSS custom properties for all design tokens including z-index. Prevents the endemic Rails app problem of z-index values scattered across dozens of files with no relationship to each other.

**What to avoid:**

Fizzy does not have a traditional sidebar. Its navigation is popover and dialog based, reflecting its mobile-first kanban focus. The sidebar pattern must be designed from scratch. Fizzy's specific implementation cannot be lifted.

Fizzy does not use Tailwind — it uses handwritten CSS with custom properties. Patterns need translation into Tailwind v4's `@theme` system. The concepts transfer; the syntax does not.

### 2D: Tailwind/Rails Ecosystem

The Rails Tailwind UI ecosystem consists of several libraries and patterns.

`shadcn-rails` ports ShadCN React components to ERB partials. It uses the same `data-*` attribute API as ShadCN, with Stimulus replacing React hooks. This confirms that the ShadCN data-attribute contract translates cleanly to Rails, but the `margin-left` problem travels with it.

RailsUI and Maquina Components are thin ERB partial wrappers around Tailwind utility classes. They accelerate initial development but provide no component abstraction — developers modify the partials directly, and design system consistency requires discipline rather than enforcement.

Tailwind UI's application shell patterns are documented HTML blocks — copy-paste layouts with Tailwind classes. They are correct and production-proven but explicitly not abstracted. Tailwind UI expects you to own the HTML.

The idiomatic Stimulus pattern in Rails is `data-controller="sidebar" data-action="click->sidebar#toggle"`. This is universally understood by Rails developers and should not be deviated from.

Rails `content_for` is the native slot system for layout composition. It has been in Rails since version 2. It is more powerful than Vue named slots because any partial at any nesting depth can fill a named slot without the filling partial being a direct child of the layout component. This power is used deliberately in the final architecture.

**What is worth borrowing:**

`content_for` for filling sidebar and topbar slots. Do not invent an alternative.

Tailwind v4 `@theme` blocks for design token CSS custom properties. This is the idiomatic way to define design tokens in a Tailwind v4 project — they become `var(--*)` properties automatically.

The Stimulus toggle pattern for sidebar open/close.

**What to avoid:**

Copy-paste HTML with no abstraction is unmaintainable at scale. When the sidebar nav item design changes, it must change in one place.

Component libraries that abstract too much create fighting-the-API problems. If a developer cannot customize a nav item without forking the component, the abstraction has negative value. The correct level of abstraction is: layout is open HTML, UI primitives (nav items, buttons, badges) are components.

---

## Part 3: Four Adversarial Proposals

### 3A: The ShadCN v4 Approach (Provider/Inset Pattern)

This proposal translated the React Provider pattern directly into Rails ERB. The `<body>` element serves as the provider:

```html
<body data-controller="sidebar-provider"
      data-sidebar-provider-open-value="true"
      data-sidebar-provider-cookie-value="sidebar_state">
```

The sidebar element carries `data-sidebar="sidebar"`. The main content area carries `data-sidebar="inset"` and uses `margin-left: var(--sidebar-width)` with a CSS transition. The trigger button carries `data-sidebar="trigger"` and fires the action. The Stimulus controller on the body element owns all state, persists the cookie, and reads the cookie on `connect()`.

**Its strongest arguments:**

Provider-on-body genuinely survives Turbo Drive navigations. When Turbo Drive navigates, it replaces the `<body>` element — but it reads the new body's attributes from the server-rendered response. If the server reads the cookie and emits the correct `data-sidebar-provider-open-value` on the body, the state is correct after every navigation. This is not a React-specific pattern; it is a cookie-to-server-render pattern that works identically in Rails.

Server-rendered initial state from cookie equals zero FOUC. This is mathematically true regardless of which framework implements it. The proposal gets this right.

The `data-sidebar` attributes as semantic CSS hooks do survive HTML restructuring. Adding a wrapper div inside `[data-sidebar="sidebar"]` does not break the CSS. This is the correct insight.

**Where it lost the debate:**

The `margin-left` transition is a layout reflow per animation frame. This is not a minor performance concern — on Safari on iPhone it produces visible jitter. When `margin-left` changes, the browser recalculates the content element's position AND its width simultaneously, because `margin-left` affects both. CSS Grid eliminates this: the grid reallocates track sizes, which can be composited without recalculating content layout. The content inside the `1fr` column never moves relative to its column.

The flat `data-sidebar` namespace is genuinely confusing at scale. `data-sidebar="sidebar"` marks the sidebar element. `data-sidebar="menu"` marks the nav list inside it. `data-sidebar="inset"` marks the content area. These are structurally different: some identify components, some identify elements within a component. Using the same attribute namespace for both makes CSS selectors read ambiguously.

Importing React Context architecture into ERB produces friction. The Stimulus controller ends up approximating a context provider by attaching to `<body>` and using `data-values` as a substitute for context state. This is not idiomatic Stimulus — Stimulus values are for a controller's own state, not application-wide shared state. The cookie-to-server-render pattern is the idiomatic Rails equivalent of SSR context, and it belongs in `ApplicationController`, not in a Stimulus controller's `connect()`.

### 3B: The Nuxt UI 4 Approach (Flexbox Hierarchy)

This proposal directly translated Nuxt UI's component hierarchy into `kui()` components:

```erb
<%= kui(:dashboard_group) do %>
  <%= kui(:dashboard_sidebar) do %>
    <%= yield :sidebar %>
  <% end %>
  <%= kui(:dashboard_panel) do %>
    <%= kui(:dashboard_navbar) do %>
      <%= yield :topbar %>
    <% end %>
    <div class="flex-1 overflow-y-auto">
      <%= yield %>
    </div>
  <% end %>
<% end %>
```

Each component emits the corresponding Tailwind classes: `dashboard_group` emits `flex flex-row h-full`; `dashboard_sidebar` emits `shrink-0 w-[var(--sidebar-width)]`; `dashboard_panel` emits `grow min-w-0 overflow-hidden`; `dashboard_navbar` emits `shrink-0 h-14 border-b`.

**Its strongest arguments:**

Code nesting exactly mirrors visual structure. Reading the ERB template above produces a complete mental wireframe. The sidebar is a sibling of the panel. The navbar is inside the panel. The content is inside the panel below the navbar. This is exactly how they appear on screen. This is a genuine advantage over flat layouts where the visual relationship must be inferred.

The `grow min-w-0 overflow-hidden` formula on the panel element is correct flex behavior. It is the only set of classes that makes a flex child fill remaining space while allowing it to shrink below its content width and clip overflowing content. The component encapsulates this knowledge so the developer doesn't have to know about `min-w-0`.

Multi-panel layouts are free. If a board view needs a secondary details panel alongside main content, you add another `kui(:dashboard_panel)` and flex distributes the space. No architectural change required.

Resizable sidebar via drag is cleanly implemented: the drag handler updates `--sidebar-width` via `style.setProperty`, and every consumer — sidebar width, nav item sizing, content offset — reacts automatically through the CSS custom property cascade.

The semantic naming is self-documenting. `dashboard_navbar` tells any developer that this is a page-level navigation bar, distinguishing it from a card's action bar or a section header.

**Where it lost the debate:**

The `min-w-0` footgun moves from being a developer responsibility to being a component responsibility, but it is still a footgun. If a developer extends the panel with a custom wrapper, they must remember `min-w-0`. CSS Grid eliminates this class of problem: grid tracks distribute space at the grid level. The content column `1fr` always fills what remains; it cannot overflow the grid parent without explicit permission.

Wrapping the entire layout in `kui(:dashboard_group)` adds abstraction to what is ultimately a layout file. Layout files exist to be read and understood by any Rails developer, not to be components. Adding a component wrapper means a developer must look up the `dashboard_group` component to understand the layout structure. Plain HTML is self-documenting.

The FOUC problem still requires server-side cookie restoration. This proposal did not address it, instead acknowledging it as out of scope. But FOUC is not out of scope — a sidebar that flashes from open to closed on every page load is a broken user experience.

The component hierarchy, while elegant, is slightly over-engineered for what is ultimately a two-column layout with a header. The abstraction costs more than it saves at this level of the stack.

### 3C: The Fizzy CSS-First Approach (No Component Abstraction)

This proposal argued that the layout is not a component and should use zero `kui()` components for its shell. The layout ERB file uses plain HTML with Tailwind classes:

```erb
<body class="grid grid-rows-[var(--topbar-height)_1fr] h-dvh overflow-hidden"
      data-controller="sidebar"
      data-sidebar-open="true">
  <header class="col-span-full flex items-center h-14 border-b px-4 bg-background">
    <button data-action="sidebar#toggle" aria-expanded="true">☰</button>
    <%= yield :topbar %>
  </header>
  <div class="grid overflow-hidden [grid-template-columns:var(--sidebar-current-width)_1fr]">
    <aside class="sidebar-rail overflow-hidden border-r bg-sidebar">
      <nav class="sidebar-nav w-[--sidebar-width] p-4">
        <%= yield :sidebar %>
      </nav>
    </aside>
    <main class="overflow-y-auto p-6 bg-background">
      <%= yield %>
    </main>
  </div>
</body>
```

The CSS:
```css
body[data-sidebar-open="true"]  { --sidebar-current-width: var(--sidebar-width); }
body[data-sidebar-open="false"] { --sidebar-current-width: 0rem; }

.sidebar-rail {
  width: var(--sidebar-current-width);
  transition: width 220ms cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.sidebar-nav {
  width: var(--sidebar-width);
  height: 100%;
  overflow-y: auto;
}
```

The Stimulus controller: set `data-sidebar-open` to the toggled value, write the cookie. Five lines total.

**Its strongest arguments:**

The CSS Grid `grid-template-columns: var(--sidebar-current-width) 1fr` is the correct geometry primitive. The grid parent owns the tracks. The sidebar column IS `--sidebar-current-width`. When that variable transitions from `16rem` to `0rem`, the grid reallocates its tracks and the `1fr` content column expands automatically. No JavaScript. No margin. No `position: fixed`. The content column expands because the sidebar column contracted — this is GPU-compositable track reallocation, not layout reflow.

One data attribute on `<body>` gives every CSS rule in the application the ability to respond to sidebar state. A component three levels deep in the render tree can target `body[data-sidebar-open="false"] [data-slot="nav-item-label"]` without importing anything, without registering anything, without prop drilling. This is the power of the cascade applied deliberately.

Fizzy proves this pattern at production scale: complex kanban layouts, expand/collapse column behaviors via `:has()`, drag and drop, responsive behaviors — all from class and attribute toggles, zero JavaScript for layout logic.

Layout is not a component. Layout is a frame. The Rails developer who knows `yield` and `content_for` understands the entire layout file in two minutes. No component documentation required.

**Where it lost the debate:**

No design system enforcement. A developer writing a new section of the app can deviate from sidebar conventions by editing the classes directly. The component-based approaches enforce conventions by making divergence require an API violation rather than a typo.

The scrim for mobile overlay requires a real DOM element or careful pseudo-element use. A `::before` pseudo-element on `<body>` cannot receive click events in all browsers. The component-based approach wraps this in the component so developers cannot forget it.

The FOUC fix requires server-side cookie restoration. This proposal admitted it but called it "slight boilerplate." It is not slight — it requires a `before_action` in `ApplicationController`, a controller instance variable, and the variable referenced in the `<body>` tag. Three changes across three files. Still the right approach, but not negligible.

CSS custom properties are not type-safe. `--sidebar-wiidth` (typo) fails silently. The `@theme` block provides no validation. This is a real operational risk that the proposal did not address.

### 3D: The Kiso-Native Approach (Extend Existing Patterns)

This proposal built the dashboard as a proper Kiso layout component using all existing Kiso conventions: ClassVariants for theme definition, `data-slot` attributes on every structural element, Stimulus values API for state, and a `kui()` helper wrapping the layout.

```ruby
module Kiso::Themes
  DashboardLayout = ClassVariants.build(
    base: "grid h-dvh overflow-hidden",
    variants: {}
  )

  DashboardSidebar = ClassVariants.build(
    base: "flex flex-col shrink-0 h-full border-r bg-[--sidebar-background]",
    variants: {}
  )
end
```

```erb
<%# _dashboard_layout.html.erb %>
<div data-controller="kiso--dashboard"
     data-kiso--dashboard-collapsed-value="<%= @sidebar_collapsed %>"
     data-slot="dashboard"
     class="<%= Kiso::Themes::DashboardLayout.call %>">
  <div data-slot="dashboard-sidebar"
       class="<%= Kiso::Themes::DashboardSidebar.call %>">
    <%= yield(:sidebar) %>
  </div>
  <div data-slot="dashboard-main" class="flex flex-col grow min-w-0 overflow-hidden">
    <header data-slot="dashboard-topbar" class="shrink-0 h-14 border-b flex items-center px-4">
      <%= yield(:topbar) %>
    </header>
    <main data-slot="dashboard-content" class="flex-1 overflow-y-auto">
      <%= yield %>
    </main>
  </div>
</div>
```

```javascript
static values = { collapsed: Boolean }
connect() {
  this.element.dataset.collapsed = this.collapsedValue
}
collapsedValueChanged() {
  this.element.dataset.collapsed = this.collapsedValue
  document.cookie = `kiso_sidebar_collapsed=${this.collapsedValue};path=/;max-age=31536000`
}
toggle() { this.collapsedValue = !this.collapsedValue }
```

```css
[data-slot="dashboard-sidebar"] { width: var(--sidebar-width); transition: width 220ms ease; }
[data-collapsed="true"] [data-slot="dashboard-sidebar"] { width: 0; }
```

**Its strongest arguments:**

The `data-slot` CSS targeting is the correct override API. The slot name is the stable contract between the component and its styling. `[data-collapsed="true"] [data-slot="dashboard-sidebar"]` reads as a sentence: "when the dashboard is collapsed, the dashboard sidebar gets these styles." No class names in the middle of that chain. The DOM can restructure freely.

The Stimulus values API with `collapsedValueChanged()` provides a single source of truth. When the value changes — from any call site — the callback fires, the attribute updates, and the cookie persists. This is more robust than manually calling `toggle()` from multiple places.

Zero new concepts for a developer who already knows Kiso. Same `kui()`, same `data-slot`, same Stimulus values, same `content_for`. The dashboard layout is just another Kiso component.

Rails `content_for` outperforms Vue named slots. A partial rendered inside a card inside a column inside a board can fill `:topbar` with breadcrumb content, and that content appears in the layout topbar. Vue slot content must be passed up explicitly; Rails `content_for` buffers from anywhere in the render tree.

**Where it lost the debate:**

Wrapping the layout in a `kui()` component adds a layer of indirection that serves no clear purpose. A layout file's job is to be readable. When the layout is a component, a developer must read both the layout file and the component's theme definition to understand the layout geometry. Plain HTML in a Rails layout file is already the right abstraction level for a layout.

The `data-collapsed` attribute on the component root is slightly less expressive than `data-sidebar-open` on the body. The body attribute allows any CSS in the application to respond to sidebar state without a CSS selector that must traverse from body to the specific component. When the attribute is on `<body>`, the cascade reaches everywhere.

---

## Part 4: The Final Recommended Architecture

### 4.1 The Core Decision: Layout is ERB, Components Fill the Inside

The layout shell is not a `kui()` component. The layout is a Rails layout ERB file — `app/views/layouts/dashboard.html.erb` — with Tailwind classes directly on semantic HTML elements. Every Rails developer understands layout files. Every Rails developer understands `yield`. This is the correct level of abstraction for the frame that holds all pages.

`kui()` components handle the UI primitives that appear inside the layout: nav section headers, nav items with icons and active states, user avatars in the sidebar footer, topbar action buttons, notification badge counts. These primitives repeat across pages. They have design system requirements. They benefit from component encapsulation.

This is the synthesis that resolved the debate: the CSS-first advocate was correct that the shell should be HTML, and the Kiso-native advocate was correct that the internals should be components. The layout file is the frame; `kui()` components are the picture.

The sidebar open/closed state attribute lives on `<body>`. It is set by the server before first paint via a cookie. It is toggled by a five-line Stimulus controller. CSS cascade does everything else — animations, collapsed widths, mobile overlay behavior, nav item label hiding when collapsed.

### 4.2 Layout Geometry: CSS Grid for the Sidebar Track

CSS Grid wins for the sidebar layout geometry for one reason: the grid parent owns the tracks.

When the layout uses `grid-template-columns: var(--sidebar-current-width) 1fr`, the sidebar column is `--sidebar-current-width`. It does not have a width; it IS the track. When `--sidebar-current-width` transitions from `16rem` to `0rem`, the grid recomputes track sizes. The `1fr` content column automatically expands to fill the freed space. This recomputation is GPU-compositable — the browser does not need to recalculate where content elements are positioned relative to each other.

Compare with `margin-left`: the content element has `margin-left: var(--sidebar-width)`. When the sidebar closes, the margin must decrease and the content element's left edge must move. These are two simultaneous layout effects: position change and width change. The browser must re-layout the content element and all its descendants on every animation frame. On a page with a complex content tree this is expensive. On a phone this jitters.

Compare with pure flexbox: `flex-shrink: 0` sidebar and `flex-grow: 1` panel is correct, but the flex model distributes free space among children; it has no concept of a named "sidebar track." The sidebar element must know its own width. The panel element must know it can grow. The CSS Grid approach inverts this: the parent knows the track sizes, children participate without negotiating dimensions.

The body layout uses `grid-rows`:

```html
<body class="grid grid-rows-[var(--topbar-height)_1fr] h-dvh overflow-hidden bg-background"
      data-controller="sidebar"
      data-sidebar-open="<%= @sidebar_open %>">
```

`h-dvh` uses the dynamic viewport height unit, which accounts for mobile browser chrome appearing and disappearing. `overflow-hidden` on the body prevents the layout from causing page-level scroll — scroll happens inside the content area, not the viewport.

The topbar occupies the first row via `col-span-full`. The second row contains the inner grid for sidebar and content:

```html
<div class="grid overflow-hidden [grid-template-columns:var(--sidebar-current-width)_1fr] row-start-2">
```

Arbitrary property syntax `[grid-template-columns:var(--sidebar-current-width)_1fr]` is valid Tailwind v4 and generates the correct CSS.

### 4.3 State Machine: One Data Attribute, CSS Does the Rest

The state attribute `data-sidebar-open` on `<body>` is the application's single source of truth for sidebar state. It has two values: `"true"` and `"false"`. No other values. No other attributes.

The CSS in `app/assets/stylesheets/dashboard.css`:

```css
@layer components {
  /* Track variable follows state attribute */
  body[data-sidebar-open="true"]  { --sidebar-current-width: var(--sidebar-width); }
  body[data-sidebar-open="false"] { --sidebar-current-width: 0rem; }

  /* Sidebar rail: owns width, clips content, animates */
  .sidebar-rail {
    overflow: hidden;
    width: var(--sidebar-current-width);
    transition: width var(--sidebar-duration) var(--ease-out-expo);
  }

  /* Inner nav: always full sidebar-width, scrolls independently */
  .sidebar-nav {
    width: var(--sidebar-width);
    height: 100%;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  /* Mobile: sidebar becomes a fixed overlay, never a grid column */
  @media (max-width: 767px) {
    .sidebar-rail {
      position: fixed;
      inset-block: 0;
      inset-inline-start: 0;
      z-index: var(--z-sidebar);
      width: var(--sidebar-width);
      transform: translateX(calc(-1 * var(--sidebar-width)));
      transition: transform var(--sidebar-duration) var(--ease-out-expo);
    }

    body[data-sidebar-open="true"] .sidebar-rail {
      transform: translateX(0);
    }

    /* Content column never moves on mobile */
    .content-grid {
      grid-template-columns: 0 1fr;
    }

    /* Real scrim element, not ::before pseudo, for click event support */
    .sidebar-scrim {
      display: none;
    }

    body[data-sidebar-open="true"] .sidebar-scrim {
      display: block;
      position: fixed;
      inset: 0;
      z-index: calc(var(--z-sidebar) - 1);
      background: oklch(0% 0 0 / 40%);
    }
  }
}
```

The two-layer trick for the sidebar animation: the `.sidebar-rail` element is `overflow: hidden` and its `width` transitions. The `.sidebar-nav` inside it is always `width: var(--sidebar-width)` — it never squashes. The nav items inside it never compress or reflow. The rail clips the nav as it closes. This means text in the sidebar doesn't squish into single characters as the sidebar closes — it is cleanly clipped.

On mobile, the rail switches from a grid column participant to `position: fixed` with a CSS transform animation. The content grid column is forced to `0 1fr` so the content area occupies the full viewport. The sidebar overlays it. The scrim is a real DOM element rather than a `::before` pseudo-element so it can receive click events.

`data-sidebar-open` was chosen over alternatives for specific reasons. `data-state="expanded"` conflicts with the `data-state` attribute used by other components like popovers and accordions. `data-collapsed="true"` uses negative naming — tracking a negative boolean is confusing in CSS selectors. Class toggles cannot carry values and cannot distinguish `sidebar-open` from `sidebar-pinned` from `sidebar-hovered`.

### 4.4 Design Tokens via Tailwind v4 `@theme`

All layout dimensions, animation parameters, color tokens, and z-index values are declared as CSS custom properties in a Tailwind v4 `@theme` block. This makes them available both as `var(--*)` references in raw CSS and as Tailwind utilities via the token name.

```css
@import "tailwindcss";

@theme {
  /* Sidebar geometry */
  --sidebar-width:            16rem;
  --sidebar-width-icon:       3.5rem;

  /* Layout heights */
  --topbar-height:            3.5rem;

  /* Sidebar surface color tokens */
  --sidebar-background:       var(--color-white);
  --sidebar-foreground:       var(--color-gray-900);
  --sidebar-border:           var(--color-gray-200);
  --sidebar-accent:           var(--color-gray-100);
  --sidebar-accent-foreground: var(--color-gray-700);

  /* Animation */
  --sidebar-duration:         220ms;
  --ease-out-expo:            cubic-bezier(0.16, 1, 0.3, 1);

  /* Z-index stack — defined once, referenced everywhere */
  --z-sidebar:     40;
  --z-scrim:       39;
  --z-topbar:      30;
  --z-flash:       50;
}

/* Dark mode: single selector overrides all sidebar tokens */
.dark {
  --sidebar-background:        var(--color-gray-950);
  --sidebar-foreground:        var(--color-gray-100);
  --sidebar-border:            var(--color-gray-800);
  --sidebar-accent:            var(--color-gray-800);
  --sidebar-accent-foreground: var(--color-gray-300);
}
```

No `dark:` Tailwind prefixes appear on any sidebar or layout element. Every element uses `bg-[--sidebar-background]` or `text-[--sidebar-foreground]`, and the token values flip when `.dark` is applied to `<html>`. The entire layout adapts to dark mode without a single per-element dark variant.

### 4.5 FOUC Prevention — Cookie to Server Render

Flash of unstyled content occurs when the browser paints the initial state and then JavaScript immediately changes it. The sidebar rendering open and then snapping closed in the first 50ms is a bad user experience that signals technical debt. It is preventable.

The prevention is: write the sidebar state to a cookie on every toggle, read the cookie server-side before every render, emit the correct `data-sidebar-open` value on `<body>` in the HTML response. The browser paints the correct state. JavaScript never corrects it.

```ruby
# app/controllers/application_controller.rb
before_action :restore_sidebar_state

private

  def restore_sidebar_state
    @sidebar_open = cookies[:sidebar_open] != "false"
  end
```

The default is `true` (sidebar open). A missing cookie means open. The string `"false"` means closed. Any other value means open. This is explicit and unambiguous.

```erb
<%# In the <body> tag of app/views/layouts/dashboard.html.erb %>
<body data-sidebar-open="<%= @sidebar_open %>">
```

The controller writes the cookie on toggle:

```javascript
document.cookie = `sidebar_open=${next};path=/;max-age=31536000;SameSite=Lax`
```

`SameSite=Lax` is correct for a first-party cookie that survives navigation. `max-age=31536000` is one year — persistent across browser restarts.

### 4.6 The Stimulus Controller

The entire sidebar Stimulus controller:

```javascript
// app/javascript/controllers/sidebar_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["trigger", "scrim"]

  toggle() {
    const isOpen = this.element.dataset.sidebarOpen !== "false"
    const next   = String(!isOpen)

    this.element.dataset.sidebarOpen = next
    document.cookie = `sidebar_open=${next};path=/;max-age=31536000;SameSite=Lax`

    if (this.hasTriggerTarget) {
      this.triggerTarget.setAttribute("aria-expanded", next)
    }
  }

  closeOnMobile() {
    if (window.innerWidth < 768) {
      this.element.dataset.sidebarOpen = "false"
      document.cookie = "sidebar_open=false;path=/;max-age=31536000;SameSite=Lax"
    }
  }
}
```

The controller sets one attribute on one element. The CSS does everything else. No JavaScript reads `getComputedStyle`. No JavaScript measures `offsetWidth`. No JavaScript sets `element.style.width`. The controller does not know how the sidebar is displayed. It only knows whether it is open.

`closeOnMobile()` is connected to the scrim element's click event so tapping outside the mobile sidebar closes it. The width check prevents this from firing on desktop where the scrim is hidden via CSS.

### 4.7 The Complete Dashboard Layout File

```erb
<%# app/views/layouts/dashboard.html.erb %>
<!DOCTYPE html>
<html lang="en" class="<%= @dark_mode ? 'dark' : '' %>">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>

    <%= stylesheet_link_tag "application", data: { turbo_track: "reload" } %>
    <%= javascript_importmap_tags %>

    <title><%= content_for(:title).presence || "App" %></title>
    <%= yield :head %>
  </head>

  <%#
    The <body> is the sidebar state machine.
    data-controller="sidebar" attaches the Stimulus controller.
    data-sidebar-open is set by the server from the cookie — zero FOUC.
    CSS reads this attribute to set --sidebar-current-width and control
    mobile overlay behavior.
  %>
  <body class="grid grid-rows-[var(--topbar-height)_1fr] h-dvh overflow-hidden bg-background text-foreground"
        data-controller="sidebar"
        data-sidebar-open="<%= @sidebar_open %>">

    <%#
      Topbar spans both grid columns (col-span-full).
      Sits in row 1 of the body grid.
      Fixed height via --topbar-height token.
    %>
    <header class="col-span-full flex items-center gap-3 px-4 border-b border-border bg-background
                   shrink-0 h-[--topbar-height] z-[--z-topbar]">

      <%# The hamburger / toggle button %>
      <button data-sidebar-target="trigger"
              data-action="click->sidebar#toggle"
              aria-label="Toggle sidebar"
              aria-expanded="<%= @sidebar_open %>"
              aria-controls="sidebar-panel"
              class="flex items-center justify-center w-8 h-8 rounded-md
                     text-foreground/60 hover:text-foreground hover:bg-accent
                     transition-colors duration-150">
        <%# Icon — replace with kui(:icon) or your icon system %>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
             viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             aria-hidden="true">
          <line x1="4" x2="20" y1="12" y2="12"/>
          <line x1="4" x2="20" y1="6" y2="6"/>
          <line x1="4" x2="20" y1="18" y2="18"/>
        </svg>
      </button>

      <%# Views fill this slot with page title, breadcrumbs, action buttons %>
      <%= yield :topbar %>
    </header>

    <%#
      The inner grid for sidebar + content.
      grid-template-columns uses --sidebar-current-width which the body
      state attribute controls. When open: 16rem 1fr. When closed: 0rem 1fr.
      overflow-hidden clips the sidebar as it collapses.
    %>
    <div class="content-grid grid overflow-hidden [grid-template-columns:var(--sidebar-current-width)_1fr]">

      <%#
        The sidebar rail: clips the nav as it collapses.
        On desktop: width transitions via --sidebar-current-width.
        On mobile: position:fixed, transform-based slide, handled by CSS.
        The rail's overflow:hidden ensures content is clipped, not squashed.
      %>
      <aside id="sidebar-panel"
             class="sidebar-rail border-r border-[--sidebar-border] bg-[--sidebar-background]"
             aria-label="Sidebar navigation">

        <%#
          The inner nav: always full sidebar width.
          Never squashes regardless of rail width.
          This is the key two-layer sidebar trick.
        %>
        <nav class="sidebar-nav flex flex-col">
          <%= yield :sidebar %>
        </nav>
      </aside>

      <%#
        Main content area: overflow-y-auto for page-level scroll.
        min-w-0 prevents content from overflowing the 1fr grid column.
        (CSS Grid 1fr columns can have children that overflow without min-w-0
        because grid tracks don't enforce child intrinsic sizing by default.)
      %>
      <main class="min-w-0 overflow-y-auto bg-background" id="main-content">
        <%= yield %>
      </main>

      <%#
        Mobile scrim: a real DOM element so it can receive click events.
        Hidden via CSS on desktop. Appears via CSS when body[data-sidebar-open="true"]
        on mobile breakpoints.
      %>
      <div class="sidebar-scrim"
           data-sidebar-target="scrim"
           data-action="click->sidebar#closeOnMobile"
           aria-hidden="true">
      </div>
    </div>
  </body>
</html>
```

Every structural decision in this file has a corresponding explanation in this document. The layout file is the implementation; this spec is the rationale.

### 4.8 What `kui()` Components Are Used Inside the Layout

The layout file provides the frame. `kui()` components provide the furniture. These are the components used inside the layout's named slots.

**`kui(:nav_section, title:)`** renders a sidebar navigation section with a category title. It emits `data-slot="nav-section"` on the wrapper and `data-slot="nav-section-title"` on the heading. CSS can target `[data-slot="nav-section-title"]` to control typography or hide titles when the sidebar is collapsed.

**`kui(:nav_item, href:, icon:)`** renders a navigation link. It emits `data-slot="nav-item"` on the link element and `data-slot="nav-item-label"` on the text span. When the sidebar collapses, a single CSS rule hides all labels:

```css
body[data-sidebar-open="false"] [data-slot="nav-item-label"] {
  opacity: 0;
  width: 0;
  overflow: hidden;
}
```

The nav item component does not know about sidebar collapse state. The parent body attribute and CSS cascade handle it. The component only needs to emit the correct slot attribute.

**`kui(:avatar, user:)`** renders a user avatar in the sidebar footer. Emits `data-slot="avatar"`. The sidebar footer is part of the sidebar nav and collapses with it.

**`kui(:button, variant:)`** renders topbar action buttons. Emits `data-slot="button"`.

**`kui(:badge, count:)`** renders notification count badges on nav items. Emits `data-slot="badge"`.

A nav item with a badge and icon in practice:

```erb
<%= kui(:nav_item, href: boards_path, icon: "squares-2x2") do %>
  <span data-slot="nav-item-label">Boards</span>
  <%= kui(:badge, count: @unread_count) if @unread_count > 0 %>
<% end %>
```

### 4.9 Developer Ergonomics — What You Actually Write

The day-to-day experience of building a new section of the application:

**Step 1: Assign the layout in the controller.**

```ruby
# app/controllers/boards_controller.rb
class BoardsController < ApplicationController
  layout "dashboard"
end
```

That is the only controller change. `restore_sidebar_state` runs automatically via the `before_action` in `ApplicationController`.

**Step 2: Populate the sidebar from a shared partial.**

For sections that share the same sidebar navigation across all their pages, render the sidebar partial once from a `before_action` or a layout-level `content_for`:

```erb
<%# app/views/layouts/dashboard.html.erb — add above yield :sidebar %>
<% content_for :sidebar do %>
  <%= render "shared/sidebar_nav" %>
<% end %>
```

The shared partial:

```erb
<%# app/views/shared/_sidebar_nav.html.erb %>

<%# Sidebar header with logo and app name %>
<div class="flex items-center gap-2 px-4 h-[--topbar-height] border-b border-[--sidebar-border] shrink-0">
  <%= image_tag "logo.svg", class: "w-6 h-6", alt: "" %>
  <span data-slot="nav-item-label" class="font-semibold text-sm text-[--sidebar-foreground]">
    ApprovThis
  </span>
</div>

<%# Navigation sections %>
<div class="flex-1 overflow-y-auto py-4 px-2 space-y-6">
  <%= kui(:nav_section, title: "Workspace") do %>
    <%= kui(:nav_item, href: dashboard_path, icon: "home") do %>
      <span data-slot="nav-item-label">Dashboard</span>
    <% end %>
    <%= kui(:nav_item, href: boards_path, icon: "squares-2x2") do %>
      <span data-slot="nav-item-label">Boards</span>
      <%= kui(:badge, count: 3) %>
    <% end %>
  <% end %>
</div>

<%# Sidebar footer with user info %>
<div class="shrink-0 p-3 border-t border-[--sidebar-border]">
  <%= kui(:avatar, user: current_user) %>
</div>
```

**Step 3: Fill the topbar from the view.**

```erb
<%# app/views/boards/show.html.erb %>
<% content_for :topbar do %>
  <nav class="flex items-center gap-1 text-sm text-foreground/60" aria-label="Breadcrumb">
    <%= link_to "Boards", boards_path, class: "hover:text-foreground" %>
    <span aria-hidden="true">/</span>
    <span class="text-foreground font-medium"><%= @board.name %></span>
  </nav>

  <div class="ml-auto flex items-center gap-2">
    <%= kui(:button, variant: :primary, size: :sm) do %>
      New Card
    <% end %>
  </div>
<% end %>

<%# Content — just write your page — no layout wrapper needed %>
<div class="p-6">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <%# board columns %>
  </div>
</div>
```

**Step 4: Fill the topbar from a nested partial.**

This works without any additional wiring:

```erb
<%# app/views/cards/_show.html.erb — rendered three levels deep %>
<% content_for :topbar do %>
  <%= render "shared/card_breadcrumb", card: @card %>
<% end %>

<article class="p-6 max-w-3xl mx-auto">
  <%# card content %>
</article>
```

Rails buffers `content_for` across the entire render chain. The breadcrumb partial can be inside a partial inside a partial inside the view — `content_for :topbar` still fills the topbar slot in the layout. This is the superpower of Rails layouts over framework-specific slot systems.

### 4.10 Dark Mode Strategy

Dark mode requires no per-element `dark:` prefixes anywhere in the layout or sidebar. The implementation:

All color values on layout and sidebar elements reference CSS custom property tokens:
- `bg-[--sidebar-background]` instead of `bg-white dark:bg-gray-950`
- `text-[--sidebar-foreground]` instead of `text-gray-900 dark:text-gray-100`
- `border-[--sidebar-border]` instead of `border-gray-200 dark:border-gray-800`

The `@theme` block declares light-mode defaults. The `.dark` selector on `<html>` overrides them:

```css
.dark {
  --sidebar-background:        var(--color-gray-950);
  --sidebar-foreground:        var(--color-gray-100);
  --sidebar-border:            var(--color-gray-800);
  --sidebar-accent:            var(--color-gray-800);
  --sidebar-accent-foreground: var(--color-gray-300);
}
```

A Stimulus theme controller toggles the `.dark` class:

```javascript
// app/javascript/controllers/theme_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  toggle() {
    const dark = document.documentElement.classList.toggle("dark")
    localStorage.setItem("theme", dark ? "dark" : "light")
    document.cookie = `theme=${dark ? "dark" : "light"};path=/;max-age=31536000;SameSite=Lax`
  }
}
```

The same FOUC prevention applies: read the theme cookie server-side, render `<html class="dark">` when appropriate.

```ruby
# app/controllers/application_controller.rb
before_action :restore_theme

private

  def restore_theme
    @dark_mode = cookies[:theme] == "dark"
  end
```

```erb
<html lang="en" class="<%= "dark" if @dark_mode %>">
```

Zero JavaScript required after first paint. The browser paints dark mode immediately.

### 4.11 Mobile Behavior in Detail

On screens narrower than 768px, the sidebar's role changes completely. On desktop it is a grid column. On mobile it is a fixed overlay. The CSS handles both without any JavaScript change.

The `.content-grid` forces `grid-template-columns: 0 1fr` on mobile — the sidebar column in the grid is zero width. Content occupies the full viewport. The sidebar itself switches to `position: fixed` and uses a CSS transform:

```css
@media (max-width: 767px) {
  .sidebar-rail {
    position: fixed;
    inset-block: 0;
    inset-inline-start: 0;
    z-index: var(--z-sidebar);
    /* Override the desktop width: rail is always full sidebar-width on mobile */
    width: var(--sidebar-width);
    /* Hidden by default via transform */
    transform: translateX(calc(-1 * var(--sidebar-width)));
    transition: transform var(--sidebar-duration) var(--ease-out-expo);
  }

  body[data-sidebar-open="true"] .sidebar-rail {
    transform: translateX(0);
  }

  .content-grid {
    grid-template-columns: 0 1fr;
  }
}
```

The toggle button fires `sidebar#toggle`, which flips `data-sidebar-open` on `<body>`. The same Stimulus controller, the same attribute, the same cookie write — but the CSS responds differently because the media query changes which rules apply.

The scrim is a real `<div>` element attached to the `sidebar-scrim` Stimulus target. On desktop it has `display: none` via `.sidebar-scrim { display: none }`. On mobile, when `body[data-sidebar-open="true"]`, the CSS shows it as a full-viewport overlay. Because it is a real element (not a `::before` pseudo-element), it receives pointer events. Clicking the scrim fires `closeOnMobile()` on the sidebar controller, which sets `data-sidebar-open="false"` if the viewport is narrow.

RTL support is built in via `inset-inline-start` instead of `left`. The sidebar appears on the left in LTR locales and on the right in RTL locales without any additional CSS.

---

## Part 5: What NOT to Build

The following patterns were considered and explicitly rejected. An implementation agent should not introduce any of them.

**No `kui(:dashboard_group)` wrapper component.** The layout is a Rails layout ERB file. Layout files are the correct abstraction level for page frames. A component wrapper adds indirection without encapsulating anything the layout file does not already make obvious. ERB layouts are readable, composable via `yield`/`content_for`, and understood by every Rails developer.

**No `margin-left` transition for sidebar open/close.** The `margin-left` approach requires the content element to know the sidebar width and causes layout reflow on every animation frame. CSS Grid track resizing via `--sidebar-current-width` is GPU-compositable and requires zero knowledge in the content element.

**No React Context / Provider pattern.** There is no component tree in Rails ERB. There is a document. State on the document root (the `<body>` element) propagates to all CSS selectors via the cascade. This is the Rails/CSS equivalent of React Context, and it is more powerful because it is available to all CSS rules in the application without registration or import.

**No Vue slot system approximation.** Rails `content_for`/`yield` is the slot system. It is already built in. It is more powerful than Vue named slots because it works across unlimited nesting depth. Do not invent a `with_sidebar` block API or a slot registration system.

**No flexbox-only layout.** Pure flexbox for sidebar-plus-content works, but it puts sizing responsibility on the children (`flex-shrink: 0` on sidebar, `flex-grow: 1 min-w-0` on panel). CSS Grid puts sizing on the parent, which is the correct model: the layout parent owns the geometry, children participate without negotiating dimensions.

**No JavaScript for sidebar width measurement or inline style setting.** The sidebar width is `var(--sidebar-width)` — a CSS custom property defined in `@theme`. JavaScript never reads `getComputedStyle`. JavaScript never calls `element.style.setProperty` for layout purposes. CSS custom properties and the cascade handle all sizing. The Stimulus controller sets one boolean attribute.

**No `dark:` Tailwind prefixes on layout elements.** All layout and sidebar colors are CSS custom property tokens. The `.dark` class on `<html>` overrides those tokens. This means dark mode is a single selector override, not a per-element duplicate-class problem. The sidebar will have dozens of color references; maintaining `dark:` variants on each is error-prone and verbose.

**No separate mobile Stimulus controller.** The same `sidebar_controller.js` handles both desktop and mobile. The Stimulus controller sets one attribute. The CSS applies different rules at different breakpoints. Splitting the controller would duplicate the toggle and cookie logic for no benefit.

**No `data-state` attribute for sidebar open/closed.** The `data-state` attribute is used by disclosure components, accordions, popovers, and other interactive components throughout the UI. Using it for sidebar state creates attribute naming collision and makes CSS selectors ambiguous. `data-sidebar-open` is unambiguous and specific.
