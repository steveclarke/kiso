---
title: InputOTP
layout: docs
description: One-time password input with individual character slots, auto-advance, and paste support.
category: Forms
source: lib/kiso/themes/input_otp.rb
---

## Quick Start

```erb
<%= kui(:input_otp, length: 6, name: "otp_code") do %>
  <%= kui(:input_otp, :group) do %>
    <%= kui(:input_otp, :slot) %>
    <%= kui(:input_otp, :slot) %>
    <%= kui(:input_otp, :slot) %>
  <% end %>
  <%= kui(:input_otp, :separator) %>
  <%= kui(:input_otp, :group) do %>
    <%= kui(:input_otp, :slot) %>
    <%= kui(:input_otp, :slot) %>
    <%= kui(:input_otp, :slot) %>
  <% end %>
<% end %>
```

## Locals

### `input_otp` (root)

| Local | Type | Default | Description |
|---|---|---|---|
| `length` | Integer | `6` | Number of character slots |
| `name` | String | `nil` | Form field name for submission |
| `id` | String | `nil` | ID attribute for the inner input (for label association) |
| `value` | String | `nil` | Pre-filled value |
| `aria_label` | String | `nil` | Accessible label for the inner input |
| `pattern` | String | `"\\d"` | Regex pattern for allowed characters |
| `disabled` | Boolean | `false` | Disables the input |
| `autocomplete` | String | `"one-time-code"` | Autocomplete hint for mobile autofill |
| `css_classes` | String | `""` | Additional CSS classes |

### `input_otp :slot`

| Local | Type | Default | Description |
|---|---|---|---|
| `size` | Symbol | `:md` | Size: `:sm`, `:md`, `:lg` |
| `css_classes` | String | `""` | Additional CSS classes |

### `input_otp :group`

| Local | Type | Default | Description |
|---|---|---|---|
| `css_classes` | String | `""` | Additional CSS classes |

### `input_otp :separator`

| Local | Type | Default | Description |
|---|---|---|---|
| `css_classes` | String | `""` | Additional CSS classes |

## Usage

### Sizes

Pass `size:` to each slot.

```erb
<%= kui(:input_otp, length: 4, name: "pin") do %>
  <%= kui(:input_otp, :group) do %>
    <% 4.times do %>
      <%= kui(:input_otp, :slot, size: :lg) %>
    <% end %>
  <% end %>
<% end %>
```

### With Separator

Group slots and place separators between groups.

```erb
<%= kui(:input_otp, length: 6, name: "code") do %>
  <%= kui(:input_otp, :group) do %>
    <%= kui(:input_otp, :slot) %>
    <%= kui(:input_otp, :slot) %>
  <% end %>
  <%= kui(:input_otp, :separator) %>
  <%= kui(:input_otp, :group) do %>
    <%= kui(:input_otp, :slot) %>
    <%= kui(:input_otp, :slot) %>
  <% end %>
  <%= kui(:input_otp, :separator) %>
  <%= kui(:input_otp, :group) do %>
    <%= kui(:input_otp, :slot) %>
    <%= kui(:input_otp, :slot) %>
  <% end %>
<% end %>
```

### Alphanumeric

Change the `pattern:` to accept letters and numbers.

```erb
<%= kui(:input_otp, length: 6, name: "code", pattern: "[a-zA-Z0-9]") do %>
  <%= kui(:input_otp, :group) do %>
    <% 6.times do %>
      <%= kui(:input_otp, :slot) %>
    <% end %>
  <% end %>
<% end %>
```

### With Field

Wrap in a field for labels and descriptions.

```erb
<%= kui(:field) do %>
  <%= kui(:field, :label) { "Verification Code" } %>
  <%= kui(:input_otp, length: 6, name: "verification_code") do %>
    <%= kui(:input_otp, :group) do %>
      <% 3.times do %>
        <%= kui(:input_otp, :slot) %>
      <% end %>
    <% end %>
    <%= kui(:input_otp, :separator) %>
    <%= kui(:input_otp, :group) do %>
      <% 3.times do %>
        <%= kui(:input_otp, :slot) %>
      <% end %>
    <% end %>
  <% end %>
  <%= kui(:field, :description) { "Enter the 6-digit code sent to your email." } %>
<% end %>
```

### Disabled

```erb
<%= kui(:input_otp, length: 6, name: "otp", disabled: true, value: "123456") do %>
  ...
<% end %>
```

### Form Helpers

The transparent input has the `name:` attribute and submits naturally with Rails forms.

```erb
<%= form_with(model: @verification) do |f| %>
  <%= kui(:input_otp, length: 6, name: "verification[code]") do %>
    ...
  <% end %>
  <%= kui(:button) { "Verify" } %>
<% end %>
```

## Events

The Stimulus controller dispatches custom events on the root element.

| Event | Detail | Description |
|---|---|---|
| `kiso--input-otp:change` | `{ value: string }` | Fired when the value changes |
| `kiso--input-otp:complete` | `{ value: string }` | Fired when all slots are filled |

```erb
<%= kui(:input_otp, length: 6, name: "otp",
    data: { action: "kiso--input-otp:complete->verification#submit" }) do %>
  ...
<% end %>
```

## Theme

```ruby
Kiso::Themes::InputOtp          # Root container
Kiso::Themes::InputOtpGroup     # Group wrapper
Kiso::Themes::InputOtpSlot      # Individual character slot (size axis)
Kiso::Themes::InputOtpSeparator # Separator between groups
```

## Accessibility

| Feature | Implementation |
|---|---|
| Screen reader | Real `<input>` is accessible; visual slots are `aria-hidden` |
| Mobile autofill | `autocomplete="one-time-code"` for SMS codes |
| Numeric keyboard | `inputmode="numeric"` when pattern is digits-only |
| Focus indicator | Active slot shows ring and blinking caret |
| Disabled state | `has-disabled:opacity-50` dims entire component |

### Keyboard

| Key | Action |
|---|---|
| `0-9` / `a-z` | Enter character in current slot, advance to next |
| `Backspace` | Delete previous character, move back |
| `←` / `→` | Navigate between character positions |
| `Ctrl+V` / `Cmd+V` | Paste fills all slots at once |
