# Date Picker — Component Vision

## Current API

Composes a trigger button, native popover, and calendar for date selection.
Syncs the selected date to a hidden input for form submission.

```erb
<%# Basic %>
<%= kui(:date_picker, name: "event_date") %>

<%# With pre-selected value %>
<%= kui(:date_picker, value: Date.today.iso8601, name: "start_date") %>

<%# In a form with Field wrapper %>
<%= kui(:field) do %>
  <%= kui(:field, :label) { "Event Date" } %>
  <%= kui(:date_picker, name: "event[date]", required: true) %>
<% end %>
```

**Locals:** `value:`, `placeholder:`, `color:`, `variant:`, `size:`, `min:`,
`max:`, `locale:`, `name:`, `required:`, `months:`, `mode:`,
`button_variant:`, `button_size:`, `show_outside_days:`,
`css_classes:`, `**component_options`

## Architecture

- Trigger button uses `kui(:button)` with `popovertarget` attribute
- Popover uses native `[popover]` API + Floating UI for positioning
- Calendar inside popover uses `kui(:calendar)` (Cally web components)
- Stimulus controller (`kiso--date-picker`) wires the flow:
  - Listens for popover `toggle` event to start/stop Floating UI
  - Listens for Cally `change` event via `customElements.whenDefined()`
  - Updates display text via `Intl.DateTimeFormat`
  - Syncs ISO 8601 value to hidden input
  - Closes popover on selection

## Key Design Decisions

- **Native `[popover]` instead of `kui(:popover)`** — lighter, fewer
  dependencies between components. Popover open/close is handled by the
  browser, controller just manages positioning.
- **`customElements.whenDefined()` for Cally event listener** — Stimulus
  controller connects before Cally's custom element upgrades. Must wait
  for the element to be defined before attaching the `change` listener.
- **`SecureRandom.hex(4)` for popover IDs** — supports multiple pickers
  on the same page without ID collisions.

## Files

- `lib/kiso/themes/date_picker.rb`
- `app/views/kiso/components/_date_picker.html.erb`
- `app/javascript/controllers/kiso/date_picker_controller.js`
