# Mobile Audit Tool — Design Spec

## Problem

Kiso has 43+ components tested at desktop viewport (1280×720) but zero
automated mobile coverage beyond the dashboard sidebar. Components like
stats-card are known to overflow at narrow widths. There's no systematic
way to find mobile issues across the entire component library.

## Solution

A standalone Playwright Node script that visits every component preview at
mobile viewport width, runs structural checks, takes screenshots, and
produces a self-contained HTML report for human review.

## Scope

**In scope:**
- One-time audit tool for discovering mobile issues
- Automated structural checks (overflow, clipping, touch targets, truncation)
- Screenshot gallery embedded in HTML report
- All 43 components from the existing dark-mode COMPONENTS array

**Out of scope (follow-up work):**
- CI regression tests (extract from audit findings later)
- Multiple viewport sizes (start with 375px, add tablet later)
- Interactive component states (dropdown open, tooltip visible, etc.)
- Fixing the issues found (separate work per component)

## Technical Design

### Script Location

`test/e2e/mobile-audit.js` — standalone Node script using Playwright's
API directly (not a test file). Run with:

```bash
node test/e2e/mobile-audit.js
```

Expects Lookbook running on `localhost:4001` (or `LOOKBOOK_PORT` env var).

### Viewport

375×667 (iPhone SE). Single viewport for the initial audit. Chosen because
it's the narrowest common device — if it works here, wider mobile devices
are fine.

### Component List

Extract the COMPONENTS array into a shared module at
`test/e2e/fixtures/components.js` so both `dark-mode.spec.js` and
`mobile-audit.js` import from one source. When a new component is added,
only one file needs updating.

```javascript
const COMPONENTS = [
  { name: "alert", url: "/preview/kiso/alert/playground" },
  { name: "alert-dialog", url: "/preview/kiso/alert_dialog/playground?open=true" },
  { name: "app", url: "/preview/kiso/layout/app/playground" },
  { name: "aspect-ratio", url: "/preview/kiso/aspect_ratio/playground" },
  { name: "avatar", url: "/preview/kiso/avatar/playground" },
  { name: "badge", url: "/preview/kiso/badge/playground" },
  { name: "breadcrumb", url: "/preview/kiso/breadcrumb/playground" },
  { name: "button", url: "/preview/kiso/button/playground" },
  { name: "card", url: "/preview/kiso/card/playground" },
  { name: "checkbox", url: "/preview/kiso/form/checkbox/with_field" },
  { name: "color-mode-button", url: "/preview/kiso/color_mode/color_mode_button/playground" },
  { name: "color-mode-select", url: "/preview/kiso/color_mode/color_mode_select/playground" },
  { name: "combobox", url: "/preview/kiso/combobox/with_field" },
  { name: "command", url: "/preview/kiso/command/playground" },
  { name: "container", url: "/preview/kiso/layout/container/playground" },
  { name: "dialog", url: "/preview/kiso/dialog/playground?open=true" },
  { name: "dropdown-menu", url: "/preview/kiso/dropdown_menu/basic" },
  { name: "empty", url: "/preview/kiso/empty/with_actions" },
  { name: "field", url: "/preview/kiso/form/field/textarea" },
  { name: "footer", url: "/preview/kiso/layout/footer/playground" },
  { name: "header", url: "/preview/kiso/layout/header/playground" },
  { name: "input", url: "/preview/kiso/form/input/with_field" },
  { name: "select-native", url: "/preview/kiso/form/select_native/with_field" },
  { name: "input-group", url: "/preview/kiso/form/input_group/playground" },
  { name: "input-otp", url: "/preview/kiso/form/input_otp/playground" },
  { name: "kbd", url: "/preview/kiso/kbd/playground" },
  { name: "main", url: "/preview/kiso/layout/main/playground" },
  { name: "page", url: "/preview/kiso/page/page/playground" },
  { name: "pagination", url: "/preview/kiso/pagination/playground" },
  { name: "popover", url: "/preview/kiso/popover/basic" },
  { name: "progress", url: "/preview/kiso/progress/playground" },
  { name: "radio-group", url: "/preview/kiso/form/radio_group/playground" },
  { name: "select", url: "/preview/kiso/form/select/playground" },
  { name: "separator", url: "/preview/kiso/separator/playground" },
  { name: "skeleton", url: "/preview/kiso/skeleton/playground" },
  { name: "slider", url: "/preview/kiso/form/slider/playground" },
  { name: "spinner", url: "/preview/kiso/spinner/playground" },
  { name: "stats-card", url: "/preview/kiso/stats_card/playground" },
  { name: "switch", url: "/preview/kiso/form/switch/playground" },
  { name: "table", url: "/preview/kiso/table/playground" },
  { name: "textarea", url: "/preview/kiso/form/textarea/with_field" },
  { name: "toggle", url: "/preview/kiso/toggle/playground" },
  { name: "toggle-group", url: "/preview/kiso/toggle_group/playground" },
  { name: "tooltip", url: "/preview/kiso/tooltip/playground" },
]
```

### Structural Checks

Four automated checks run against each component at mobile viewport:

#### 1. Horizontal Overflow

```javascript
const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
const viewportWidth = 375
if (scrollWidth > viewportWidth) {
  findings.push({
    type: "overflow",
    severity: "error",
    message: `Horizontal overflow: ${scrollWidth - viewportWidth}px beyond viewport`,
  })
}
```

#### 2. Elements Outside Viewport

Find all `[data-slot]` elements and check bounding boxes:

```javascript
const slots = await page.locator("[data-slot]").all()
for (const slot of slots) {
  const box = await slot.boundingBox()
  if (box && (box.x + box.width > viewportWidth + 1)) {
    const slotName = await slot.getAttribute("data-slot")
    findings.push({
      type: "clipping",
      severity: "warning",
      message: `[data-slot="${slotName}"] extends ${Math.round(box.x + box.width - viewportWidth)}px past viewport`,
    })
  }
}
```

#### 3. Touch Target Size

Check interactive elements are at least 44×44px:

```javascript
const interactiveSelector = "button, a, input, select, textarea, " +
  "[role='button'], [role='checkbox'], [role='radio'], [role='switch'], " +
  "[role='tab'], [role='menuitem'], [role='option']"

const elements = await page.locator(interactiveSelector).all()
for (const el of elements) {
  if (!(await el.isVisible())) continue
  const box = await el.boundingBox()
  if (box && (box.width < 44 || box.height < 44)) {
    const tag = await el.evaluate(e => `<${e.tagName.toLowerCase()}${e.dataset.slot ? ` data-slot="${e.dataset.slot}"` : ""}>`)
    findings.push({
      type: "touch-target",
      severity: "warning",
      message: `${tag} is ${Math.round(box.width)}×${Math.round(box.height)}px (minimum 44×44)`,
    })
  }
}
```

#### 4. Text Truncation Without Overflow Handling

```javascript
const textElements = await page.locator("[data-slot]").all()
for (const el of textElements) {
  const overflow = await el.evaluate(e => {
    const style = getComputedStyle(e)
    return {
      scrollWidth: e.scrollWidth,
      clientWidth: e.clientWidth,
      overflowX: style.overflowX,
      textOverflow: style.textOverflow,
      slot: e.dataset.slot,
    }
  })
  if (overflow.scrollWidth > overflow.clientWidth + 1 &&
      overflow.overflowX !== "hidden" &&
      overflow.overflowX !== "scroll" &&
      overflow.overflowX !== "auto" &&
      overflow.overflowX !== "clip") {
    findings.push({
      type: "truncation",
      severity: "warning",
      message: `[data-slot="${overflow.slot}"] text overflows by ${overflow.scrollWidth - overflow.clientWidth}px without overflow handling`,
    })
  }
}
```

### Screenshot Capture

Screenshot of each component preview, clipped to max 2000px height to keep
report size manageable. JPEG format for smaller file size (UI content
compresses well). Embedded as base64 data URIs for a self-contained report.

```javascript
const screenshot = await page.screenshot({
  fullPage: true,
  type: "jpeg",
  quality: 80,
  clip: { x: 0, y: 0, width: 375, height: Math.min(2000, fullHeight) },
})
const base64 = screenshot.toString("base64")
```

### HTML Report

Output: `tmp/mobile-audit.html` — self-contained, no external dependencies.

Structure:
- **Summary bar** — total components, issue counts per category, timestamp
- **Component cards** — sorted with flagged components first, clean components below
- Each card shows: component name, embedded screenshot, list of findings
  with severity badges (red for error, amber for warning), or green
  "no issues" badge
- **Jump links** — summary links to flagged components for quick navigation
- Inline CSS using a clean, minimal design

### Script Flow

```
1. Launch Chromium browser (headless)
2. Set viewport to 375×667
3. Pre-flight check: hit Lookbook root URL, exit with clear error if not running
4. For each component (wrapped in try/catch — failures recorded, don't crash):
   a. Navigate to Lookbook preview URL (10s timeout)
   b. Wait for first [data-slot] element to appear (component rendered)
   c. Run 4 structural checks, collect findings
   d. Take full-page screenshot (clipped to max 2000px height)
   e. Store results
5. Sort results: components with findings first
6. Generate HTML report with JPEG screenshots (smaller than PNG)
7. Write to tmp/mobile-audit.html
8. Print summary to stdout (X components, Y issues found)
```

Expected runtime: ~1-2 minutes for 43 components.

### Dependencies

- `playwright` (already installed)
- `fs` and `path` (Node built-ins)
- No new npm dependencies

### File Structure

```
test/e2e/fixtures/components.js  # Shared COMPONENTS array (new, imported by dark-mode + audit)
test/e2e/mobile-audit.js         # The audit script
tmp/mobile-audit.html            # Generated report (gitignored)
```

`tmp/` should already be in `.gitignore`. If not, the report file itself
should be gitignored — it's a generated artifact.

## Known Limitations

- **Touch target check is conservative.** `boundingBox()` measures the CSS
  box, not the effective tap area (which can be larger via padding or
  pseudo-elements). Expect some false positives — the report is for human
  triage, not a pass/fail gate.
- **Clipping check doesn't account for intentional `overflow: hidden`
  ancestors.** An element clipped by a scrollable container (correct
  behavior) will still be flagged. Again, human judgment required.
- **Lookbook preview padding.** The `/preview/` URLs serve component content
  directly (no Lookbook chrome/iframe), but Lookbook may add its own body
  padding. This could inflate overflow measurements slightly. Checks measure
  against the document, so preview wrapper padding is included.
- **Light mode only.** Dark mode could surface different mobile issues but
  is deferred to keep the initial audit focused.

## Future Work

Once the audit identifies issues and they're fixed:

1. **Extract regression tests** — pull the structural checks into a proper
   Playwright test file (`test/e2e/mobile.spec.js`) that runs in CI,
   following the dark-mode.spec.js pattern
2. **Add tablet viewport** — 768×1024 as a second pass
3. **Interactive states** — open dropdowns, trigger tooltips, expand
   collapsibles before checking
4. **Per-component baselines** — visual regression via
   `expect(page).toHaveScreenshot()` once mobile rendering is stable
