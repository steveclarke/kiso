import { test, expect } from "../fixtures/index.js"

test.describe("Toggle component", () => {
  const BASE = "/preview/kiso/toggle"

  test.describe("playground", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("renders with data-slot=toggle", async ({ page }) => {
      const toggle = page.getByTestId("toggle")
      await expect(toggle).toBeVisible()
    })

    test("starts in off state", async ({ page }) => {
      const toggle = page.getByTestId("toggle")
      await expect(toggle).toHaveAttribute("data-state", "off")
      await expect(toggle).toHaveAttribute("aria-pressed", "false")
    })

    test("toggles to on state on click", async ({ page }) => {
      const toggle = page.getByTestId("toggle")
      await toggle.click()
      await expect(toggle).toHaveAttribute("data-state", "on")
      await expect(toggle).toHaveAttribute("aria-pressed", "true")
    })

    test("toggles back to off on second click", async ({ page }) => {
      const toggle = page.getByTestId("toggle")
      await toggle.click()
      await toggle.click()
      await expect(toggle).toHaveAttribute("data-state", "off")
      await expect(toggle).toHaveAttribute("aria-pressed", "false")
    })

    test("activates with Enter key", async ({ page }) => {
      const toggle = page.getByTestId("toggle")
      await toggle.focus()
      await page.keyboard.press("Enter")
      await expect(toggle).toHaveAttribute("data-state", "on")
    })

    test("activates with Space key", async ({ page }) => {
      const toggle = page.getByTestId("toggle")
      await toggle.focus()
      await page.keyboard.press("Space")
      await expect(toggle).toHaveAttribute("data-state", "on")
    })

    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })
})
