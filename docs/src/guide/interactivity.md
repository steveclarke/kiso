---
title: Interactivity
layout: docs
description: How to add dynamic behavior with native HTML5 and Stimulus instead of component state.
---

## HTML5 first

Before reaching for JavaScript, check if the browser already handles it.
These native elements cover a surprising number of UI patterns:

| Pattern | HTML5 | Instead of |
|---------|-------|------------|
| Modal / dialog | `<dialog>` | Vue `<Teleport>` + state management |
| Popover / tooltip | `[popover]` attribute | Headless UI / Floating UI |
| Accordion / disclosure | `<details>` / `<summary>` | Disclosure components with state |
| Progress indicator | `<progress>` | Custom progress bar components |
| Form validation | Built-in constraint API | Custom validation libraries |

These work without any JavaScript, are accessible by default, and are
supported in all modern browsers.

```erb
<%% # A modal using native <dialog> %>
<dialog id="confirm-dialog">
  <%%= kui(:card) do %>
    <%%= kui(:card, :header) do %>
      <%%= kui(:card, :title) { "Are you sure?" } %>
    <%% end %>
    <%%= kui(:card, :content) do %>
      <p>This action cannot be undone.</p>
    <%% end %>
    <%%= kui(:card, :footer) do %>
      <%%= kui(:button, variant: :outline, data: { action: "click->dialog#close" }) { "Cancel" } %>
      <%%= kui(:button, variant: :solid, color: :error) { "Delete" } %>
    <%% end %>
  <%% end %>
</dialog>
```

## Stimulus for everything else

When you need behavior that HTML can't express — toggling visibility,
clipboard operations, form enhancement, async loading — use
[Stimulus](https://stimulus.hotwired.dev).

If you're used to Vue's reactivity or React's `useState`, the mental shift
is: **the server sends the right HTML, and Stimulus adds progressive
enhancements on top.**

```erb
<%% # Toggle visibility with Stimulus %>
<div data-controller="toggle">
  <%%= kui(:button, data: { action: "click->toggle#toggle" }) { "Show details" } %>
  <div data-toggle-target="content" class="hidden">
    <%%= kui(:alert, color: :info) do %>
      <%%= kui(:alert, :description) { "Here are the details." } %>
    <%% end %>
  </div>
</div>
```

## Turbo for page updates

Rails uses [Turbo](https://turbo.hotwired.dev) for SPA-like page transitions
and partial updates without writing JavaScript:

- **Turbo Drive** — automatic link interception, no full page reloads
- **Turbo Frames** — update a section of the page without touching the rest
- **Turbo Streams** — server-pushed DOM updates over WebSocket or HTTP

Kiso components work naturally with Turbo because they're just HTML. Wrap a
component in a `<turbo-frame>` and it updates in place:

```erb
<turbo-frame id="notification-count">
  <%%= kui(:badge, color: :error, variant: :solid) { @count } %>
</turbo-frame>
```

## Key difference from Vue/React

In Vue or React, the component owns its state and updates the DOM when state
changes. In Kiso's model:

1. **The server owns the state** — your Rails models and controllers
2. **ERB renders the HTML** — Kiso components produce the markup
3. **Turbo delivers updates** — partial page updates without full reloads
4. **Stimulus adds behavior** — small JS enhancements where HTML isn't enough

This means less JavaScript, simpler debugging (view source works), and no
hydration mismatches.
