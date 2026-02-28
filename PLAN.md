# Kiso Development Plan

Current status and next steps for building Kiso. Read this when starting a
new session.

## Before You Start

Read these files in order:
1. `CLAUDE.md` — conventions, architecture, component pattern
2. `project/component-strategy.md` — theming recipes, class_variants patterns
3. `.claude/skills/contributing/SKILL.md` — component creation workflow and checklist

## Current Status

**Phase 1: Maquina Parity** — in progress. Port all maquina_components so
Ninjanizr can swap `gem "maquina-components"` for `gem "kiso"`.

Reference: `vendor/maquina_components/` (local checkout)

### What's Done

- [x] Gem skeleton (Rails engine, isolate_namespace, engine_name)
- [x] lookbook/ app (Lookbook, Tailwind v4, Propshaft, port 4001)
- [x] Core helpers: `kui()`, `kiso_prepare_options()` in ComponentHelper
- [x] class_variants + tailwind_merge integration
- [x] Theme CSS: 7 semantic palettes + surface tokens + dark mode
- [x] Badge component (color × variant × size, compound variants)
- [x] Alert component (color × variant, CSS Grid with has-[>svg] auto-layout)
- [x] Button component (6 variants, smart tag, 5 sizes, has-[>svg] padding)
- [x] Card component (3 variants, 6 sub-parts, shadcn gap-6/py-6 spacing)
- [x] Separator component (horizontal/vertical, decorative prop)
- [x] Empty State component (5 sub-parts, media variant, shadcn structure)
- [x] Stats Card + Stats Grid (dashboard metrics, Card-like variants, tabular-nums)
- [x] Table (7 sub-parts, semantic HTML, scrollable container, shadcn 1:1)
- [x] All components aligned div-for-div with shadcn structure
- [x] bin/kiso CLI (`make component NAME` scaffolds all files)
- [x] AI skills (usage + contributing)
- [x] Docs site (Bridgetown 2.1, Tailwind v4, sidebar nav, dark mode)
- [x] Docs pages for all shipped components
- [x] Overmind dev setup (root bin/dev, daemonized, Lookbook + CSS + docs)
- [x] Lookbook preview layout with default padding
- [x] Batch 2: Form inputs (Field, Label, Input, Textarea, Checkbox, Radio Group, Switch, Select, Input Group, Field Group, Field Set)
- [x] Batch 3: Stimulus components (Toggle, Toggle Group, Breadcrumb, Popover, Dropdown Menu, Combobox, Command, Select)
- [x] Kbd, Pagination components
- [x] Playwright E2E + Vitest unit test infrastructure (#73)
- [x] 3-tier testing strategy (`project/testing-strategy.md`)
- [x] Agentic component factory (builder + reviewer agents, worktree isolation)

### Open Issues

- **#4** — Icon system (standalone Ruby gem for Iconify icon sets)
- **#6** — Deploy docs site to GitHub Pages
- **#7** — Publish Lookbook and link from docs site
- **#8** — Live component previews in documentation pages
- **#9** — Polish component documentation to match Nuxt UI quality

### What's Next

**Batch 1 complete. Batch 2 complete. Batch 3 mostly complete** (Toast, Calendar,
Date Picker remaining). Current priorities:

- **#74** — Write Playwright E2E tests for all existing components
- **#75** — Organize project documentation
- Toast / Calendar / Date Picker — remaining Batch 3 components
- Header deferred to Phase 2 (page-level layouts: Header, Sidebar, Page)

## Phase 1: Maquina Parity

Goal: Port every maquina_components component into Kiso so Ninjanizr can
replace `gem "maquina-components"` with `gem "kiso"` and see zero visual
changes. This is the sole focus until done.

### Component Scaffold Command

```bash
bin/kiso make component badge              # colored (color × variant axes)
bin/kiso make component separator --no-colored  # simple (variant only)
```

This generates theme module, ERB partial, Lookbook previews, and updates
kiso.rb + skill docs. Then fill in the implementation.

### Components to Build (Priority Order)

Start with the simplest, build up to Stimulus-dependent ones. Every component
below exists in maquina_components.

**Batch 1 — Simple (ERB + computed classes only):**

| Component | Type | Status | Maquina Notes |
|-----------|------|--------|---------------|
| Badge | colored | done | color × variant × size, pill shape |
| Alert | colored | done | CSS Grid, has-[>svg] auto-layout, sub-parts |
| Button | colored | done | 6 variants, smart tag, has-[>svg] padding |
| Card | simple | done | 3 variants, 6 sub-parts (+ action sub-part) |
| Separator | simple | done | Horizontal/vertical, decorative |
| Empty State | simple | done | 5 sub-parts: header, media, title, description, content |
| Stats | simple | done | Stats card + stats grid for dashboards |
| Table | simple | done | 7 sub-parts: header, body, footer, row, head, cell, caption |

**Batch 2 — Form inputs:**

Kiso uses `kui(:input)` partials with class_variants themes and
`data-slot` identity attributes (shadcn v4 convention).

| Component | Type | Status | Notes |
|-----------|------|--------|-------|
| Label | simple | done | Form field label, required indicator |
| Input | simple | done | Text input styling |
| Textarea | simple | done | Text area styling |
| Select | simple | done | Native select styling (+ Stimulus select) |
| Checkbox | simple | done | Custom styled checkbox |
| Radio Group | simple | done | Custom styled radio group |
| Switch | simple | done | Toggle switch |
| Field | simple | done | Composable form field wrapper |
| Input Group | simple | done | Inline prefix/suffix addons |

**Batch 3 — With Stimulus controllers:**

| Component | Type | Status | Notes |
|-----------|------|--------|-------|
| Toggle | simple | done | Stimulus toggle, aria-pressed |
| Toggle Group | colored | done | Single/multi select, keyboard nav |
| Breadcrumb | simple | done | 7 sub-parts, responsive collapse |
| Popover | simple | done | Stimulus, anchor/trigger/content |
| Dropdown Menu | simple | done | Stimulus, keyboard nav, sub-menus |
| Combobox | simple | done | Stimulus, search + select, multi-select |
| Command | simple | done | Stimulus, keyboard nav, dialog variant |
| Select | simple | done | Stimulus, keyboard nav, form integration |
| Toast / Toaster | colored | | Auto-dismiss, flash integration |
| Calendar | simple | | Date grid, range mode, min/max |
| Date Picker | simple | | Calendar + popover trigger |

### Also Needed for Phase 1

- [ ] Install generator (`bin/rails generate kiso:install`)
- [ ] Icons helper (`icon()` — port maquina's `icon_for()` or use Iconify)
- [ ] Pagination helper (Pagy integration, port from maquina)
- [ ] Toast helper (flash message integration)
- [ ] Sidebar helper (cookie-based state)
- [ ] importmap config for Stimulus controllers

### Phase 1 Milestone

Ninjanizr replaces `gem "maquina-components"` with `gem "kiso"` in its
Gemfile. `bin/rails generate kiso:install`. Zero visual changes. All
existing components work. Start dogfooding.

## Phase 2: Core Additions

New components not in maquina. Build these after Ninjanizr is on Kiso.

- Header (top nav bar, app shell)
- Sidebar (collapsible, mobile offcanvas)
- Page (page header + body layout)
- Dialog (native `<dialog>`)
- Sheet (slide-over variant)
- Drawer (bottom sheet variant)
- Popover (native Popover API)
- Collapsible (native `<details>`)
- Avatar, Skeleton, Progress, Spinner
- Tabs (panel switching, ARIA)
- Tooltip (CSS + JS positioning)
- Slider (range input)
- Item / ItemGroup (list items with media, content, actions)
- Number Stepper (increment/decrement input)

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

## Dev Environment

```bash
bin/dev                         # All services via Overmind (Lookbook :4001 + docs :4000)
bin/dev restart web             # Restart Lookbook server
bin/dev restart docs            # Restart docs server
bundle exec rake test           # Ruby tests
npm run test:unit               # JS unit tests (Vitest)
npm run test:e2e                # E2E tests (Playwright, needs bin/dev)
bundle exec standardrb --fix    # Ruby lint
npm run lint && npm run fmt     # JS lint + format
```

## Reference

- shadcn source: `vendor/shadcn-ui` (git submodule)
- Nuxt UI source: `vendor/nuxt-ui` (git submodule)
- Maquina components: `vendor/maquina_components` (local checkout)
- Lookbook source: https://github.com/ViewComponent/lookbook
