---
title: Icons
layout: docs
description: Render inline SVG icons from Lucide, Heroicons, Material Design, and hundreds of other icon libraries.
---

## How It Works

Kiso uses **kiso-icons** for server-side inline SVG rendering. Icons are resolved from Iconify JSON data at template time — no client-side JavaScript, no font files, no CDN requests. The rendered output is a plain `<svg>` element inlined in your HTML.

## Lucide (Built-in)

[Lucide](https://lucide.dev) (~1,500 icons) is bundled in the gem and works out of the box with zero configuration:

```erb
<%%= kiso_icon("check") %>
<%%= kiso_icon("settings") %>
<%%= kiso_icon("layout-dashboard") %>
```

Lucide is the default set — bare icon names resolve to Lucide automatically.

## Sizing

Icons render at `1em` by default (inherits parent font size). Use the `size:` parameter for explicit sizing:

```erb
<%%= kiso_icon("check", size: :xs) %>   <%% # size-3  (12px) %>
<%%= kiso_icon("check", size: :sm) %>   <%% # size-4  (16px) %>
<%%= kiso_icon("check", size: :md) %>   <%% # size-5  (20px) %>
<%%= kiso_icon("check", size: :lg) %>   <%% # size-6  (24px) %>
<%%= kiso_icon("check", size: :xl) %>   <%% # size-8  (32px) %>
```

Or pass a class directly:

```erb
<%%= kiso_icon("check", class: "size-5 text-success") %>
```

Inside Kiso components (Button, Alert, Nav), parent CSS handles icon sizing automatically — no explicit size needed.

## Adding Icon Libraries

Pin additional [Iconify](https://icon-sets.iconify.design/) sets with the CLI:

```bash
bin/kiso-icons pin heroicons        # Heroicons (Tailwind Labs)
bin/kiso-icons pin mdi              # Material Design Icons
bin/kiso-icons pin tabler           # Tabler Icons
bin/kiso-icons pin phosphor         # Phosphor Icons
bin/kiso-icons pin ri               # Remix Icons
```

This downloads JSON files to `vendor/icons/`. Commit them to git — the same vendor-and-commit pattern used by importmap-rails.

Browse all available sets at [icon-sets.iconify.design](https://icon-sets.iconify.design/).

### Managing Pinned Sets

```bash
bin/kiso-icons list       # show pinned sets with icon counts
bin/kiso-icons unpin mdi  # remove a set
bin/kiso-icons pristine   # re-download all pinned sets
```

## Using Icons from Other Sets

Prefix with the set name:

```erb
<%%= kiso_icon("heroicons:check-circle") %>
<%%= kiso_icon("mdi:account") %>
<%%= kiso_icon("tabler:settings") %>
```

Without a prefix, the default set (Lucide) is used.

## Component Icons

Kiso components use built-in icons for things like separator chevrons, pagination arrows, and close buttons. These are configurable — you can swap the icon library globally without touching any component templates:

```ruby
# config/initializers/kiso.rb
Kiso.configure do |config|
  config.icons[:chevron_right] = "heroicons:chevron-right"
  config.icons[:menu] = "heroicons:bars-3"
  config.icons[:x] = "heroicons:x-mark"
end
```

### Registered Component Icons

| Name | Default (Lucide) | Used By |
|---|---|---|
| `chevron_right` | `chevron-right` | Breadcrumb separator |
| `chevron_down` | `chevron-down` | Select trigger, Nav section |
| `chevrons_up_down` | `chevrons-up-down` | Combobox trigger |
| `check` | `check` | Select/Combobox selected item |
| `x` | `x` | Command dialog close |
| `search` | `search` | Command input |
| `ellipsis` | `ellipsis` | Breadcrumb ellipsis, Pagination |
| `chevron_left` | `chevron-left` | Pagination prev |
| `menu` | `menu` | Sidebar toggle |
| `minus` | `minus` | InputOTP separator |
| `panel_left_close` | `panel-left-close` | Sidebar collapse (open) |
| `panel_left_open` | `panel-left-open` | Sidebar collapse (closed) |
| `sun` | `sun` | Color mode button (light) |
| `moon` | `moon` | Color mode button (dark) |

## Accessibility

Icons are `aria-hidden="true"` by default (decorative). For standalone meaningful icons, pass an aria label:

```erb
<%%= kiso_icon("check", aria: { label: "Done" }) %>
```

This removes `aria-hidden` and adds `role="img"`.

## Configuration

```ruby
# config/initializers/kiso_icons.rb
Kiso::Icons.configure do |config|
  config.default_set = "heroicons"     # change default from Lucide
  config.vendor_path = "vendor/icons"  # where pinned sets live
end
```

## Resolution Order

When you call `kiso_icon("name")`, icons are resolved in this order:

1. **In-memory cache** — instant, per-request
2. **Already-loaded set** — parsed JSON in memory
3. **Vendored JSON** — `vendor/icons/<set>.json`
4. **Bundled** — gem's `data/<set>.json.gz` (Lucide only)

In development, if an icon isn't found, an HTML comment is rendered (`<!-- kiso-icons: 'name' not found -->`). In production, nothing is rendered.
