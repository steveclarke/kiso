---
title: Dialog
layout: docs
description: Modal dialog wrapping the native HTML dialog element with backdrop, focus trapping, and Escape-to-close.
category: Overlay
source: lib/kiso/themes/dialog.rb
---

## Quick Start

```erb
<button onclick="document.getElementById('my-dialog').showModal()">Open</button>

<%%= kui(:dialog, id: "my-dialog") do %>
  <%%= kui(:dialog, :close) %>
  <%%= kui(:dialog, :header) do %>
    <%%= kui(:dialog, :title) { "Dialog Title" } %>
    <%%= kui(:dialog, :description) { "A brief description." } %>
  <%% end %>
  <%%= kui(:dialog, :body) do %>
    <p>Content goes here.</p>
  <%% end %>
  <%%= kui(:dialog, :footer) do %>
    <%%= kui(:button, variant: :outline, data: { action: "kiso--dialog#close" }) { "Cancel" } %>
    <%%= kui(:button) { "Continue" } %>
  <%% end %>
<%% end %>
```

## Locals

| Local | Type | Default |
|-------|------|---------|
| `open:` | `Boolean` | `false` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Sub-parts

| Part | Element | Purpose |
|------|---------|---------|
| `:header` | `<div>` | Container for title and description |
| `:title` | `<h2>` | Dialog heading |
| `:description` | `<p>` | Subtitle text |
| `:body` | `<div>` | Main content area |
| `:footer` | `<div>` | Action buttons |
| `:close` | `<button>` | X close button (top-right) |

## Usage

### Server-Rendered Open

Pass `open: true` to open the dialog on page load. This sets a Stimulus
Value that calls `showModal()` on connect — it does NOT use the HTML
`open` attribute (which would show the dialog non-modally without a backdrop).

```erb
<%%= kui(:dialog, open: true, id: "welcome") do %>
  <%%= kui(:dialog, :header) do %>
    <%%= kui(:dialog, :title) { "Welcome!" } %>
  <%% end %>
  <%%= kui(:dialog, :footer) do %>
    <%%= kui(:button, data: { action: "kiso--dialog#close" }) { "Get started" } %>
  <%% end %>
<%% end %>
```

### Confirmation Dialog

A simple confirm/cancel pattern with no body.

```erb
<%%= kui(:dialog, id: "confirm") do %>
  <%%= kui(:dialog, :header) do %>
    <%%= kui(:dialog, :title) { "Are you sure?" } %>
    <%%= kui(:dialog, :description) { "This action cannot be undone." } %>
  <%% end %>
  <%%= kui(:dialog, :footer) do %>
    <%%= kui(:button, variant: :outline, data: { action: "kiso--dialog#close" }) { "Cancel" } %>
    <%%= kui(:button, color: :error) { "Delete" } %>
  <%% end %>
<%% end %>
```

### With Form

Wrap body and footer in a `<form>` with `class="grid gap-4"` to maintain
spacing between the form fields and action buttons.

```erb
<%%= kui(:dialog, id: "create") do %>
  <%%= kui(:dialog, :close) %>
  <%%= kui(:dialog, :header) do %>
    <%%= kui(:dialog, :title) { "Create item" } %>
  <%% end %>
  <form class="grid gap-4">
    <%%= kui(:dialog, :body) do %>
      <%%= kui(:field) do %>
        <%%= kui(:field, :label) { "Title" } %>
        <%%= kui(:input, placeholder: "Item title") %>
      <%% end %>
    <%% end %>
    <%%= kui(:dialog, :footer) do %>
      <%%= kui(:button, variant: :outline, data: { action: "kiso--dialog#close" }) { "Cancel" } %>
      <%%= kui(:button, type: :submit) { "Create" } %>
    <%% end %>
  </form>
<%% end %>
```

### Scrollable Body

For tall content, add `max-h-72 overflow-y-auto` to the body.

```erb
<%%= kui(:dialog, :body, css_classes: "max-h-72 overflow-y-auto") do %>
  <%% # Long content here %>
<%% end %>
```

## Opening the Dialog

The dialog opens via `showModal()`. Common trigger patterns:

```erb
<%%# Simple onclick %>
<button onclick="document.getElementById('my-dialog').showModal()">Open</button>

<%%# Stimulus action (when trigger is inside the dialog's DOM scope) %>
<button data-action="kiso--dialog#open">Open</button>
```

## Closing the Dialog

Three ways to close:

1. **Close button** — `kui(:dialog, :close)` renders an X button
2. **Escape key** — native behavior, intercepted for exit animation
3. **Backdrop click** — clicking outside the content panel

Any button can close the dialog via Stimulus action:

```erb
<%%= kui(:button, data: { action: "kiso--dialog#close" }) { "Cancel" } %>
```

## Accessibility

| Attribute | Value |
|-----------|-------|
| Element | Native `<dialog>` with `showModal()` |
| Focus trapping | Native (built into `showModal()`) |
| `aria-modal` | Implicit via `showModal()` |
| Close button | Has `<span class="sr-only">Close</span>` |
| Escape key | Closes the dialog |

### Keyboard

| Key | Action |
|-----|--------|
| `Escape` | Closes the dialog |
| `Tab` | Cycles focus within the dialog |
