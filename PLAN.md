# Kiso Development Plan

Current status and next steps for building Kiso. Read this when starting a
new session.

## Before You Start

Read these files in order:
1. `CLAUDE.md` — conventions, architecture, component pattern
2. `docs/COMPONENT_STRATEGY.md` — theming recipes, class_variants patterns
3. `.claude/skills/contributing/SKILL.md` — component creation workflow

## Current Status

**Phase 1: Foundation** — in progress.

### What's Done

- [x] Gem skeleton (Rails engine, isolate_namespace, engine_name)
- [x] test/dummy/ app (Lookbook, Tailwind v4, Propshaft, port 4000)
- [x] Core helpers: `component_tag()`, `kiso()` in ComponentHelper
- [x] class_variants + tailwind_merge integration
- [x] Theme CSS: 7 semantic palettes + surface tokens + dark mode
- [x] Badge component (two-axis: color × variant × size, compound variants)
- [x] bin/kiso CLI (`make component NAME` scaffolds all files)
- [x] AI skills (usage + contributing)
- [x] PR #1: bootstrap-dummy-app-and-badge

### Open Issues

- **#2** — Theme override architecture (should engine ship defaults so host
  apps only need overrides?)
- **#3** — Lookbook dark mode toggle not applying to preview iframe

## Phase 1: Foundation

Goal: Port maquina components into Kiso so Ninjanizr can replace
`maquina-components` with `kiso` and see zero visual changes.

### Component Scaffold Command

```bash
bin/kiso make component badge              # colored (color × variant axes)
bin/kiso make component separator --no-colored  # simple (variant only)
```

This generates theme module, ERB partial, Lookbook previews, and updates
kiso.rb + skill docs. Then fill in the implementation.

### Components to Build (Priority Order)

Start with the simplest, build up to Stimulus-dependent ones.

**Batch 1 — Simple (ERB + computed classes only):**

| Component | Type | Notes |
|-----------|------|-------|
| Button | colored | Solid/outline/soft/subtle/ghost/link variants. Smart tag (a vs button). |
| Card | simple | Composed: Header, Title, Description, Content, Footer sub-parts. |
| Alert | colored | Icon + title + description. |
| Separator | simple | Horizontal/vertical. |
| Label | simple | For form fields. |
| Empty | simple | Empty state placeholder. |

**Batch 2 — Form inputs (CSS-only, applied via data attributes):**

| Component | Type | Notes |
|-----------|------|-------|
| Input | simple | Text input styling. |
| Input Group | simple | Input with leading/trailing addons. |
| Textarea | simple | Auto-grow optional. |
| Select | simple | Native select styling. |
| Checkbox | simple | Custom styled. |
| Radio | simple | Custom styled. |
| Switch | simple | Toggle switch. |

**Batch 3 — With Stimulus controllers:**

| Component | Type | Notes |
|-----------|------|-------|
| Table | simple | Header, Body, Row, Cell sub-parts. |
| Toast | colored | Auto-dismiss, Stimulus controller. |
| Tabs | simple | Panel switching, ARIA. |
| Toggle Group | colored | Multi-select toggle buttons. |
| Dropdown Menu | simple | Trigger + Content + Items. Stimulus. |
| Combobox | simple | Search + select. Stimulus. |
| Breadcrumbs | simple | With truncation. |
| Sidebar | simple | Collapsible navigation. |

**Batch 4 — Port from Ninjanizr app:**

| Component | Type | Notes |
|-----------|------|-------|
| Item / ItemGroup | simple | List items with media, content, actions. |
| Page | simple | Page header + body layout. |
| Number Stepper | simple | Increment/decrement input. Stimulus. |
| Calendar | colored | Date grid. Stimulus. |
| Date Picker | colored | Calendar + input. Stimulus. |
| Slider | simple | Range input. |
| Tooltip | simple | CSS + JS positioning. |

### Also Needed for Phase 1

- [ ] Install generator (`bin/rails generate kiso:install`)
- [ ] Icons helper (`icon()` — Iconify via Tailwind CSS plugin)
- [ ] Pagination helper
- [ ] Breadcrumbs helper
- [ ] Combobox helper
- [ ] importmap config for Stimulus controllers

### Phase 1 Milestone

Ninjanizr replaces `gem "maquina-components"` with `gem "kiso"` in its
Gemfile. `bin/rails generate kiso:install`. Zero visual changes. All
existing components work.

## Phase 2: Core Additions

New components not in maquina:

- Dialog (native `<dialog>`)
- Sheet (slide-over variant)
- Drawer (bottom sheet variant)
- Popover (native Popover API)
- Collapsible (native `<details>`)
- Avatar, Skeleton, Progress, Spinner

**Milestone:** ~85% of common UI needs covered.

## Phase 3: Advanced Interactions

- Command palette, Context Menu, Hover Card, Navigation Menu
- Alert Dialog, Input OTP, Scroll Area, Kbd, Aspect Ratio

**Milestone:** Full shadcn parity for Rails.

## Phase 4: Ecosystem

- Form builder integration
- Data Table (sorting + filtering + pagination)
- Charts
- Pre-composed layout blocks (auth, settings, dashboards)

## Reference

- shadcn source: `/Users/steve/src/vendor/shadcn-ui`
- Nuxt UI source: `/Users/steve/src/vendor/nuxt-ui`
- Lookbook source: `/Users/steve/src/vendor/lookbook`
- Maquina components: check Ninjanizr's Gemfile for the repo location
