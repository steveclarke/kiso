# CLAUDE.md

## Project Overview

**Kiso** (Japanese: foundation) — a Rails engine gem providing UI components
inspired by shadcn/ui and Nuxt UI. ERB partials, Tailwind CSS, progressive
Stimulus.

## Key References

- `project/design-system.md` — **read before building any component**. Strict
  compound variant formulas, semantic token table, Nuxt UI token mapping,
  and **spatial system** (heights, padding, gaps, typography, radius, icon
  sizing — all extracted from shadcn/ui). Every colored component uses
  identical formulas — no exceptions. Every component uses spatial values
  from the established scales — no arbitrary values.
- `project/component-strategy.md` — class_variants patterns, compound variants,
  theming, override system, dark mode, two-layer architecture.
- `project/code-documentation.md` — YARD, ERB, CSS, and JSDoc standards with
  examples. Read before writing docs on any file type.
- `project/finalize-checklist.md` — per-component and per-PR checklists
  (triggered via `/finalize`).
- `.claude/skills/contributing/SKILL.md` — component creation workflow and checklist
- `skills/kiso/` — AI skill with component reference (update when adding components)

## Framework Mindset

Kiso is a UI framework, not an app. Every decision becomes a precedent that
all components must follow. **No one-off exceptions.** Before adding a Tailwind
class, a token, a prop name, or a structural pattern to any component, ask:
"Does every other component handle this the same way?" If not, fix the
inconsistency across all components — don't make a local exception. When in
doubt, consult before making a change that only applies to one component.
Consistency is more important than any individual improvement.

## Key Conventions

- **Global theme overrides** — host apps override component styles globally
  via `Kiso.configure { |c| c.theme[:button] = { base: "rounded-full" } }`.
  Layer order: theme default < global config < per-instance `css_classes:`.
  See `project/component-strategy.md` Override System section.
- **Computed Tailwind classes in ERB** — theme modules define variant class
  strings, partials render them. No `@apply` in CSS. CSS files only for
  transitions, animations, pseudo-states that ERB can't express.
- **Two-axis variants (Nuxt UI pattern)** — components with colors use
  `color:` + `variant:` axes with compound variants. **Compound variant
  formulas are identical across all colored components** — copy from an
  existing component (Badge), never invent new formulas. See
  `project/design-system.md`.
- **Semantic tokens** — `bg-primary`, `text-foreground`, `bg-muted`, etc.
  Components never use raw palette shades or `dark:` prefixes.
- **Tailwind v4 CSS variable syntax** — use **parentheses** for CSS variable
  references: `bg-(--my-color)`. **Never use square brackets** for CSS
  variables — `bg-[--my-color]` is broken in v4. Square brackets are only
  for literal arbitrary values like `text-[11px]`.
- **`text-foreground` on container components** — Kiso uses CSS variable
  swapping for dark mode, not `dark:` prefixes. Every component that
  displays text must set `text-foreground` on its root container so
  children inherit correct color in dark mode.
- **Foreground pairing** — every color has a `-foreground` companion.
  `bg-primary text-primary-foreground` is always accessible. This includes
  `inverted` → `inverted-foreground`.
- **Inherit parent color for secondary text inside colored components** —
  description text inherits parent text color at full opacity. Never use
  `text-muted-foreground` inside colored components (absolute zinc-500,
  unreadable on colored backgrounds).
- **shadcn is the structural source of truth** — match shadcn's
  implementation div-for-div, class-for-class from
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/`. Only deviate where
  Kiso's variant system or semantic tokens require it.
- **Component names must match shadcn exactly** — same name for component
  and all sub-parts. Check shadcn source file name before naming anything.
- **Nuxt UI is the theming source of truth** — check
  `vendor/nuxt-ui/src/theme/` for variant formulas and token usage.
  shadcn provides the skeleton, Nuxt UI provides the paint.
- **`css_classes:` override** — single override point for the root element,
  merged via tailwind_merge.
- **`ui:` prop for per-slot overrides** — compound components accept
  `ui: { slot_name: "classes" }` for inner sub-part styles. Four layers:
  theme default < global config < instance `ui:` < instance `css_classes:`.
  See `project/decisions/004-per-slot-ui-prop.md`.
- **`appui()` for host app components** — mirrors `kui()` for app-specific
  components. Themes in `app/themes/{theme_name}/`, partials in
  `app/views/components/`. Generate with `bin/rails g kiso:component name`.
- **Theme presets** — `:rounded` and `:sharp`, applied at boot via
  `Kiso.configure { |c| c.apply_preset(:rounded) }`. Preset files in
  `lib/kiso/presets/` must be in the Tailwind `@source` directive.
- **`data-slot` for component identity** — every component and sub-part
  gets `data-slot="name"` in kebab-case. Root: `data-slot="card"`,
  sub-parts: `data-slot="card-header"`.
- **Native HTML5 first** — `<dialog>`, `[popover]`, `<details>`, `<progress>`
  before reaching for Stimulus.
- **Props for common patterns, yield for override** — accept props for the
  90% case, yield block replaces all internal structure for full control.
- **`kiso_component_icon` for default icons** — use
  `kiso_component_icon(:semantic_name)` for built-in icons (chevrons, close
  X). Lets host apps swap icons globally. See `lib/kiso/configuration.rb`.
- **Tag helpers for Stimulus data attributes** — use `tag.*` helpers with
  `data:` hash. Rails converts double underscores to double dashes:
  `data: { kiso__combobox_target: "input" }`. Never write raw `data-kiso--*`.
- **Never use `block_given?` in ERB partials** — always `true` in Rails
  partials. Use `capture { yield }.presence` instead. Never bypass `kui()`
  to render Kiso partials directly — it passes `block ||= proc {}` to
  prevent yield bubbling. See `_dialog.html.erb` for the pattern.
- **Composition over configuration** — Card = Header + Title + Content +
  Footer. Small partials, flexibly combined.
- **Sub-part naming** — `kui(:component, :part)`, never `kui(:component_part)`.
  Files: `component/_part.html.erb`. Data slots: `data-slot="card-header"`.
- **Strict locals on every partial** — `<%# locals: (color: :primary) %>`
- **Bare specifier imports** — use `"kiso-ui/utils/highlight"` not relative
  paths. Required for importmap compatibility. When adding a new util, add
  an explicit export entry in `package.json`. See existing controllers.
- **Vendored third-party JS** — vendor browser ESM builds in
  `app/javascript/kiso/vendor/`, pin in engine's `config/importmap.rb`.
  **Never use CDN pins.** See `project/decisions/002-floating-ui-positioning.md`.
- **i18n for all user-visible text** — use `t("kiso.component_name.key")`
  with defaults in `config/locales/en.yml`. Components with configurable
  labels: `label ||= t("kiso.component_name.key")`.
- **JSDoc on all JavaScript** — see `project/code-documentation.md` for
  full spec. Reference: `app/javascript/controllers/kiso/select_controller.js`.

## Dark Mode System

**`kiso_theme_script`** — blocking inline `<script>` in `<head>` that sets
`.dark` on `<html>` before first paint. CSP-safe via `nonce: true`.

**`kiso--theme` Stimulus controller** — `toggle()` cycles light/dark,
`set()` accepts "light"/"dark"/"system". Persists to localStorage + cookie.

**Components:** `kui(:color_mode_button)` (toggle), `kui(:color_mode_select)`
(dropdown with Light/Dark/System).

## Docs Site (Bridgetown)

**ERB escaping gotcha:** Bridgetown evaluates all `.md` files as ERB —
including fenced code blocks. **Double the `%`** in code examples:
`<%%=` → `<%=`, `<%%` → `<%`, `%%>` → `%>`. Only unescaped `<%= %>`
should be intentional Bridgetown helpers.

Deploy via Kamal: `bin/deploy` (both), `bin/deploy --only docs`,
`bin/deploy --only lookbook`.

## GitHub Project

The repo uses **GitHub Projects** (project #7, `PVT_kwHNBRnOAUCSOg`).
When creating issues, add them to the project and set the Status field.

```bash
# Add issue to project
gh project item-add 7 --owner steveclarke --url https://github.com/steveclarke/kiso/issues/N

# Set status (use item ID from item-list, not issue number)
gh project item-edit --project-id PVT_kwHNBRnOAUCSOg --id PVTI_xxx --field-id PVTSSF_lAHNBRnOAUCSOs4PlkNg --single-select-option-id <option-id>
```

**Status field** (`PVTSSF_lAHNBRnOAUCSOs4PlkNg`) options:

| Status | Option ID |
|--------|-----------|
| Backlog | `57035eea` |
| Up Next | `8e2027b0` |
| In Progress | `3d0aad59` |
| Waiting | `4974cf98` |
| Done | `6d842610` |

## Git & PRs

- **Always squash merge PRs** (`gh pr merge --squash`). Repo is configured
  to only allow squash merges.
- **Link PRs to issues** — include `Closes #N` in the PR body so GitHub
  auto-closes the issue on merge.
- **Do not commit without explicit permission** from the user.

## Linting & Formatting

- **Ruby**: `bundle exec standardrb --fix`
- **JS lint**: `npm run lint` (oxlint). Config: `.oxlintrc.json`.
- **JS format**: `npm run fmt` (oxfmt). Config: `.oxfmtrc.json`.
- oxfmt uses no semicolons, double quotes, trailing commas, and sorts
  imports + Tailwind classes automatically.

## Commands

See `DEVSTACK.md` for full dev environment documentation.

```bash
bin/dev                       # Start all services (TUI dashboard)
bin/dev -D                    # Start headless (for agents)
bin/dev stop                  # Stop all services
bin/dummy                     # Start dummy integration app
bundle exec rake test         # Run Ruby tests
npm run test                  # Run all JS tests (unit + E2E)
bundle exec standardrb --fix  # Lint & auto-format Ruby
npm run lint                  # Lint JS (oxlint)
npm run fmt                   # Format JS (oxfmt)
npm run fmt:check             # Check JS formatting (CI)
bin/deploy                    # Deploy docs + Lookbook (Kamal + 1Password)
bin/release                   # Tag and release a new gem version
bin/release --npm 0.1.1       # Release npm package kiso-ui
bin/smoke-test                # Run automated smoke tests for all features
```
