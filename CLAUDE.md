# CLAUDE.md

## Project Overview

**Kiso** (Japanese: foundation) — a Rails engine gem providing UI components
inspired by shadcn/ui and Nuxt UI. ERB partials, Tailwind CSS, progressive
Stimulus.

## Key References

- `PLAN.md` — **read first**. Current status, what's done, what to build next,
  priority-ordered component list with batches.
- `project/DESIGN_SYSTEM.md` — **read before building any component**. Strict
  compound variant formulas, semantic token table, Nuxt UI token mapping,
  and **spatial system** (heights, padding, gaps, typography, radius, icon
  sizing — all extracted from shadcn/ui). Every colored component uses
  identical formulas — no exceptions. Every component uses spatial values
  from the established scales — no arbitrary values.
- `project/COMPONENT_STRATEGY.md` — class_variants patterns, compound variants,
  theming, override system, dark mode.
- `.claude/skills/contributing/SKILL.md` — component creation workflow and checklist
- `skills/kiso/` — AI skill with component reference (update when adding components)
- `VISION.md` — full roadmap, component catalog, phased rollout

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

- **Computed Tailwind classes in ERB** — theme modules define variant class
  strings, partials render them. No `@apply` in CSS. CSS files only for
  transitions, animations, pseudo-states that ERB can't express.
- **Two-axis variants (Nuxt UI pattern)** — components with colors use
  `color:` + `variant:` axes with compound variants. Colors: primary,
  secondary, success, info, warning, error, neutral. Variants: solid,
  outline, soft, subtle. **Compound variant formulas are identical across
  all colored components** — copy from an existing component (Badge), never
  invent new formulas. See `project/DESIGN_SYSTEM.md`.
- **Semantic tokens** — `bg-primary`, `text-foreground`, `bg-muted`, etc.
  Components never use raw palette shades or `dark:` prefixes.
- **`text-foreground` on container components** — Kiso uses CSS variable
  swapping for dark mode (`.dark {}` block), not Tailwind `dark:` prefixes.
  The browser default text color is black and doesn't change automatically.
  Every component that displays text must set `text-foreground` on its
  root container so children inherit the correct color in dark mode. See
  Card, Table, and Empty for examples.
- **Foreground pairing** — every color has a `-foreground` companion.
  `bg-primary text-primary-foreground` is always accessible. This includes
  `inverted` → `inverted-foreground`.
- **`opacity-90` for secondary text inside colored components** — description
  text inherits the parent color at 90% opacity. Never use
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
- **Component vision docs** — `project/components/COMPONENT.md` defines the
  target API for each component. Read before building or extending.
- **Composition over configuration** — Card = Header + Title + Content + Footer.
  Small partials, flexibly combined.
- **Sub-part naming** — sub-parts always use `kui(:component, :part)`, never
  `kui(:component_part)`. Files live in `component/_part.html.erb`. Data
  slots use kebab-case: `data-slot="alert-title"`, `data-slot="card-header"`.
- **Strict locals on every partial** — `<%# locals: (color: :primary) %>`
- **JSDoc on all JavaScript** — every Stimulus controller, method, property,
  and event must have JSDoc comments. Class-level: `@example` with HTML usage,
  `@property` for targets/values, `@fires` for dispatched events. Methods:
  `@param`, `@returns`, `@private` as appropriate. See existing controllers
  in `app/javascript/controllers/kiso/` for the expected format.

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
lib/kiso/themes/           Ruby theme modules (ClassVariants definitions)
app/views/kiso/components/ ERB partials (rendered via kui() helper)
app/assets/stylesheets/    Component CSS (thin — transitions/pseudo-states only)
app/helpers/kiso/          kui(), kiso_prepare_options() helpers
test/components/previews/  Lookbook preview classes + templates
test/dummy/                Development Rails app (bin/dev → port 4001)
skills/kiso/               AI skill (component reference, theming guide)
project/                   Architecture docs, design system, component vision docs
docs/                      Bridgetown docs site (published documentation)
```

## Dependencies

- Rails >= 8.0
- tailwindcss-rails (host app owns the Tailwind build)
- class_variants ~> 1.1 (variant definitions, Ruby cva equivalent)
- tailwind_merge ~> 1.0 (class deduplication)

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
- **Dev server**: `bin/dev` runs Overmind daemonized. Start it if not
  running, restart services as needed (`overmind restart web`).

## Linting

- **standardrb** — run `bundle exec standardrb --fix` before committing.

## Commands

```bash
bin/dev                       # Start all services daemonized (Lookbook :4001 + docs :4000)
bin/dev restart web           # Restart Lookbook server
bin/dev restart docs          # Restart docs server
bin/dev status                # Show running processes
bin/dev stop                  # Stop all services
bin/dev -f                    # Start in foreground (for debugging)
bundle exec rake test         # Run tests
bundle exec standardrb --fix  # Lint & auto-format Ruby
bin/deploy                    # Deploy both services to production (Kamal + 1Password)
bin/deploy --only lookbook    # Deploy Lookbook only (lookbook.kisoui.com)
bin/deploy --only docs        # Deploy docs only (kisoui.com)
bin/release                   # Tag and release a new gem version
bin/release --npm 0.1.1       # Release npm package kiso-ui
bin/release 0.2.0 --npm 0.1.1 # Release both gem and npm
```
