import { test, expect } from "../fixtures/index.js"

const BASE = "/preview/kiso/form/slider"

test.describe("Slider component", () => {
  // --- Rendering ---
  test.describe("playground", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("renders with data-slot=slider", async ({ page }) => {
      const slider = page.locator("[data-slot='slider']")
      await expect(slider).toBeVisible()
    })

    test("renders track, range, and thumb sub-parts", async ({ page }) => {
      await expect(page.locator("[data-slot='slider-track']")).toBeVisible()
      await expect(page.locator("[data-slot='slider-range']")).toBeVisible()
      await expect(page.locator("[data-slot='slider-thumb']")).toBeVisible()
    })

    test("thumb has role=slider with ARIA attributes", async ({ page }) => {
      const thumb = page.locator("[data-slot='slider-thumb']")
      await expect(thumb).toHaveAttribute("role", "slider")
      await expect(thumb).toHaveAttribute("aria-valuemin", "0")
      await expect(thumb).toHaveAttribute("aria-valuemax", "100")
      await expect(thumb).toHaveAttribute("aria-valuenow")
    })

    test("contains a hidden range input", async ({ page }) => {
      const input = page.locator("[data-slot='slider'] input[type='range']")
      await expect(input).toHaveCount(1)
    })

    // --- Keyboard ---
    test("ArrowRight increases value by step", async ({ page }) => {
      const thumb = page.locator("[data-slot='slider-thumb']")
      const input = page.locator("[data-slot='slider'] input[type='range']")

      const initialValue = await input.inputValue()
      await thumb.focus()
      await page.keyboard.press("ArrowRight")

      const newValue = await input.inputValue()
      expect(Number(newValue)).toBe(Number(initialValue) + 1)
    })

    test("ArrowLeft decreases value by step", async ({ page }) => {
      const thumb = page.locator("[data-slot='slider-thumb']")
      const input = page.locator("[data-slot='slider'] input[type='range']")

      const initialValue = await input.inputValue()
      await thumb.focus()
      await page.keyboard.press("ArrowLeft")

      const newValue = await input.inputValue()
      expect(Number(newValue)).toBe(Number(initialValue) - 1)
    })

    test("Home jumps to minimum value", async ({ page }) => {
      const thumb = page.locator("[data-slot='slider-thumb']")
      const input = page.locator("[data-slot='slider'] input[type='range']")

      await thumb.focus()
      await page.keyboard.press("Home")

      const value = await input.inputValue()
      expect(Number(value)).toBe(0)
    })

    test("End jumps to maximum value", async ({ page }) => {
      const thumb = page.locator("[data-slot='slider-thumb']")
      const input = page.locator("[data-slot='slider'] input[type='range']")

      await thumb.focus()
      await page.keyboard.press("End")

      const value = await input.inputValue()
      expect(Number(value)).toBe(100)
    })

    test("PageUp increases by 10x step", async ({ page }) => {
      await page.goto(`${BASE}/playground?value=50`)
      const thumb = page.locator("[data-slot='slider-thumb']")
      const input = page.locator("[data-slot='slider'] input[type='range']")

      await thumb.focus()
      await page.keyboard.press("PageUp")

      const value = await input.inputValue()
      expect(Number(value)).toBe(60)
    })

    test("PageDown decreases by 10x step", async ({ page }) => {
      await page.goto(`${BASE}/playground?value=50`)
      const thumb = page.locator("[data-slot='slider-thumb']")
      const input = page.locator("[data-slot='slider'] input[type='range']")

      await thumb.focus()
      await page.keyboard.press("PageDown")

      const value = await input.inputValue()
      expect(Number(value)).toBe(40)
    })

    test("ARIA valuenow updates on keyboard change", async ({ page }) => {
      const thumb = page.locator("[data-slot='slider-thumb']")

      await thumb.focus()
      await page.keyboard.press("End")

      await expect(thumb).toHaveAttribute("aria-valuenow", "100")
    })

    // --- Event dispatch ---
    test("dispatches kiso--slider:change on value change", async ({ page, captureEvent }) => {
      const thumb = page.locator("[data-slot='slider-thumb']")

      await thumb.focus()
      const getValue = await captureEvent("[data-slot='slider']", "kiso--slider:change")
      await page.keyboard.press("End")

      const detail = await getValue()
      expect(detail.value).toBe(100)
    })

    // --- Accessibility ---
    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })

  // --- Sizes ---
  test("renders different sizes", async ({ page }) => {
    await page.goto(`${BASE}/sizes`)
    const sliders = page.locator("[data-slot='slider']")
    await expect(sliders).toHaveCount(3)
  })

  // --- Disabled ---
  test("disabled slider prevents keyboard interaction", async ({ page }) => {
    await page.goto(`${BASE}/disabled`)
    const input = page.locator("[data-slot='slider'] input[type='range']")
    await expect(input).toBeDisabled()

    const thumb = page.locator("[data-slot='slider-thumb']")
    const valueBefore = await input.inputValue()

    // Try keyboard — should not change
    await thumb.focus({ force: true })
    await page.keyboard.press("ArrowRight")
    const valueAfter = await input.inputValue()
    expect(valueAfter).toBe(valueBefore)
  })

  // --- Track click ---
  test("clicking track updates slider value", async ({ page }) => {
    await page.goto(`${BASE}/playground?value=0`)
    const track = page.locator("[data-slot='slider-track']")
    const input = page.locator("[data-slot='slider'] input[type='range']")

    // Click near the middle of the track
    const box = await track.boundingBox()
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)

    const value = Number(await input.inputValue())
    // Should be roughly 50 (mid-point click)
    expect(value).toBeGreaterThan(30)
    expect(value).toBeLessThan(70)
  })
})
