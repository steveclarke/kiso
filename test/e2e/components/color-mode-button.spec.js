import { test, expect } from "../fixtures/index.js"
import { waitForStimulus } from "../helpers/interactions.js"

test.describe("ColorModeButton component", () => {
  const BASE = "/preview/kiso/color_mode/color_mode_button"

  test.describe("default preview", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
      await waitForStimulus(page, "kiso--theme")
    })

    test("renders with data-slot=color-mode-button", async ({ page }) => {
      await expect(page.getByTestId("color-mode-button")).toBeVisible()
    })

    test("has accessible label", async ({ page }) => {
      await expect(page.getByTestId("color-mode-button")).toHaveAttribute(
        "aria-label",
        "Toggle color mode",
      )
    })

    test("toggles .dark on <html> when clicked", async ({ page }) => {
      const button = page.getByTestId("color-mode-button")
      const html = page.locator("html")

      // Starts light (no .dark)
      await expect(html).not.toHaveClass(/dark/)

      // Click to go dark
      await button.click()
      await expect(html).toHaveClass(/dark/)

      // Click again to go light
      await button.click()
      await expect(html).not.toHaveClass(/dark/)
    })

    test("light icon visible in light mode, hidden in dark", async ({ page }) => {
      const button = page.getByTestId("color-mode-button")
      const lightIcon = page.locator("[data-slot='color-mode-icon-light']")
      const darkIcon = page.locator("[data-slot='color-mode-icon-dark']")

      // Light mode: sun visible, moon hidden
      await expect(lightIcon).toBeVisible()
      await expect(darkIcon).not.toBeVisible()

      // Toggle to dark
      await button.click()

      // Dark mode: moon visible, sun hidden
      await expect(darkIcon).toBeVisible()
      await expect(lightIcon).not.toBeVisible()
    })

    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })
})
