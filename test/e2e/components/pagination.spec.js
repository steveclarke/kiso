import { test, expect } from "../fixtures/index.js"

test.describe("Pagination component", () => {
  const BASE = "/preview/kiso/pagination"

  test.describe("default preview", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/default`)
    })

    test("renders with data-slot=pagination", async ({ page }) => {
      await expect(page.getByTestId("pagination")).toBeVisible()
    })

    test("contains nav element", async ({ page }) => {
      const nav = page.locator("nav[data-slot='pagination']")
      await expect(nav).toBeVisible()
      await expect(nav).toHaveAttribute("role", "navigation")
      await expect(nav).toHaveAttribute("aria-label", "pagination")
    })

    test("renders pagination items", async ({ page }) => {
      const items = page.getByTestId("pagination-item")
      await expect(items.first()).toBeVisible()
      expect(await items.count()).toBeGreaterThan(0)
    })

    test("renders previous and next links", async ({ page }) => {
      await expect(page.getByTestId("pagination-previous")).toBeVisible()
      await expect(page.getByTestId("pagination-next")).toBeVisible()
    })

    test("active page has aria-current=page", async ({ page }) => {
      const activeLink = page.locator("[data-slot='pagination-link'][aria-current='page']")
      await expect(activeLink).toBeVisible()
      await expect(activeLink).toContainText("5")
    })

    test("renders ellipsis", async ({ page }) => {
      const ellipsis = page.getByTestId("pagination-ellipsis")
      await expect(ellipsis.first()).toBeVisible()
      expect(await ellipsis.count()).toBeGreaterThan(0)
    })

    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })
})
