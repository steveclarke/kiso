# Plan: Extract Icon System to kiso-icons Gem

GitHub Issue: https://github.com/steveclarke/kiso/issues/20
Previous Issue: https://github.com/steveclarke/kiso/issues/4 (implementation, merged)

## Agent Prompt

Use this to kick off implementation on another machine. Copy everything below
the line into a new conversation.

---

I need you to implement the `kiso-icons` gem extraction described in
`project/plans/ICON_GEM.md`. Read that file thoroughly before starting — it
contains every architectural decision, file structure, code sample, and
implementation step.

**Context:** Kiso is a Rails engine gem providing UI components. It has a
working icon system under `lib/kiso/icons/` that resolves and renders Iconify
icons as inline SVG. We're extracting that into a standalone `kiso-icons` gem
so it can be used independently. The gem follows the importmap-rails pattern
(one gem, Rails dependency, conditional railtie, binstub CLI).

**The key architectural insight:** The gem ships `kiso_icon_tag()` — a raw SVG
helper with no CSS framework opinion. Kiso keeps `kiso_icon()` which wraps
`kiso_icon_tag()` and adds Tailwind (shrink-0, size presets, TailwindMerge).
Two distinct helper names, composition not override. Read the "Helper
Architecture" section in the plan for the full rendering stack.

**What to do:**

1. Read `project/plans/ICON_GEM.md` completely — it has the file structure,
   every code sample, gemspec, railtie, helper, CLI, and the 7 implementation
   steps in order.

2. Read the existing icon system files to understand what you're extracting:
   - `lib/kiso/icons.rb` and everything under `lib/kiso/icons/`
   - `app/helpers/kiso/icon_helper.rb`
   - `lib/kiso/cli/icons.rb`
   - `data/lucide.json.gz`

3. Read `project/ICON_SIZING.md` for the two-layer architecture (renderer vs
   helper) and how parent components control icon sizing via CSS selectors.

4. Read the actual importmap-rails gem on disk for structural reference:
   `~/.local/share/mise/installs/ruby/3.4.7/lib/ruby/gems/3.4.0/gems/importmap-rails-2.2.2/`
   Key files: `lib/importmap-rails.rb` (entry point), `lib/importmap/engine.rb`
   (railtie pattern), `lib/importmap/commands.rb` (CLI pattern),
   `lib/install/` (binstub + install template).

5. Create a new `kiso-icons` repo (ask me where to put it), scaffold the gem,
   and follow the 7 implementation steps in order. The plan specifies exactly
   which files move as-is, which need changes, and what the changes are.

**Important constraints:**
- The namespace stays `Kiso::Icons` — zero renames from the current code.
- `require "kiso/icons"` must work (both the gem entry and Kiso's existing
  require statement load the same thing).
- The renderer outputs raw SVG with `width="1em" height="1em"` — no Tailwind.
  This was already refactored and is documented in `project/ICON_SIZING.md`.
- The CLI's `start(ARGV)` goes in the binstub, NOT in `commands.rb` — so the
  Commands class can be required by Kiso's CLI without triggering execution.
- Run `bundle exec standardrb --fix` before committing.

---

## Overview

Extract `lib/kiso/icons/` from the Kiso engine into a standalone `kiso-icons`
gem. Follows the **importmap-rails pattern** exactly: one gem, Rails dependency,
conditional railtie, binstub CLI, rake install task.

The gem ships a `kiso_icon_tag()` helper that renders raw SVG with no CSS
framework opinion. Kiso wraps it with `kiso_icon()` which adds Tailwind
(shrink-0, size presets, TailwindMerge). Two distinct names, composition not
override — no load-order fragility.

The icon system is already fully functional and integrated in Kiso. This is a
pure extraction — no new features, no API changes to Kiso's `kiso_icon()`.

## Pattern Source: importmap-rails 2.2.2

Every structural decision below is modeled on importmap-rails (read from the
installed gem at `~/.local/share/mise/installs/ruby/3.4.7/lib/ruby/gems/3.4.0/
gems/importmap-rails-2.2.2/`). Deviations are noted explicitly.

### What importmap-rails does

| Aspect | importmap-rails | kiso-icons (ours) |
|--------|----------------|-------------------|
| Entry point | `lib/importmap-rails.rb` | `lib/kiso-icons.rb` → requires `kiso/icons` |
| Namespace | `Importmap` | `Kiso::Icons` |
| Engine/Railtie | `Rails::Engine` (has `app/` dirs) | `Rails::Railtie` (no `app/` dirs) |
| Conditional load | `require "importmap/engine" if defined?(Rails::Railtie)` | Same pattern |
| Dependencies | `railties >= 6.0`, `activesupport >= 6.0`, `actionpack >= 6.0` | `railties >= 8.0`, `activesupport >= 8.0` |
| CLI | `Importmap::Commands < Thor`, auto-starts at bottom of file | `Kiso::Icons::Commands < Thor`, NO auto-start (see below) |
| Binstub | `lib/install/bin/importmap` — boots Rails, requires commands | `lib/install/bin/kiso-icons` — same |
| Install | `rake importmap:install` runs `lib/install/install.rb` template | `rake kiso_icons:install` — same |
| Vendor path | `vendor/javascript` (hardcoded convention) | `vendor/icons` (configurable) |
| Config | `config/importmap.rb` DSL file | Detection-based (if file exists, it's pinned) |

### One deliberate deviation: CLI auto-start

importmap-rails puts `Importmap::Commands.start(ARGV)` at the bottom of
`commands.rb`. Requiring the file auto-starts the CLI. Simple for a binstub,
but makes the class impossible to reuse as a Thor subcommand.

We put `start(ARGV)` in the binstub instead, so Kiso's `bin/kiso icons` can
require `kiso/icons/commands` and register it as a subcommand without
triggering execution. This is the standard Thor pattern (Rails' own CLI works
this way).

## Gem File Structure

```
kiso-icons/
├── lib/
│   ├── kiso-icons.rb                  # Entry shim: require "kiso/icons"
│   └── kiso/
│       ├── icons.rb                   # Main entry (moved from Kiso)
│       └── icons/
│           ├── version.rb
│           ├── configuration.rb       # Extracted from icons.rb
│           ├── cache.rb               # Thread-safe in-memory cache
│           ├── set.rb                 # Iconify JSON parser + alias resolution
│           ├── resolver.rb            # Resolution cascade
│           ├── renderer.rb            # Raw SVG rendering (no Tailwind)
│           ├── api_client.rb          # Iconify API fallback (dev only)
│           ├── helper.rb              # kiso_icon_tag() view helper
│           ├── commands.rb            # Thor CLI (pin/unpin/pristine/list)
│           └── railtie.rb             # Rails::Railtie (conditional)
├── lib/
│   ├── install/
│   │   ├── install.rb                 # Rails template (creates binstub + vendor dir)
│   │   └── bin/
│   │       └── kiso-icons             # Binstub template
│   └── tasks/
│       └── kiso_icons_tasks.rake      # rake kiso_icons:install
├── data/
│   └── lucide.json.gz                 # Bundled Lucide (81KB, zero-config default)
├── test/
│   ├── test_helper.rb
│   ├── cache_test.rb
│   ├── set_test.rb
│   ├── resolver_test.rb
│   ├── renderer_test.rb
│   ├── helper_test.rb
│   ├── api_client_test.rb
│   └── commands_test.rb
├── kiso-icons.gemspec
├── Gemfile
├── Rakefile
├── MIT-LICENSE
└── README.md
```

## Require Path

The gem name `kiso-icons` maps to `lib/kiso-icons.rb`. But the namespace
`Kiso::Icons` maps to `lib/kiso/icons.rb`. We provide both:

```ruby
# lib/kiso-icons.rb (entry shim — like importmap-rails.rb)
require "kiso/icons"
```

```ruby
# lib/kiso/icons.rb (main entry — real module definition)
module Kiso
  module Icons
    class Error < StandardError; end
    class IconNotFound < Error; end
    class SetNotFound < Error; end
  end
end

require "kiso/icons/version"
require "kiso/icons/configuration"
require "kiso/icons/cache"
require "kiso/icons/set"
require "kiso/icons/resolver"
require "kiso/icons/renderer"
require "kiso/icons/api_client"
require "kiso/icons/railtie" if defined?(Rails::Railtie)
```

This means both `require "kiso-icons"` and `require "kiso/icons"` work.
Critically, **Kiso already does `require "kiso/icons"` in `lib/kiso.rb`** — so
after extraction, Kiso requires zero changes to its require statement. The gem
replaces the local file seamlessly.

## Key Files (What They Do)

### Entry point: `lib/kiso/icons.rb`

Moved from Kiso with one change: `Configuration` extracted to its own file.
Module-level API unchanged:

```ruby
Kiso::Icons.configure { |c| ... }
Kiso::Icons.configuration
Kiso::Icons.resolve("lucide:check")  # → { body:, width:, height: }
Kiso::Icons.cache
Kiso::Icons.reset!
```

### Configuration: `lib/kiso/icons/configuration.rb`

Extracted from the current `icons.rb`. Pure Ruby, sensible defaults:

```ruby
class Configuration
  attr_accessor :default_set, :vendor_path, :fallback_to_api

  def initialize
    @default_set = "lucide"
    @vendor_path = "vendor/icons"
    @fallback_to_api = defined?(Rails) ? Rails.env.development? : false
  end
end
```

### Helper: `lib/kiso/icons/helper.rb`

The gem's view helper. Renders raw SVG — no Tailwind, no size presets. This is
the standalone API for non-Kiso apps:

```ruby
# lib/kiso/icons/helper.rb
module Kiso
  module Icons
    module Helper
      # Renders an inline SVG icon from Iconify icon sets.
      #
      #   kiso_icon_tag("lucide:check")
      #   kiso_icon_tag("check")                          # uses default set (lucide)
      #   kiso_icon_tag("check", class: "w-5 h-5")       # pass any CSS classes
      #   kiso_icon_tag("check", aria: { label: "Done" }) # accessible icon
      #
      def kiso_icon_tag(name, **options)
        icon_data = Kiso::Icons.resolve(name.to_s)

        unless icon_data
          if defined?(Rails) && Rails.env.development?
            return "<!-- kiso-icons: '#{ERB::Util.html_escape(name)}' not found -->".html_safe
          end
          return "".html_safe
        end

        Kiso::Icons::Renderer.render(icon_data, css_class: options.delete(:class), **options)
      end
    end
  end
end
```

- No `shrink-0`, no size presets, no TailwindMerge
- `class:` is passed through verbatim to the SVG element
- Returns `html_safe` string (via Renderer's SafeBuffer support)
- Missing icons: HTML comment in dev, empty string in prod

### Railtie: `lib/kiso/icons/railtie.rb`

Modeled on `importmap-rails/lib/importmap/engine.rb`. Uses `Rails::Railtie`
(not `Rails::Engine`) because the gem has no `app/` directory. The helper is
included via initializer, same pattern as importmap-rails' helper inclusion.

```ruby
# lib/kiso/icons/railtie.rb
require "kiso/icons/helper"

module Kiso
  module Icons
    class Railtie < ::Rails::Railtie
      initializer "kiso_icons.configure" do |app|
        Kiso::Icons.configure do |config|
          config.fallback_to_api = Rails.env.development? || Rails.env.test?
        end
      end

      initializer "kiso_icons.helpers" do
        ActiveSupport.on_load(:action_view) do
          include Kiso::Icons::Helper
        end
      end

      rake_tasks do
        load "tasks/kiso_icons_tasks.rake"
      end
    end
  end
end
```

The railtie includes `kiso_icon_tag()` into ActionView. Kiso's engine
separately includes `Kiso::IconHelper` which provides `kiso_icon()` — the
Tailwind-aware wrapper that calls `kiso_icon_tag()` internally.

### Commands (CLI): `lib/kiso/icons/commands.rb`

Moved from `lib/kiso/cli/icons.rb`. Changes:

1. Inherits from `Thor` directly (not `Kiso::Cli::Base`)
2. Class name: `Kiso::Icons::Commands` (not `Kiso::Cli::Icons`)
3. No `start(ARGV)` at bottom (put in binstub instead)
4. Uses `Kiso::Icons.configuration.vendor_path` (not hardcoded)

```ruby
require "thor"
require "kiso/icons"

class Kiso::Icons::Commands < Thor
  include Thor::Actions

  def self.exit_on_failure? = false

  desc "pin SETS...", "Download icon sets to vendor/icons/"
  def pin(*sets)
    # ... (existing logic from Kiso::Cli::Icons)
  end

  desc "unpin SET", "Remove a vendored icon set"
  def unpin(set_name)
    # ...
  end

  desc "pristine", "Re-download all pinned icon sets"
  def pristine
    # ...
  end

  desc "list", "Show pinned icon sets"
  def list
    # ...
  end
end
```

### Binstub: `lib/install/bin/kiso-icons`

Follows importmap-rails' `lib/install/bin/importmap` exactly:

```ruby
#!/usr/bin/env ruby

require_relative "../config/application"
require "kiso/icons/commands"

Kiso::Icons::Commands.start(ARGV)
```

Boots Rails (for config access), requires the commands class, starts Thor.

### Install template: `lib/install/install.rb`

Follows importmap-rails' `lib/install/install.rb`:

```ruby
say "Use vendor/icons for pinned icon sets"
empty_directory "vendor/icons"
keep_file "vendor/icons"

say "Copying binstub"
copy_file "#{__dir__}/bin/kiso-icons", "bin/kiso-icons"
chmod "bin", 0755 & ~File.umask, verbose: false
```

### Rake task: `lib/tasks/kiso_icons_tasks.rake`

Follows importmap-rails' `lib/tasks/importmap_tasks.rake`:

```ruby
namespace :kiso_icons do
  desc "Setup kiso-icons for the app"
  task :install do
    previous_location = ENV["LOCATION"]
    ENV["LOCATION"] = File.expand_path("../install/install.rb", __dir__)
    Rake::Task["app:template"].invoke
    ENV["LOCATION"] = previous_location
  end
end
```

### Renderer: `lib/kiso/icons/renderer.rb`

Moved as-is. Already framework-agnostic (refactored in previous session):
- Raw SVG with `width="1em" height="1em"`
- No Tailwind classes
- Optional `css_class:` passthrough
- `ActiveSupport::SafeBuffer` if available (guarded)

### Other modules

`cache.rb`, `set.rb`, `resolver.rb`, `api_client.rb` — moved as-is. They
already use `defined?(Rails)` guards and fall back to stdlib equivalents.

## Gemspec

```ruby
Gem::Specification.new do |spec|
  spec.name        = "kiso-icons"
  spec.version     = Kiso::Icons::VERSION
  spec.authors     = ["Steve Clarke"]
  spec.email       = ["steve@sevenview.ca"]
  spec.homepage    = "https://github.com/steveclarke/kiso-icons"
  spec.summary     = "Iconify icons for Rails — vendor pattern like importmap-rails"
  spec.description = "Pin any of Iconify's 224 icon sets (299k icons) to vendor/icons/. " \
                     "Inline SVG rendering, zero JavaScript, vendored for production."
  spec.license     = "MIT"

  spec.required_ruby_version = ">= 3.2"

  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    Dir["{data,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]
  end

  spec.require_paths = ["lib"]

  # Following importmap-rails: hard depend on Rails
  spec.add_dependency "railties",      ">= 8.0"
  spec.add_dependency "activesupport", ">= 8.0"
  spec.add_dependency "actionpack",    ">= 8.0"
end
```

`actionpack` is needed for `ActiveSupport.on_load(:action_view)` in the
railtie's helper inclusion (same reason importmap-rails depends on it).
No `tailwind_merge` (that's Kiso's concern). No `thor` as a runtime
dependency (it's already a transitive dependency of railties).

## Changes in Kiso After Extraction

### Files to delete from Kiso

```
lib/kiso/icons.rb               # Provided by gem now
lib/kiso/icons/cache.rb          #
lib/kiso/icons/set.rb            #
lib/kiso/icons/resolver.rb       #
lib/kiso/icons/renderer.rb       #
lib/kiso/icons/api_client.rb     #
data/lucide.json.gz              # Ships in gem
```

### Files to modify in Kiso

**`kiso.gemspec`** — add gem dependency, remove `data` from files glob:

```ruby
spec.files = Dir.chdir(File.expand_path(__dir__)) do
  Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]
  #    ^^^^ removed "data" ^^^^
end

spec.add_dependency "kiso-icons"
```

**`lib/kiso.rb`** — NO CHANGES. `require "kiso/icons"` now loads from the gem
instead of the local file. The namespace `Kiso::Icons` is identical.

**`lib/kiso/cli/icons.rb`** — thin delegate to gem's CLI:

```ruby
# frozen_string_literal: true

require "kiso/icons/commands"

# Delegate bin/kiso icons → kiso-icons gem's Commands class
Kiso::Cli::Icons = Kiso::Icons::Commands
```

**`lib/kiso/cli/main.rb`** — NO CHANGES. Already registers
`subcommand "icons", Kiso::Cli::Icons` which now points to the gem's class.

**`lib/kiso/engine.rb`** — NO CHANGES. Keeps `include Kiso::IconHelper`.

**`app/helpers/kiso/icon_helper.rb`** — change `kiso_icon()` to call
`kiso_icon_tag()` instead of calling `Kiso::Icons.resolve` and
`Kiso::Icons::Renderer.render` directly:

```ruby
# app/helpers/kiso/icon_helper.rb
module Kiso
  module IconHelper
    SIZE_PRESETS = {
      xs: "size-3", sm: "size-4", md: "size-5",
      lg: "size-6", xl: "size-8"
    }.freeze

    BASE_CLASSES = "shrink-0"

    def kiso_icon(name, size: nil, **options)
      css_classes = options.delete(:class) || ""
      size_class = size ? SIZE_PRESETS.fetch(size, nil) : nil
      merged = merge_icon_classes(BASE_CLASSES, size_class, css_classes)

      kiso_icon_tag(name, class: merged, **options)
    end

    private

    def merge_icon_classes(*parts)
      combined = parts.reject { |p| p.nil? || p.to_s.empty? }.join(" ")
      icon_class_merger.merge(combined)
    end

    def icon_class_merger
      @icon_class_merger ||= TailwindMerge::Merger.new
    end
  end
end
```

The key change: `kiso_icon` no longer calls `Kiso::Icons.resolve` and
`Kiso::Icons::Renderer.render` directly. It calls `kiso_icon_tag` (provided
by the gem's `Kiso::Icons::Helper`) and just handles the Tailwind class
merging. This is pure composition.

### Files that stay in Kiso

```
app/helpers/kiso/icon_helper.rb  # Tailwind wrapper: kiso_icon() → kiso_icon_tag()
lib/kiso/engine.rb               # Helper inclusion into ActionView
lib/kiso/cli/main.rb             # icons subcommand registration
```

## Namespace References

All internal code already uses `Kiso::Icons` namespace. No renames needed.

### Internal gem references (unchanged from current code)

| Reference | Used in |
|-----------|---------|
| `Kiso::Icons.cache` | resolver.rb |
| `Kiso::Icons.configuration` | resolver.rb, set.rb, api_client.rb |
| `Kiso::Icons.configuration.vendor_path` | set.rb |
| `Kiso::Icons.configuration.fallback_to_api` | resolver.rb |
| `Kiso::Icons.configuration.default_set` | resolver.rb |
| `Kiso::Icons.resolve` | helper.rb (`kiso_icon_tag`) |
| `Kiso::Icons::Renderer.render` | helper.rb (`kiso_icon_tag`) |

### Cross-gem references (Kiso → gem)

| Reference | Used in |
|-----------|---------|
| `kiso_icon_tag()` | Kiso's `icon_helper.rb` (`kiso_icon` calls it) |
| `Kiso::Icons::Helper` | Included by gem's railtie; available in views |
| `Kiso::Icons::Commands` | Kiso's CLI delegation |

## Helper Architecture: `kiso_icon_tag()` → `kiso_icon()`

Two distinct helpers, composition not override:

| Helper | Defined in | Tailwind? | Purpose |
|--------|-----------|-----------|---------|
| `kiso_icon_tag()` | Gem (`kiso-icons`) | No | Raw SVG rendering. Standalone API. |
| `kiso_icon()` | Kiso (`app/helpers/kiso/icon_helper.rb`) | Yes | Adds `shrink-0`, size presets, TailwindMerge. Calls `kiso_icon_tag()`. |

### Standalone usage (gem only, no Kiso)

```erb
<%= kiso_icon_tag("lucide:check") %>
<%= kiso_icon_tag("check", class: "w-5 h-5 text-green-600") %>
<%= kiso_icon_tag("check", aria: { label: "Done" }) %>
```

Output:
```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
     width="1em" height="1em" aria-hidden="true" fill="none">
  <path d="..." stroke="currentColor" stroke-width="2"/>
</svg>
```

### Kiso usage (wraps the gem)

```erb
<%= kiso_icon("check") %>                        <%# inside a component — parent CSS sizes it %>
<%= kiso_icon("check", size: :md) %>              <%# standalone — explicit size %>
<%= kiso_icon("check", class: "text-success") %>  <%# extra classes merged via TailwindMerge %>
```

Kiso's `kiso_icon()` calls `kiso_icon_tag()` internally:

```ruby
# app/helpers/kiso/icon_helper.rb (stays in Kiso)
def kiso_icon(name, size: nil, **options)
  css_classes = options.delete(:class) || ""
  size_class = size ? SIZE_PRESETS.fetch(size, nil) : nil
  merged = merge_icon_classes(BASE_CLASSES, size_class, css_classes)

  kiso_icon_tag(name, class: merged, **options)
end
```

### Why this works

- **No override** — two different method names, no load-order concerns
- **Composition** — `kiso_icon` wraps `kiso_icon_tag`, clear call chain
- **Self-documenting** — `_tag` suffix follows Rails convention (`image_tag`,
  `content_tag`), signals "renders an HTML element"
- **Both available in Kiso** — Kiso users can call `kiso_icon_tag` directly
  if they want raw SVG without Tailwind

### Full rendering stack

```
kiso_icon("check", size: :md)          # Kiso helper (Tailwind)
  → kiso_icon_tag("check", class: "shrink-0 size-5")  # Gem helper (raw)
    → Kiso::Icons.resolve("check")     # Resolution cascade
    → Kiso::Icons::Renderer.render()   # SVG generation
```

See `project/ICON_SIZING.md` for documentation on how parent components
(Button, Alert, Badge) control icon sizing via CSS child selectors.

## Implementation Steps

### Step 1: Create gem repo and scaffold

1. Create `kiso-icons` repo on GitHub
2. Scaffold gem structure (gemspec, Gemfile, Rakefile, MIT-LICENSE)
3. Create `lib/kiso-icons.rb` entry shim
4. Create `lib/kiso/icons/version.rb`

### Step 2: Move core modules

Copy from Kiso with minimal changes (namespace stays the same):

1. `lib/kiso/icons.rb` — extract Configuration to its own file
2. `lib/kiso/icons/configuration.rb` — new file, extracted from icons.rb
3. `lib/kiso/icons/cache.rb` — as-is
4. `lib/kiso/icons/set.rb` — as-is
5. `lib/kiso/icons/resolver.rb` — as-is
6. `lib/kiso/icons/renderer.rb` — as-is
7. `lib/kiso/icons/api_client.rb` — update warn message (`bin/kiso-icons pin`)
8. `lib/kiso/icons/helper.rb` — NEW: `kiso_icon_tag()` (thin wrapper over resolve + render)
9. `data/lucide.json.gz` — as-is

### Step 3: Add railtie

1. `lib/kiso/icons/railtie.rb` — configuration + helper inclusion + rake tasks
2. `lib/tasks/kiso_icons_tasks.rake` — install task
3. `lib/install/install.rb` — Rails template
4. `lib/install/bin/kiso-icons` — binstub template

### Step 4: Add CLI

1. `lib/kiso/icons/commands.rb` — Thor class (moved from `lib/kiso/cli/icons.rb`)
   - Change superclass from `Kiso::Cli::Base` to `Thor`
   - Add `include Thor::Actions` (for `say` method)
   - Add `self.exit_on_failure? = false`
   - Remove `start(ARGV)` (stays in binstub)

### Step 5: Write tests

Unit tests for each module (minitest, matching Kiso's style):

- `cache_test.rb` — get/set/clear/size, thread safety
- `set_test.rb` — JSON parsing, icon lookup, alias resolution, transforms
- `resolver_test.rb` — cascade order, caching, name parsing
- `renderer_test.rb` — SVG output, attributes, aria-label, SafeBuffer
- `api_client_test.rb` — HTTP mocking (webmock), error handling
- `commands_test.rb` — pin/unpin/list (tmpdir + HTTP mocking)

### Step 6: Update Kiso

1. Add `spec.add_dependency "kiso-icons"` to `kiso.gemspec`
2. Remove `data` from gemspec files glob
3. Delete `lib/kiso/icons.rb` and `lib/kiso/icons/*.rb`
4. Delete `data/` directory
5. Update `app/helpers/kiso/icon_helper.rb` — `kiso_icon` calls `kiso_icon_tag`
6. Update `lib/kiso/cli/icons.rb` to delegate to gem
7. Run tests, verify Lookbook previews still work

### Step 7: Release

1. Push kiso-icons gem to RubyGems
2. Update Kiso's Gemfile to use released gem
3. Update issue #20

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| One gem or two? | One gem | importmap-rails pattern; code is small (~400 lines); avoids release coordination complexity |
| Namespace | `Kiso::Icons` | Maps to `kiso-icons` gem name; zero renames in Kiso after extraction |
| Rails dependency | Hard depend on `railties >= 8.0` | Matches importmap-rails; binstub boots Rails; primary audience is Rails apps |
| Engine vs Railtie | `Rails::Railtie` | Helper included via initializer (like importmap-rails); no `app/` directory needed |
| Gem helper | `kiso_icon_tag()` | Raw SVG, no Tailwind. `_tag` suffix follows Rails convention. Standalone API. |
| Kiso helper | `kiso_icon()` wraps `kiso_icon_tag()` | Adds Tailwind (shrink-0, size presets). Composition, not override. |
| CLI auto-start | In binstub, not in commands.rb | Deviation from importmap-rails; enables Kiso to register as Thor subcommand |
| Bundled data | `data/lucide.json.gz` ships in gem | Zero-config default; same as current behavior |
| Config file | Detection-based | If `vendor/icons/lucide.json` exists, it's pinned; no `config/kiso_icons.rb` needed |
| Vendored format | Raw JSON (not gzipped) | Inspectable, git compresses well; same as current |

## Open Questions (Resolved)

These were open in previous drafts. All resolved now:

1. ~~Should vendored files be stored gzipped?~~ **No.** Raw JSON. Git
   compresses in packfiles.
2. ~~Config file for pinned sets?~~ **No.** Detection-based. File exists =
   pinned.
3. ~~Should the gem name be generic?~~ **No.** `kiso-icons` for now. Can
   rename later if needed.
4. ~~Should the renderer have zero dependencies?~~ **Already done.** Renderer
   outputs raw SVG. No Tailwind, no TailwindMerge.
5. ~~How to handle the CLI?~~ **Thor class in gem, binstub boots Rails.**
   Kiso delegates via subcommand registration.
6. ~~Should bundled Lucide be a separate gem?~~ **No.** Ships in main gem at
   81KB gzipped. Not worth a separate gem.
7. ~~Should the gem ship a helper?~~ **Yes.** `kiso_icon_tag()` — raw SVG,
   no Tailwind. Kiso wraps it with `kiso_icon()` (composition, not override).
8. ~~Helper naming conflict?~~ **Solved.** Two distinct names:
   `kiso_icon_tag()` (gem, raw) and `kiso_icon()` (Kiso, Tailwind). The
   `_tag` suffix follows Rails convention and makes the relationship
   self-documenting.
