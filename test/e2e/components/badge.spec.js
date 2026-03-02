import { test, expect } from "../fixtures/index.js"

test.describe("Badge component", () => {
  const BASE = "/preview/kiso/badge"

  test.describe("default preview", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("renders with data-slot=badge", async ({ page }) => {
      await expect(page.getByTestId("badge")).toBeVisible()
    })

    test("renders default text content", async ({ page }) => {
      await expect(page.getByTestId("badge")).toContainText("Badge")
    })

    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })

  test("accepts color and variant via query params", async ({ page }) => {
    await page.goto(`${BASE}/playground?color=success&variant=solid`)
    const badge = page.getByTestId("badge")
    await expect(badge).toBeVisible()
    await expect(badge).toHaveAttribute("data-slot", "badge")
  })

  test("renders 28 badges on the variants page (7 colors x 4 variants)", async ({ page }) => {
    await page.goto(`${BASE}/variants`)
    const badges = page.getByTestId("badge")
    await expect(badges).toHaveCount(28)
  })
})
