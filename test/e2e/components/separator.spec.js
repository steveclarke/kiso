import { test, expect } from "../fixtures/index.js"

test.describe("Separator component", () => {
  const BASE = "/preview/kiso/separator"

  test.describe("default preview", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("renders with data-slot=separator", async ({ page }) => {
      await expect(page.getByTestId("separator").first()).toBeVisible()
    })

    test("decorative separator has role=none", async ({ page }) => {
      await expect(page.getByTestId("separator").first()).toHaveAttribute("role", "none")
    })

    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })

  test("renders a horizontal separator", async ({ page }) => {
    await page.goto(`${BASE}/horizontal`)
    await expect(page.getByTestId("separator").first()).toBeVisible()
  })

  test("non-decorative separator has role=separator", async ({ page }) => {
    await page.goto(`${BASE}/playground?decorative=false`)
    await expect(page.getByTestId("separator").first()).toHaveAttribute("role", "separator")
  })

  test("renders vertical separator", async ({ page }) => {
    await page.goto(`${BASE}/vertical`)
    await expect(page.getByTestId("separator").first()).toBeVisible()
  })
})
