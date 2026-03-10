# Install Generator Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `rails generate kiso:install` that scaffolds a Kiso initializer (always) and a design system document (opt-in) into the host app.

**Architecture:** Standard Rails generator with no required arguments. Uses `yes?()` and `ask()` for interactive prompts. Two ERB templates — `initializer.rb.tt` and `design_system.md.tt`. Follows the existing `kiso:component` generator pattern.

**Tech Stack:** Rails generators, ERB templates (.tt files), Minitest

**Spec:** `docs/superpowers/specs/2026-03-10-install-generator-design.md`

---

## File Structure

```
lib/generators/kiso/install/
  install_generator.rb          # Generator class (no required args, interactive prompts)
  templates/
    initializer.rb.tt           # Kiso.configure block with commented-out examples
    design_system.md.tt         # Design system doc personalized with app_name
  USAGE                         # Help text shown by `rails generate kiso:install --help`

test/generators/
  install_generator_test.rb     # Generator tests
```

---

## Chunk 1: Generator skeleton + initializer template

### Task 1: Write the generator test file

**Files:**
- Create: `test/generators/install_generator_test.rb`

- [ ] **Step 1: Write failing tests for the initializer (always-created path)**

```ruby
# frozen_string_literal: true

require "test_helper"
require "generators/kiso/install/install_generator"
require "rails/generators/test_case"

class Kiso::Generators::InstallGeneratorTest < Rails::Generators::TestCase
  tests Kiso::Generators::InstallGenerator
  destination File.expand_path("../tmp/generator_test", __dir__)

  setup do
    prepare_destination
  end

  test "creates initializer with Kiso.configure block" do
    run_generator

    assert_file "config/initializers/kiso.rb" do |content|
      assert_match(/Kiso\.configure do \|config\|/, content)
    end
  end

  test "initializer includes preset examples" do
    run_generator

    assert_file "config/initializers/kiso.rb" do |content|
      assert_match(/apply_preset/, content)
      assert_match(/:rounded/, content)
      assert_match(/:sharp/, content)
    end
  end

  test "initializer includes theme override examples" do
    run_generator

    assert_file "config/initializers/kiso.rb" do |content|
      assert_match(/config\.theme\[:button\]/, content)
    end
  end

  test "initializer includes icon customization examples" do
    run_generator

    assert_file "config/initializers/kiso.rb" do |content|
      assert_match(/config\.icons/, content)
    end
  end

  test "initializer includes app_theme example" do
    run_generator

    assert_file "config/initializers/kiso.rb" do |content|
      assert_match(/app_theme/, content)
    end
  end

  test "skips initializer when it already exists" do
    run_generator
    # Modify the file so we can detect if it gets overwritten
    File.write(File.join(destination_root, "config/initializers/kiso.rb"), "# existing")

    run_generator

    assert_file "config/initializers/kiso.rb" do |content|
      assert_equal "# existing", content
    end
  end
end
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bundle exec ruby -Itest test/generators/install_generator_test.rb`
Expected: FAIL — cannot load `generators/kiso/install/install_generator`

- [ ] **Step 3: Create the generator class and initializer template**

Create `lib/generators/kiso/install/install_generator.rb`:

```ruby
# frozen_string_literal: true

module Kiso
  module Generators
    # Sets up Kiso in a host application.
    #
    # Creates a well-commented initializer and optionally generates a
    # design system document. No required arguments — interactive prompts
    # handle optional inputs.
    #
    # @example
    #   bin/rails generate kiso:install
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path("templates", __dir__)

      def create_initializer
        initializer_path = "config/initializers/kiso.rb"
        if File.exist?(File.join(destination_root, initializer_path))
          say_status :skip, initializer_path, :yellow
        else
          template "initializer.rb.tt", initializer_path
        end
      end

      def create_design_system
        return unless yes?(<<~PROMPT)

          Would you like to generate a Design System document?
          This creates DESIGN_SYSTEM.md with your app's spacing, typography, color,
          and component conventions — useful for team alignment and AI coding agents.

          Generate DESIGN_SYSTEM.md? (y/n)
        PROMPT

        @app_name = ask(<<~PROMPT, default: "My App")
          What's your app called? This is just a friendly name for the document
          header (e.g. "Outport", "My App").
        PROMPT

        template "design_system.md.tt", "DESIGN_SYSTEM.md"
      end

      def print_next_steps
        say ""
        say "Kiso installed!", :green
        say ""
        say "  Initializer: config/initializers/kiso.rb"
        say "  Design System: DESIGN_SYSTEM.md" if File.exist?(File.join(destination_root, "DESIGN_SYSTEM.md"))
        say ""
        say "Next steps:"
        say "  1. Add Kiso's CSS to your Tailwind stylesheet:"
        say "       @import \"../builds/tailwind/kiso\";"
        say "  2. Add the theme script to your layout <head>:"
        say "       <%= kiso_theme_script %>"
        say "  3. Customize your brand colors in your Tailwind @theme block."
        say "     See: https://kisoui.com/guide/css-variables"
        say ""
      end

      private

      attr_reader :app_name
    end
  end
end
```

Create `lib/generators/kiso/install/templates/initializer.rb.tt`:

```erb
# frozen_string_literal: true

Kiso.configure do |config|
  # --- Style Preset ---
  # Apply a pre-built style preset. Presets adjust border-radius, padding,
  # and other visual properties across all components.
  #
  # Available presets:
  #   :rounded — softer corners (buttons → rounded-full, cards → rounded-2xl)
  #   :sharp   — minimal rounding (buttons → rounded-sm, cards → rounded-lg)
  #
  # config.apply_preset(:rounded)

  # --- Global Theme Overrides ---
  # Override component styles globally. These apply to every instance of the
  # component — use css_classes: on individual calls for one-off overrides.
  #
  # Accepts: base:, variants:, compound_variants:, defaults:, ui:
  #
  # config.theme[:button] = { base: "rounded-full" }
  # config.theme[:card]   = { base: "rounded-xl shadow-lg" }
  # config.theme[:badge]  = { defaults: { variant: :outline } }
  #
  # Override inner sub-part elements with ui:
  # config.theme[:card] = { ui: { header: "p-8", footer: "px-8" } }

  # --- Icon Customization ---
  # Swap default component icons. Keys are semantic names, values are icon
  # identifiers passed to kiso_icon (e.g. "heroicons:chevron-right").
  #
  # config.icons[:chevron_right] = "heroicons:chevron-right"
  # config.icons[:x] = "heroicons:x-mark"
  # config.icons[:search] = "heroicons:magnifying-glass"

  # --- App Theme ---
  # Theme directory for appui() components. Themes live in app/themes/<name>/.
  # Default: :default (app/themes/default/)
  #
  # config.app_theme = :default
end
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bundle exec ruby -Itest test/generators/install_generator_test.rb`
Expected: All 6 tests PASS

- [ ] **Step 5: Commit**

```bash
git add lib/generators/kiso/install/ test/generators/install_generator_test.rb
git commit -m "feat: Add kiso:install generator with initializer template (#191)"
```

---

### Task 2: Design system template + tests

**Files:**
- Create: `lib/generators/kiso/install/templates/design_system.md.tt`
- Modify: `test/generators/install_generator_test.rb`

- [ ] **Step 1: Add failing tests for the design system doc**

Append to `test/generators/install_generator_test.rb`:

```ruby
  test "creates design system doc when user opts in" do
    # Simulate answering "yes" to the prompt and providing an app name
    run_generator [], {}, { "Would you like" => "y", "What's your app" => "TestApp" }

    assert_file "DESIGN_SYSTEM.md" do |content|
      assert_match(/TestApp/, content)
      assert_match(/Color Palette/, content)
      assert_match(/Typography/, content)
      assert_match(/Spacing/, content)
    end
  end

  test "does not create design system doc when user opts out" do
    run_generator [], {}, { "Would you like" => "n" }

    assert_no_file "DESIGN_SYSTEM.md"
  end

  test "design system doc uses default app name when none provided" do
    run_generator [], {}, { "Would you like" => "y", "What's your app" => "" }

    assert_file "DESIGN_SYSTEM.md" do |content|
      assert_match(/My App/, content)
    end
  end
```

**Important note on testing interactive prompts:** Rails generators use
`$stdin` for `yes?()` and `ask()`. The third argument to `run_generator`
is not a standard API for mocking prompts. The test approach may need
adjustment — check how the existing Rails generator test case handles
interactive input. Options:

1. Stub `$stdin` with a `StringIO`
2. Override `yes?` and `ask` on the generator instance
3. Extract the design system creation into a method gated by a class option
   `--skip-design-system` (allows non-interactive testing)

**Recommended approach:** Add a `--skip-design-system` class option that
defaults to `nil` (meaning: ask interactively). When `true`, skip the doc.
When `false`, generate it without asking. This makes tests deterministic
and also supports CI/scripted usage:

```ruby
class_option :skip_design_system,
  type: :boolean,
  default: nil,
  desc: "Skip generating DESIGN_SYSTEM.md (default: ask interactively)"

class_option :app_name,
  type: :string,
  default: nil,
  desc: "App name for the design system doc header (default: ask interactively)"
```

Update `create_design_system` to check `options[:skip_design_system]` first:
- `nil` → ask interactively (default)
- `true` → skip without asking
- `false` → generate without asking

Update `app_name` to check `options[:app_name]` first, fall back to asking.

Then tests become:

```ruby
  test "creates design system doc with app name" do
    run_generator ["--no-skip-design-system", "--app-name=TestApp"]

    assert_file "DESIGN_SYSTEM.md" do |content|
      assert_match(/TestApp/, content)
      assert_match(/Color Palette/, content)
      assert_match(/Typography/, content)
      assert_match(/Spacing/, content)
      assert_match(/Component Conventions/, content)
    end
  end

  test "skips design system doc with --skip-design-system" do
    run_generator ["--skip-design-system"]

    assert_no_file "DESIGN_SYSTEM.md"
  end

  test "design system doc uses default app name" do
    run_generator ["--no-skip-design-system"]

    assert_file "DESIGN_SYSTEM.md" do |content|
      assert_match(/My App/, content)
    end
  end

  test "design system doc includes anti-patterns section" do
    run_generator ["--no-skip-design-system", "--app-name=TestApp"]

    assert_file "DESIGN_SYSTEM.md" do |content|
      assert_match(/Anti-patterns/, content)
    end
  end
```

- [ ] **Step 2: Run tests to verify new tests fail**

Run: `bundle exec ruby -Itest test/generators/install_generator_test.rb`
Expected: New tests FAIL

- [ ] **Step 3: Update generator with class options and create the design system template**

Update `install_generator.rb` to add the class options and update `create_design_system`:

```ruby
      class_option :skip_design_system,
        type: :boolean,
        default: nil,
        desc: "Skip generating DESIGN_SYSTEM.md (default: ask interactively)"

      class_option :app_name,
        type: :string,
        default: nil,
        desc: "App name for the design system doc header (default: ask interactively)"
```

Update `create_design_system` method:

```ruby
      def create_design_system
        should_generate = case options[:skip_design_system]
        when true then false
        when false then true
        else
          yes?(<<~PROMPT)

            Would you like to generate a Design System document?
            This creates DESIGN_SYSTEM.md with your app's spacing, typography, color,
            and component conventions — useful for team alignment and AI coding agents.

            Generate DESIGN_SYSTEM.md? (y/n)
          PROMPT
        end

        return unless should_generate

        @app_name = options[:app_name].presence || ask(<<~PROMPT, default: "My App")
          What's your app called? This is just a friendly name for the document
          header (e.g. "Outport", "My App").
        PROMPT

        template "design_system.md.tt", "DESIGN_SYSTEM.md"
      end
```

Create `lib/generators/kiso/install/templates/design_system.md.tt`:

The template should contain these sections with content drawn from
`project/design-system.md` (the Spatial System section). Use `<%= @app_name %>`
for personalization. Key sections:

1. **Header** — "# <%= @app_name %> Design System" with intro paragraph
2. **Color Palette** — Kiso's semantic color tokens table (primary through
   error, plus surface tokens), with a callout to customize via `@theme`
   and link to CSS Variables Reference
3. **Typography Hierarchy** — 6 roles table:
   - Page title: `text-lg font-semibold`
   - Section title: `text-base font-semibold`
   - Card title: `text-sm font-semibold`
   - Body: `text-sm` (default weight)
   - Caption: `text-xs` (default weight)
   - Label: `text-sm font-medium`
4. **Spacing Scale** — heights, padding, gaps tables from design-system.md
5. **Component Conventions** — which `kui()` components to use for common UI
   patterns (page headers, cards, forms, empty states, dialogs, navigation)
6. **Anti-patterns** — what NOT to do (raw HTML, arbitrary spacing values,
   hardcoded colors, `dark:` prefixes, skipping semantic tokens)

Keep content concise — tables and code examples, not prose. Reference
kisoui.com docs for deep dives. The full template content should be written
by reading `project/design-system.md` and `docs/src/guide/css-variables.md`
as source material.

- [ ] **Step 4: Run tests to verify they pass**

Run: `bundle exec ruby -Itest test/generators/install_generator_test.rb`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add lib/generators/kiso/install/ test/generators/install_generator_test.rb
git commit -m "feat: Add design system template to kiso:install generator (#191)"
```

---

### Task 3: USAGE file + linting + final verification

**Files:**
- Create: `lib/generators/kiso/install/USAGE`

- [ ] **Step 1: Create the USAGE file**

```
Description:
  Sets up Kiso in your application. Creates a well-commented initializer
  with preset, theme, and icon configuration examples.

  Optionally generates a DESIGN_SYSTEM.md with your app's spacing,
  typography, color, and component conventions.

Examples:
  bin/rails generate kiso:install

    Creates:
      config/initializers/kiso.rb

    Optionally creates (interactive prompt):
      DESIGN_SYSTEM.md

  bin/rails generate kiso:install --no-skip-design-system --app-name="My App"

    Creates both files without interactive prompts.

  bin/rails generate kiso:install --skip-design-system

    Creates only the initializer, skips the design system doc.
```

- [ ] **Step 2: Run full test suite**

Run: `bundle exec rake test`
Expected: All tests PASS (existing + new)

- [ ] **Step 3: Run linters**

```bash
bundle exec standardrb --fix
```

- [ ] **Step 4: Commit**

```bash
git add lib/generators/kiso/install/USAGE
git commit -m "docs: Add USAGE help text for kiso:install generator (#191)"
```

---

### Task 4: Update CLAUDE.md and docs

**Files:**
- Modify: `CLAUDE.md` (add `kiso:install` to Commands section)
- Modify: `docs/src/getting-started.md` (mention the install generator)

- [ ] **Step 1: Add install generator to CLAUDE.md commands**

In the Commands section, add:

```
bin/rails g kiso:install                     # Set up Kiso (initializer + optional design system)
```

- [ ] **Step 2: Add install generator mention to Getting Started docs**

Check `docs/src/getting-started.md` for the installation section and add a
reference to `rails generate kiso:install` as a setup step.

- [ ] **Step 3: Run linters and tests**

```bash
bundle exec standardrb --fix
bundle exec rake test
```

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md docs/src/getting-started.md
git commit -m "docs: Document kiso:install generator in CLAUDE.md and Getting Started (#191)"
```
