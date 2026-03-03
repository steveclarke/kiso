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
  theming, override system, dark mode.
- `.claude/skills/contributing/SKILL.md` — component creation workflow and checklist
- `skills/kiso/` — AI skill with component reference (update when adding components)
- `VISION.md` — why Kiso exists, design principles

## Architecture

Two layers (CSS files only for transitions/pseudo-states):
1. **Ruby Theme Modules** (`lib/kiso/themes/`) — variant definitions using
   `class_variants` + `tailwind_merge`. This is where component styles live.
2. **ERB Partials** (`app/views/kiso/components/`) — strict locals, computed
   class strings from theme modules, composition via `yield` and sub-parts.

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
  Overrides are applied once at boot via `ClassVariants::Instance#merge`.
  Layer order: theme default < global config < per-instance `css_classes:`.
  See `project/component-strategy.md` Override System section.
- **Computed Tailwind classes in ERB** — theme modules define variant class
  strings, partials render them. No `@apply` in CSS. CSS files only for
  transitions, animations, pseudo-states that ERB can't express.
- **Two-axis variants (Nuxt UI pattern)** — components with colors use
  `color:` + `variant:` axes with compound variants. Colors: primary,
  secondary, success, info, warning, error, neutral. Variants: solid,
  outline, soft, subtle. **Compound variant formulas are identical across
  all colored components** — copy from an existing component (Badge), never
  invent new formulas. See `project/design-system.md`.
- **Semantic tokens** — `bg-primary`, `text-foreground`, `bg-muted`, etc.
  Components never use raw palette shades or `dark:` prefixes.
- **Tailwind v4 CSS variable syntax** — use **parentheses** for CSS variable
  references: `bg-(--my-color)`, `border-(--sidebar-border)`. Parentheses
  auto-wrap in `var()`. **Never use square brackets** for CSS variables —
  `bg-[--my-color]` passes the value literally without `var()` and is broken
  in v4. Square brackets are only for literal arbitrary values like
  `text-[11px]` or `min-h-[49px]`.
- **`text-foreground` on container components** — Kiso uses CSS variable
  swapping for dark mode (`.dark {}` block), not Tailwind `dark:` prefixes.
  The browser default text color is black and doesn't change automatically.
  Every component that displays text must set `text-foreground` on its
  root container so children inherit the correct color in dark mode. See
  Card, Table, and Empty for examples.
- **Foreground pairing** — every color has a `-foreground` companion.
  `bg-primary text-primary-foreground` is always accessible. This includes
  `inverted` → `inverted-foreground`.
- **Inherit parent color for secondary text inside colored components** —
  description text inherits the parent text color at full opacity. Never use
  `text-muted-foreground` inside colored components (it's absolute zinc-500,
  unreadable on colored backgrounds).
- **shadcn is the structural source of truth** — when building a component,
  match shadcn's implementation div-for-div, class-for-class
  (`vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/`). Copy their
  Tailwind utility classes for layout, spacing, typography, and structure.
  Only deviate where Kiso's variant system or semantic tokens require it.
- **Component names must match shadcn exactly** — use the same name shadcn
  uses for the component and all its sub-parts. If shadcn calls it `empty`,
  we call it `empty` — not `empty_state`. If shadcn calls a sub-part
  `header`, we call it `header`. Check the shadcn source file name and
  exported component names before naming anything.
- **Nuxt UI is the theming source of truth** — check the Nuxt UI theme file
  (`vendor/nuxt-ui/src/theme/`) for variant formulas and token usage.
  This is where `color:` × `variant:` axes, compound variants, and the
  outline/soft/subtle system come from. shadcn provides the skeleton,
  Nuxt UI provides the paint.
- **`css_classes:` override** — single override point, merged via
  tailwind_merge. Conflicting classes are resolved automatically.
- **`data-slot` for component identity (shadcn v4 convention)** — every
  component and sub-part gets `data-slot="name"` in kebab-case. Root:
  `data-slot="card"`, sub-parts: `data-slot="card-header"`. Used for CSS
  targeting (`has-[[data-slot=...]]`), testing, and Stimulus. Stimulus
  controllers (`data-controller`, `data-action`, `data-*-target`) are
  added separately when behavior is needed.
- **Native HTML5 first** — `<dialog>`, `[popover]`, `<details>`, `<progress>`
  before reaching for Stimulus.
- **Props for common patterns, yield for override** — if 90% of usages look
  the same, accept props (`title:`, `description:`, `icon:`) and handle
  layout internally. Yield block replaces all internal structure for full
  control. Props are guardrails for agent-written code.
- **`kiso_component_icon` for default icons in partials** — when a component
  renders a built-in default icon (separator chevron, pagination arrows,
  close button X), use `kiso_component_icon(:semantic_name)` instead of
  `kiso_icon("icon-name")`. This lets host apps swap icons globally via
  `Kiso.config.icons[:semantic_name] = "heroicons:chevron-right"`. See
  `lib/kiso/configuration.rb` for the registry of semantic icon names.
  `kiso_icon("name")` is still used for user-specified icons in app code.
- **Tag helpers for Stimulus data attributes** — always use `tag.*` helpers
  with `data:` hash for inner elements that need Stimulus attributes. Rails
  converts double underscores to double dashes:
  `data: { kiso__combobox_target: "input" }` → `data-kiso--combobox-target`.
  Never write raw `data-kiso--*` attributes in HTML.
- **Never use `block_given?` in ERB partials** — Rails wraps every partial
  in a block internally, so `block_given?` is always `true` regardless of
  whether the caller passed a block. For "default content with optional
  block override", use `capture { yield }.presence` instead:
  ```erb
  <%= capture { yield }.presence || kiso_component_icon(:chevron_right) %>
  ```
  For multi-line defaults, assign first:
  ```erb
  <% content = capture { yield }.presence %>
  ```
  This pattern is safe because `kui()` passes `block ||= proc {}` to every
  render call. Without the empty proc, `yield` in a blockless partial would
  bubble up the ERB rendering chain and capture the layout's `<%= yield %>`
  (the entire page template). The empty proc gives `yield` something to
  call, returning empty → `.presence` returns nil → default content renders.
  **Never bypass `kui()` to render Kiso partials directly** — the empty
  proc guard only works through the helper.
- **Composition over configuration** — Card = Header + Title + Content + Footer.
  Small partials, flexibly combined.
- **Sub-part naming** — sub-parts always use `kui(:component, :part)`, never
  `kui(:component_part)`. Files live in `component/_part.html.erb`. Data
  slots use kebab-case: `data-slot="alert-title"`, `data-slot="card-header"`.
- **Strict locals on every partial** — `<%# locals: (color: :primary) %>`
- **Bare specifier imports for shared utils** — Kiso must support both
  importmaps (Rails) and npm bundlers (esbuild/Vite). Relative imports
  (`./utils/highlight`) don't work with importmaps because Propshaft serves
  fingerprinted filenames that relative URLs can't resolve. Instead, import
  shared utilities using bare specifiers that match the npm package name:
  ```javascript
  import { highlightItem, wrapIndex } from "kiso-ui/utils/highlight"
  import { startPositioning } from "kiso-ui/utils/positioning"
  import { FOCUSABLE_SELECTOR } from "kiso-ui/utils/focusable"
  ```
  These resolve via `pin_all_from` in `config/importmap.rb` for Rails apps
  and via `package.json` `exports` for bundler apps. Both use wildcards,
  so new util files in `app/javascript/kiso/utils/` are picked up
  automatically — no config changes needed. **Never use relative imports
  for shared utils.**
- **Vendored third-party JS dependencies** — when a component needs a
  third-party JS library (like Floating UI for positioning), the engine
  **vendors the browser ESM build** in `app/javascript/kiso/vendor/` and
  **pins it in the engine's `config/importmap.rb`**. The engine's importmap
  merges into the host app automatically — host apps don't configure
  anything for importmap apps. Bundler apps install via npm (peer
  dependency). **Never use CDN pins** — CDN fetches are async, happen
  after `load` event, and cause race conditions with Stimulus controller
  loading. Follow the pattern of `stimulus-rails` (vendors `stimulus.min.js`)
  and `turbo-rails` (vendors `turbo.js`). See
  `project/decisions/002-floating-ui-positioning.md` for rationale.
  Vendored files go in `.oxlintrc.json` and `.oxfmtrc.json` ignore patterns.
  Add as `dependencies` in `package.json` (so bundler apps get it
  automatically via `npm install kiso-ui`) and as `devDependencies` for
  local development/testing.
- **JSDoc on all JavaScript** — every Stimulus controller, method, property,
  and event must have JSDoc comments. Class-level: `@example` with HTML usage,
  `@property` for targets/values, `@fires` for dispatched events. Methods:
  `@param`, `@returns`, `@private` as appropriate. See existing controllers
  in `app/javascript/controllers/kiso/` for the expected format.

## Dark Mode System

**`kiso_theme_script` helper** — outputs a blocking inline `<script>` in
`<head>` that reads localStorage → cookie → `prefers-color-scheme` and sets
`.dark` on `<html>` before first paint. Zero server-side code needed. CSP-safe
via `nonce: true`. Developers add one line to their layout:

```erb
<head>
  <%= kiso_theme_script %>
  <%= stylesheet_link_tag "tailwind" %>
</head>
```

**`kiso--theme` Stimulus controller** — handles toggling. `toggle()` cycles
light ↔ dark. `set()` accepts "light", "dark", or "system" via event detail.
Persists to both localStorage and cookie.

**Color mode components:**
- `kui(:color_mode_button)` — light/dark toggle with sun/moon icons
- `kui(:color_mode_select)` — dropdown with Light/Dark/System options

## Dashboard Layout

**Components, not layouts.** The engine ships composable `kui()` components.
Host apps own their layout file — the engine never renders `<html>` or `<body>`.

```erb
<%= kui(:dashboard_group) do %>
  <%= kui(:dashboard_navbar) do %>
    <%= kui(:dashboard_sidebar, :toggle) %>
    <%= kui(:dashboard_sidebar, :collapse) %>
    <%= kui(:color_mode_button) %>
  <% end %>
  <%= kui(:dashboard_sidebar) { yield :sidebar } %>
  <%= kui(:dashboard_panel) { yield } %>
<% end %>
```

`dashboard_group` reads `cookies[:sidebar_open]` itself — no `before_action`
needed in host controllers. CSS mechanics (grid layout, sidebar animation,
mobile overlay) live in `app/assets/tailwind/kiso/dashboard.css` using
`[data-slot]` selectors.

## Component Pattern

```ruby
# lib/kiso/themes/badge.rb — variant definitions
Kiso::Themes::Badge = ClassVariants.build(
  base: "inline-flex items-center rounded-md font-medium",
  variants: { ... },
  compound_variants: [ ... ],
  defaults: { color: :primary, variant: :soft, size: :md }
)
```

```erb
<%# app/views/kiso/components/_badge.html.erb %>
<%# locals: (color: :primary, variant: :soft, size: :md, css_classes: "", **component_options) %>
<%= content_tag :span,
    class: Kiso::Themes::Badge.render(color: color, variant: variant, size: size, class: css_classes),
    data: kiso_prepare_options(component_options, slot: "badge"),
    **component_options do %>
  <%= yield %>
<% end %>
```

## File Structure

```
lib/kiso/themes/              Ruby theme modules (ClassVariants definitions)
app/views/kiso/components/    ERB partials (rendered via kui() helper)
app/assets/tailwind/kiso/     Component CSS (engine.css + per-component mechanics)
app/helpers/kiso/             kui(), kiso_prepare_options(), kiso_theme_script()
app/javascript/controllers/kiso/  Stimulus controllers (namespaced kiso--)
app/javascript/kiso/utils/    Shared JS utilities (positioning, highlight, focusable)
test/components/previews/     Lookbook preview classes + templates
test/dummy/                   Integration test app (bin/dummy → port 5000)
lookbook/                     Lookbook dev app (bin/dev → port 4001)
skills/kiso/                  AI skill (component reference, theming guide)
project/                      Architecture docs, design system, decisions
docs/                         Bridgetown docs site (published documentation)
```

## Dependencies

- Rails >= 8.0
- class_variants ~> 1.1 (variant definitions, Ruby cva equivalent)
- tailwind_merge ~> 1.0 (class deduplication)
- Host app owns the Tailwind build (works with tailwindcss-rails or cssbundling-rails)

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
| Someday | `b0767535` |
| Backlog | `1913d265` |
| Up Next | `3b515411` |
| In Progress | `f174b9f7` |
| Done | `da46eb59` |

## Git & PRs

- **Always squash merge PRs** (`gh pr merge --squash`). Repo is configured
  to only allow squash merges.
- **Link PRs to issues** — include `Closes #N` in the PR body so GitHub
  auto-closes the issue on merge.
- **Do not commit without explicit permission** from the user.

## Finalize Checklist

Run `/finalize` or ask "are we ready to merge?" to trigger this. These are
Kiso-specific checks on top of the universal finalize skill.

**Per component:**
- [ ] Theme module in `lib/kiso/themes/` + required in `lib/kiso.rb`
- [ ] ERB partial with `data-slot`, `css_classes:`, strict locals
- [ ] Default icons use `kiso_component_icon(:name)` — no raw SVGs anywhere
- [ ] Icon names registered in `lib/kiso/configuration.rb`
- [ ] `type: "button"` on all `<button>` elements
- [ ] Stimulus data attributes via `tag.*` helpers with `data:` hash — no raw HTML
- [ ] Lookbook preview with `@logical_path` grouping (Form, Color Mode, Dashboard, etc.)
- [ ] Docs page at `docs/src/components/{name}.md` (no `# Title` — frontmatter handles it)
- [ ] Entry in `docs/src/_data/navigation.yml` (alphabetical)
- [ ] Entry in `skills/kiso/references/components.md`
- [ ] JSDoc on all JS controllers (`@example`, `@property`, `@fires`, `@param`)
- [ ] `frozen_string_literal` consistency with existing files
- [ ] Entry in `test/e2e/dark-mode.spec.js` `COMPONENTS` array (dark mode a11y)

**Per PR:**
- [ ] `bundle exec standardrb --fix` — clean
- [ ] `npm run lint && npm run fmt:check` — clean
- [ ] `bundle exec rake test` — all pass
- [ ] Visual check in Lookbook and/or dummy app
- [ ] Dark mode verified (if applicable)
- [ ] PR description reflects actual scope
- [ ] `Closes #N` in PR body
- [ ] Parent epic updated with current status
- [ ] Follow-on issues created for deferred work
- [ ] Issues on project board with correct status
- [ ] `MEMORY.md` updated with learnings

## Linting & Formatting

- **Ruby**: `bundle exec standardrb --fix`
- **JS lint**: `npm run lint` (oxlint). Config: `.oxlintrc.json`.
- **JS format**: `npm run fmt` (oxfmt). Config: `.oxfmtrc.json`.
- oxfmt uses no semicolons, double quotes, trailing commas, and sorts
  imports + Tailwind classes automatically.

## Commands

```bash
bin/dev                       # Start all services daemonized (Lookbook :4001 + docs :4000)
bin/dev restart web           # Restart Lookbook server
bin/dev restart docs          # Restart docs server
bin/dev status                # Show running processes and URLs
bin/dev logs                  # Tail all logs
bin/dev logs web              # Tail logs from a specific service
bin/dev stop                  # Stop all services
bin/dev -f                    # Start in foreground (for debugging)
bin/dummy                     # Start dummy integration app daemonized (port 5000)
bin/dummy restart web         # Restart dummy web server
bin/dummy status              # Show running processes
bin/dummy logs                # Tail dummy app logs
bin/dummy stop                # Stop dummy app
bin/dummy -f                  # Start dummy app in foreground
bundle exec rake test         # Run Ruby tests
npm run test                  # Run all JS tests (unit + E2E)
bundle exec standardrb --fix  # Lint & auto-format Ruby
npm run lint                  # Lint JS (oxlint)
npm run lint:fix              # Lint JS with auto-fix
npm run fmt                   # Format JS (oxfmt)
npm run fmt:check             # Check JS formatting (CI)
bin/deploy                    # Deploy both services to production (Kamal + 1Password)
bin/deploy --only lookbook    # Deploy Lookbook only (lookbook.kisoui.com)
bin/deploy --only docs        # Deploy docs only (kisoui.com)
bin/release                   # Tag and release a new gem version
bin/release --npm 0.1.1       # Release npm package kiso-ui
bin/release 0.2.0 --npm 0.1.1 # Release both gem and npm
```
