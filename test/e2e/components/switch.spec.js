import { test, expect } from "../fixtures/index.js"

test.describe("Switch component", () => {
  const BASE = "/preview/kiso/form/switch"

  test.describe("playground", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("renders with data-slot=switch", async ({ page }) => {
      const switchEl = page.getByTestId("switch")
      await expect(switchEl).toBeVisible()
    })

    test("has role=switch on the input", async ({ page }) => {
      const input = page.locator("[data-slot='switch'] input[role='switch']")
      await expect(input).toHaveCount(1)
    })

    test("click toggles on and off", async ({ page }) => {
      const switchEl = page.getByTestId("switch")
      const input = switchEl.locator("input[role='switch']")

      // Starts unchecked
      await expect(input).not.toBeChecked()

      // Click to toggle on
      await switchEl.click()
      await expect(input).toBeChecked()

      // Click to toggle off
      await switchEl.click()
      await expect(input).not.toBeChecked()
    })

    test("keyboard Space toggles switch", async ({ page }) => {
      const switchEl = page.getByTestId("switch")
      const input = switchEl.locator("input[role='switch']")

      // Focus the input and press Space
      await input.focus()
      await page.keyboard.press("Space")
      await expect(input).toBeChecked()

      // Press Space again to toggle off
      await page.keyboard.press("Space")
      await expect(input).not.toBeChecked()
    })

    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })

  test("disabled switch is not interactive", async ({ page }) => {
    await page.goto(`${BASE}/disabled`)
    const firstSwitch = page.getByTestId("switch").first()
    const input = firstSwitch.locator("input[role='switch']")

    await expect(input).toBeDisabled()
    await expect(input).not.toBeChecked()

    // Click should not toggle
    await firstSwitch.click({ force: true })
    await expect(input).not.toBeChecked()
  })

  test("renders with different colors", async ({ page }) => {
    await page.goto(`${BASE}/playground?color=success&checked=true`)
    const switchEl = page.getByTestId("switch")
    await expect(switchEl).toBeVisible()
  })
})
