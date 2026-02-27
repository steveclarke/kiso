# Component Structure

## File Locations

- **Theme**: `lib/kiso/themes/{name}.rb`
- **Partial**: `app/views/kiso/components/_{name}.html.erb`
- **Sub-parts**: `app/views/kiso/components/{name}/_{part}.html.erb`
- **CSS** (if needed): `app/assets/stylesheets/kiso/{name}.css`
- **Lookbook preview**: `test/components/previews/kiso/{name}_preview.rb`
- **Preview templates**: `test/components/previews/kiso/{name}_preview/*.html.erb`

## Standard Partial Template

```erb
<%# app/views/kiso/components/_badge.html.erb %>
<%# locals: (color: :primary, variant: :soft, size: :md, css_classes: "", **component_options) %>
<%= content_tag :span,
    class: Kiso::Themes::Badge.render(color: color, variant: variant, size: size, class: css_classes),
    data: { component: :badge },
    **component_options do %>
  <%= yield %>
<% end %>
```

### Key patterns

- **Strict locals** with defaults on every partial
- **`css_classes:`** for user overrides (not `class:` — avoid Ruby keyword conflict)
- **`**component_options`** splat for arbitrary HTML attributes (data, aria, id, etc.)
- **`data: { component: :name }`** for identity — testing, Stimulus, debugging
- **`yield`** for block content / slot composition

## Sub-Part Partials

For composed components (Card = Header + Title + Content + Footer):

```erb
<%# app/views/kiso/components/card/_header.html.erb %>
<%# locals: (css_classes: "", **component_options) %>
<%= content_tag :div,
    class: Kiso::Themes::CardHeader.render(class: css_classes),
    data: { component: :card, card_part: :header },
    **component_options do %>
  <%= yield %>
<% end %>
```

Rendered via the `kui()` helper with a part argument:

```erb
<%= kui(:card) do %>
  <%= kui(:card, :header) do %>
    <%= kui(:card, :title) { "Members" } %>
    <%= kui(:card, :description) { "Manage your team members." } %>
  <% end %>
  <%= kui(:card, :content) do %>
    ...
  <% end %>
<% end %>
```

## CSS-Only Components

Some components (Button, Input) can be styled via data attributes on native elements without a partial:

```erb
<%= f.submit "Save", data: { component: "button" },
    class: Kiso::Themes::Button.render(variant: :solid, color: :primary) %>
```

## Lookbook Preview Template

```ruby
# test/components/previews/kiso/badge_preview.rb
module Kiso
  # @label Badge
  class BadgePreview < Lookbook::Preview
    # @label Playground
    # @param color select { choices: [primary, secondary, success, info, warning, error, neutral] }
    # @param variant select { choices: [solid, outline, soft, subtle] }
    # @param size select { choices: [xs, sm, md, lg, xl] }
    # @param text text "Badge"
    def playground(color: :primary, variant: :soft, size: :md, text: "Badge")
      render_with_template(locals: {
        color: color.to_sym,
        variant: variant.to_sym,
        size: size.to_sym,
        text: text
      })
    end

    # @label Colors
    def colors
      render_with_template
    end
  end
end
```

### Preview conventions

- **Playground first** — interactive params, shown as default when clicking the component
- **Gallery scenarios** — Colors, Variants, Sizes as separate views showing all options
- **`render_with_template`** — use ERB templates (not inline render) so `kui()` helper works
- **`.to_sym`** — Lookbook passes strings, theme modules expect symbols

## Registering a New Component

1. Create theme in `lib/kiso/themes/{name}.rb`
2. Add `require "kiso/themes/{name}"` to `lib/kiso.rb`
3. Create partial at `app/views/kiso/components/_{name}.html.erb`
4. Create Lookbook preview + templates
5. Update `skills/kiso/references/components.md`
6. If CSS needed, add file and import in `app/assets/tailwind/kiso/engine.css`
