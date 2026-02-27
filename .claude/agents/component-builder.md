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
4. `vendor/nuxt-ui/src/theme/{name}.ts` — **theming source of truth**. Color × variant compounds.
5. An existing Kiso component as reference — read `lib/kiso/themes/card.rb` and `app/views/kiso/components/_card.html.erb` for the exact patterns.
6. `.claude/skills/contributing/SKILL.md` — full conventions and checklist

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
    data: kiso_prepare_options(component_options, component: :component_name),
    **component_options do %>
  <%= yield %>
<% end %>
```

Sub-part partial: `app/views/kiso/components/{name}/_{part}.html.erb`

```erb
<%# locals: (css_classes: "", **component_options) %>
<%= content_tag :div,
    class: Kiso::Themes::ComponentNamePart.render(class: css_classes),
    data: kiso_prepare_options(component_options, component: :component_name, component_name_part: :part),
    **component_options do %>
  <%= yield %>
<% end %>
```

Rules:
- `text-foreground` on every container component root
- Strict locals on every partial
- `css_classes: ""` and `**component_options` on every partial
- Use `kiso_prepare_options()` for data attributes
- Match the HTML element shadcn uses (`<div>`, `<label>`, `<fieldset>`, etc.)

### 4. Create Lookbook previews

File: `test/components/previews/kiso/{name}_preview.rb`
Templates: `test/components/previews/kiso/{name}_preview/*.html.erb`

Match the shadcn docs page demo count. Check `https://ui.shadcn.com/docs/components/radix/{name}` for how many demos they show and replicate them.

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

Add the component to `skills/kiso/references/components.md` in the appropriate section (Layout, Forms, Element).

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

### 9. Create the PR

```bash
git checkout -b feat/{name}-component
git add [specific files]
git commit -m "feat: ComponentName component (#N)"
git push -u origin feat/{name}-component
gh pr create --title "feat: ComponentName component (#N)" --body "$(cat <<'EOF'
## Summary
- [bullet points of what was built]

Closes #N

## Test plan
- [x] All Lookbook previews render (200)
- [x] standardrb passes
- [x] rake test passes
- [ ] Visual review in Lookbook
EOF
)"
```

**CRITICAL:** Include `Closes #N` in the PR body so GitHub auto-closes the issue on merge.

### 10. Stop services

```bash
bin/dev stop
```

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
- [ ] All files: theme, require, partials, previews, docs page, nav entry, skills ref
- [ ] `Closes #N` in PR body
- [ ] Lint passes
- [ ] Tests pass
- [ ] All previews return 200

## Field preview integration

If this component is a form control, check issue #11 for the Field preview
mapping table. Update the corresponding Field preview template at
`test/components/previews/kiso/field_preview/` to use the real Kiso component
instead of the plain HTML placeholder.
