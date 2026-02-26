# Kiso 基礎

UI components for Rails + Hotwire. Follows the design language of [shadcn/ui](https://ui.shadcn.com), adapted for ERB and Tailwind CSS.

One gem gives you accessible, themeable components. No React, no build step beyond Tailwind. ERB partials with strict locals, variant-driven styling via [class_variants](https://github.com/MooseSaeed/class_variants), and Stimulus controllers only where native HTML falls short.

Icons are handled by the companion [kiso-icons](https://github.com/steveclarke/kiso-icons) gem (included as a dependency).

## How it works

Components have two layers:

1. **Ruby theme modules** (`lib/kiso/themes/`) — variant definitions using `class_variants` + `tailwind_merge`
2. **ERB partials** (`app/views/kiso/components/`) — strict locals, computed class strings from theme modules, composition via `yield` and sub-parts

Styling uses semantic tokens (`bg-primary`, `text-foreground`, `bg-muted`) that flip automatically in dark mode. No `dark:` prefixes in component code.

## Installation

```ruby
# Gemfile
gem "kiso"
```

```bash
bundle install
bin/rails generate kiso:install
```

### Local Development (Host App)

If you're working on Kiso alongside a host app, point the Gemfile at the git
repo and use Bundler's local override to resolve from disk:

```ruby
# Gemfile (works everywhere — CI, deploy, other devs)
gem "kiso", git: "https://github.com/steveclarke/kiso.git", branch: "master"
```

```bash
# Your machine only (one-time setup)
bundle config set local.kiso ~/src/kiso
```

Bundler resolves from your local checkout. Edit kiso on disk, changes are
picked up immediately. Deploy works because it fetches from GitHub.

## Development

```bash
git clone --recurse-submodules https://github.com/steveclarke/kiso.git
cd kiso
bundle install
bin/dev
```

This starts [Lookbook](https://lookbook.build) on port 4001 and a Tailwind CSS watcher. Open [http://localhost:4001/lookbook](http://localhost:4001/lookbook) to browse component previews.

If you cloned without `--recurse-submodules`, run `bin/vendor init` to fetch the reference repos.

Run tests:

```bash
bundle exec rake test             # all tests
bundle exec standardrb            # lint
```

See [CONTRIBUTING.md](CONTRIBUTING.md) to help out.

### Project layout

```
app/views/kiso/components/   ERB partials
lib/kiso/themes/             Ruby theme modules (ClassVariants definitions)
app/helpers/kiso/            component_tag, kiso() helpers
app/assets/stylesheets/kiso/ Component CSS (transitions, pseudo-states only)
test/components/previews/    Lookbook preview classes + templates
test/dummy/                  Development Rails app
vendor/shadcn-ui/            Structural reference (git submodule)
vendor/nuxt-ui/              Theming reference (git submodule)
docs/                        Bridgetown documentation site
```

## Usage

Render components with the `kiso()` helper:

```erb
<%= kiso(:badge, variant: :primary) { "Active" } %>

<%= kiso(:card) do %>
  <%= kiso(:card, :header) do %>
    <%= kiso(:card, :title, text: "Members") %>
  <% end %>
  <%= kiso(:card, :content) do %>
    ...
  <% end %>
<% end %>
```

CSS-only components work with data attributes directly:

```erb
<%= f.submit "Save", data: { component: "button", variant: "primary" } %>
```

## Design Principles

1. **Native first.** `<dialog>`, `[popover]`, `<details>`, `<progress>` before JavaScript.
2. **Data attributes are the API.** `data-component`, `data-variant`, `data-size`, `data-*-part`.
3. **Composition over configuration.** Card = Header + Title + Content + Footer.
4. **ERB is enough.** Strict locals, `yield` for slots, `content_tag` for merging.
5. **Tailwind classes first.** Utilities in ERB markup. `@apply` only where you can't — variant selectors, pseudo-states.
6. **One CSS file per component.** Thin files for what ERB can't express. Most styling is in the partials.
7. **Theme via semantic tokens.** Palette aliases (primary → blue) + surface tokens (bg-elevated, text-muted) that flip automatically in dark mode.
8. **Turbo-compatible by default.** Works inside Turbo Frames and Streams.
9. **Stimulus as enhancement.** Remove the controller; the component still renders.

## Requirements

- Ruby >= 3.3
- Rails >= 8.0
- [tailwindcss-rails](https://github.com/rails/tailwindcss-rails)

## Status

Early development. See [VISION.md](VISION.md) for the full roadmap and component catalog.

## License

MIT License. See [MIT-LICENSE](MIT-LICENSE).
