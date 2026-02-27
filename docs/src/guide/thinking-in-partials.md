---
title: Thinking in Partials
layout: docs
description: How Kiso components work if you're coming from Vue or React.
---

If you're coming from Vue or React, Kiso components will feel familiar — but
the mechanics are different. This guide maps the concepts you already know to
how things work in ERB.

## Components are templates, not classes

A Vue SFC or React component is a unit of code that manages state, renders
UI, and hooks into a lifecycle. A Kiso component is simpler: it's an ERB
partial that receives locals and produces HTML. No instances, no lifecycle, no
re-renders.

<div class="grid gap-6 sm:grid-cols-2 not-prose my-6">
  <div>
    <p class="text-sm font-medium text-foreground mb-2">Vue</p>
    <pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>&lt;Badge color="primary"&gt;New&lt;/Badge&gt;</code></pre>
  </div>
  <div>
    <p class="text-sm font-medium text-foreground mb-2">Kiso</p>
    <pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>&lt;%%= kui(:badge, color: :primary) { "New" } %&gt;</code></pre>
  </div>
</div>

`kui()` is Kiso's render helper. It finds the right partial, passes your
locals, and returns HTML. Think of it as a function call that returns markup —
because that's exactly what it is.

## The `kui()` helper

Every component renders through `kui()`:

```erb
<%% # Component with a block %>
<%%= kui(:badge, color: :success) { "Active" } %>

<%% # Component with sub-parts %>
<%%= kui(:card) do %>
  <%%= kui(:card, :header) do %>
    <%%= kui(:card, :title) { "Settings" } %>
  <%% end %>
<%% end %>
```

The first argument is always the component name. An optional second argument
selects a sub-part. Everything else is a local passed to the partial.

## No virtual DOM, no reactivity

In React, changing state triggers a re-render. In Vue, reactive data updates
the DOM automatically. Kiso doesn't do either — the server renders HTML once
and sends it to the browser.

For interactivity, Kiso uses:

1. **Native HTML5** — `<dialog>`, `[popover]`, `<details>` handle most UI
   patterns without any JavaScript
2. **Stimulus** — lightweight controllers for behavior that HTML can't express
   (toggling, animations, async loading)

This is a different mental model. Instead of "how do I make this component
react to state changes?", think "how do I make the server send the right HTML,
and what browser-native features handle the rest?"
