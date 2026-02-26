# Kiso 基礎

UI components for Rails. Built on ERB, Tailwind CSS, and Hotwire.

Add one gem and get badges, buttons, cards, alerts, and more. They all work with screen readers and dark mode. The look follows [shadcn/ui](https://ui.shadcn.com).

No React. No extra build step. Just ERB with [class_variants](https://github.com/avo-hq/class_variants) for styling.

Icons come from the [kiso-icons](https://github.com/steveclarke/kiso-icons) gem, which is bundled in.

> [!WARNING]
> Kiso is in early development and **not ready for production use**. The gem is published to reserve the name on RubyGems. APIs, component names, and theme tokens will change without notice. Watch the repo or check back in a few weeks.

## Installation

```ruby
# Gemfile
gem "kiso"
```

```bash
bundle install
bin/rails generate kiso:install
```

## Usage

Use the `kiso()` helper to render components:

```erb
<%= kiso(:badge, variant: :primary) { "Active" } %>
```

Components are made of small parts. A card has a header, title, content, and footer:

```erb
<%= kiso(:card) do %>
  <%= kiso(:card, :header) do %>
    <%= kiso(:card, :title, text: "Members") %>
  <% end %>
  <%= kiso(:card, :content) do %>
    ...
  <% end %>
<% end %>
```

Data attributes work on any HTML element too:

```erb
<%= f.submit "Save", data: { component: "button", variant: "primary" } %>
```

## How it works

Each component has two parts:

1. **A theme file** in `lib/kiso/themes/` — sets up variants, sizes, and colors
2. **An ERB partial** in `app/views/kiso/components/` — reads the theme and renders HTML

Colors use tokens like `bg-primary` and `text-muted`. They switch on their own in dark mode. No `dark:` classes needed.

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

Run tests:

```bash
bundle exec rake test             # all tests
bundle exec standardrb            # lint
```

See [CONTRIBUTING.md](CONTRIBUTING.md) to help out.

### Project layout

```
app/views/kiso/components/   ERB partials
lib/kiso/themes/             Theme files (class_variants)
app/helpers/kiso/            component_tag, kiso() helpers
app/assets/stylesheets/kiso/ CSS (only transitions and pseudo-states)
test/components/previews/    Lookbook previews
test/dummy/                  Dev Rails app
vendor/shadcn-ui/            Layout reference (git submodule)
vendor/nuxt-ui/              Theme reference (git submodule)
docs/                        Docs site (Bridgetown)
```

## Requirements

- Ruby >= 3.3
- Rails >= 8.0
- [tailwindcss-rails](https://github.com/rails/tailwindcss-rails)

## Status

Early development. See [VISION.md](VISION.md) for the roadmap and full component list.

## License

MIT License. See [MIT-LICENSE](MIT-LICENSE).
