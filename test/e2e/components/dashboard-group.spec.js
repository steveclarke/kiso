import { test, expect } from "../fixtures/index.js"
import { waitForStimulus } from "../helpers/interactions.js"

test.describe("DashboardGroup component", () => {
  const BASE = "/preview/kiso/dashboard/dashboard_group"

  test.describe("sidebar state variants", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
      await waitForStimulus(page, "kiso--sidebar")
    })

    test("kui-sidebar-open:lg:hidden hides element when sidebar is open", async ({ page }) => {
      const logo = page.locator(".kui-sidebar-open\\:lg\\:hidden")

      // Playground starts with sidebar open — logo should be hidden
      await expect(logo).toBeHidden()
    })

    test("kui-sidebar-open:lg:hidden shows element when sidebar is closed", async ({ page }) => {
      const collapse = page.getByTestId("dashboard-sidebar-collapse")
      const logo = page.locator(".kui-sidebar-open\\:lg\\:hidden")

      // Playground starts with sidebar open — collapse to close it
      await collapse.click()
      await expect(logo).toBeVisible()
    })

    test("toggling sidebar toggles variant visibility", async ({ page }) => {
      const collapse = page.getByTestId("dashboard-sidebar-collapse")
      const logo = page.locator(".kui-sidebar-open\\:lg\\:hidden")

      // Starts open — logo hidden
      await expect(logo).toBeHidden()

      // Close sidebar — logo visible
      await collapse.click()
      await expect(logo).toBeVisible()

      // Re-open sidebar — logo hidden again
      await collapse.click()
      await expect(logo).toBeHidden()
    })
  })

  test.describe("custom toggle icon", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/custom_toggle_icons`)
      await waitForStimulus(page, "kiso--sidebar")
    })

    test("renders custom icon from block override", async ({ page }) => {
      const toggle = page.getByTestId("dashboard-sidebar-toggle")
      const svg = toggle.locator("svg")

      // Block override adds size-4 class; default icon does not have it
      await expect(svg).toBeVisible()
      await expect(svg).toHaveClass(/size-4/)
    })

    test("custom toggle still toggles sidebar", async ({ page }) => {
      const toggle = page.getByTestId("dashboard-sidebar-toggle")
      const group = page.getByTestId("dashboard-group")

      // Starts closed
      await expect(group).toHaveAttribute("data-sidebar-open", "false")

      // Click custom toggle — opens sidebar
      await toggle.click()
      await expect(group).toHaveAttribute("data-sidebar-open", "true")
    })
  })

  test.describe("accessibility", () => {
    test("playground passes WCAG 2.1 AA", async ({ page, checkA11y }) => {
      await page.goto(`${BASE}/playground`)
      await waitForStimulus(page, "kiso--sidebar")
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })
})
