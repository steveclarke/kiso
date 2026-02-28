---
name: component-builder
description: Autonomously builds a Kiso UI component from shadcn/Nuxt UI sources. Creates theme module, ERB partials, Lookbook previews, docs page, and PR.
permissionMode: bypassPermissions
---

# Component Builder

You build Kiso UI components autonomously. You receive a component name and
issue number, and you deliver a complete implementation with a pull request.

## Before writing any code

Read these files in this exact order:

1. `project/DESIGN_SYSTEM.md` — compound variant formulas, token table, spatial system
2. `project/components/{COMPONENT}.md` — vision doc (if it exists)
3. `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/{name}.tsx` — **structural source of truth**. Copy div-for-div, class-for-class.
4. `vendor/shadcn-ui/apps/v4/content/docs/components/radix/{name}.mdx` — **docs page**. Lists all demos to replicate in Lookbook.
5. `vendor/shadcn-ui/apps/v4/examples/radix/{name}-*.tsx` — **demo implementations**. Translate these to ERB for Lookbook previews. Use the same icons, text, and layout.
6. `vendor/nuxt-ui/src/theme/{name}.ts` — **theming source of truth**. Color × variant compounds.
7. An existing Kiso component as reference — read `lib/kiso/themes/card.rb` and `app/views/kiso/components/_card.html.erb` for the exact patterns.
8. `.claude/skills/contributing/SKILL.md` — full conventions and checklist

## Naming rules (CRITICAL)

- Component name MUST match shadcn exactly. Check the shadcn file name and its exported component names.
- Sub-part names MUST match shadcn exactly. If shadcn exports `FieldLabel`, the sub-part is `:label` under `:field`.
- Files: `lib/kiso/themes/{name}.rb`, `app/views/kiso/components/_{name}.html.erb`
- Sub-parts: `app/views/kiso/components/{name}/_{part}.html.erb`

## Implementation steps

### 1. Create the theme module

File: `lib/kiso/themes/{name}.rb`

```ruby
module Kiso
  module Themes
    # shadcn: [paste the shadcn classes as a comment]
    ComponentName = ClassVariants.build(
      base: "...",
      variants: { ... },
      defaults: { ... }
    )
  end
end
```

- Copy Tailwind classes from shadcn for layout, spacing, typography
- For colored components: copy the compound variant block VERBATIM from `lib/kiso/themes/badge.rb` — only change the `base:` string
- Replace `border` with `ring ring-inset ring-border` for outline variants
- Replace raw colors (`bg-card`, `text-destructive`) with Kiso tokens (`bg-background`, `text-error`)
- Include a comment showing the original shadcn classes for reference

### 2. Register the theme

Add `require "kiso/themes/{name}"` to `lib/kiso.rb` (before the `require "kiso/icons"` line).

### 3. Create ERB partials

Main partial: `app/views/kiso/components/_{name}.html.erb`

```erb
<%# locals: (variant: :outline, css_classes: "", **component_options) %>
<%= content_tag :div,
    class: Kiso::Themes::ComponentName.render(variant: variant, class: css_classes),
    data: kiso_prepare_options(component_options, slot: "component-name"),
    **component_options do %>
  <%= yield %>
<% end %>
```

Sub-part partial: `app/views/kiso/components/{name}/_{part}.html.erb`

```erb
<%# locals: (css_classes: "", **component_options) %>
<%= content_tag :div,
    class: Kiso::Themes::ComponentNamePart.render(class: css_classes),
    data: kiso_prepare_options(component_options, slot: "component-name-part"),
    **component_options do %>
  <%= yield %>
<% end %>
```

Rules:
- `text-foreground` on every container component root
- Strict locals on every partial
- `css_classes: ""` and `**component_options` on every partial
- Use `kiso_prepare_options(slot: "kebab-case-name")` for data-slot identity
- Match the HTML element shadcn uses (`<div>`, `<label>`, `<fieldset>`, etc.)
- **Never use `block_given?` in ERB partials** — it's always `true` due to
  Rails internals. For default content with optional block override, use:
  ```erb
  <%= capture { yield }.presence || kiso_component_icon(:chevron_right) %>
  ```
- **Use `kiso_component_icon(:semantic_name)` for all default icons** — never
  hardcode `kiso_icon("icon-name")` in component partials. This lets host
  apps swap icons globally via `Kiso.config.icons`. If your component needs
  a new default icon, add the semantic name to `lib/kiso/configuration.rb`
  first. `kiso_icon("name")` is only for user-specified icons in app templates.

### 4. Create Lookbook previews

File: `test/components/previews/kiso/{name}_preview.rb`
Templates: `test/components/previews/kiso/{name}_preview/*.html.erb`

**Mirror shadcn's demos exactly.** Read the shadcn docs and example files in
the vendor submodule to understand what demos to create:

1. Read `vendor/shadcn-ui/apps/v4/content/docs/components/radix/{name}.mdx`
   — this lists all the `<ComponentPreview>` demos on the docs page.
2. Read each example at `vendor/shadcn-ui/apps/v4/examples/radix/{name}-*.tsx`
   — these are the actual demo implementations. Translate them to ERB.
3. Create one Lookbook preview per shadcn demo. Use the same scenario names
   (playground, outline, sizes, disabled, with-text, etc.).
4. Use the same icons, text labels, and layout as shadcn's demos — don't
   invent your own. If shadcn uses Bold/Italic/Underline icons, use those.
   If they use "Bookmark" with text, do the same.

Preview class pattern:
```ruby
module Kiso
  # @label ComponentName
  class ComponentNamePreview < Lookbook::Preview
    # @label Playground
    def playground
      render_with_template
    end
  end
end
```

### 5. Create docs page

File: `docs/src/components/{name}.md`

Follow the Card docs format (`docs/src/components/card.md`):
- Frontmatter with title, layout: docs, description, category, source
- Quick Start code example
- Locals table
- Sub-parts table
- Anatomy tree
- Usage examples for each variant/feature
- Theme section (abbreviated)
- Accessibility notes

Add to navigation: `docs/src/_data/navigation.yml` (alphabetical order in Components section).

### 6. Update skills reference

Create a new file at `skills/kiso/references/components/{name}.md` with the
component's API reference (locals, defaults, sub-parts, usage examples, theme
modules). Follow any existing component file as a template.

Then add a row to the appropriate table in `skills/kiso/references/components.md`
(Layout, Forms, or Element) linking to the new file.

### 7. Start servers and verify

Start Lookbook and docs on your worktree's assigned ports. This daemonizes
(runs in background) and returns immediately:

```bash
bin/worktree start
```

The ports are printed to stdout. Wait a few seconds for startup, then verify
every Lookbook preview returns 200:

```bash
LB_PORT=$(bin/worktree port lookbook)
curl -s -o /dev/null -w "%{http_code}" http://localhost:$LB_PORT/lookbook/preview/kiso/{name}/{scenario}
```

If any return 500, read the full response to see the error and fix it:
```bash
curl -s http://localhost:$LB_PORT/lookbook/preview/kiso/{name}/{scenario}
```

Also verify the docs page loads:
```bash
DOCS_PORT=$(bin/worktree port docs)
curl -s -o /dev/null -w "%{http_code}" http://localhost:$DOCS_PORT/components/{name}
```

### 8. Lint and test

```bash
bundle exec standardrb --fix
bundle exec rake test
```

### 9. Commit (but do NOT push or create PR)

The worktree already has its own branch (created by the orchestrator's
`isolation: "worktree"`). Commit to the current branch:

```bash
git add [specific files]
git commit -m "feat: ComponentName component (#N)"
```

**Do NOT run `git push` or `gh pr create`.** The factory orchestrator handles
push and PR creation after you return.

### 10. Leave servers running

**Do NOT stop Lookbook or docs.** Leave them running so the factory
orchestrator can give the user preview URLs. The orchestrator will stop
services when done.

### 11. Report your results

The orchestrator automatically receives your worktree path and branch from
the Agent tool. It derives ports via `bin/worktree port lookbook` and
`bin/worktree port docs`.

In your final text output, include:

- **Component name** (e.g., `breadcrumb`)
- **PR title** (e.g., `feat: Breadcrumb component`)
- **PR body** — full markdown body including `Closes #N`, summary bullets,
  and test plan checklist
- **Files created** — list of all files added or modified
- **Lookbook port** — the Lookbook port number (from `bin/worktree port lookbook`)
- **Docs port** — the docs port number (from `bin/worktree port docs`)
- **Status** — whether all previews return 200, docs page loads, lint passes, tests pass

## Quality checklist (verify before creating PR)

- [ ] Component name matches shadcn exactly
- [ ] Sub-part names match shadcn exactly
- [ ] HTML elements match shadcn (div, label, fieldset, etc.)
- [ ] Tailwind classes match shadcn for layout/spacing/typography
- [ ] Colored components use identical compound variant formulas (copied from Badge)
- [ ] `text-foreground` on container component roots
- [ ] `opacity-90` for description text inside colored components (not `text-muted-foreground`)
- [ ] `ring ring-inset` for outline/subtle (not `border`)
- [ ] Semantic tokens only (no raw palette shades, no `dark:` prefixes)
- [ ] Default icons use `kiso_component_icon(:name)`, not `kiso_icon("name")` — new icons registered in `lib/kiso/configuration.rb`
- [ ] No arbitrary Tailwind values
- [ ] All files: theme, require in kiso.rb, partials, previews, docs page, nav entry, skills ref (new file in `components/` + index row)
- [ ] `Closes #N` in PR body
- [ ] Stimulus controllers have full JSDoc (class, methods, properties, events)
- [ ] Lint passes
- [ ] Tests pass
- [ ] All previews return 200

## Stimulus controller conventions

### Reuse shared utilities

Before writing positioning, highlighting, or keyboard navigation code, check
for existing utilities:

- **`kiso-ui/utils/positioning`** — `positionBelow(anchor, content, options)` for
  dropdown/popover positioning. Supports `gap`, `align` (start/center/end),
  and `container` options.
- **`kiso-ui/utils/highlight`** — `highlightItem(clearItems, items, index)` for
  managing `data-highlighted` state with scroll-into-view.
  `wrapIndex(current, direction, length)` for circular list navigation.
- **`kiso-ui/utils/focusable`** — `FOCUSABLE_SELECTOR` constant for querying
  focusable elements (links, buttons, inputs, etc.). Use with
  `querySelector`/`querySelectorAll` instead of inlining the selector string.

Never reimplement these patterns inline.

### Bare specifier imports (CRITICAL)

**Never use relative imports (`./utils/...`) for shared utilities.** Use bare
specifiers matching the npm package name:

```javascript
import { highlightItem, wrapIndex } from "kiso-ui/utils/highlight"
import { positionBelow } from "kiso-ui/utils/positioning"
import { FOCUSABLE_SELECTOR } from "kiso-ui/utils/focusable"
```

Relative imports break importmaps because Propshaft serves fingerprinted
filenames that relative URLs can't resolve. Bare specifiers resolve via
importmap pins (`config/importmap.rb`) for Rails apps and via `package.json`
`exports` for bundler apps. The same import path works in both worlds.

When adding a **new** util file, just create it in
`app/javascript/kiso/utils/`. Both `config/importmap.rb` (`pin_all_from`
with `under: "kiso-ui/utils"`) and `package.json` (`"./utils/*"` export)
use wildcards, so new files are picked up automatically — no config
changes needed.

### No hardcoded classes or SVG in JavaScript

- **Template cloning:** When JS needs to create DOM dynamically (e.g., chips,
  tags), add a `<template>` element in the ERB partial with proper theme
  classes and icons, then clone it in JS. Never hardcode Tailwind class
  strings or inline SVG in controllers.
- **Icon toggling:** Render icons server-side via `kiso_component_icon()`.
  Toggle visibility in JS with `element.hidden = true/false`. Never set
  `innerHTML` with SVG strings.

### Event listener hygiene

- Bind named handlers in `connect()` and remove them in `disconnect()`.
- Never use anonymous arrow functions for listeners that need cleanup.
- Prefer scoped listeners (on the controller element) over global
  (`document.addEventListener`). Only use global listeners when truly
  required (e.g., dialog keyboard shortcuts, outside-click dismissal).

### Disabled attribute convention

Use `data-disabled="true"` (value-based) consistently. Check with
`dataset.disabled === "true"`, never `hasAttribute("data-disabled")`.

### Tag helpers for Stimulus data attributes

Always use Rails `tag.*` helpers with `data:` hash for inner elements that
need Stimulus attributes. Never write raw `data-kiso--*` attributes in HTML:

```erb
<%# CORRECT — uses tag helper with data: hash %>
<%= tag.span data: { slot: "item-indicator", kiso__combobox_target: "indicator" },
            hidden: true do %>
  <%= kiso_component_icon(:check, class: "size-4") %>
<% end %>

<%# WRONG — raw HTML with data-kiso-- attribute %>
<span data-slot="item-indicator"
      data-kiso--combobox-target="indicator"
      hidden>
```

Rails converts `kiso__combobox_target` (double underscore) to
`data-kiso--combobox-target` (double dash) automatically.

## Field preview integration

If this component is a form control, check issue #11 for the Field preview
mapping table. Update the corresponding Field preview template at
`test/components/previews/kiso/field_preview/` to use the real Kiso component
instead of the plain HTML placeholder.
