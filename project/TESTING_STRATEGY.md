# Testing Strategy

How Kiso tests components. Every component ships with tests — no exceptions.

## Two Test Layers

**Vitest** — unit tests for JS utility functions (`test/javascript/`).
Pure logic only, runs in jsdom, ~400ms total.

**Playwright** — E2E tests against Lookbook previews (`test/e2e/`).
Real browser, real DOM, real Stimulus controllers. This is where component
tests live.

Why Playwright for components (not jsdom/Vitest): Kiso components are
server-rendered ERB + Stimulus. Testing them means rendering real HTML in a
real browser where Stimulus connects, CSS loads, and native HTML5 behaviors
work. jsdom can't do this. The Lookbook previews already render every
component at known URLs — Playwright navigates to them and asserts.

## Component Test Tiers

Every component falls into one of three tiers based on complexity. Higher
tiers include all tests from lower tiers.

### Tier 1: Static Components (render-only, no JS)

Components: alert, badge, breadcrumb, button, card, empty, field,
input_group, kbd, label, pagination, separator, stats_card, table

**Required tests:**

| Category | What to test | Example assertion |
|----------|-------------|-------------------|
| **Renders** | `data-slot` present, element visible | `expect(locator).toHaveAttribute("data-slot", "badge")` |
| **Content** | Text/children render correctly | `expect(locator).toContainText("Badge")` |
| **Variants** | Representative color/variant/size combos render via query params | Navigate to `?color=success&variant=solid`, assert visible |
| **Composition** | Sub-parts have correct `data-slot` nesting (compound components) | `expect(page.locator("[data-slot='card-header']")).toBeVisible()` |
| **Accessibility** | axe-core WCAG 2.1 AA scan passes | `expect(results.violations).toEqual([])` |

### Tier 2: Native-Interactive (HTML5 behavior, no Stimulus)

Components: checkbox, input, radio_group, switch, textarea

Everything from Tier 1, plus:

| Category | What to test | Example assertion |
|----------|-------------|-------------------|
| **State** | Checked/unchecked, selected, value changes | Click checkbox, assert `checked` property |
| **Disabled** | Disabled state prevents interaction | Assert element has `disabled` attribute, click does nothing |

### Tier 3: Stimulus-Interactive (the critical tier)

Components: combobox, command, command_dialog, dropdown_menu, popover,
select, toggle, toggle_group

Everything from Tier 1, plus:

| Category | What to test | Example assertion |
|----------|-------------|-------------------|
| **Open/Close** | Click trigger opens, Escape closes, click outside closes | Click trigger, assert content visible; press Escape, assert content hidden |
| **Keyboard** | Arrow keys, Enter/Space, Tab, Home/End as applicable | Focus trigger, press ArrowDown, assert first item highlighted |
| **Focus** | Focus moves to content on open, returns to trigger on close | Open, assert `activeElement` is inside content; close, assert focus on trigger |
| **ARIA state** | `aria-expanded`, `aria-pressed`, `aria-selected`, `data-state` update correctly | Open dropdown, assert `aria-expanded="true"` on trigger |
| **Selection** | Selecting items updates value display + hidden input (select/combobox) | Click item, assert trigger text changed, hidden input value updated |

**This tier catches the regressions that triggered this initiative** — popover
not opening, dropdown keyboard nav broken, etc.

## Test File Structure

One `.spec.js` file per component in `test/e2e/components/`:

```
test/
├── e2e/
│   ├── components/
│   │   ├── badge.spec.js         # Tier 1
│   │   ├── combobox.spec.js      # Tier 3
│   │   ├── dropdown-menu.spec.js # Tier 3
│   │   └── ...
│   └── fixtures/
│       └── axe-fixture.js        # Shared WCAG 2.1 AA checker
├── javascript/
│   └── utils/
│       ├── focusable.spec.js     # Vitest
│       └── highlight.spec.js     # Vitest
```

File naming: kebab-case, `.spec.js` suffix, one file per component.

## Test Template

Every component test file follows this structure:

```javascript
import { test, expect } from "@playwright/test"
import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/{component}"

test.describe("{ComponentName} component", () => {
  // --- Rendering ---
  test("renders with correct data-slot", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    await expect(page.locator("[data-slot='{component}']")).toBeVisible()
  })

  // --- Variants (if applicable) ---
  test("renders all variants", async ({ page }) => {
    await page.goto(`${BASE}/variants`)
    // assert expected count or structure
  })

  // --- Interaction (Tier 2-3 only) ---
  // Open/close, keyboard, focus, selection...

  // --- Accessibility (always last) ---
  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
```

## Lookbook Preview URL Pattern

Tests navigate to Lookbook preview URLs:

```
/preview/kiso/{component}/{scenario}
```

Parameterized scenarios accept query params matching `@param` annotations:

```
/preview/kiso/badge/playground?color=success&variant=solid&size=lg
```

## axe-core Configuration

The shared `checkA11y()` fixture disables `document-title` and `html-has-lang`
rules — these are Lookbook preview layout issues, not component concerns.

## Running Tests

```bash
npm run test:unit          # Vitest (JS utils)
npm run test:e2e           # Playwright (all browsers)
npm run test:e2e:ui        # Playwright GUI
npm run test:e2e:headed    # Playwright with visible browsers
```

Playwright requires `bin/dev` running (or starts its own server via
`webServer` config). Locally it reuses an existing server; in CI it starts
one automatically.

## CI

- **Vitest**: `test-js` job in `.github/workflows/ci.yml` (~15s)
- **Playwright**: `.github/workflows/playwright.yml` with 3-browser matrix
  (Chromium, Firefox, WebKit, ~1m each)

## When to Write Tests

Tests are part of the component creation workflow. A component is not done
until it has a test file covering its tier. The component-builder agent
writes tests. The component-reviewer agent verifies they exist and cover
the right tier.
