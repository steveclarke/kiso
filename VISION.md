# Kiso: A Rails Component Library

**Kiso** (Japanese: foundation) is a full-featured UI component library for
Rails, distributed as a gem. It follows the design language and component
catalog of shadcn/ui, adapted for the Rails + Hotwire stack.

## Vision

One gem, installed in any Rails 8 project, that gives you a complete set of
accessible, themeable UI components. No React, no build step beyond Tailwind.
ERB partials with strict locals, CSS powered by data-attribute selectors, and
Stimulus controllers only where native HTML falls short.

The goal is **shadcn-level polish and coverage** with **Rails-native
simplicity**. Every component works with Turbo out of the box.

## Architecture

### Three Layers

```
1. ERB Partials          <%= kiso(:card) { ... } %>
2. CSS (data-attributes)  [data-component="card"] { ... }
3. Stimulus Controllers   data-controller="kiso--combobox" (only when needed)
```

**ERB partials** use strict locals magic comments. Components compose through
`yield` and sub-part partials (Card > Header > Title). No Ruby class overhead,
no ViewComponent dependency.

**CSS** targets `data-component` and `data-variant` attributes using
`@apply` for Tailwind utilities and CSS custom properties for theming. Every
component is a standalone CSS file, imported into a master `engine.css`.

**Stimulus controllers** are added progressively. Native HTML5 first:
`<dialog>`, Popover API, `<details>/<summary>`, `<input type="range">`. Stimulus
fills the gaps: keyboard navigation in comboboxes, focus trapping in command
palettes, auto-dismiss on toasts.

### Theme System

Follows the [Nuxt UI](https://ui.nuxt.com/docs/getting-started/theme/css-variables)
approach: a small set of CSS variables that flip automatically in dark mode.
Component authors never write `dark:` variants — they use semantic tokens
like `bg-elevated` or `text-muted` and dark mode just works.

Two layers:

**1. Semantic color palettes** — map purpose names to Tailwind palettes.
These provide the full shade range (`primary-50` through `primary-950`)
for when components need specific shades:

```css
@theme inline {
  --color-primary-*: var(--color-blue-*);    /* CTAs, brand, links */
  --color-secondary-*: var(--color-teal-*);  /* Alternative actions */
  --color-success-*: var(--color-green-*);   /* Success states */
  --color-info-*: var(--color-sky-*);        /* Info, help text */
  --color-warning-*: var(--color-amber-*);   /* Warnings, attention */
  --color-error-*: var(--color-red-*);       /* Errors, destructive */
  --color-neutral-*: var(--color-zinc-*);    /* Text, borders, surfaces */
}
```

Changing the brand color: swap `blue` → `orange` on one line. No OKLCH values.

**2. Semantic surface tokens** — the core of the dark-mode-just-works system.
These CSS variables are redefined under `.dark` so components never need
`dark:` prefixes:

```css
:root {
  /* Backgrounds */
  --color-bg-default: white;
  --color-bg-muted: var(--color-neutral-50);
  --color-bg-elevated: var(--color-neutral-100);
  --color-bg-accented: var(--color-neutral-200);
  --color-bg-inverted: var(--color-neutral-900);

  /* Text */
  --color-text-dimmed: var(--color-neutral-400);
  --color-text-muted: var(--color-neutral-500);
  --color-text-toned: var(--color-neutral-600);
  --color-text-default: var(--color-neutral-700);
  --color-text-highlighted: var(--color-neutral-900);
  --color-text-inverted: white;

  /* Borders */
  --color-border-default: var(--color-neutral-200);
  --color-border-accented: var(--color-neutral-300);
  --color-border-inverted: var(--color-neutral-900);
}

.dark {
  --color-bg-default: var(--color-neutral-900);
  --color-bg-muted: var(--color-neutral-800);
  --color-bg-elevated: var(--color-neutral-800);
  --color-bg-accented: var(--color-neutral-700);
  --color-bg-inverted: white;

  --color-text-dimmed: var(--color-neutral-500);
  --color-text-muted: var(--color-neutral-400);
  --color-text-toned: var(--color-neutral-300);
  --color-text-default: var(--color-neutral-200);
  --color-text-highlighted: white;
  --color-text-inverted: var(--color-neutral-900);

  --color-border-default: var(--color-neutral-800);
  --color-border-accented: var(--color-neutral-700);
  --color-border-inverted: white;
}
```

**Usage in components — no `dark:` needed:**

```erb
<div class="bg-elevated text-highlighted border-default rounded-lg p-4">
  <p class="text-muted">Secondary text adapts automatically.</p>
  <button class="bg-primary-600 text-white">Brand button</button>
</div>
```

**Why this approach:**
- Dark mode is automatic — component markup never uses `dark:` for surface
  colors, text, or borders
- ~15 semantic tokens total (bg, text, border) — small and easy to understand
- Semantic palette aliases give the full shade range when needed
- Changing brand color = swapping one palette name
- Follows Nuxt UI's proven naming (elevated, muted, toned, dimmed, inverted)
  rather than shadcn's less intuitive names (card, card-foreground)

### Icon System

Kiso uses [Iconify](https://iconify.design) via its
[Tailwind CSS plugin](https://iconify.design/docs/usage/css/tailwind/) for
icons. No bundled SVGs, no JS icon libraries — Iconify generates CSS at build
time using `mask-image` (monotone icons inherit `currentColor`) and
`background-image` (colored icons). Only icons actually used in markup end up
in the CSS.

The host app owns icon installation. Kiso defaults to Lucide (the same set
shadcn/ui uses), but any Iconify set works.

```bash
# Host app installs the Tailwind plugin + icon set(s)
npm i -D @iconify/tailwind4 @iconify-json/lucide
```

```css
/* Host app's Tailwind CSS */
@plugin "@iconify/tailwind4";
```

**`icon()` helper** — a thin DSL over the Iconify class naming convention:

```ruby
# Kiso::IconsHelper
icon("lucide:check")
# => <span class="icon-[lucide--check] size-5 shrink-0" aria-hidden="true">

icon("lucide:chevron-down", size: :sm)
# => <span class="icon-[lucide--chevron-down] size-4 shrink-0" aria-hidden="true">

icon("lucide:alert-triangle", class: "text-destructive")
# => <span class="icon-[lucide--alert-triangle] size-5 shrink-0 text-destructive" aria-hidden="true">
```

The helper uses a `collection:name` format (e.g. `lucide:check`) which it
converts to the Iconify Tailwind class (`icon-[lucide--check]`). Named size
presets (`:xs` through `:xl`) map to Tailwind `size-*` utilities.

**Component icon parameters** — components that need icons accept an `icon:`
local:

```erb
<%= render "components/alert", variant: :destructive, icon: "lucide:alert-triangle" do %>
  ...
<% end %>
```

**Default icons** — Kiso defines defaults for internal component icons
(close button, chevrons, search, etc.) in `Kiso.default_icons`. Host apps
can override any default:

```ruby
# config/initializers/kiso.rb
Kiso.default_icons[:close] = "heroicons:x-mark"
```

Components reference defaults internally:

```erb
<%= icon(Kiso.default_icons[:close], size: :sm) %>
```

This replaces maquina's approach of bundling 60+ inline SVGs in a Ruby helper.
The entire icon system is one helper method (~10 lines), a config hash of
defaults, and the host app's Iconify Tailwind plugin.

### Component API Pattern

Every component follows the same conventions, powered by a `component_tag`
helper that handles all the data-attribute wiring:

```erb
<%# kiso/components/_badge.html.erb %>
<%# locals: (variant: :default, size: :md, css_classes: "", **component_options) %>
<%= component_tag :span, :badge, variant:, size:, class: css_classes,
    **component_options do %>
  <%= yield %>
<% end %>
```

This produces:

```html
<span data-component="badge" data-variant="default" data-size="md">Active</span>
```

The `component_tag` helper (in `Kiso::ComponentHelper`):
- Wraps `content_tag` with automatic data-attribute merging
- Sets `data-component`, `data-variant`, `data-size` from keyword args
- Merges any caller-provided `data:` hash (so apps can add their own data
  attributes without clobbering component ones)
- Compacts nil values — omit `size:` and no `data-size` appears

**Sub-parts** use the `part:` parameter:

```erb
<%# kiso/components/card/_header.html.erb %>
<%# locals: (css_classes: "", **component_options) %>
<%= component_tag :div, :card, part: :header, class: css_classes,
    **component_options do %>
  <%= yield %>
<% end %>
```

Produces `<div data-card-part="header">` (no `data-component` on sub-parts).

**API summary:**

| Argument | Purpose | Output |
|---|---|---|
| `:span` | HTML element | `<span ...>` |
| `:badge` | Component name | `data-component="badge"` |
| `variant:` | Visual style | `data-variant="..."` |
| `size:` | Dimensions | `data-size="..."` |
| `part:` | Sub-part name | `data-badge-part="..."` |
| `class:` | Extra Tailwind classes | `class="..."` |
| `**options` | Passthrough HTML attrs | `id="..."`, `aria-*`, etc. |

### Rendering Components

The `kiso()` helper (in `Kiso::ComponentHelper`) wraps `render` with the
`kiso/components/` namespace so callers never think about paths:

```ruby
def kiso(component, part = nil, collection: nil, **kwargs, &block)
  path = if part
    "kiso/components/#{component}/#{part}"
  else
    "kiso/components/#{component}"
  end

  if collection
    render partial: path, collection: collection, **kwargs, &block
  else
    render path, **kwargs, &block
  end
end
```

**Usage:**

```erb
<%= kiso(:badge, variant: :success) { "Active" } %>

<%= kiso(:card) do %>
  <%= kiso(:card, :header) do %>
    <%= kiso(:card, :title, text: "Members") %>
  <% end %>
  <%= kiso(:card, :content) do %>
    ...
  <% end %>
<% end %>
```

**Collections:**

```erb
<%= kiso(:badge, collection: @statuses) %>
```

CSS-only components (Button, Input, etc.) use data attributes directly:

```erb
<%= f.submit "Save", data: { component: "button", variant: "primary" } %>
<%= f.text_field :name, data: { component: "input" } %>
```

## Gem Structure

```
kiso/
  lib/
    kiso.rb
    kiso/
      engine.rb
      icons.rb               # Default icon name registry (Kiso.default_icons)
      version.rb
    generators/
      kiso/
        install/
          install_generator.rb
          templates/
            theme.css.tt          # Default theme variables
            kiso_helper.rb.tt
  app/
    assets/
      stylesheets/
        alert.css
        avatar.css
        badge.css
        button.css               # (part of form.css or standalone)
        card.css
        checkbox.css
        collapsible.css
        combobox.css
        command.css
        dialog.css
        drawer.css
        dropdown_menu.css
        empty.css
        form.css                 # Input, textarea, select, radio, switch
        item.css
        label.css
        number_stepper.css
        page.css
        pagination.css
        popover.css
        progress.css
        scroll_area.css
        separator.css
        sheet.css
        sidebar.css
        skeleton.css
        slider.css
        table.css
        tabs.css
        toast.css
        toggle_group.css
        tooltip.css
      tailwind/
        kiso/
          engine.css             # Master @import of all component CSS
    helpers/
      kiso/
        icons_helper.rb          # icon() helper — DSL over Iconify classes
        pagination_helper.rb
        breadcrumbs_helper.rb
        combobox_helper.rb
        sidebar_helper.rb
        calendar_helper.rb
        toast_helper.rb
        dropdown_menu_helper.rb
        table_helper.rb
        toggle_group_helper.rb
        component_helper.rb      # component_tag() + kiso() render helper
    javascript/
      controllers/
        kiso/                    # Namespaced under kiso--
          combobox_controller.js
          command_controller.js
          dialog_controller.js
          drawer_controller.js
          dropdown_menu_controller.js
          number_stepper_controller.js
          sidebar_controller.js
          tabs_controller.js
          toast_controller.js
          calendar_controller.js
          date_picker_controller.js
          toggle_group_controller.js
          breadcrumb_controller.js
          collapsible_controller.js
    views/
      kiso/                          # Namespaced to avoid collisions
        components/
          _alert.html.erb
          alert/
            _title.html.erb
            _description.html.erb
          _avatar.html.erb
          _badge.html.erb
          _breadcrumbs.html.erb
          _calendar.html.erb
          _card.html.erb
          card/
            _header.html.erb
            _title.html.erb
            _description.html.erb
            _content.html.erb
            _footer.html.erb
            _action.html.erb
          _collapsible.html.erb
          _combobox.html.erb
          combobox/
            _trigger.html.erb
            _content.html.erb
            _input.html.erb
            _list.html.erb
            _option.html.erb
            _empty.html.erb
          _command.html.erb
          _date_picker.html.erb
          _dialog.html.erb
          dialog/
            _header.html.erb
            _title.html.erb
            _description.html.erb
            _content.html.erb
            _footer.html.erb
            _close.html.erb
          _drawer.html.erb
          _dropdown_menu.html.erb
          dropdown_menu/
            _trigger.html.erb
            _content.html.erb
            _item.html.erb
            _separator.html.erb
          _empty.html.erb
          _item.html.erb
          _item_group.html.erb
          item/
            _media.html.erb
            _content.html.erb
            _title.html.erb
            _description.html.erb
            _actions.html.erb
            _link.html.erb
          _number_stepper.html.erb
          _page.html.erb
          page/
            _header.html.erb
            _body.html.erb
          _pagination.html.erb
          _popover.html.erb
          _progress.html.erb
          _separator.html.erb
          _sheet.html.erb
          _sidebar.html.erb
          sidebar/
            (sub-parts)
          _skeleton.html.erb
          _slider.html.erb
          _table.html.erb
          table/
            _header.html.erb
            _body.html.erb
            _row.html.erb
            _cell.html.erb
            _head.html.erb
            _caption.html.erb
            _footer.html.erb
          _tabs.html.erb
          tabs/
            _list.html.erb
            _trigger.html.erb
            _content.html.erb
          _toast.html.erb
          _toggle_group.html.erb
          _tooltip.html.erb
  config/
    importmap.rb
  test/
    components/
      previews/                  # Lookbook previews for every component
  kiso.gemspec
  Gemfile
  README.md
```

## Installation

```ruby
# Gemfile
gem "kiso"
```

```bash
bundle install
bin/rails generate kiso:install
```

The install generator:
1. Adds `@import "../builds/tailwind/kiso.css"` to application.css
2. Injects default theme CSS variables (customizable)
3. Creates `app/helpers/kiso_helper.rb` for icon/builder access
4. Configures importmap for Stimulus controllers
5. Installs `@iconify/tailwind4` and `@iconify-json/lucide` (npm)
6. Adds `@plugin "@iconify/tailwind4"` to the app's Tailwind CSS

## Component Catalog

### Mapping to shadcn/ui

Components marked with their implementation approach:

| shadcn Component    | Kiso Equivalent       | Type            | Source          |
|---------------------|-----------------------|-----------------|-----------------|
| **Actions**         |                       |                 |                 |
| Button              | Button                | CSS-only        | Maquina         |
| Toggle              | Toggle                | CSS-only        | New             |
| Toggle Group        | Toggle Group          | Stimulus        | Maquina         |
| **Layout**          |                       |                 |                 |
| Card                | Card                  | ERB + CSS       | Maquina         |
| Dialog              | Dialog                | ERB + Stimulus  | New (native)    |
| Drawer              | Drawer                | ERB + Stimulus  | New (native)    |
| Sheet               | Sheet                 | ERB + Stimulus  | New (native)    |
| Collapsible         | Collapsible           | ERB + CSS       | New (details)   |
| Separator           | Separator             | CSS-only        | New             |
| Scroll Area         | Scroll Area           | CSS-only        | New             |
| Aspect Ratio        | Aspect Ratio          | CSS-only        | New             |
| **Navigation**      |                       |                 |                 |
| Tabs                | Tabs                  | ERB + Stimulus  | New             |
| Breadcrumb          | Breadcrumbs           | ERB + Stimulus  | Maquina         |
| Pagination          | Pagination            | Helper + CSS    | Maquina + App   |
| Dropdown Menu       | Dropdown Menu         | ERB + Stimulus  | Maquina         |
| Command             | Command               | ERB + Stimulus  | New             |
| Sidebar             | Sidebar               | ERB + Stimulus  | Maquina         |
| Navigation Menu     | Navigation Menu       | ERB + Stimulus  | New             |
| **Data Display**    |                       |                 |                 |
| Table               | Table                 | ERB + CSS       | Maquina         |
| Badge               | Badge                 | ERB + CSS       | Maquina         |
| Avatar              | Avatar                | ERB + CSS       | New             |
| Skeleton            | Skeleton              | CSS-only        | New             |
| Calendar            | Calendar              | ERB + Stimulus  | Maquina         |
| Empty               | Empty                 | ERB + CSS       | Maquina         |
| Item                | Item / Item Group     | ERB + CSS       | App-level       |
| Page                | Page                  | ERB + CSS       | App-level       |
| Kbd                 | Kbd                   | CSS-only        | New             |
| **Forms**           |                       |                 |                 |
| Input               | Input                 | CSS-only        | Maquina         |
| Input Group         | Input Group           | CSS-only        | Maquina         |
| Textarea            | Textarea              | CSS-only        | Maquina         |
| Select              | Select                | CSS-only        | Maquina         |
| Checkbox            | Checkbox              | CSS-only        | Maquina         |
| Radio Group         | Radio                 | CSS-only        | Maquina         |
| Switch              | Switch                | CSS-only        | Maquina         |
| Slider              | Slider                | CSS + JS        | App-level       |
| Combobox            | Combobox              | ERB + Stimulus  | Maquina         |
| Date Picker         | Date Picker           | ERB + Stimulus  | Maquina         |
| Label               | Label                 | CSS-only        | New             |
| Number Stepper      | Number Stepper        | ERB + Stimulus  | App-level       |
| Input OTP           | Input OTP             | ERB + Stimulus  | New             |
| **Feedback**        |                       |                 |                 |
| Alert               | Alert                 | ERB + CSS       | Maquina         |
| Alert Dialog        | Alert Dialog          | ERB + native    | New             |
| Toast               | Toast                 | ERB + Stimulus  | Maquina         |
| Tooltip             | Tooltip               | CSS + JS        | App-level       |
| Hover Card          | Hover Card            | ERB + CSS       | New             |
| Popover             | Popover               | ERB + native    | New             |
| Progress            | Progress              | CSS + native    | New             |
| Spinner             | Spinner               | CSS-only        | New             |
| Context Menu        | Context Menu          | ERB + Stimulus  | New             |

**Totals:**
- ~45 components (vs shadcn's ~60, excluding React-specific ones like Form/hooks)
- ~20 carried from maquina (MIT, with refinements)
- ~5 carried from app-level (Item, Page, Number Stepper, Slider, Tooltip)
- ~20 new builds

### Native HTML5 Strategy (Progressive Approach)

These shadcn components map directly to native elements, needing minimal or no
Stimulus:

| Component     | Native Element            | Stimulus Needed For          |
|---------------|---------------------------|------------------------------|
| Dialog        | `<dialog>`                | Focus trap, close on escape  |
| Sheet/Drawer  | `<dialog>` + CSS position | Slide animation direction    |
| Popover       | `[popover]` attribute     | Positioning (Floating UI)    |
| Collapsible   | `<details>/<summary>`     | Animation only               |
| Progress      | `<progress>`              | None (CSS-only)              |
| Alert Dialog  | `<dialog>` (modal)        | Minimal                      |
| Tabs          | Role-based                | Panel switching, ARIA        |

## Phased Rollout

### Phase 1: Foundation (Bootstrap the Gem)

Extract maquina components into kiso. This gets the gem working with zero new
code:

- Gem skeleton with Rails engine, importmap, Tailwind CSS integration
- Install generator (theme + CSS import + helper)
- Carry over: Button, Badge, Card, Alert, Input, Input Group, Textarea,
  Select, Checkbox, Radio, Switch, Table, Empty State, Toast
- Carry over: Combobox, Calendar, Date Picker, Toggle Group, Dropdown Menu,
  Sidebar, Breadcrumbs (with Stimulus controllers)
- Carry over from app: Item/ItemGroup, Page, Number Stepper, Slider, Tooltip
- Helpers: icons, pagination, breadcrumbs, combobox, etc.
- Lookbook previews for every component

**Milestone:** Ninjanizr replaces `maquina-components` with `kiso` in its
Gemfile. Zero visual changes. All existing components work.

### Phase 2: Core Additions

Build the most-needed missing components:

- **Dialog** (native `<dialog>`, replaces hand-rolled modals)
- **Sheet** (slide-over dialog variant)
- **Drawer** (bottom sheet dialog variant)
- **Popover** (native Popover API)
- **Tabs** (lightweight Stimulus)
- **Collapsible** (native `<details>`)
- **Separator** (CSS-only)
- **Label** (CSS-only)
- **Avatar** (ERB + CSS)
- **Skeleton** (CSS-only)
- **Progress** (native `<progress>`)
- **Spinner** (CSS-only)

**Milestone:** Covers ~85% of common UI needs. Ninjanizr's hand-rolled dialogs
and option pickers refactored to use kiso Dialog/Sheet.

### Phase 3: Advanced Interactions

Components requiring more sophisticated Stimulus work:

- **Command** (command palette with fuzzy search)
- **Context Menu** (right-click)
- **Hover Card** (delayed popover on hover)
- **Navigation Menu** (desktop mega-menu)
- **Alert Dialog** (confirmation variant)
- **Input OTP** (multi-digit code input)
- **Scroll Area** (custom scrollbar)
- **Kbd** (keyboard shortcut display)
- **Aspect Ratio** (CSS-only)

**Milestone:** Full shadcn parity for Rails. The gem covers every common UI
pattern.

### Phase 4: Ecosystem

- **Form builder integration** — helper that wraps Rails form fields with
  Label + Input + error message, matching shadcn's Field pattern
- **Data Table** — Table + sorting + filtering + pagination composed
- **Chart** — Integration with a charting library (Chart.js or similar)
- **Blocks** — Pre-composed layouts (auth forms, settings pages, dashboards)
  as generator templates

## Migration Path for Ninjanizr

### Step 1: Create the Gem

Set up `kiso` as a new gem repository. Bootstrap the engine structure from
maquina's architecture.

### Step 2: Port Components

Copy maquina's ERB, CSS, Stimulus, and helpers. Rename namespaces:
- `maquina_components` -> `kiso`
- `data-controller="combobox"` -> `data-controller="kiso--combobox"`
- CSS import path: `kiso/engine.css`
- Helper module: `Kiso::ComponentHelper`

Port app-level components (Item, Page, Number Stepper, Slider, Tooltip) from
Ninjanizr into the gem.

### Step 3: Swap in Ninjanizr

1. Replace `gem "maquina-components"` with `gem "kiso"` in Gemfile
2. Run `bin/rails generate kiso:install`
3. Remove maquina-specific CSS imports
4. Update Stimulus controller references (`combobox` -> `kiso--combobox`)
5. Remove app-level components that now live in the gem
6. Run tests, verify Lookbook, visual QA

### Step 4: Iterate

Build Phase 2 components as Ninjanizr needs them. The gem grows driven by
real usage.

## Design Principles

1. **Native first.** Use `<dialog>`, `[popover]`, `<details>`, `<progress>`
   before reaching for JavaScript. Progressive enhancement, not reimplementation.

2. **Data attributes are the API.** `data-component`, `data-variant`,
   `data-size`, `data-*-part`. CSS selects on these. No class soup.

3. **Composition over configuration.** Card is Header + Title + Content +
   Footer. Not `<Card title="..." footer="...">`. Small pieces, flexibly
   combined.

4. **ERB is enough.** Partials with strict locals, `yield` for slots,
   `content_tag` for attribute merging. No framework on top of the framework.

5. **Tailwind classes first, `@apply` as last resort.** Put utility classes
   directly on elements in ERB. Only use `@apply` in component CSS files for
   things you can't express in markup — like styling `data-variant` selectors,
   complex pseudo-states, or animation keyframes.

6. **One CSS file per component.** Easy to find, easy to understand, easy to
   override. Master file imports them all. These files should be thin — most
   styling lives in ERB as Tailwind classes.

7. **Theme via semantic tokens.** Semantic palettes (primary, neutral, etc.)
   alias Tailwind colors. Surface tokens (bg-elevated, text-muted, etc.) flip
   automatically in dark mode — components never use `dark:` for these.

8. **Turbo-compatible by default.** Components work inside Turbo Frames and
   respond to Turbo Streams without special handling.

9. **Stimulus as enhancement.** Controllers add keyboard navigation, focus
   management, and animation. Remove the controller and the component still
   renders and is usable.

## Open Questions

- ~~**Icon system**~~: **Resolved.** Iconify via the Tailwind CSS plugin.
  `icon()` helper with `collection:name` syntax, `Kiso.default_icons` for
  component defaults. See "Icon System" section above.

- ~~**Lookbook bundling**~~: **Resolved.** Ship previews with the gem.
  Lookbook is a dev-only dependency — any app that installs Kiso gets a
  live component browser in development with zero extra setup.

- ~~**Stimulus controller namespacing**~~: **Resolved.** Namespace everything.
  Controllers use `data-controller="kiso--combobox"`, views live under
  `app/views/kiso/components/`, and the `kiso()` render helper hides the
  path from callers.

- ~~**Monorepo or separate repo**~~: **Resolved.** Separate repo. Kiso lives
  at its own GitHub repo. Host apps use `bundle config set local.kiso` for
  local development (see README).
