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

Import the generated engine CSS in your Tailwind stylesheet. Kiso auto-generates
this file before every Tailwind build with the correct paths for your environment:

```css
@import "tailwindcss";
@import "../builds/tailwind/kiso";

/* Optional: override tokens to match your brand */
/* @theme { --color-primary: var(--color-violet-600); } */
```

Use the `kui()` helper to render components:

```erb
<%%= kui(:badge, color: :primary) { "New" } %>

<%%= kui(:button, href: "/signup", variant: :solid) { "Get started" } %>

<%%= kui(:alert, color: :success, variant: :soft) do |alert| %>
  <%% alert.with_title { "Done!" } %>
  <%% alert.with_description { "Your changes have been saved." } %>
<%% end %>
```

## Components

Browse the available components in the sidebar, or see the full list on the
[Components](/components) page.

### Stimulus controllers for bundler apps

If your app uses a JS bundler (esbuild, Vite, Bun), install the npm package
for interactive components (Toggle, Select, etc.):

```bash
npm install kiso-ui
```

```js
import KisoUi from "kiso-ui"
KisoUi.start(application)
```

Importmap apps get Stimulus controllers automatically — no npm install needed.

## Architecture

Kiso has two layers:

1. **Ruby theme modules** — variant definitions using `class_variants` + `tailwind_merge`
2. **ERB partials** — strict locals, computed class strings, composition via `yield`

Components never use `@apply` in CSS. Tailwind classes are computed in Ruby and
rendered in ERB. CSS files are only used for transitions, animations, and
pseudo-states that ERB can't express.
