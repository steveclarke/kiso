---
title: Slots & Composition
layout: docs
description: How Vue/React slots and children map to Kiso's yield and sub-part composition.
---

## Default slot

Vue's `<slot>`, React's `{children}`, and Kiso's `yield` all do the same
thing — render whatever the caller puts inside the component:

<div class="grid gap-6 sm:grid-cols-3 not-prose my-6">
  <div>
    <p class="text-sm font-medium text-foreground mb-2">Vue</p>
    <pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>&lt;Card&gt;
  Hello
&lt;/Card&gt;</code></pre>
  </div>
  <div>
    <p class="text-sm font-medium text-foreground mb-2">React</p>
    <pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>&lt;Card&gt;
  Hello
&lt;/Card&gt;</code></pre>
  </div>
  <div>
    <p class="text-sm font-medium text-foreground mb-2">Kiso</p>
    <pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>&lt;%%= kui(:card) do %&gt;
  Hello
&lt;%% end %&gt;</code></pre>
  </div>
</div>

## Named slots → sub-part composition

Vue has named slots (`<template #header>`). React uses compound components
(`<Card.Header>`). Kiso uses **sub-part partials**:

<div class="grid gap-6 sm:grid-cols-3 not-prose my-6">
  <div>
    <p class="text-sm font-medium text-foreground mb-2">Vue</p>
    <pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>&lt;Card&gt;
  &lt;template #header&gt;
    &lt;CardTitle&gt;Title&lt;/CardTitle&gt;
  &lt;/template&gt;
  Content here
  &lt;template #footer&gt;
    &lt;Button&gt;Save&lt;/Button&gt;
  &lt;/template&gt;
&lt;/Card&gt;</code></pre>
  </div>
  <div>
    <p class="text-sm font-medium text-foreground mb-2">React (shadcn)</p>
    <pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>&lt;Card&gt;
  &lt;CardHeader&gt;
    &lt;CardTitle&gt;Title&lt;/CardTitle&gt;
  &lt;/CardHeader&gt;
  &lt;CardContent&gt;
    Content here
  &lt;/CardContent&gt;
  &lt;CardFooter&gt;
    &lt;Button&gt;Save&lt;/Button&gt;
  &lt;/CardFooter&gt;
&lt;/Card&gt;</code></pre>
  </div>
  <div>
    <p class="text-sm font-medium text-foreground mb-2">Kiso</p>
    <pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>&lt;%%= kui(:card) do %&gt;
  &lt;%%= kui(:card, :header) do %&gt;
    &lt;%%= kui(:card, :title) { "Title" } %&gt;
  &lt;%% end %&gt;
  &lt;%%= kui(:card, :content) do %&gt;
    Content here
  &lt;%% end %&gt;
  &lt;%%= kui(:card, :footer) do %&gt;
    &lt;%%= kui(:button) { "Save" } %&gt;
  &lt;%% end %&gt;
&lt;%% end %&gt;</code></pre>
  </div>
</div>

`kui(:card, :header)` renders the `card/_header.html.erb` partial. Each
sub-part is its own file with its own locals — just like how shadcn
decomposes `Card` into `CardHeader`, `CardTitle`, `CardContent`, and
`CardFooter`.

## Why composition instead of `content_for`?

Rails does have `content_for` / `yield :name`, which looks like named slots:

```erb
<%% # This works but has a gotcha %>
<%%= kui(:card) do %>
  <%% content_for :header, "Title" %>
  Body content
<%% end %>
```

The problem: **`content_for` is page-global**. If you render two Cards on the
same page, their `:header` content bleeds into each other. Sub-part
composition doesn't have this problem — each `kui(:card, :header)` call is
isolated.

This is the same reason shadcn and Nuxt UI use compound components instead of
Vue's named slots for complex layouts.

## Choosing between yield and sub-parts

**Use `yield` (default slot)** for simple components where the caller provides
a single block of content:

```erb
<%%= kui(:badge, color: :success) { "Active" } %>

<%%= kui(:button, variant: :solid) do %>
  Save changes
<%% end %>
```

**Use sub-parts** for structured components with multiple content areas:

```erb
<%%= kui(:alert, color: :info) do %>
  <%%= kui(:alert, :title) { "Heads up!" } %>
  <%%= kui(:alert, :description) { "This is important." } %>
<%% end %>
```

Each component's docs page lists its available sub-parts.
