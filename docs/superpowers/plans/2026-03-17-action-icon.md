# ActionIcon Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new `kui(:action_icon)` component — a small, inline icon-only action trigger for table cells, card headers, and text rows.

**Architecture:** Single theme module + single ERB partial. No Stimulus controller, no CSS file. Polymorphic tag (`<button>`, `<a>`, `button_to`) reuses the same pattern as Button. Three sizes (xs/sm/md) via padding-only sizing — no fixed heights.

**Tech Stack:** Ruby (ClassVariants theme), ERB partial, Tailwind CSS semantic tokens, Lookbook preview, Bridgetown docs page.

**Spec:** `docs/superpowers/specs/2026-03-17-action-icon-design.md`

---

### Task 1: Theme module

**Files:**
- Create: `lib/kiso/themes/action_icon.rb`
- Modify: `lib/kiso.rb` (add require)

- [ ] **Step 1: Create theme module**

Create `lib/kiso/themes/action_icon.rb`:

```ruby
module Kiso
  module Themes
    # Inline icon-only action trigger for table cells, card headers,
    # and text rows.
    #
    # Quiet by default — muted foreground that brightens on hover with
    # a subtle background. No fixed height; flows inline with
    # surrounding text.
    #
    # @example
    #   ActionIcon.render(size: :sm)
    #
    # Variants:
    # - +size+ — :xs, :sm (default), :md
    #
    # shadcn base: n/a (no shadcn equivalent — inspired by Mantine ActionIcon
    # and Outport's appui(:icon_action))
    ActionIcon = ClassVariants.build(
      base: "inline-flex items-center justify-center " \
            "text-muted-foreground hover:text-foreground " \
            "hover:bg-accent rounded-md " \
            "cursor-pointer transition-colors duration-150 " \
            "disabled:pointer-events-none disabled:opacity-50 " \
            "aria-disabled:cursor-not-allowed aria-disabled:opacity-50 " \
            "focus-visible:outline-2 focus-visible:outline-offset-2 " \
            "focus-visible:outline-inverted " \
            "#{Shared::SVG_BASE}",
      variants: {
        size: {
          xs: "p-0.5 [&_svg:not([class*='size-'])]:size-3",
          sm: "p-1 [&_svg:not([class*='size-'])]:size-3.5",
          md: "p-1.5 [&_svg:not([class*='size-'])]:size-4"
        }
      },
      defaults: {size: :sm}
    )
  end
end
```

- [ ] **Step 2: Add require to `lib/kiso.rb`**

Insert between `require "kiso/themes/alert"` (line 14) and
`require "kiso/themes/aspect_ratio"` (line 15):

```ruby
require "kiso/themes/action_icon"
```

- [ ] **Step 3: Verify theme loads**

Run: `bundle exec ruby -e "require 'kiso'; puts Kiso::Themes::ActionIcon.render(size: :sm)"`

Expected: A string of Tailwind classes including `inline-flex`, `p-1`,
`text-muted-foreground`, etc.

- [ ] **Step 4: Commit**

```bash
git add lib/kiso/themes/action_icon.rb lib/kiso.rb
git commit -m "feat(action_icon): add theme module with size variants"
```

---

### Task 2: ERB partial

**Files:**
- Create: `app/views/kiso/components/_action_icon.html.erb`

- [ ] **Step 1: Create the partial**

Create `app/views/kiso/components/_action_icon.html.erb`:

```erb
<%# locals: (icon:, size: :sm, title: nil, href: nil, method: nil, disabled: false, css_classes: "", **component_options) %>
<%# Inline icon-only action trigger. Polymorphic tag: <button> by default,
    <a> with href:, or button_to with href: + method: (non-GET).
    No fixed height — flows inline with surrounding text. %>
<%
  css = Kiso::Themes::ActionIcon.render(size: size, class: css_classes)
  label = title || t("kiso.action_icon.action")
  data = kiso_prepare_options(component_options, slot: "action-icon")
  use_button_to = href.present? && method.present? && method.to_s != "get"
%>
<% if use_button_to %>
  <%= button_to href,
      method: method,
      class: css,
      form_class: "contents",
      data: data,
      disabled: disabled || nil,
      title: title,
      aria: { label: label },
      **component_options do %>
    <%= kiso_icon(icon) %>
  <% end %>
<% elsif href.present? %>
  <% component_options[:href] = href
     component_options[:"aria-disabled"] = true if disabled %>
  <%= content_tag :a,
      class: css,
      data: data,
      title: title,
      aria: { label: label },
      **component_options do %>
    <%= kiso_icon(icon) %>
  <% end %>
<% else %>
  <%= content_tag :button,
      class: css,
      data: data,
      type: "button",
      disabled: disabled || nil,
      title: title,
      aria: { label: label },
      **component_options do %>
    <%= kiso_icon(icon) %>
  <% end %>
<% end %>
```

- [ ] **Step 2: Verify partial renders in Rails console**

Start the dummy app or Lookbook and test in a view or console that
`kui(:action_icon, icon: "pencil", title: "Edit")` renders a `<button>`
with the expected classes and `data-slot="action-icon"`.

- [ ] **Step 3: Commit**

```bash
git add app/views/kiso/components/_action_icon.html.erb
git commit -m "feat(action_icon): add ERB partial with polymorphic tag"
```

---

### Task 3: i18n fallback

**Files:**
- Modify: `config/locales/en.yml`

- [ ] **Step 1: Add i18n entry**

Add under `kiso:` in `config/locales/en.yml`, in alphabetical order
(before the `alert:` block — `action_icon` sorts before `alert`):

```yaml
    action_icon:
      action: "Action"
```

- [ ] **Step 2: Commit**

```bash
git add config/locales/en.yml
git commit -m "feat(action_icon): add i18n fallback label"
```

---

### Task 4: Preset entries

**Files:**
- Modify: `lib/kiso/presets/rounded.rb`
- Modify: `lib/kiso/presets/sharp.rb`

- [ ] **Step 1: Add to rounded preset**

In `lib/kiso/presets/rounded.rb`, add at the top of the `ROUNDED` hash,
before the `button:` entry (`action_icon` sorts before `button`):

```ruby
      # ActionIcon: rounded-md → rounded-full
      action_icon: {base: "rounded-full"},
```

- [ ] **Step 2: Add to sharp preset**

In `lib/kiso/presets/sharp.rb`, add at the top of the `SHARP` hash,
before the `button:` entry (`action_icon` sorts before `button`):

```ruby
      # ActionIcon: rounded-md → rounded-none
      action_icon: {base: "rounded-none"},
```

- [ ] **Step 3: Commit**

```bash
git add lib/kiso/presets/rounded.rb lib/kiso/presets/sharp.rb
git commit -m "feat(action_icon): add preset entries for rounded and sharp"
```

---

### Task 5: Lookbook preview

**Files:**
- Create: `test/components/previews/kiso/action_icon_preview.rb`
- Create: `test/components/previews/kiso/action_icon_preview/playground.html.erb`
- Create: `test/components/previews/kiso/action_icon_preview/sizes.html.erb`

- [ ] **Step 1: Create preview class**

Create `test/components/previews/kiso/action_icon_preview.rb`:

```ruby
module Kiso
  # @label ActionIcon
  # @logical_path kiso
  class ActionIconPreview < Lookbook::Preview
    # @label Playground
    # @param size select { choices: [xs, sm, md] }
    # @param icon text
    # @param title text
    # @param disabled toggle
    def playground(size: :sm, icon: "pencil", title: "Edit", disabled: false)
      render_with_template(locals: {
        size: size.to_sym,
        icon: icon,
        title: title,
        disabled: disabled
      })
    end

    # @label Sizes
    def sizes
      render_with_template
    end

    # @label Inline with text
    def inline_with_text
      render_with_template
    end
  end
end
```

- [ ] **Step 2: Create playground template**

Create `test/components/previews/kiso/action_icon_preview/playground.html.erb`:

```erb
<div class="flex gap-4 items-center text-foreground">
  <%= kui(:action_icon, icon: icon, title: title, size: size, disabled: disabled) %>
</div>
```

- [ ] **Step 3: Create sizes template**

Create `test/components/previews/kiso/action_icon_preview/sizes.html.erb`:

```erb
<div class="flex gap-4 items-end text-foreground">
  <%= kui(:action_icon, icon: "pencil", title: "Edit", size: :xs) %>
  <%= kui(:action_icon, icon: "pencil", title: "Edit", size: :sm) %>
  <%= kui(:action_icon, icon: "pencil", title: "Edit", size: :md) %>
</div>
```

- [ ] **Step 4: Create inline with text template**

Create `test/components/previews/kiso/action_icon_preview/inline_with_text.html.erb`:

```erb
<div class="space-y-4 text-foreground">
  <p class="text-xs">
    Dense table text
    <%= kui(:action_icon, icon: "pencil", title: "Edit", size: :xs) %>
    <%= kui(:action_icon, icon: "copy", title: "Copy", size: :xs) %>
    <%= kui(:action_icon, icon: "trash", title: "Delete", size: :xs) %>
  </p>
  <p class="text-sm">
    Standard body text
    <%= kui(:action_icon, icon: "pencil", title: "Edit", size: :sm) %>
    <%= kui(:action_icon, icon: "copy", title: "Copy", size: :sm) %>
    <%= kui(:action_icon, icon: "trash", title: "Delete", size: :sm) %>
  </p>
  <p class="text-base">
    Larger heading text
    <%= kui(:action_icon, icon: "pencil", title: "Edit", size: :md) %>
    <%= kui(:action_icon, icon: "copy", title: "Copy", size: :md) %>
    <%= kui(:action_icon, icon: "trash", title: "Delete", size: :md) %>
  </p>
</div>
```

- [ ] **Step 5: Verify in Lookbook**

Run: `bin/dev` and visit `http://localhost:4001`. Navigate to
ActionIcon in the sidebar. Verify:
- Playground renders with interactive controls
- Sizes shows all three sizes side by side
- Inline with text shows icons flowing naturally with text at each size
- Dark mode toggle works (icons and hover states adapt)

- [ ] **Step 6: Commit**

```bash
git add test/components/previews/kiso/action_icon_preview.rb
git add test/components/previews/kiso/action_icon_preview/
git commit -m "feat(action_icon): add Lookbook preview with playground and size demos"
```

---

### Task 6: Docs page

**Files:**
- Create: `docs/src/components/action_icon.md`
- Modify: `docs/src/_data/navigation.yml`

- [ ] **Step 1: Create docs page**

Create `docs/src/components/action_icon.md`:

```markdown
---
title: ActionIcon
layout: docs
description: A small, inline icon-only action trigger for table cells, card headers, and text rows.
category: Element
source: lib/kiso/themes/action_icon.rb
---

## Quick Start

<%%= render "component_preview", comp: "action_icon", scenario: "playground" %>

```erb
<%%= kui(:action_icon, icon: "pencil", title: "Edit") %>
```

## Locals

| Local | Type | Default |
|-------|------|---------|
| `icon:` | `String` | (required) |
| `size:` | `:xs` \| `:sm` \| `:md` | `:sm` |
| `title:` | `String` | `nil` |
| `href:` | `String` | `nil` |
| `method:` | `Symbol` | `nil` |
| `disabled:` | `Boolean` | `false` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Sizes

<%%= render "component_preview", comp: "action_icon", scenario: "sizes" %>

Three sizes optimized for inline use — no fixed heights, padding-only
sizing.

```erb
<%%= kui(:action_icon, icon: "pencil", title: "Edit", size: :xs) %>
<%%= kui(:action_icon, icon: "pencil", title: "Edit", size: :sm) %>
<%%= kui(:action_icon, icon: "pencil", title: "Edit", size: :md) %>
```

## Inline with text

<%%= render "component_preview", comp: "action_icon", scenario: "inline_with_text" %>

ActionIcon flows inline without overflowing the surrounding line height.
Choose a size that matches the text context.

## Links

Renders as `<a>` with `href:`, or as a `button_to` form when combined
with `method:`.

```erb
<%%= kui(:action_icon, icon: "external-link", title: "Open",
    href: "/page", target: "_blank") %>

<%%= kui(:action_icon, icon: "trash", title: "Delete",
    href: "/items/1", method: :delete) %>
```

## Destructive actions

Use `css_classes:` for one-off color overrides:

```erb
<%%= kui(:action_icon, icon: "trash", title: "Delete",
    css_classes: "text-error hover:text-error") %>
```

## Theme

```ruby
Kiso::Themes::ActionIcon = ClassVariants.build(
  base: "inline-flex items-center justify-center
         text-muted-foreground hover:text-foreground
         hover:bg-accent rounded-md
         cursor-pointer transition-colors duration-150 ...",
  variants: {
    size: {
      xs: "p-0.5 [&_svg:not([class*='size-'])]:size-3",
      sm: "p-1 [&_svg:not([class*='size-'])]:size-3.5",
      md: "p-1.5 [&_svg:not([class*='size-'])]:size-4"
    }
  },
  defaults: { size: :sm }
)
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| `data-slot` | `"action-icon"` |
| `aria-label` | Set from `title:` prop (falls back to `t("kiso.action_icon.action")`) |
| `type` | `"button"` (when rendering as `<button>`) |

Always provide a descriptive `title:` — it sets both the visual tooltip
and the accessible label for screen readers.
```

- [ ] **Step 2: Add navigation entry**

In `docs/src/_data/navigation.yml`, add in the Components section in
alphabetical order (before Alert — `ActionIcon` sorts before `Alert`):

```yaml
      - title: ActionIcon
        href: /components/action_icon
```

- [ ] **Step 3: Verify docs page renders**

Run: `bin/dev` and visit `http://localhost:4000/components/action_icon`.
Verify the page renders with previews and code examples.

- [ ] **Step 4: Commit**

```bash
git add docs/src/components/action_icon.md docs/src/_data/navigation.yml
git commit -m "docs(action_icon): add docs page and navigation entry"
```

---

### Task 7: Skills reference and E2E dark mode

**Files:**
- Modify: `skills/kiso/references/components.md`
- Modify: `test/e2e/fixtures/components.js`

- [ ] **Step 1: Add to components reference**

In `skills/kiso/references/components.md`, add to the **Element** section
table (alphabetical order, before `alert` — `action_icon` sorts first):

```markdown
| `action_icon` | `icon` (required), `size` (xs/sm/md), `title`, `href`, `method`, `disabled`. Inline icon-only action trigger — no fixed height, flows with text. Polymorphic tag like Button. | [action_icon.md](components/action_icon.md) |
```

- [ ] **Step 2: Add E2E dark mode entry**

In `test/e2e/fixtures/components.js`, add to the `COMPONENTS` array in
alphabetical order (before the `alert` entry — `action-icon` sorts first):

```javascript
  { name: "action-icon", url: "/preview/kiso/action_icon/playground" },
```

- [ ] **Step 3: Run E2E dark mode test**

Run: `npm run test -- --grep "action-icon"`

Expected: The test captures light and dark screenshots and runs axe
accessibility checks. Should pass with no contrast violations.

- [ ] **Step 4: Commit**

```bash
git add skills/kiso/references/components.md test/e2e/fixtures/components.js
git commit -m "feat(action_icon): add skills reference and E2E dark mode entry"
```

---

### Task 8: Final verification

- [ ] **Step 1: Run Ruby linter**

Run: `bundle exec standardrb --fix`

Expected: No offenses (or auto-fixed).

- [ ] **Step 2: Run Ruby tests**

Run: `bundle exec rake test`

Expected: All tests pass.

- [ ] **Step 3: Visual verification in Lookbook**

Open `http://localhost:4001` and verify:
- All three sizes render correctly
- Hover state shows `bg-accent` background and `text-foreground` color
- Focus ring appears on keyboard navigation (`outline-inverted`)
- Disabled state shows reduced opacity
- Dark mode: colors switch correctly via semantic tokens
- Inline with text: icons sit naturally within text lines without overflow

- [ ] **Step 4: Commit any lint fixes**

If StandardRB made changes:

```bash
git add -A
git commit -m "style: standardrb fixes for action_icon"
```
