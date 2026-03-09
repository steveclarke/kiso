# DX Quick Wins Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement three developer experience improvements: layout centering variant (#193), `appui_tag` helper (#194), and `kiso_icon` attribute forwarding (#195).

**Architecture:** All three are additive — no breaking changes. The centering variant adds a `center:` boolean to the App theme. The `appui_tag` helper wraps `content_tag` + `kiso_prepare_options` + theme rendering. The icon fix forwards `**options` through to the SVG tag (already works, just needs documentation clarity).

**Tech Stack:** Ruby, ClassVariants, ERB partials, ActionView helpers, Minitest

---

### Task 1: Add `center:` variant to App layout component

**Files:**
- Modify: `lib/kiso/themes/layout.rb` (App theme, ~line 10)
- Modify: `app/views/kiso/components/_app.html.erb`
- Test: `test/kiso/layout_test.rb` (create)

**Step 1: Write the failing test**

Create `test/kiso/layout_test.rb`:

```ruby
# frozen_string_literal: true

require "test_helper"

class Kiso::LayoutTest < ActiveSupport::TestCase
  test "App renders base classes by default" do
    result = Kiso::Themes::App.render
    assert_includes result, "bg-background"
    assert_includes result, "text-foreground"
    refute_includes result, "min-h-screen"
  end

  test "App renders centering classes when center: true" do
    result = Kiso::Themes::App.render(center: true)
    assert_includes result, "min-h-screen"
    assert_includes result, "flex"
    assert_includes result, "items-center"
    assert_includes result, "justify-center"
  end

  test "App does not render centering classes when center: false" do
    result = Kiso::Themes::App.render(center: false)
    refute_includes result, "min-h-screen"
    refute_includes result, "items-center"
  end
end
```

**Step 2: Run test to verify it fails**

Run: `bundle exec ruby -Itest test/kiso/layout_test.rb`
Expected: FAIL — `center:` variant doesn't exist yet

**Step 3: Add center variant to App theme**

Edit `lib/kiso/themes/layout.rb`, change the App definition:

```ruby
App = ClassVariants.build(
  base: "bg-background text-foreground antialiased",
  variants: {
    center: {
      true => "min-h-screen flex items-center justify-center",
      false => ""
    }
  },
  defaults: {center: false}
)
```

**Step 4: Update the App partial to accept center:**

Edit `app/views/kiso/components/_app.html.erb`:

```erb
<%# locals: (center: false, css_classes: "", **component_options) %>
<%= content_tag :div,
    class: Kiso::Themes::App.render(center: center, class: css_classes),
    data: kiso_prepare_options(component_options, slot: "app"),
    **component_options do %>
  <%= yield %>
<% end %>
```

**Step 5: Run test to verify it passes**

Run: `bundle exec ruby -Itest test/kiso/layout_test.rb`
Expected: PASS (3 tests, 3 assertions)

**Step 6: Run full test suite**

Run: `bundle exec rake test`
Expected: All pass

**Step 7: Commit**

```bash
git add lib/kiso/themes/layout.rb app/views/kiso/components/_app.html.erb test/kiso/layout_test.rb
git commit -m "feat: Add center: variant to App layout component (#193)"
```

---

### Task 2: Create `appui_tag` helper

**Files:**
- Modify: `app/helpers/kiso/app_component_helper.rb` (add `appui_tag` method)
- Modify: `app/helpers/kiso/component_helper.rb` (add `kui_tag` method)
- Test: `test/kiso/app_component_helper_test.rb` (add tests)
- Modify: `lib/generators/kiso/component/templates/partial.html.erb.tt` (use new helper)
- Modify: `lib/generators/kiso/component/templates/sub_part_partial.html.erb.tt` (use new helper)

**Step 1: Write the failing tests**

Add to `test/kiso/app_component_helper_test.rb`:

```ruby
test "appui_tag is available as a helper" do
  assert_respond_to self, :appui_tag
end
```

Create `test/kiso/component_helper_test.rb`:

```ruby
# frozen_string_literal: true

require "test_helper"

class Kiso::ComponentHelperTest < ActionView::TestCase
  include Kiso::ComponentHelper

  test "kui_tag is available as a helper" do
    assert_respond_to self, :kui_tag
  end
end
```

**Step 2: Run tests to verify they fail**

Run: `bundle exec ruby -Itest test/kiso/app_component_helper_test.rb test/kiso/component_helper_test.rb`
Expected: FAIL — methods don't exist yet

**Step 3: Implement `kui_tag` in ComponentHelper**

Add to `app/helpers/kiso/component_helper.rb`, after the `kiso_prepare_options` method (before `private`):

```ruby
# Renders a themed HTML element with Kiso conventions.
#
# Collapses the common +content_tag+ + +kiso_prepare_options+ + theme
# rendering boilerplate into a single call. Use in component partials
# instead of manually wiring +content_tag+.
#
# @param tag [Symbol] HTML element name (e.g. +:div+, +:span+, +:button+)
# @param theme [ClassVariants::Instance] the theme module to render classes from
# @param slot [String] the +data-slot+ value (kebab-case)
# @param css_classes [String] caller's class overrides, merged via +tailwind_merge+
# @param component_options [Hash] HTML attributes forwarded to +content_tag+
#   (e.g. +id:+, +aria:+). A +data:+ key is extracted and merged with slot.
# @param variant_kwargs [Hash] variant values forwarded to +theme.render+
#   (e.g. +size: :md+, +color: :primary+)
# @yield optional block for element content
# @return [ActiveSupport::SafeBuffer] rendered HTML
#
# @example In a component partial
#   kui_tag :div, theme: Kiso::Themes::Badge, slot: "badge",
#       css_classes: css_classes, color: color, variant: variant,
#       **component_options do
#     yield
#   end
def kui_tag(tag, theme:, slot:, css_classes: "", **kwargs, &block)
  # Separate variant kwargs from HTML attributes.
  # component_options are anything ClassVariants doesn't understand.
  variant_keys = theme.variant_names
  variant_kwargs = kwargs.slice(*variant_keys)
  component_options = kwargs.except(*variant_keys)

  content_tag(tag,
    class: theme.render(**variant_kwargs, class: css_classes),
    data: kiso_prepare_options(component_options, slot: slot),
    **component_options, &block)
end
```

**Step 4: Check if ClassVariants exposes variant names**

Run: `bundle exec ruby -e "require 'class_variants'; cv = ClassVariants.build(variants: { size: { sm: 'text-sm' } }, defaults: { size: :sm }); puts cv.respond_to?(:variant_names)"`

If `variant_names` doesn't exist, we need a different approach. In that case, use explicit variant kwargs passed as a hash:

Alternative API if `variant_names` is unavailable:

```ruby
# @param variants [Hash] variant values forwarded to theme.render
def kui_tag(tag, theme:, slot:, css_classes: "", variants: {}, **component_options, &block)
  content_tag(tag,
    class: theme.render(**variants, class: css_classes),
    data: kiso_prepare_options(component_options, slot: slot),
    **component_options, &block)
end
```

Usage in partial:
```erb
<%= kui_tag :div, theme: Kiso::Themes::Badge, slot: "badge",
    variants: { color: color, variant: variant, size: size },
    css_classes: css_classes, **component_options do %>
  <%= yield %>
<% end %>
```

**Step 5: Add `appui_tag` in AppComponentHelper**

Add to `app/helpers/kiso/app_component_helper.rb`:

```ruby
# Renders a themed HTML element for host app components.
#
# Identical to {ComponentHelper#kui_tag} — provided as a naming
# convenience so host app partials use +appui_tag+ alongside +appui()+.
#
# @see ComponentHelper#kui_tag
def appui_tag(...)
  kui_tag(...)
end
```

**Step 6: Run tests to verify they pass**

Run: `bundle exec ruby -Itest test/kiso/app_component_helper_test.rb test/kiso/component_helper_test.rb`
Expected: PASS

**Step 7: Update generator partial template**

Edit `lib/generators/kiso/component/templates/partial.html.erb.tt`:

```erb
<%% # locals: (css_classes: "", **component_options) %>
<%%= appui_tag :div, theme: AppThemes::<%= has_namespace? ? "#{module_prefix}::" : "" %><%= class_name_without_namespace %>, slot: "<%= slot_name %>",
    css_classes: css_classes, **component_options do %>
  <%%= yield %>
<%% end %>
```

Edit `lib/generators/kiso/component/templates/sub_part_partial.html.erb.tt` the same way (read it first to get current content).

**Step 8: Run full test suite**

Run: `bundle exec rake test`
Expected: All pass (including generator tests)

**Step 9: Commit**

```bash
git add app/helpers/kiso/component_helper.rb app/helpers/kiso/app_component_helper.rb \
  test/kiso/app_component_helper_test.rb test/kiso/component_helper_test.rb \
  lib/generators/kiso/component/templates/partial.html.erb.tt \
  lib/generators/kiso/component/templates/sub_part_partial.html.erb.tt
git commit -m "feat: Add kui_tag/appui_tag helper to reduce partial boilerplate (#194)"
```

---

### Task 3: Verify kiso_icon already forwards attributes

**Files:**
- Review: `app/helpers/kiso/icon_helper.rb`

**Step 1: Verify kiso_icon already accepts and forwards extra attributes**

Looking at the existing code:

```ruby
def kiso_icon(name, size: nil, **options)
  css_classes = options.delete(:class) || ""
  size_class = size ? SIZE_PRESETS.fetch(size) : nil
  merged = merge_icon_classes(BASE_CLASSES, size_class, css_classes)
  kiso_icon_tag(name, class: merged, **options)
end
```

`**options` already captures and forwards everything except `size:` and `class:`. So `data:`, `aria:`, `id:`, etc. all pass through to `kiso_icon_tag`.

**Step 2: Verify with a test**

```ruby
# The method signature already accepts **options and forwards them.
# data:, aria:, id: all pass through to kiso_icon_tag.
```

This issue is actually already working — `kiso_icon("check", data: { testid: "icon" }, aria: { label: "Done" })` works today. The ApproveThis feedback may have been about a different limitation (e.g., `kiso_icon` returns an SVG string, so you can't wrap it in `content_tag` with extra attributes).

**Step 3: Close the issue with a comment explaining it already works**

Run:
```bash
gh issue comment 195 --body "kiso_icon already forwards **options to kiso_icon_tag — data:, aria:, id: all pass through. Example: kiso_icon(\"check\", data: { testid: \"icon\" }, aria: { label: \"Done\" })"
gh issue close 195 --reason "not planned" --comment "Already supported — the **options splat in kiso_icon forwards all attributes to the underlying SVG tag."
```

No code changes needed.

---

### Task 4: Lint and final verification

**Step 1: Run StandardRB**

Run: `bundle exec standardrb --fix`
Expected: Clean

**Step 2: Run full test suite one more time**

Run: `bundle exec rake test`
Expected: All pass

**Step 3: Commit any lint fixes**

Only if standardrb made changes.
