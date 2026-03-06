# Implementation Plan: Per-Slot `ui:` Prop

**Issue:** [#168](https://github.com/steveclarke/kiso/issues/168)
**ADR:** `project/decisions/004-per-slot-ui-prop.md`

## Overview

Add Nuxt UI-style per-slot class overrides to Kiso. A `ui:` prop on `kui()`
accepts a hash of slot-name to class-string pairs. Overrides flow to sub-parts
via a request-scoped context stack (ERB's equivalent of Vue provide/inject).

## Phase 1: Core Infrastructure

### 1.1 — UI Context Stack (new file)

**File:** `app/helpers/kiso/ui_context_helper.rb`

A helper module mixed into views that manages a per-component context stack.
Sub-parts read their parent's `ui:` hash to pick up slot overrides.

```ruby
module Kiso
  module UiContextHelper
    # Push a ui hash onto the context stack for a component.
    def kiso_push_ui_context(component, ui)
      kiso_ui_stack[component] ||= []
      kiso_ui_stack[component].push(ui || {})
    end

    # Pop the most recent ui hash for a component.
    def kiso_pop_ui_context(component)
      kiso_ui_stack[component]&.pop
    end

    # Read the current ui hash for a component.
    # Returns the top of the stack, or empty hash.
    def kiso_current_ui(component)
      kiso_ui_stack.dig(component, -1) || {}
    end

    private

    # Per-request stack storage. View helpers are instantiated per-request
    # in Rails, so instance variables are request-scoped and thread-safe.
    def kiso_ui_stack
      @kiso_ui_stack ||= {}
    end
  end
end
```

**Why instance variables are safe:** Rails creates a fresh view context per
request. Each request gets its own `@kiso_ui_stack`. No thread-safety concern.

**Include in engine:**

```ruby
# lib/kiso/engine.rb — inside the initializer block
ActiveSupport.on_load(:action_view) do
  include Kiso::UiContextHelper
end
```

### 1.2 — Update `kui()` Helper

**File:** `app/helpers/kiso/component_helper.rb`

```ruby
def kui(component, part = nil, collection: nil, ui: nil, **kwargs, &block)
  path = if part
    "kiso/components/#{component}/#{part}"
  else
    "kiso/components/#{component}"
  end

  block ||= proc {}

  if part
    # Sub-part: merge slot override from parent's ui context
    parent_ui = kiso_current_ui(component)
    if (slot_classes = parent_ui[part].presence)
      existing = kwargs[:css_classes] || ""
      kwargs[:css_classes] = existing.blank? ? slot_classes : "#{existing} #{slot_classes}"
    end

    if collection
      render partial: path, collection: collection, locals: kwargs, &block
    else
      render path, **kwargs, &block
    end
  else
    # Parent component: merge global ui config with instance ui
    merged_ui = merge_ui_layers(component, ui)

    # Push context for sub-parts to read
    kiso_push_ui_context(component, merged_ui)
    begin
      # Pass ui: to the partial so self-rendering components can use it
      result = if collection
        render partial: path, collection: collection, locals: kwargs.merge(ui: merged_ui), &block
      else
        render path, **kwargs.merge(ui: merged_ui), &block
      end
    ensure
      kiso_pop_ui_context(component)
    end

    result
  end
end

private

# Merge global config ui overrides with instance ui overrides.
# Global config is Layer 2, instance ui: is Layer 3.
def merge_ui_layers(component, instance_ui)
  global_ui = Kiso.config.theme.dig(component, :ui) || {}
  return instance_ui || {} if global_ui.empty?
  return global_ui if instance_ui.nil? || instance_ui.empty?

  # Instance overrides win. Both are flat hashes of { slot: "classes" }.
  # For slots present in both, concatenate and let tailwind_merge resolve.
  global_ui.merge(instance_ui) do |_slot, global_classes, instance_classes|
    "#{global_classes} #{instance_classes}"
  end
end
```

**Key behaviors:**

- `ui: nil` default — not `{}` — so we can distinguish "not passed" from
  "passed empty". Existing calls that don't pass `ui:` are unchanged.
- Parent components push the merged ui context before rendering.
- Sub-part calls (`kui(:card, :header)`) automatically read the context and
  merge slot classes into `css_classes:`. **No partial changes needed for
  composed sub-parts** — the override is injected before the partial runs.
- Self-rendering components receive `ui:` as a local and apply overrides
  to the elements they render internally.
- `ensure` block guarantees context cleanup even if rendering raises.

### 1.3 — Update Global Config to Accept `ui:` Key

**File:** `lib/kiso/theme_overrides.rb`

Update `apply!` to extract `ui:` from override hashes before passing to
`ClassVariants::Instance#merge` (which doesn't understand `ui:`):

```ruby
def apply!
  return if @applied

  overrides = Kiso.config.theme
  return if overrides.empty?

  validate_keys!(overrides.keys)

  overrides.each do |key, options|
    # Extract ui: before passing to ClassVariants#merge
    cv_options = options.except(:ui)
    resolve_constant(key).merge(**cv_options) unless cv_options.empty?
  end

  @applied = true
end
```

The `ui:` values stay in `Kiso.config.theme[component][:ui]` and are read
at render time by `merge_ui_layers` in the helper.

### 1.4 — Update Strict Locals on Self-Rendering Partials

Self-rendering components need `ui: {}` in their strict locals declaration
so they can apply overrides to internally rendered sub-parts.

**Each partial below gets `ui: {}` added to its locals line, plus override
logic for its inner elements:**

Priority (self-rendering — inner parts are unreachable without `ui:`):

| Partial | Inner parts to override |
|---------|------------------------|
| `_alert.html.erb` | wrapper, close, (icon handled via class) |
| `_alert_dialog.html.erb` | content |
| `_avatar.html.erb` | fallback, image |
| `_dialog.html.erb` | content |
| `_select_native.html.erb` | wrapper, icon |
| `_slider.html.erb` | track, range, thumb |
| `_switch.html.erb` | track, thumb |
| `command/_group.html.erb` | heading |
| `command/_input.html.erb` | wrapper |
| `combobox/_item.html.erb` | indicator |
| `nav/_item.html.erb` | badge |
| `nav/_section.html.erb` | title, content |
| `select/_item.html.erb` | indicator |

**Example — Alert partial update:**

```erb
<%# locals: (icon: nil, color: :primary, variant: :soft, close: false, ui: {}, css_classes: "", **component_options) %>
<%= content_tag :div,
    role: :alert,
    class: Kiso::Themes::Alert.render(color: color, variant: variant, class: css_classes),
    data: kiso_prepare_options(component_options, slot: "alert",
      **({ controller: "kiso--alert" } if close)),
    **component_options do %>
  <% if icon %>
    <%= kiso_icon(icon, class: "size-4 translate-y-0.5 text-current #{ui[:icon]}") %>
  <% end %>
  <%= content_tag :div,
      class: Kiso::Themes::AlertWrapper.render(class: ui[:wrapper]),
      data: { slot: "alert-wrapper" } do %>
    <%= yield %>
  <% end %>
  <% if close %>
    <%= tag.button type: "button",
        class: Kiso::Themes::AlertClose.render(class: ui[:close]),
        data: { slot: "alert-close", action: "click->kiso--alert#close" },
        aria: { label: "Dismiss" } do %>
      <%= kiso_component_icon(:x, class: "size-4") %>
    <% end %>
  <% end %>
<% end %>
```

**Pattern for each inner element:**

```ruby
# Before (no ui: support):
class: Kiso::Themes::SliderTrack.render

# After (with ui: support):
class: Kiso::Themes::SliderTrack.render(class: ui[:track])
```

The `class:` kwarg on `.render()` already feeds through tailwind_merge, so
the slot override is automatically deduplicated against the theme default.

## Phase 2: Tests

### 2.1 — Unit Tests for UI Context Helper

**File:** `test/helpers/ui_context_helper_test.rb`

- Push/pop stack isolation
- Nested component contexts (card inside card)
- Empty/nil ui values
- Stack cleanup on pop

### 2.2 — Unit Tests for `kui()` with `ui:`

**File:** Update `test/helpers/component_helper_test.rb`

- `ui:` prop merges into sub-part `css_classes:`
- `ui:` does not affect root element (that's `css_classes:` territory)
- `ui:` + explicit `css_classes:` on sub-part — both merge
- Global config `ui:` + instance `ui:` layering
- Self-rendering component: `ui:` overrides inner elements
- Backward compatibility: no `ui:` = identical behavior to today

### 2.3 — Unit Tests for ThemeOverrides with `ui:` Key

**File:** Update `test/lib/theme_overrides_test.rb`

- `ui:` key is not passed to `ClassVariants#merge` (would error)
- `ui:` values preserved in config for runtime access
- Mixed `base:` + `ui:` in same override hash

### 2.4 — Integration Tests

**File:** `test/components/ui_prop_test.rb`

Render real components with `ui:` and assert the output HTML:

- `kui(:card, ui: { header: "p-8" })` + `kui(:card, :header)` → header div
  has `p-8` merged into its classes
- `kui(:alert, ui: { close: "opacity-50" })` → close button has `opacity-50`
- `kui(:slider, ui: { thumb: "bg-red-500" })` → thumb element has `bg-red-500`
- Tailwind-merge deduplication: `ui: { header: "p-8" }` overrides theme's
  default `p-4` (not both present)

## Phase 3: Documentation Updates

### 3.1 — Update `project/component-strategy.md`

In the **Override System** section:

- Change "three layers" to "four layers"
- Add Layer 3: Instance `ui:` (per-slot overrides)
- Renumber Instance `css_classes:` to Layer 4
- Add code examples showing the `ui:` prop
- Add a subsection explaining the context stack mechanism
- Update the "Why Not More Layers?" section — remove the disclaimer about
  not having provide/inject, since we now have the context stack

### 3.2 — Update `project/component-creation.md`

In the **ERB partial** template section:

- Add `ui: {}` to the self-rendering partial template
- Add the pattern for applying `ui[:slot_name]` to inner elements
- Add a note that composed sub-part partials do NOT need `ui:` in their
  locals — the context stack handles it

In the **Quality checklist**:

- Add: "Self-rendering partials accept `ui: {}` and apply slot overrides"

In the **Code conventions quick reference** table:

- Add row: `ui: prop` | Per-slot class overrides. Self-rendering partials
  declare `ui: {}`. Composed sub-parts inherit via context stack.

### 3.3 — Update `project/component-review.md`

Add review checkpoint:

- Self-rendering components accept `ui: {}` and apply overrides to all
  inner themed elements
- Inner `.render()` calls pass `class: ui[:slot_name]`

### 3.4 — Update `skills/kiso/references/theming.md`

Add a **Per-slot overrides** section covering:

- Instance `ui:` prop with examples
- Global config `ui:` key with examples
- Four-layer override order
- Which components support `ui:` (all compound components)
- Slot name reference (matches sub-part names)

### 3.5 — Update `CLAUDE.md`

In **Key Conventions** section, add:

```markdown
- **`ui:` prop for per-slot overrides** — compound components accept
  `ui: { slot_name: "classes" }` to override inner sub-part styles.
  Self-rendering partials declare `ui: {}` in strict locals and apply
  overrides via `Kiso::Themes::SubPart.render(class: ui[:slot_name])`.
  Composed sub-parts inherit overrides automatically via a context stack
  in the `kui()` helper — no partial changes needed. Global config
  supports `ui:` key: `config.theme[:card] = { ui: { header: "p-8" } }`.
```

In the **Finalize Checklist** per-component section, add:

```markdown
- [ ] Self-rendering partials accept `ui: {}` and apply to inner elements
```

### 3.6 — Update `skills/kiso/references/components/*.md`

For each component with sub-parts, add a `ui:` section showing available
slot names. Priority: Alert, Dialog, Card, Slider, Switch, Avatar.

### 3.7 — Update `.claude/skills/contributing/SKILL.md`

Add `ui:` prop to the "Where to find what" context — point to the ADR and
the updated component-strategy.md section.

### 3.8 — Update docs site pages

Update `docs/src/components/` pages for affected components:

- Add "Per-slot overrides" usage example to each component doc
- Update the theming/customization guide page if one exists

## Phase 4: Implement Across All Self-Rendering Components

Apply the `ui: {}` local + inner override pattern to each self-rendering
partial. Each is a small, independent change:

1. `_alert.html.erb` — `:wrapper`, `:close`, `:icon`
2. `_alert_dialog.html.erb` — `:content`
3. `_avatar.html.erb` — `:fallback`, `:image`
4. `_dialog.html.erb` — `:content`
5. `_select_native.html.erb` — `:wrapper`, `:icon`
6. `_slider.html.erb` — `:track`, `:range`, `:thumb`
7. `_switch.html.erb` — `:track`, `:thumb`
8. `command/_group.html.erb` — `:heading`
9. `command/_input.html.erb` — `:wrapper`
10. `combobox/_item.html.erb` — `:indicator`
11. `nav/_item.html.erb` — `:badge`
12. `nav/_section.html.erb` — `:title`, `:content`
13. `select/_item.html.erb` — `:indicator`

Pattern for each:

```diff
-<%# locals: (..., css_classes: "", **component_options) %>
+<%# locals: (..., ui: {}, css_classes: "", **component_options) %>

-    class: Kiso::Themes::SubPart.render,
+    class: Kiso::Themes::SubPart.render(class: ui[:slot_name]),
```

## Implementation Order

```
1. Core infrastructure (Phase 1)
   1.1  UiContextHelper module
   1.2  kui() helper changes
   1.3  ThemeOverrides ui: key support
   1.4  Alert partial (first self-rendering component — proof of concept)

2. Tests (Phase 2)
   2.1  UiContextHelper unit tests
   2.2  kui() helper tests
   2.3  ThemeOverrides tests
   2.4  Integration tests (Alert as first subject)

3. Remaining self-rendering partials (Phase 4)
   — All 13 partials listed above

4. Documentation (Phase 3)
   3.1  component-strategy.md
   3.2  component-creation.md
   3.3  component-review.md
   3.4  theming.md skill reference
   3.5  CLAUDE.md
   3.6  Component skill references
   3.7  Contributing skill
   3.8  Docs site pages
```

## Files Changed (Summary)

**New files:**
- `app/helpers/kiso/ui_context_helper.rb`
- `project/decisions/004-per-slot-ui-prop.md`
- `test/helpers/ui_context_helper_test.rb`
- `test/components/ui_prop_test.rb`

**Modified — infrastructure:**
- `app/helpers/kiso/component_helper.rb` — `kui()` signature + context logic
- `lib/kiso/engine.rb` — include UiContextHelper
- `lib/kiso/theme_overrides.rb` — extract `ui:` before ClassVariants merge

**Modified — partials (13 self-rendering):**
- `app/views/kiso/components/_alert.html.erb`
- `app/views/kiso/components/_alert_dialog.html.erb`
- `app/views/kiso/components/_avatar.html.erb`
- `app/views/kiso/components/_dialog.html.erb`
- `app/views/kiso/components/_select_native.html.erb`
- `app/views/kiso/components/_slider.html.erb`
- `app/views/kiso/components/_switch.html.erb`
- `app/views/kiso/components/command/_group.html.erb`
- `app/views/kiso/components/command/_input.html.erb`
- `app/views/kiso/components/combobox/_item.html.erb`
- `app/views/kiso/components/nav/_item.html.erb`
- `app/views/kiso/components/nav/_section.html.erb`
- `app/views/kiso/components/select/_item.html.erb`

**Modified — documentation:**
- `CLAUDE.md`
- `project/component-strategy.md`
- `project/component-creation.md`
- `project/component-review.md`
- `skills/kiso/references/theming.md`
- `skills/kiso/references/components/*.md` (affected components)
- `.claude/skills/contributing/SKILL.md`
- `docs/src/components/*.md` (affected component pages)

**Modified — tests:**
- `test/helpers/component_helper_test.rb`
- `test/lib/theme_overrides_test.rb`

## Backward Compatibility

- `ui: nil` default — existing calls unchanged
- `css_classes:` unchanged — still targets root element
- `config.theme[:card_header] = { base: "p-8" }` still works
- Composed sub-part partials need zero changes — context stack injects
  overrides before the partial runs
- Only self-rendering partials get a new `ui: {}` default local
