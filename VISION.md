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
1. ERB Partials          <%%= render "components/card" %>
2. CSS (data-attributes)  [data-component="card"] { ... }
3. Stimulus Controllers   data-controller="combobox" (only when needed)
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

Built on Tailwind's color palette — no hand-rolled OKLCH values. Semantic
color tokens alias Tailwind's built-in colors, similar to how Nuxt UI works.
You pick a palette name ("my primary is blue") and get the full shade range
for free.

```css
@theme {
  /* Semantic aliases → Tailwind palette */
  --color-primary: var(--color-blue-600);
  --color-primary-foreground: var(--color-white);
  --color-secondary: var(--color-zinc-100);
  --color-secondary-foreground: var(--color-zinc-900);
  --color-muted: var(--color-zinc-100);
  --color-muted-foreground: var(--color-zinc-500);
  --color-accent: var(--color-zinc-100);
  --color-accent-foreground: var(--color-zinc-900);
  --color-destructive: var(--color-red-600);
  --color-destructive-foreground: var(--color-white);
  --color-success: var(--color-green-600);
  --color-success-foreground: var(--color-white);
  --color-warning: var(--color-amber-500);
  --color-warning-foreground: var(--color-white);
  --color-border: var(--color-zinc-200);
  --color-input: var(--color-zinc-200);
  --color-ring: var(--color-blue-600);
  --color-background: var(--color-white);
  --color-foreground: var(--color-zinc-950);
  --color-card: var(--color-white);
  --color-card-foreground: var(--color-zinc-950);
}

/* Dark mode: swap to different shades from the same palettes */
.dark {
  --color-primary: var(--color-blue-400);
  --color-background: var(--color-zinc-950);
  --color-foreground: var(--color-zinc-50);
  --color-border: var(--color-zinc-800);
  /* ... */
}
```

**Why this approach:**
- Tailwind's palettes are professionally designed with consistent contrast
- No time spent picking and tuning raw OKLCH values
- Changing your brand color means changing one word (`blue` → `orange`)
- Full shade range available (`primary-50` through `primary-950`) when needed
- Dark mode is just remapping to darker/lighter shades of the same palettes
- Components use `var(--color-primary)` in CSS, or `bg-primary` in Tailwind
  utilities — both work

### Component API Pattern

Every component follows the same conventions:

```erb
<%# locals: (variant: :default, size: :md, css_classes: "", **html_options) %>
<% merged_data = (html_options.delete(:data) || {}).merge(
    component: :badge,
    variant: variant,
    size: size
  ).compact %>

<%%= content_tag :span, class: css_classes.presence, data: merged_data,
    **html_options do %>
  <%%= yield %>
<%% end %>
```

- `data-component` identifies the type (CSS hooks onto this)
- `data-variant` selects visual style
- `data-size` controls dimensions
- `data-*-part` names sub-parts (e.g., `data-card-part="header"`)
- `css_classes` allows additional Tailwind utilities
- `**html_options` passes through arbitrary HTML attributes
- A `component_data` helper merges caller data with component defaults

### Rendering Components

```erb
<%%= render "components/badge", variant: :success do %>Active<%% end %>

<%%= render "components/card" do %>
  <%%= render "components/card/header" do %>
    <%%= render "components/card/title", text: "Members" %>
  <%% end %>
  <%%= render "components/card/content" do %>
    ...
  <%% end %>
<%% end %>
```

CSS-only components (Button, Input, etc.) use data attributes directly:

```erb
<%%= f.submit "Save", data: { component: "button", variant: "primary" } %>
<%%= f.text_field :name, data: { component: "input" } %>
```

## Gem Structure

```
kiso/
  lib/
    kiso.rb
    kiso/
      engine.rb
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
        kiso_engine/
          engine.css             # Master @import of all component CSS
    helpers/
      kiso/
        icons_helper.rb
        pagination_helper.rb
        breadcrumbs_helper.rb
        combobox_helper.rb
        sidebar_helper.rb
        calendar_helper.rb
        toast_helper.rb
        dropdown_menu_helper.rb
        table_helper.rb
        toggle_group_helper.rb
        component_helper.rb      # component_data merge utility
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
1. Adds `@import "../builds/tailwind/kiso_engine.css"` to application.css
2. Injects default theme CSS variables (customizable)
3. Creates `app/helpers/kiso_helper.rb` for icon/builder access
4. Configures importmap for Stimulus controllers

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
- CSS import path: `kiso_engine/engine.css`
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

7. **Theme via Tailwind palettes.** Semantic tokens (`--color-primary`, etc.)
   alias Tailwind's built-in colors. Change your brand by swapping one palette
   name. No hand-rolled color values.

8. **Turbo-compatible by default.** Components work inside Turbo Frames and
   respond to Turbo Streams without special handling.

9. **Stimulus as enhancement.** Controllers add keyboard navigation, focus
   management, and animation. Remove the controller and the component still
   renders and is usable.

## Open Questions

- **Icon system**: Maquina bundles 60+ inline SVG icons via a helper. Should
  kiso do the same, or integrate with an icon library (Lucide via importmap)?
  Inline SVGs are self-contained but bloat the helper. An icon component that
  references a sprite sheet might scale better.

- **Lookbook bundling**: Should Lookbook previews ship with the gem (available
  to all projects in dev) or live in a separate companion gem? Shipping with
  the gem is convenient but adds test dependencies.

- **Stimulus controller namespacing**: Maquina uses bare names
  (`data-controller="combobox"`). Kiso should namespace
  (`data-controller="kiso--combobox"`) to avoid collisions with app-level
  controllers. This is a breaking change from maquina's convention.

- **Monorepo or separate repo**: Kiso as its own GitHub repo (clean, focused)
  vs. living in a monorepo with Ninjanizr (convenient during initial
  development). Separate repo is the long-term answer; monorepo may be
  practical for bootstrapping.
