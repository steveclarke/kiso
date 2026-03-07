<p align="center">
  <a href="https://kisoui.com">
    <img src="brand/svg/logo-horizontal-color.svg" width="280" alt="Kiso">
  </a>
</p>

<p align="center">
  UI components for Rails. Built on ERB, Tailwind CSS, and Hotwire.
</p>

<p align="center">
  <a href="https://kisoui.com">Docs</a> ·
  <a href="https://lookbook.kisoui.com">Lookbook</a> ·
  <a href="https://github.com/steveclarke/kiso/discussions">Discussions</a> ·
  <a href="https://kisoui.com/discord">Discord</a>
</p>

Add one gem and get badges, buttons, cards, alerts, and more. They all work with screen readers and dark mode.

No React. No extra build step. Just ERB with [class_variants](https://github.com/avo-hq/class_variants) for styling.

> [!WARNING]
> Kiso is in early development and **not ready for production use**. The gem is published to reserve the name on RubyGems. APIs, component names, and theme tokens will change without notice. Watch the repo or check back in a few weeks.

## Getting started

Add the gem to your Gemfile and bundle:

```ruby
# Gemfile
gem "kiso"
```

```bash
bundle install
```

Then add one import to your Tailwind CSS entrypoint:

```css
/* app/assets/tailwind/application.css */
@import "../builds/tailwind/kiso.css";
```

And add the dark mode helper to your layout's `<head>`:

```erb
<head>
  <%= kiso_theme_script %>
  <%= stylesheet_link_tag "tailwind" %>
  <%= javascript_importmap_tags %>
</head>
```

That's it. Helpers, importmap pins, asset paths, dark mode tokens, and base
body styles are all wired up automatically by the engine. See the
[Getting Started guide](https://kisoui.com/getting-started) for the full
walkthrough.

### Bundler apps (esbuild, Vite, Bun)

If your app uses a JS bundler instead of importmaps, also install the npm
package for Stimulus controllers:

```bash
npm install kiso-ui
```

```js
// app/javascript/controllers/index.js
import KisoUi from "kiso-ui"
KisoUi.start(application)
```

Importmap apps get Stimulus controllers automatically — no npm install needed.

## Usage

Use the `kui()` helper to render components:

```erb
<%= kui(:badge, color: :primary) { "Active" } %>
```

Components are made of small parts. A card has a header, title, content, and footer:

```erb
<%= kui(:card) do %>
  <%= kui(:card, :header) do %>
    <%= kui(:card, :title, text: "Members") %>
  <% end %>
  <%= kui(:card, :content) do %>
    ...
  <% end %>
<% end %>
```

## How it works

Each component has two parts:

1. **A theme file** in `lib/kiso/themes/` — sets up variants, sizes, and colors
2. **An ERB partial** in `app/views/kiso/components/` — reads the theme and renders HTML

Colors use tokens like `bg-primary` and `text-muted`. They switch on their own in dark mode. No `dark:` classes needed.

## Design system

Kiso follows a strict spatial system — consistent heights, padding, gaps, typography, border radius, and icon sizing across every component. See the [Design System](https://kisoui.com/design-system) page for the visual reference.

## Design principles

1. **Native HTML first.** Use `<dialog>`, `[popover]`, `<details>` before adding JavaScript.
2. **Build from small parts.** Card = Header + Title + Content + Footer.
3. **ERB is enough.** Use strict locals and `yield` for blocks.
4. **Tailwind classes in ERB.** CSS files only hold transitions and pseudo-states.
5. **Theme with tokens.** Names like `primary` map to real colors. They flip in dark mode.
6. **Works with Turbo.** Use them in Turbo Frames and Streams.
7. **Stimulus only when needed.** Native HTML handles the basics. Stimulus adds the rest.

## Development

```bash
git clone --recurse-submodules https://github.com/steveclarke/kiso.git
cd kiso
bundle install
bin/dev
```

This starts [Lookbook](https://lookbook.build) on port 4001 with a Tailwind watcher. Open [http://localhost:4001/lookbook](http://localhost:4001/lookbook) to browse previews.

Cloned without `--recurse-submodules`? Run `bin/vendor init` to fetch the vendor repos.

Run tests and lint:

```bash
bundle exec rake test             # Ruby tests
npm run test:unit                 # JS unit tests (Vitest)
npm run test:e2e                  # E2E tests (Playwright, needs bin/dev)
bundle exec standardrb            # Ruby lint
npm run lint && npm run fmt:check # JS lint + format check
```

See [CONTRIBUTING.md](CONTRIBUTING.md) to help out.

### Project layout

```
app/views/kiso/components/   ERB partials
lib/kiso/themes/             Theme files (class_variants)
app/javascript/controllers/  Stimulus controllers (also shipped via npm as kiso-ui)
app/helpers/kiso/            kui(), kiso_prepare_options() helpers
app/assets/tailwind/kiso/   CSS (only transitions and pseudo-states)
lookbook/                    Lookbook dev app (previews on port 4001)
docs/                        Docs site (Bridgetown)
```

## Requirements

- Ruby >= 3.3
- Rails >= 8.0
- A Tailwind CSS build pipeline ([tailwindcss-rails](https://github.com/rails/tailwindcss-rails) or [cssbundling-rails](https://github.com/rails/cssbundling-rails))

## Status

Early development. APIs, component names, and theme tokens may change.

## License

MIT License. See [MIT-LICENSE](MIT-LICENSE).
