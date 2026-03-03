# Input Date — Component Vision

## Current API

Segmented date input with individual month, day, and year fields.
Keyboard-driven: arrow keys increment/decrement, number typing with
auto-advance, tab between segments.

```erb
<%# Empty %>
<%= kui(:input_date, name: "birth_date") %>

<%# With value %>
<%= kui(:input_date, value: Date.today.iso8601, name: "birth_date") %>

<%# In a form with Field wrapper %>
<%= kui(:field) do %>
  <%= kui(:field, :label) { "Birth Date" } %>
  <%= kui(:input_date, name: "person[birth_date]", required: true) %>
<% end %>
```

**Locals:** `value:`, `name:`, `variant:`, `size:`, `required:`, `disabled:`,
`css_classes:`, `**component_options`

## Architecture

- Wrapper styled like `kui(:input)` (same border, ring, focus patterns)
- Three `<span>` segments with `role="spinbutton"` and ARIA attributes
- Stimulus controller (`kiso--input-date`) handles all keyboard interaction:
  - ArrowUp/Down: increment/decrement within valid range (wraps)
  - ArrowRight/Left: navigate between segments
  - Number keys: type-ahead with 800ms buffer, auto-advance on full entry
  - Backspace: clear segment back to placeholder
- Hidden `<input>` syncs combined ISO 8601 value when all segments are filled
- Dispatches `change` event on the controller element

## Key Design Decisions

- **No Cally dependency** — pure Stimulus, no web components. The segmented
  input is a standalone component that doesn't need a calendar grid.
- **MM/DD/YYYY format** — US locale default. Future: locale-aware segment
  ordering (DD/MM/YYYY for EU).
- **`tabular-nums` on segments** — prevents layout shift as digits change.
- **`focus:bg-primary focus:text-primary-foreground`** — focused segment
  uses the primary color, matching the calendar's selected-date styling.

## Files

- `lib/kiso/themes/input_date.rb`
- `app/views/kiso/components/_input_date.html.erb`
- `app/javascript/controllers/kiso/input_date_controller.js`
