# Plan: Kiso Iconify Gem

GitHub Issue: https://github.com/steveclarke/kiso/issues/4

## Problem

Kiso components need an `icon:` prop (Button, Alert, Badge, etc.) but there's
no pure-Ruby way to use the full Iconify catalog (224 sets, 299k icons) in
Rails. Existing options all fall short — either they require Node/npm, only
support a handful of sets, or are abandoned projects.

## Solution

A standalone Ruby gem that follows the **importmap-rails vendor pattern**:
users pin the icon sets they need, the gem downloads JSON files to
`vendor/icons/`, and they commit them. Files are in git, deploy everywhere,
no runtime network dependency. API fallback in development for sets not yet
pinned.

This is exactly how `importmap-rails` works with `vendor/javascript/` — a
pattern created by DHH, well-understood by every Rails developer.

## How It Works

### Pin icon sets (like `bin/importmap pin`)

```bash
bin/kiso icons pin lucide                # downloads vendor/icons/lucide.json (82KB gz)
bin/kiso icons pin heroicons mdi tabler  # pin multiple sets at once
bin/kiso icons unpin mdi                 # remove a set
bin/kiso icons pristine                  # re-download all pinned sets
bin/kiso icons update                    # check for newer versions
bin/kiso icons list                      # show pinned sets + sizes
```

Downloads Iconify JSON from GitHub to `vendor/icons/{set}.json`. User commits
these files. They deploy to Heroku, Docker, Fly, anywhere — same as vendored
JavaScript.

### Use icons in views

```erb
<%= icon("lucide:check") %>
<%= icon("heroicons:x-mark", size: :lg) %>
<%= icon("mdi:home", class: "text-primary") %>

<%# Short form uses default set (lucide) %>
<%= icon("check") %>
```

### Resolution order

```
1. In-memory cache (sub-ms, per-process)
2. Vendored JSON in vendor/icons/ (committed to git, always available)
3. Bundled Lucide (ships inside the gem itself, zero-config fallback)
4. Iconify API (development only, warns to pin the set)
```

**Production:** Layers 1-3. No network. No `tmp/`. No ephemeral storage.
**Development:** All 4 layers. API handles sets you haven't pinned yet.

### Development experience

```erb
<%# Using an icon set that isn't pinned yet %>
<%= icon("mdi:home") %>
```

Works via API fallback. Console shows:

```
[KisoIcons] Fetched mdi:home from Iconify API (148ms).
  Pin this set for offline use: bin/kiso icons pin mdi
```

Pin it when ready, commit, done. Same flow as `bin/importmap pin`.

## Why This Works in Production

The vendored JSON files are **committed to git**, which means:

- They're in the Heroku slug (built from git)
- They're in the Docker image (copied from repo)
- They're in the Fly.io deploy (built from Dockerfile)
- They survive restarts, scaling events, dyno cycling
- They're versioned — rollback deploys roll back icons too
- No build step required — no `rails assets:precompile` equivalent
- No `tmp/` dependency — nothing ephemeral

This is the same guarantee `importmap-rails` provides for vendored JavaScript.
If it works for JS, it works for icons.

## Iconify JSON Format

Each set is one JSON file from the
[iconify/icon-sets](https://github.com/iconify/icon-sets) repo:

```json
{
  "prefix": "lucide",
  "info": { "name": "Lucide", "total": 1701, "height": 24 },
  "icons": {
    "check": {
      "body": "<path d=\"...\" stroke=\"currentColor\" stroke-width=\"2\"/>"
    }
  },
  "width": 24,
  "height": 24
}
```

- `body` = SVG inner content (no outer `<svg>` tags)
- Icons inherit `currentColor` — works inside colored Kiso components
- The gem wraps `body` in an `<svg>` tag with the right viewBox and classes

### Set sizes (real measurements)

| Set | Icons | Raw | Gzipped |
|-----|-------|-----|---------|
| Lucide | 1,701 | 532 KB | 82 KB |
| Heroicons | ~300 | 613 KB | 129 KB |
| Tabler | 6,004 | 2.0 MB | 324 KB |
| Remix (ri) | 3,188 | 1.1 MB | 267 KB |
| MDI | 7,447 | 3.4 MB | 796 KB |
| Phosphor (ph) | 9,072 | 4.5 MB | 940 KB |
| Material Symbols | 15,232 | 8.1 MB | 1.2 MB |
| **Full catalog** | **299k** | **396 MB** | **~60-80 MB** |

Typical app pins 2-5 sets = 1-5 MB in `vendor/icons/`. Comparable to
vendored JavaScript in `vendor/javascript/`.

## Gem Architecture

```
kiso-icons/
├── lib/
│   ├── kiso/icons.rb              # Main entry, configuration
│   ├── kiso/icons/
│   │   ├── registry.rb            # Default icons hash (close, check, etc.)
│   │   ├── resolver.rb            # Name parsing + resolution cascade
│   │   ├── set.rb                 # Icon set loader (JSON → Hash)
│   │   ├── cache.rb               # In-memory per-process cache
│   │   ├── api_client.rb          # Iconify API fallback (dev only)
│   │   ├── renderer.rb            # SVG rendering (body → <svg> tag)
│   │   ├── commands.rb            # Thor CLI (pin, unpin, pristine, etc.)
│   │   └── railtie.rb             # Rails integration (helper, tasks)
│   └── kiso/icons/
│       └── helpers/
│           └── icon_helper.rb     # icon() view helper
├── data/
│   └── lucide.json.gz            # Bundled Lucide (zero-config default)
└── kiso-icons.gemspec
```

### Configuration

```ruby
# config/initializers/kiso_icons.rb (optional — sensible defaults)
Kiso::Icons.configure do |config|
  config.default_set = "lucide"           # used when no prefix
  config.vendor_path = "vendor/icons"     # where pinned sets live
  config.fallback_to_api = Rails.env.development?  # API only in dev
end
```

### View Helper

```ruby
# Explicit set
icon("lucide:check")
icon("mdi:home")
icon("heroicons:x-mark")

# Short form (uses default_set)
icon("check")
icon("home")     # only works if unambiguous in pinned sets

# Size presets
icon("check", size: :xs)    # size-3
icon("check", size: :sm)    # size-4
icon("check", size: :md)    # size-5 (default)
icon("check", size: :lg)    # size-6
icon("check", size: :xl)    # size-8

# Extra classes
icon("check", class: "text-success")

# Arbitrary attributes
icon("check", data: { testid: "check-icon" })
```

### Rendering

The helper renders actual `<svg>` elements — no CSS tricks, no spans:

```ruby
icon("lucide:check")
# => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
#        class="size-5 shrink-0" fill="none" aria-hidden="true">
#      <path d="..." stroke="currentColor" stroke-width="2"/>
#    </svg>
```

- Inline SVG inherits `currentColor` — works inside colored buttons, alerts
- `shrink-0` prevents flex collapsing
- `aria-hidden="true"` for decorative icons
- Size class from presets, merged via TailwindMerge

## Kiso Integration

Once the gem exists, Kiso depends on it and defines component default icons:

```ruby
# kiso.gemspec
spec.add_dependency "kiso-icons"

# lib/kiso/icons.rb
module Kiso
  DEFAULT_ICONS = {
    close: "lucide:x",
    check: "lucide:check",
    search: "lucide:search",
    chevron_down: "lucide:chevron-down",
    chevron_up: "lucide:chevron-up",
    chevron_left: "lucide:chevron-left",
    chevron_right: "lucide:chevron-right",
    info: "lucide:info",
    success: "lucide:circle-check",
    warning: "lucide:triangle-alert",
    error: "lucide:circle-x",
    loader: "lucide:loader-circle",
    plus: "lucide:plus",
    minus: "lucide:minus",
    external_link: "lucide:external-link"
  }.freeze

  def self.default_icons = @default_icons ||= DEFAULT_ICONS.dup
end
```

Components use defaults internally:

```erb
<%= icon(Kiso.default_icons[:close], size: :sm) %>
```

Host apps override:

```ruby
Kiso.default_icons[:close] = "heroicons:x-mark"
```

## CLI Commands

Following the importmap-rails pattern exactly:

```bash
bin/kiso icons pin lucide heroicons     # download + vendor
bin/kiso icons unpin heroicons          # remove vendored set
bin/kiso icons pristine                 # re-download all pinned sets
bin/kiso icons update                   # check for newer versions
bin/kiso icons list                     # show pinned sets with sizes
bin/kiso icons search check             # search across pinned sets
```

## Phases

### Phase 1: MVP
- Core gem with vendoring CLI (pin/unpin/pristine)
- icon() view helper with size presets
- Bundled Lucide (ships in gem, zero-config)
- Vendored set loader (reads from vendor/icons/)
- Rails integration (Railtie, helper auto-include)
- Development API fallback with console warnings

### Phase 2: Polish
- `bin/kiso icons update` (check for newer set versions)
- `bin/kiso icons search` (search across pinned sets)
- `bin/kiso icons list` (show installed sets + icon counts)
- Better error messages with actionable commands

### Phase 3: Kiso component integration
- Wire icon() into Button, Alert, Badge props
- Kiso.default_icons registry
- Component vision doc target APIs become real

## Gem Name

`iconify-ruby` is taken (abandoned, 0 stars). Options:
- `kiso-icons` — ties it to Kiso, but clear purpose
- `iconify_rails` — not tied to Kiso, broader appeal
- `ruby-iconify` — generic

Recommend **`kiso-icons`** for now. Can always extract to a generic name
later if it gets traction beyond Kiso.

## Open Questions

1. **Should vendored files be stored gzipped?** Raw JSON is easier to
   inspect but larger in git. Gzipped saves space but adds complexity.
   Leaning toward raw JSON — it compresses well in git's packfiles anyway.
2. **Config file for pinned sets?** importmap-rails uses `config/importmap.rb`.
   We could use `config/kiso_icons.rb` or just detect what's in `vendor/icons/`.
   Leaning toward detection — if the file exists, it's pinned. Simple.
3. **Should the gem name be generic?** If this is useful beyond Kiso, a
   non-Kiso name would be better for adoption. But naming is hard and we
   can rename later.
