import { test, expect } from "../fixtures/index.js"
import { OverlayModel } from "../models/overlay.js"
import { waitForStimulus } from "../helpers/interactions.js"

test.describe("ColorModeSelect component", () => {
  const BASE = "/preview/kiso/color_mode/color_mode_select"

  test.describe("default preview", () => {
    let overlay

    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
      await waitForStimulus(page, "kiso--theme")
      overlay = new OverlayModel(page, "select", { triggerIsButton: true })
    })

    test("renders with data-slot=color-mode-select", async ({ page }) => {
      await expect(page.getByTestId("color-mode-select")).toBeVisible()
    })

    test("has three options: System, Light, Dark", async ({ page }) => {
      await overlay.open()
      const items = page.getByTestId("select-item")
      await expect(items).toHaveCount(3)
      await expect(items.nth(0)).toContainText("System")
      await expect(items.nth(1)).toContainText("Light")
      await expect(items.nth(2)).toContainText("Dark")
    })

    test("selecting Dark adds .dark to <html>", async ({ page }) => {
      const html = page.locator("html")
      await expect(html).not.toHaveClass(/dark/)

      await overlay.open()
      await page.getByTestId("select-item").filter({ hasText: "Dark" }).click()
      await expect(html).toHaveClass(/dark/)
    })

    test("selecting Light removes .dark from <html>", async ({ page }) => {
      const html = page.locator("html")

      // First go dark
      await overlay.open()
      await page.getByTestId("select-item").filter({ hasText: "Dark" }).click()
      await expect(html).toHaveClass(/dark/)

      // Then go light
      await overlay.open()
      await page.getByTestId("select-item").filter({ hasText: "Light" }).click()
      await expect(html).not.toHaveClass(/dark/)
    })

    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })
})
