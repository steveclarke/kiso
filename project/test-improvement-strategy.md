# Playwright Test Suite Improvement Strategy

## Current State

**26 E2E spec files | 284 tests | 2,806 lines | 1 fixture | 2 unit tests**

The test suite is functionally solid — every component has coverage, a11y is
tested via axe, keyboard navigation is thorough for interactive components, and
multi-browser testing (Chromium/Firefox/WebKit) is in place. The foundation is
good. But as the component count grows, the current patterns will create
significant maintenance burden due to copy-paste duplication.

### What We Do Well
- Full test isolation (`fullyParallel: true`)
- Web-first assertions throughout (auto-retrying `await expect()`)
- Consistent file structure (every spec follows the same shape)
- axe-core a11y integration with WCAG 2.1 AA tags
- Multi-browser CI config with retries and trace-on-failure
- Good behavioral coverage for interactive components

### What Needs Improvement
- **Zero shared abstractions** beyond `checkA11y()` — every test is fully inline
- **Zero use of `beforeEach`** — 284 individual `page.goto()` calls
- **Zero nested describes** — 27-test files are flat lists
- **Zero page objects or component models** — same locators rebuilt in every test
- **Zero custom fixtures** — `checkA11y` is a plain import, not a fixture
- **100% raw CSS selectors** — no `getByRole`, `getByTestId`, or locator helpers
- **Inconsistent patterns** — outside-click uses both `{x:0,y:0}` and `{x:10,y:10}`

---

## Strategy: Three Layers of Improvement

### Layer 1: Infrastructure (do first)

These changes create the foundation that all tests build on. No test behavior
changes — just better plumbing.

#### 1a. Custom test fixture with `test.extend()`

Replace the plain `checkA11y` import with a proper Playwright fixture. This
unlocks injecting shared helpers into any test without manual imports.

```javascript
// test/e2e/fixtures/index.js
import { test as base, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

export const test = base.extend({
  /**
   * Accessibility checker fixture. Injected into any test that
   * destructures it. Configured for WCAG 2.1 AA with Lookbook
   * exclusions baked in.
   */
  checkA11y: async ({ page }, use) => {
    const check = async ({ exclude = [], include } = {}) => {
      let builder = new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .disableRules(["document-title", "html-has-lang", ...exclude])
      if (include) builder = builder.include(include)
      return builder.analyze()
    }
    await use(check)
  },

  /**
   * Capture a Stimulus custom event dispatched on a selector.
   * Returns a function that resolves to the event detail value.
   */
  captureEvent: async ({ page }, use) => {
    const capture = async (selector, eventName) => {
      await page.evaluate(
        ([sel, evt]) => {
          window.__capturedEvent = null
          document.querySelector(sel).addEventListener(
            evt,
            (e) => { window.__capturedEvent = e.detail },
            { once: true },
          )
        },
        [selector, eventName],
      )
      return async () => page.evaluate(() => window.__capturedEvent)
    }
    await use(capture)
  },
})

export { expect }
```

**All spec files change their import from:**
```javascript
import { test, expect } from "@playwright/test"
import { checkA11y } from "../fixtures/axe-fixture.js"
```
**To:**
```javascript
import { test, expect } from "../fixtures/index.js"
```

#### 1b. Configure `testIdAttribute` in Playwright config

```javascript
// playwright.config.js
use: {
  baseURL: BASE_URL,
  testIdAttribute: "data-slot",   // <-- add this
  trace: "on-first-retry",
  screenshot: "only-on-failure",
},
```

This enables `page.getByTestId("badge")` as shorthand for
`page.locator("[data-slot='badge']")`. Both continue to work — this is
purely additive. We can migrate locators incrementally.

#### 1c. Shared helper utilities

```javascript
// test/e2e/helpers/interactions.js

/**
 * Click outside any component to dismiss overlays.
 * Uses a consistent position to avoid flaky coordinate-dependent behavior.
 */
export async function clickOutside(page) {
  await page.locator("body").click({ position: { x: 1, y: 1 } })
}

/**
 * Wait for Stimulus controllers to connect after navigation.
 * Needed for components that depend on Stimulus connect() timing.
 */
export async function waitForStimulus(page, controller = "kiso--") {
  await page.waitForFunction(
    (prefix) => document.querySelector(`[data-controller*="${prefix}"]`) !== null,
    controller,
    { timeout: 5000 },
  )
}
```

---

### Layer 2: Component Models (do second)

Page Object Models scoped to interactive component archetypes. Not one POM per
component — one POM per **behavioral pattern**, since many components share
the same open/close/navigate/select interaction model.

#### Identified archetypes:

| Archetype | Components | Shared behavior |
|-----------|-----------|----------------|
| **Listbox** | Select, Combobox | Open, close, navigate items, select, hidden input |
| **Menu** | DropdownMenu | Open, close, navigate items, activate, checkbox/radio items |
| **Overlay** | Popover, CommandDialog | Open, close, focus trap, escape, outside click |
| **Command** | Command, CommandDialog | Filter, navigate, select, groups, empty state |
| **Toggle** | Checkbox, Switch, Toggle | Click toggle, keyboard toggle, checked state |
| **Static** | Badge, Alert, Card, Table, Separator, Kbd, Empty, StatsCard | Renders, slot presence, a11y |

#### Example: Overlay model

```javascript
// test/e2e/models/overlay.js

/**
 * Shared interaction model for overlay components (Popover, CommandDialog,
 * DropdownMenu). Encapsulates the open/close/escape/outside-click pattern
 * that is identical across all overlay-type components.
 */
export class OverlayModel {
  /**
   * @param {import("@playwright/test").Page} page
   * @param {string} slotPrefix - e.g. "popover", "dropdown-menu"
   */
  constructor(page, slotPrefix) {
    this.page = page
    this.root = page.locator(`[data-slot='${slotPrefix}']`)
    this.trigger = page.locator(`[data-slot='${slotPrefix}-trigger']`)
    this.triggerButton = this.trigger.locator("button")
    this.content = page.locator(`[data-slot='${slotPrefix}-content']`)
  }

  async open() {
    await this.trigger.click()
    await expect(this.content).toBeVisible()
  }

  async close() {
    await this.page.keyboard.press("Escape")
    await expect(this.content).toBeHidden()
  }

  async expectClosed() {
    await expect(this.content).toBeHidden()
    await expect(this.triggerButton).toHaveAttribute("aria-expanded", "false")
  }

  async expectOpen() {
    await expect(this.content).toBeVisible()
    await expect(this.triggerButton).toHaveAttribute("aria-expanded", "true")
  }
}
```

#### Example: Listbox model (for Select + Combobox)

```javascript
// test/e2e/models/listbox.js
import { expect } from "../fixtures/index.js"

/**
 * Shared interaction model for listbox-pattern components (Select, Combobox).
 * Encapsulates item navigation, selection, highlight tracking, and value
 * assertion patterns shared between these components.
 */
export class ListboxModel {
  constructor(page, slotPrefix) {
    this.page = page
    this.content = page.locator(`[data-slot='${slotPrefix}-content']`)
    this.items = page.locator(`[data-slot='${slotPrefix}-item']`)
  }

  /** Get the currently highlighted item */
  highlighted() {
    return this.items.locator("[data-highlighted]")
  }

  /** Navigate down N times */
  async arrowDown(n = 1) {
    for (let i = 0; i < n; i++) {
      await this.page.keyboard.press("ArrowDown")
    }
  }

  /** Navigate up N times */
  async arrowUp(n = 1) {
    for (let i = 0; i < n; i++) {
      await this.page.keyboard.press("ArrowUp")
    }
  }

  /** Assert item at index is highlighted */
  async expectHighlighted(index) {
    await expect(this.items.nth(index)).toHaveAttribute("data-highlighted", "")
  }

  /** Assert item at index is NOT highlighted */
  async expectNotHighlighted(index) {
    await expect(this.items.nth(index)).not.toHaveAttribute("data-highlighted")
  }

  /** Select by keyboard (Enter on highlighted item) */
  async selectHighlighted() {
    await this.page.keyboard.press("Enter")
  }

  /** Select by clicking item with given data-value */
  async selectByValue(value) {
    await this.items.locator(`[data-value='${value}']`).click()
  }
}
```

**These models don't replace tests — they simplify them.** A combobox test goes from:

```javascript
// Before (14 lines)
test("ArrowDown navigates to next item", async ({ page }) => {
  await page.goto(`${BASE}/playground`)
  const input = page.locator("[data-slot='combobox-input'] input")
  await input.focus()
  const items = page.locator("[data-slot='combobox-item']")
  await expect(items.nth(0)).toHaveAttribute("data-highlighted", "")
  await page.keyboard.press("ArrowDown")
  await expect(items.nth(1)).toHaveAttribute("data-highlighted", "")
  await expect(items.nth(0)).not.toHaveAttribute("data-highlighted", "")
})
```

To:

```javascript
// After (7 lines)
test("ArrowDown navigates to next item", async ({ page }) => {
  await listbox.expectHighlighted(0)
  await listbox.arrowDown()
  await listbox.expectHighlighted(1)
  await listbox.expectNotHighlighted(0)
})
```

---

### Layer 3: Test Organization (do third)

Once infrastructure and models are in place, reorganize the test files.

#### 3a. Use `beforeEach` for shared navigation

Files where 80%+ of tests navigate to the same URL get a `beforeEach`:

| File | Same-URL tests | Total | % |
|------|---------------|-------|---|
| command-dialog | 13 | 13 | 100% |
| combobox | 24 | 27 | 89% |
| select | 23 | 25 | 92% |
| dropdown-menu | 22 | 27 | 81% |
| command | 17 | 19 | 89% |
| toggle-group | 16 | 20 | 80% |
| popover | 13 | 15 | 87% |

Tests that need a different URL either get a nested describe with their own
`beforeEach`, or override inline.

#### 3b. Nested describes for complex files

Group tests by behavior category within each component:

```javascript
test.describe("Select component", () => {
  const BASE = "/preview/kiso/form/select"

  test.describe("rendering", () => {
    test.beforeEach(({ page }) => page.goto(`${BASE}/playground`))
    test("renders with data-slot=select", ...)
    test("shows placeholder text", ...)
    test("content has role=listbox", ...)
    test("items have role=option", ...)
  })

  test.describe("open/close", () => {
    test.beforeEach(({ page }) => page.goto(`${BASE}/playground`))
    test("click trigger opens", ...)
    test("Escape closes without selecting", ...)
    test("outside click closes", ...)
  })

  test.describe("keyboard navigation", () => {
    test.beforeEach(({ page }) => page.goto(`${BASE}/playground`))
    test("ArrowDown navigates to next item", ...)
    test("ArrowUp navigates to previous item", ...)
    test("Home jumps to first", ...)
    test("End jumps to last", ...)
  })

  test.describe("selection", () => {
    test.beforeEach(({ page }) => page.goto(`${BASE}/playground`))
    test("click selects and closes", ...)
    test("Enter selects highlighted", ...)
    test("Space selects highlighted", ...)
    test("updates trigger text", ...)
    test("updates hidden input", ...)
    test("shows check indicator", ...)
  })

  test.describe("variants", () => {
    test("disabled trigger does not open", ...)
    test("renders groups with labels", ...)
  })

  test.describe("accessibility", () => {
    test("passes WCAG 2.1 AA", ...)
  })
})
```

#### 3c. Standardize the separator spec

`separator.spec.js` is the only file missing the canonical "renders with
data-slot" test and the a11y test. Bring it in line.

---

## Deferred: Not In Scope For This Pass

These are valuable but should be separate efforts:

### Visual regression testing (`toHaveScreenshot()`)

Would catch styling regressions for static components (Badge, Alert, Card).
Requires golden image management and platform-specific snapshots. Consider
for a follow-up issue. The Radix Themes pattern (one screenshot per
component "sink" page) is the right approach for a component library.

### Dark mode E2E testing

No tests currently verify dark mode rendering. Would need a fixture that
toggles `.dark` on `<html>` before assertions. Worth a dedicated issue.

### ARIA snapshot assertions (`toMatchAriaSnapshot()`)

Available since Playwright 1.49. Would let us snapshot the full accessible
tree structure of each component instead of individual attribute assertions.
Powerful but requires careful adoption — snapshot drift can be noisy. Evaluate
after the infrastructure layer is in place.

### `toContainClass()` assertions (Playwright 1.52+)

Could verify that variant classes are applied correctly without relying on
visual checks. Useful for testing the theme system, but tangential to the
structural improvements above.

### Responsive/viewport testing

No tests currently resize the viewport. Dashboard layout components would
benefit from mobile viewport tests. Separate effort.

---

## Implementation Plan

### Phase 1: Infrastructure (non-breaking)

Create new files, no existing test changes yet.

1. Create `test/e2e/fixtures/index.js` with extended `test` + `checkA11y` fixture
2. Create `test/e2e/helpers/interactions.js` with `clickOutside`, `waitForStimulus`
3. Add `testIdAttribute: "data-slot"` to `playwright.config.js`
4. Run full test suite — everything still passes (additive only)

### Phase 2: Component Models (non-breaking)

Create model files, no existing test changes yet.

1. Create `test/e2e/models/overlay.js` (Popover, DropdownMenu, CommandDialog)
2. Create `test/e2e/models/listbox.js` (Select, Combobox)
3. Create `test/e2e/models/command.js` (Command, CommandDialog)
4. Create `test/e2e/models/toggle.js` (Checkbox, Switch, Toggle)

### Phase 3: Migrate specs (batch by archetype)

Refactor existing specs to use the new infrastructure. Do in batches so we
can verify each group passes before moving to the next.

**Batch A — Static components (simplest, lowest risk):**
Badge, Alert, Card, Separator, Table, Empty, StatsCard, Kbd, Breadcrumb,
Input, Textarea, InputGroup, Field

Changes: import from fixtures, `beforeEach` where applicable, standardize
separator spec.

**Batch B — Toggle components:**
Checkbox, Switch, Toggle, ToggleGroup, RadioGroup

Changes: import from fixtures, use toggle model, `beforeEach`, nested describes.

**Batch C — Interactive overlay components (most complex):**
Select, Combobox, DropdownMenu, Popover, Command, CommandDialog, Pagination

Changes: import from fixtures, use overlay/listbox/command models,
`beforeEach`, nested describes, replace `captureEvent` pattern.

### Phase 4: Verify and clean up

1. Run full suite across all 3 browsers
2. Remove old `axe-fixture.js` (replaced by fixtures/index.js)
3. Verify CI passes
4. Update MEMORY.md with new test conventions

---

## Expected Impact

| Metric | Before | After (est.) |
|--------|--------|-------------|
| Total lines | 2,806 | ~2,000 (-29%) |
| Inline `page.goto()` calls | 284 | ~40 |
| Repeated locator definitions | ~500 | ~80 |
| Files importing raw `@playwright/test` | 26 | 0 |
| Shared abstractions | 1 (checkA11y) | 8+ (fixtures, models, helpers) |
| Nested describe blocks | 0 | ~30 |
| `beforeEach` hooks | 0 | ~25 |

The test count stays the same (284 tests). No behavioral changes. The suite
becomes more maintainable and establishing clear patterns for every new
component that gets added.
