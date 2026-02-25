---
layout: docs
title: Introduction
---

Kiso (基礎 — Japanese: foundation) is a Rails engine gem providing UI components inspired
by [shadcn/ui](https://ui.shadcn.com) and [Nuxt UI](https://ui.nuxt.com).

ERB partials, Tailwind CSS, progressive Stimulus.

## Quick start

Add Kiso to your Gemfile:

```ruby
gem "kiso"
```

Use the `kiso()` helper to render components:

```erb
<%%= kiso(:badge, color: :primary) { "New" } %>

<%%= kiso(:button, href: "/signup", variant: :solid) { "Get started" } %>

<%%= kiso(:alert, color: :success, variant: :soft) do |alert| %>
  <%% alert.with_title { "Done!" } %>
  <%% alert.with_description { "Your changes have been saved." } %>
<%% end %>
```

## Components

Browse the available components in the sidebar, or see the full list on the
[Components](/components) page.

## Architecture

Kiso has two layers:

1. **Ruby theme modules** — variant definitions using `class_variants` + `tailwind_merge`
2. **ERB partials** — strict locals, computed class strings, composition via `yield`

Components never use `@apply` in CSS. Tailwind classes are computed in Ruby and
rendered in ERB. CSS files are only used for transitions, animations, and
pseudo-states that ERB can't express.
