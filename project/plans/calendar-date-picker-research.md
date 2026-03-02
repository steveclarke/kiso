# Calendar + Date Picker Research

**Issue:** #95
**Date:** 2026-03-02
**Status:** Research complete, strategy recommended

## Goal

Ship `kui(:calendar)` and `kui(:date_picker)` — the last date-related
components from Phase 1. shadcn wraps react-day-picker (React-specific),
so we need a different foundation for a Rails ERB engine.

## Reference Implementations

### shadcn/ui (structural source of truth)

- Calendar wraps **react-day-picker v9.7.0**
- Date Picker is NOT a standalone component — it's a **composition pattern**:
  Button + Popover + Calendar
- CSS variable `--cell-size` drives responsive sizing (default `--spacing(8)`)
- Data attributes for selection states: `data-selected-single`,
  `data-range-start`, `data-range-middle`, `data-range-end`
- Semantic tokens: `bg-primary text-primary-foreground` (selected),
  `bg-accent text-accent-foreground` (today), `text-muted-foreground`
  (outside days, weekday headers)

### Nuxt UI (theming source of truth)

Ships Calendar, InputDate, and InputTime — wraps **Reka UI** (Vue 3
headless primitives). The theme file (`vendor/nuxt-ui/src/theme/calendar.ts`)
provides the exact compound variant formulas we need:

- Full `color × variant` system (solid, outline, soft, subtle) on selected
  date cells
- Size variants: xs (28px), sm (32px), md (36px), lg (40px), xl (44px)
- Slots: root, header, body, heading, grid, gridRow, headCell, cell,
  cellTrigger
- Data attributes: `data-[selected]`, `data-today`, `data-[highlighted]`,
  `data-disabled`, `data-[outside-view]`
- Cell trigger uses `rounded-full` (circular dates)
- Also ships a **segmented date input** (InputDate) with individual
  day/month/year fields

### 37signals

Builds custom date pickers (Basecamp, HEY) with emphasis on accessibility
and month/year dropdown navigation. **None of the code is open-sourced.**

## Library Evaluation

### Recommended: Cally

| | |
|-|-|
| **Package** | [cally](https://www.npmjs.com/package/cally) |
| **GitHub** | [WickyNilliams/cally](https://github.com/WickyNilliams/cally) |
| **Version** | 0.9.2 (Feb 2026, actively maintained) |
| **Size** | ~8.5 KB min+gzip |
| **Dependencies** | Atomico (2.5 KB micro-lib for web components) |
| **License** | MIT |

**What it is:** Web Component calendar library providing custom elements:
`<calendar-date>`, `<calendar-range>`, `<calendar-multi>`,
`<calendar-month>`.

**Why it fits Kiso:**

1. **Web Components work in ERB.** `<calendar-date>` is a standard HTML
   tag — no framework adapter needed.
2. **ESM — importmap + npm dual compatible.** Ships as ES modules. Can be
   pinned via importmap or installed via npm. Matches Kiso's delivery model.
3. **Building blocks, not a full picker.** Provides the calendar grid only.
   You compose your own input, popover, and button. Matches Kiso's
   "composition over configuration" principle.
4. **Native Popover API.** Designed to pair with `[popover]` +
   `popovertarget`. Aligns with Kiso's "native HTML5 first" convention.
5. **Styleable via `::part()`.** daisyUI 5 already ships Cally styles
   using Tailwind — proves the approach works for Tailwind component
   libraries.
6. **Accessible.** Keyboard navigation (arrow keys, page up/down for
   months), ARIA live regions, screen reader support.
7. **Localization via `Intl.DateTimeFormat`.** No locale files to ship.
   Uses the browser's built-in internationalization.
8. **Features:** single date, range, multi-date, multi-month, min/max
   dates, disabled dates (`isDateDisallowed`), RTL support.

**Concerns:**

- Pre-1.0 (0.9.2) — API could change
- Shadow DOM requires `::part()` selectors instead of direct class targeting
- Atomico dependency (not zero-dep, but very small)
- Smaller community than legacy libraries

### Evaluated and Rejected

| Library | Status | Why rejected |
|---------|--------|-------------|
| flatpickr | Dead (last release 2021) | Unmaintained, no ESM support |
| Pikaday | Archived (Aug 2025) | Creator says "use native inputs" |
| stimulus-datepicker | Active (3.6 KB, zero deps) | Monolithic — renders its own UI, can't compose with Kiso's Popover/Button |
| stimulus-flatpickr | Wraps dead library | Dead upstream |
| vanillajs-datepicker | Stale (2023) | Sass-based, Bootstrap heritage |
| Duet Date Picker | Stencil.js web components | Cally supersedes it (same creator lineage) |
| easy-picker | New, limited | No calendar grid, no range selection |

### Native `<input type="date">` Assessment

Not viable as the primary solution for a design system:

- **Calendar popup cannot be styled with CSS** — each browser renders its
  own UI. No `::date-and-time-value` pseudo-element exists (CSSWG #8359
  is unresolved).
- **Safari iOS ignores `min`/`max` attributes** in the picker UI (WebKit
  bug #225639, still open).
- **Firefox lacks `showPicker()` API** — cannot programmatically open the
  picker from a custom trigger button.
- **No range selection**, no multi-month, no disabled dates (only min/max).
- **Open UI** has a datepicker research page but no concrete proposal for
  customizable date inputs. Don't wait for this.

Native inputs are fine for simple forms where visual consistency doesn't
matter. Host apps can use `<input type="date">` directly — Kiso's
components are for when you need the full design system experience.

### Web Standards Update (March 2026)

- **Temporal API:** Shipping in Firefox 139 and Chrome 144. Safari is
  flag-only. Stage 4 pitch at TC39 March 2026 plenary. Not safe without
  polyfill yet, but trajectory is clear — will be universally available
  within 2026. Provides `Temporal.PlainDate`, `PlainDateTime`, etc.
- **Popover API:** Baseline across all browsers. The right foundation for
  custom date picker popups.
- **Customizable `<select>`:** Shipping in Chrome 134+ via
  `appearance: base-select`. Proves the pattern for customizable form
  controls, but date inputs are not close to getting this treatment.

### Date Utility Libraries

For date manipulation in the Stimulus controller:

- **Use `Intl.DateTimeFormat` directly** — zero dependency, Cally already
  uses it internally. Sufficient for formatting display dates.
- **Tempo** (`@formkit/tempo`, 5.2 KB) — if more complex date math is
  needed. Built on Intl, ESM-native, tiny.
- **Avoid:** day.js (ESM issues with importmaps), date-fns (overkill).

## Recommended Architecture

Follow the shadcn composition pattern: Calendar is standalone, Date Picker
composes Calendar + Popover + Input/Button.

### Vendoring Strategy

Follow the Floating UI pattern (see `project/decisions/002-floating-ui-positioning.md`):

1. `npm install --save-dev cally`
2. Copy browser ESM build to `app/javascript/kiso/vendor/cally.js`
3. Pin in engine's `config/importmap.rb`
4. Add as `peerDependencies` in `package.json` for bundler apps
5. Exclude from lint/format configs

### Component: `kui(:calendar)`

- ERB partial wrapping `<calendar-date>` / `<calendar-range>` web components
- Theme module (`lib/kiso/themes/calendar.rb`) with compound variants
  matching Nuxt UI's formula (color × variant for selected cells, size axis)
- CSS file (`app/assets/tailwind/kiso/calendar.css`) using `::part()`
  selectors to apply Kiso semantic tokens to Cally's internal parts
- Props: `mode:` (single/range), `color:`, `variant:`, `size:`, `value:`,
  `min:`, `max:`, `locale:`
- Data attributes: `data-slot="calendar"`

### Component: `kui(:date_picker)`

- Composes `kui(:input)` or `kui(:button)` + `kui(:popover)` +
  `kui(:calendar)`
- Stimulus controller (`kiso--date-picker`) wires:
  - Popover open/close
  - Calendar selection → input value sync
  - Form submission (ISO 8601 value in hidden input)
  - Display formatting via `Intl.DateTimeFormat`
- Props: inherits calendar props + `placeholder:`, `format:`
- Data attributes: `data-slot="date-picker"`

### Accessibility

Follow the W3C APG Date Picker Dialog pattern:
- Grid with `role="grid"` and arrow key navigation (handled by Cally)
- ARIA live regions for month changes (handled by Cally)
- `aria-describedby` for date format hints
- Focus management on popover open/close (Stimulus controller)

## Open Questions

1. **Shadow DOM styling depth** — how much of Cally's internals can we
   reach via `::part()`? Need to prototype to verify we can apply all of
   Nuxt UI's compound variant formulas.
2. **Atomico vendoring** — Cally depends on Atomico. Does the bundled ESM
   include Atomico inline, or do we need to vendor both? Need to check the
   published dist.
3. **Form integration** — how does the web component's value propagate to
   Rails form helpers? Likely needs a hidden `<input>` synced by Stimulus.
4. **Segmented date input** — Nuxt UI has InputDate (day/month/year
   segments). Do we want this for v1, or is a simple text input + calendar
   popover sufficient?
