import { test, expect } from "../fixtures/index.js"

test.describe("Card component", () => {
  const BASE = "/preview/kiso/card"

  test.describe("default preview", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("renders with data-slot=card", async ({ page }) => {
      await expect(page.getByTestId("card")).toBeVisible()
    })

    test("renders header sub-part", async ({ page }) => {
      await expect(page.getByTestId("card-header")).toBeVisible()
    })

    test("renders title sub-part", async ({ page }) => {
      const title = page.getByTestId("card-title")
      await expect(title).toBeVisible()
      await expect(title).toContainText("Card Title")
    })

    test("renders description sub-part", async ({ page }) => {
      const description = page.getByTestId("card-description")
      await expect(description).toBeVisible()
      await expect(description).toContainText("Card description goes here.")
    })

    test("renders content sub-part", async ({ page }) => {
      await expect(page.getByTestId("card-content")).toBeVisible()
    })

    test("renders footer sub-part", async ({ page }) => {
      await expect(page.getByTestId("card-footer")).toBeVisible()
    })

    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })

  test("renders with variant=soft", async ({ page }) => {
    await page.goto(`${BASE}/playground?variant=soft`)
    await expect(page.getByTestId("card")).toBeVisible()
  })

  test("renders with variant=subtle", async ({ page }) => {
    await page.goto(`${BASE}/playground?variant=subtle`)
    await expect(page.getByTestId("card")).toBeVisible()
  })
})
