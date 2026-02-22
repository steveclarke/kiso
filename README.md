# Kiso 基礎

**Kiso** (基礎 — Japanese: foundation) is a UI component library for Rails, distributed
as a gem. It follows the design language and component catalog of
[shadcn/ui](https://ui.shadcn.com), adapted for the Rails + Hotwire stack.

One gem, installed in any Rails 8 project, that gives you a complete set of
accessible, themeable UI components. No React, no build step beyond Tailwind.
ERB partials with strict locals, CSS powered by data-attribute selectors, and
Stimulus controllers only where native HTML falls short.

## Architecture

```
1. ERB Partials          <%= render "components/card" %>
2. CSS (data-attributes)  [data-component="card"] { ... }
3. Stimulus Controllers   data-controller="combobox" (only when needed)
```

- **ERB partials** with strict locals. Compose through `yield` and sub-part
  partials (Card > Header > Title). No Ruby class overhead.
- **CSS** targets `data-component` and `data-variant` attributes. One file per
  component. Semantic tokens alias Tailwind's built-in color palettes.
- **Stimulus controllers** added progressively. Native HTML5 first (`<dialog>`,
  Popover API, `<details>`). Stimulus fills the gaps.

## Installation

```ruby
# Gemfile
gem "kiso"
```

```bash
bundle install
bin/rails generate kiso:install
```

### Local Development

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

## Design Principles

1. **Native first.** `<dialog>`, `[popover]`, `<details>`, `<progress>` before JavaScript.
2. **Data attributes are the API.** `data-component`, `data-variant`, `data-size`, `data-*-part`.
3. **Composition over configuration.** Card = Header + Title + Content + Footer.
4. **ERB is enough.** Strict locals, `yield` for slots, `content_tag` for merging.
5. **Tailwind classes first.** Utilities in ERB markup. `@apply` only where you can't — variant selectors, pseudo-states.
6. **One CSS file per component.** Thin files for what ERB can't express. Most styling is in the partials.
7. **Theme via Tailwind palettes.** Semantic tokens point to Tailwind colors. Change your brand by swapping one palette name.
8. **Turbo-compatible by default.** Works inside Turbo Frames and Streams.
9. **Stimulus as enhancement.** Remove the controller; the component still renders.

## Status

Early development. See [VISION.md](VISION.md) for the full roadmap and
component catalog.

## License

The gem is available as open source under the terms of the
[MIT License](https://opensource.org/licenses/MIT).
