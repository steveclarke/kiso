# Calendar — Component Vision

## Current API

Standalone calendar grid wrapping Cally web components. Supports single
date selection, range selection, and multi-month views.

```erb
<%# Single date %>
<%= kui(:calendar, value: Date.today.iso8601) %>

<%# Range selection with two months %>
<%= kui(:calendar, mode: :range, months: 2) %>

<%# Colored variant %>
<%= kui(:calendar, color: :success, variant: :soft, value: "2026-03-15") %>
```

**Locals:** `mode:`, `value:`, `min:`, `max:`, `color:`, `variant:`, `size:`,
`locale:`, `show_outside_days:`, `months:`, `first_day_of_week:`,
`css_classes:`, `**component_options`

## Architecture

- Wraps [Cally](https://wicky.nillia.ms/cally/) web components (`<calendar-date>`, `<calendar-range>`)
- Vendored ESM build in `app/javascript/kiso/vendor/cally.js`
- Styling via `::part()` CSS selectors in `calendar.css`
- Color × variant compound variants set CSS custom properties (`--cally-color`, `--cally-color-fg`)
- Dark mode works automatically via CSS variable swapping

## Key Design Decisions

- **Cally dispatches `change` with `bubbles: false`** — must listen directly
  on the `<calendar-date>` element, not via event delegation or `data-action`
- **`::part()` for Shadow DOM styling** — confirmed in prototype that all
  needed parts are reachable (selected, today, outside, range, disabled)
- **CSS custom properties bridge theme module → CSS** — the Ruby theme sets
  `--cally-color` via Tailwind arbitrary properties, `::part()` rules reference them

## Files

- `lib/kiso/themes/calendar.rb`
- `app/views/kiso/components/_calendar.html.erb`
- `app/assets/tailwind/kiso/calendar.css`
- `app/javascript/kiso/vendor/cally.js`
