# Kiso Development Plan

Current status and next steps for building Kiso. Read this when starting a
new session.

## Before You Start

Read these files in order:
1. `CLAUDE.md` — conventions, architecture, component pattern
2. `project/COMPONENT_STRATEGY.md` — theming recipes, class_variants patterns
3. `.claude/skills/contributing/SKILL.md` — component creation workflow

## Current Status

**Phase 1: Foundation** — in progress.

### What's Done

- [x] Gem skeleton (Rails engine, isolate_namespace, engine_name)
- [x] test/dummy/ app (Lookbook, Tailwind v4, Propshaft, port 4001)
- [x] Core helpers: `component_tag()`, `kiso()` in ComponentHelper
- [x] class_variants + tailwind_merge integration
- [x] Theme CSS: 7 semantic palettes + surface tokens + dark mode
- [x] Badge component (color × variant × size, compound variants)
- [x] Alert component (color × variant, CSS Grid with has-[>svg] auto-layout)
- [x] Button component (6 variants, smart tag, 5 sizes, has-[>svg] padding)
- [x] Card component (3 variants, 6 sub-parts, shadcn gap-6/py-6 spacing)
- [x] All components aligned div-for-div with shadcn structure
- [x] bin/kiso CLI (`make component NAME` scaffolds all files)
- [x] AI skills (usage + contributing)
- [x] Docs site (Bridgetown 2.1, Tailwind v4, sidebar nav, dark mode)
- [x] Docs pages for Badge, Alert, Button, Card
- [x] Overmind dev setup (root bin/dev, daemonized, Lookbook + CSS + docs)

### Open Issues

- **#2** — Theme override architecture for host apps
- **#4** — Icon system (standalone Ruby gem for Iconify icon sets)
- **#6** — Deploy docs site to GitHub Pages
- **#7** — Publish Lookbook and link from docs site
- **#8** — Live component previews in documentation pages
- **#9** — Polish component documentation to match Nuxt UI quality

### What's Next

**Batch 1 remaining:** Separator, Label, Empty State. Then Batch 2 (form inputs).

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

| Component | Type | Status | Notes |
|-----------|------|--------|-------|
| Badge | colored | done | color × variant × size, pill shape |
| Alert | colored | done | CSS Grid, has-[>svg] auto-layout |
| Button | colored | done | 6 variants, smart tag, has-[>svg] padding |
| Card | simple | done | 3 variants, 6 sub-parts |
| Separator | simple | **next** | Horizontal/vertical. |
| Label | simple | | For form fields. |
| Empty | simple | | Empty state placeholder. |

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

## Dev Environment

```bash
bin/dev                       # All services via Overmind (Lookbook :4001 + docs :4000)
overmind restart web          # Restart Lookbook server
overmind restart docs         # Restart docs server
bundle exec rake test         # Run tests
bundle exec standardrb --fix  # Lint & auto-format Ruby
```

## Reference

- shadcn source: `vendor/shadcn-ui` (git submodule)
- Nuxt UI source: `vendor/nuxt-ui` (git submodule)
- Lookbook source: https://github.com/ViewComponent/lookbook
- Maquina components: check Ninjanizr's Gemfile for the repo location
