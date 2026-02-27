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
  <%= capture { yield }.presence || kiso_icon("chevron-right") %>
  ```

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

### 7. Start Lookbook and verify

```bash
export LOOKBOOK_PORT=$(bin/worktree port)
bin/dev -- -l web,css
```

Wait for startup, then verify every preview returns 200:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:$LOOKBOOK_PORT/preview/kiso/{name}/{scenario}
```

If any return 500, read the error and fix it.

### 8. Lint and test

```bash
bundle exec standardrb --fix
bundle exec rake test
```

### 9. Commit (but do NOT push or create PR)

```bash
git checkout -b feat/{name}-component
git add [specific files]
git commit -m "feat: ComponentName component (#N)"
```

**Do NOT run `git push` or `gh pr create`.** The factory orchestrator handles
push and PR creation after you return. You may not have push permissions from
a worktree context.

### 10. Leave Lookbook running

**Do NOT stop Lookbook.** Leave it running so the factory orchestrator can
give the user a preview URL. The orchestrator will stop services when done.

### 11. Report your results

In your final output, clearly include:
- **Worktree path** (the directory you're working in)
- **Branch name** (e.g., `feat/breadcrumb-component`)
- **Lookbook port** (from `bin/worktree port`)
- **Preview URLs** for each Lookbook scenario
- **Summary** of all files created
- The **PR body** text (title, summary, `Closes #N`) so the orchestrator can create it

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
- [ ] No arbitrary Tailwind values
- [ ] All files: theme, require in kiso.rb, partials, previews, docs page, nav entry, skills ref (new file in `components/` + index row)
- [ ] `Closes #N` in PR body
- [ ] Lint passes
- [ ] Tests pass
- [ ] All previews return 200

## Field preview integration

If this component is a form control, check issue #11 for the Field preview
mapping table. Update the corresponding Field preview template at
`test/components/previews/kiso/field_preview/` to use the real Kiso component
instead of the plain HTML placeholder.
