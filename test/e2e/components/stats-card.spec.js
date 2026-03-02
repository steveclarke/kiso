import { test, expect } from "../fixtures/index.js"

test.describe("StatsCard component", () => {
  const BASE = "/preview/kiso/stats_card"

  test.describe("default preview", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("renders with data-slot=stats-card", async ({ page }) => {
      await expect(page.getByTestId("stats-card")).toBeVisible()
    })

    test("renders label sub-part", async ({ page }) => {
      const label = page.getByTestId("stats-card-label")
      await expect(label).toBeVisible()
      await expect(label).toContainText("Total Revenue")
    })

    test("renders value sub-part", async ({ page }) => {
      const value = page.getByTestId("stats-card-value")
      await expect(value).toBeVisible()
      await expect(value).toContainText("$45,231.89")
    })

    test("renders description sub-part", async ({ page }) => {
      const description = page.getByTestId("stats-card-description")
      await expect(description).toBeVisible()
      await expect(description).toContainText("+20.1% from last month")
    })

    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })

  test("renders header sub-part", async ({ page }) => {
    await page.goto(`${BASE}/with_icon`)
    await expect(page.getByTestId("stats-card-header")).toBeVisible()
  })

  test("renders with different variants", async ({ page }) => {
    await page.goto(`${BASE}/variants`)
    const cards = page.getByTestId("stats-card")
    await expect(cards).toHaveCount(3)
  })

  test("accepts variant via query params", async ({ page }) => {
    await page.goto(`${BASE}/playground?variant=soft`)
    await expect(page.getByTestId("stats-card")).toBeVisible()
  })
})
