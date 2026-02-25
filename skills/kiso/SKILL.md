---
name: kiso
description: Build UIs with Kiso — accessible Rails UI components with Tailwind CSS theming. Use when creating interfaces, customizing themes, building forms, or composing page layouts in Rails + Hotwire apps.
---

# Kiso

Rails component library built on ERB partials + [Tailwind CSS](https://tailwindcss.com/) + [class_variants](https://github.com/avo-hq/class_variants) + [tailwind_merge](https://github.com/gjtorikian/tailwind_merge). Inspired by shadcn/ui and Nuxt UI, adapted for Rails + Hotwire.

## Installation

```ruby
# Gemfile
gem "kiso"
```

```bash
bundle install
bin/rails generate kiso:install
```

## Rendering Components

Use the `kiso()` helper to render components:

```erb
<%= kiso(:badge, color: :success, variant: :soft) { "Active" } %>

<%= kiso(:card) do %>
  <%= kiso(:card, :header) do %>
    <%= kiso(:card, :title, text: "Members") %>
  <% end %>
  <%= kiso(:card, :content) do %>
    ...
  <% end %>
<% end %>
```

## Colors

7 semantic colors configurable via theme CSS variables:

| Color | Default Palette | Purpose |
|---|---|---|
| `primary` | blue | CTAs, brand, active states |
| `secondary` | teal | Secondary actions |
| `success` | green | Success messages |
| `info` | sky | Informational |
| `warning` | amber | Warnings |
| `error` | red | Errors, destructive actions |
| `neutral` | zinc | Text, borders, surfaces |

## Variants

Components that accept both `color` and `variant` use compound variants (Nuxt UI pattern):

| Variant | Style |
|---|---|
| `solid` | Filled background, contrasting text |
| `outline` | Transparent background, colored ring |
| `soft` | Light tinted background, colored text |
| `subtle` | Light tinted background, colored text, faint ring |

## Theming

Components use semantic Tailwind utilities (`bg-primary`, `text-foreground`, `bg-muted`) that resolve to CSS variables. Dark mode flips automatically — components never use `dark:` prefixes.

Override brand colors in your app's CSS:

```css
@theme inline {
  --color-primary: var(--color-orange-600);
  --color-primary-foreground: white;
}
```

## Customizing Instances

Pass `css_classes:` to override styles on a specific instance. Conflicting classes are resolved automatically via tailwind_merge:

```erb
<%= kiso(:badge, color: :primary, css_classes: "rounded-full px-4") { "Custom" } %>
```

## Additional references

Load based on your task — **do not load all at once**:

- [references/components.md](references/components.md) — all components with props and usage
- [references/theming.md](references/theming.md) — CSS variables, tokens, brand customization
