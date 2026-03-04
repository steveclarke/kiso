---
title: AlertDialog
layout: docs
description: Modal confirmation dialog that requires an explicit user action. Cannot be dismissed by backdrop click or Escape key.
category: Overlay
source: lib/kiso/themes/alert_dialog.rb
---

## Quick Start

```erb
<button onclick="document.getElementById('my-alert').showModal()">Delete</button>

<%%= kui(:alert_dialog, id: "my-alert") do %>
  <%%= kui(:alert_dialog, :header) do %>
    <%%= kui(:alert_dialog, :title) { "Are you sure?" } %>
    <%%= kui(:alert_dialog, :description) { "This action cannot be undone." } %>
  <%% end %>
  <%%= kui(:alert_dialog, :footer) do %>
    <%%= kui(:alert_dialog, :cancel) { "Cancel" } %>
    <%%= kui(:alert_dialog, :action, color: :error) { "Delete" } %>
  <%% end %>
<%% end %>
```

## Locals

| Local | Type | Default |
|-------|------|---------|
| `open:` | `Boolean` | `false` |
| `size:` | `Symbol` | `:default` |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

### Size Variants

| Size | Description |
|------|-------------|
| `:default` | Standard width (`sm:max-w-lg`), left-aligned on desktop |
| `:sm` | Compact width (`max-w-xs`), centered layout, 2-column footer grid |

## Sub-parts

| Part | Element | Purpose |
|------|---------|---------|
| `:header` | `<div>` | Grid container for title, description, and optional media |
| `:title` | `<h2>` | Dialog heading |
| `:description` | `<p>` | Subtitle text |
| `:media` | `<div>` | Optional icon or image container |
| `:footer` | `<div>` | Action buttons |
| `:action` | `<button>` | Primary action button (solid variant, auto-closes) |
| `:cancel` | `<button>` | Cancel button (outline variant, auto-closes) |

### Action & Cancel Button Props

Both `:action` and `:cancel` accept Button styling props:

| Local | Type | Default (action) | Default (cancel) |
|-------|------|-------------------|-------------------|
| `color:` | `Symbol` | `:primary` | `:primary` |
| `variant:` | `Symbol` | `:solid` | `:outline` |
| `size:` | `Symbol` | `:md` | `:md` |

## Usage

### Basic Confirmation

```erb
<%%= kui(:alert_dialog, id: "confirm") do %>
  <%%= kui(:alert_dialog, :header) do %>
    <%%= kui(:alert_dialog, :title) { "Are you absolutely sure?" } %>
    <%%= kui(:alert_dialog, :description) { "This action cannot be undone. This will permanently delete your account." } %>
  <%% end %>
  <%%= kui(:alert_dialog, :footer) do %>
    <%%= kui(:alert_dialog, :cancel) { "Cancel" } %>
    <%%= kui(:alert_dialog, :action) { "Continue" } %>
  <%% end %>
<%% end %>
```

### Destructive Action

```erb
<%%= kui(:alert_dialog, id: "delete") do %>
  <%%= kui(:alert_dialog, :header) do %>
    <%%= kui(:alert_dialog, :title) { "Delete account?" } %>
    <%%= kui(:alert_dialog, :description) { "This will permanently delete your account and all associated data." } %>
  <%% end %>
  <%%= kui(:alert_dialog, :footer) do %>
    <%%= kui(:alert_dialog, :cancel) { "Cancel" } %>
    <%%= kui(:alert_dialog, :action, color: :error) { "Delete" } %>
  <%% end %>
<%% end %>
```

### With Media Icon

Use the `:media` sub-part for a prominent icon in the header. At default
size, the icon and text sit side-by-side on desktop.

```erb
<%%= kui(:alert_dialog, id: "share") do %>
  <%%= kui(:alert_dialog, :header) do %>
    <%%= kui(:alert_dialog, :media) do %>
      <%%= kiso_icon("lucide:share-2", class: "size-8") %>
    <%% end %>
    <%%= kui(:alert_dialog, :title) { "Share this project?" } %>
    <%%= kui(:alert_dialog, :description) { "This will make the project visible to all team members." } %>
  <%% end %>
  <%%= kui(:alert_dialog, :footer) do %>
    <%%= kui(:alert_dialog, :cancel) { "Cancel" } %>
    <%%= kui(:alert_dialog, :action) { "Share" } %>
  <%% end %>
<%% end %>
```

### Compact Size with Media

The `:sm` size uses a centered layout with a narrower panel, ideal for
short confirmation messages with an icon.

```erb
<%%= kui(:alert_dialog, id: "delete-project", size: :sm) do %>
  <%%= kui(:alert_dialog, :header) do %>
    <%%= kui(:alert_dialog, :media, css_classes: "bg-error/10 text-error") do %>
      <%%= kiso_icon("lucide:trash-2", class: "size-8") %>
    <%% end %>
    <%%= kui(:alert_dialog, :title) { "Delete project?" } %>
    <%%= kui(:alert_dialog, :description) { "This action is permanent." } %>
  <%% end %>
  <%%= kui(:alert_dialog, :footer) do %>
    <%%= kui(:alert_dialog, :cancel) { "Cancel" } %>
    <%%= kui(:alert_dialog, :action, color: :error) { "Delete" } %>
  <%% end %>
<%% end %>
```

### Server-Rendered Open

Pass `open: true` to show the alert dialog on page load.

```erb
<%%= kui(:alert_dialog, open: true, id: "terms") do %>
  <%%= kui(:alert_dialog, :header) do %>
    <%%= kui(:alert_dialog, :title) { "Accept terms?" } %>
    <%%= kui(:alert_dialog, :description) { "You must accept the terms of service to continue." } %>
  <%% end %>
  <%%= kui(:alert_dialog, :footer) do %>
    <%%= kui(:alert_dialog, :cancel) { "Decline" } %>
    <%%= kui(:alert_dialog, :action) { "Accept" } %>
  <%% end %>
<%% end %>
```

## Dialog vs Alert Dialog

Use **Dialog** for general-purpose modals (forms, content, settings).
Use **Alert Dialog** for confirmations that require an explicit choice.

| Feature | Dialog | Alert Dialog |
|---------|--------|--------------|
| Escape closes | Yes | No |
| Backdrop click closes | Yes | No |
| Close (X) button | Optional | Not available |
| Body content area | Yes | No |
| Action/Cancel buttons | Manual | Built-in sub-parts |

## Accessibility

| Attribute | Value |
|-----------|-------|
| Element | Native `<dialog>` with `showModal()` |
| `role` | `alertdialog` |
| `aria-labelledby` | Auto-linked to title (when `id:` is provided) |
| `aria-describedby` | Auto-linked to description (when `id:` is provided) |
| Focus trapping | Native (built into `showModal()`) |
| Escape key | Does **not** close (intentional) |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | Cycles focus within the dialog |
| `Escape` | No effect (user must choose an action) |
