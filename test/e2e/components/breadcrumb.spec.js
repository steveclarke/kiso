import { test, expect } from "../fixtures/index.js"

test.describe("Breadcrumb component", () => {
  const BASE = "/preview/kiso/breadcrumb"

  test.describe("default preview", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("renders with data-slot=breadcrumb", async ({ page }) => {
      await expect(page.getByTestId("breadcrumb")).toBeVisible()
    })

    test("contains nav element", async ({ page }) => {
      const nav = page.locator("nav[data-slot='breadcrumb']")
      await expect(nav).toBeVisible()
    })

    test("renders breadcrumb list", async ({ page }) => {
      await expect(page.getByTestId("breadcrumb-list")).toBeVisible()
    })

    test("renders breadcrumb items", async ({ page }) => {
      const items = page.getByTestId("breadcrumb-item")
      await expect(items).toHaveCount(3)
    })

    test("renders separators", async ({ page }) => {
      const separators = page.getByTestId("breadcrumb-separator")
      await expect(separators).toHaveCount(2)
    })

    test("current page item has aria-current=page", async ({ page }) => {
      const currentPage = page.getByTestId("breadcrumb-page")
      await expect(currentPage).toHaveAttribute("aria-current", "page")
      await expect(currentPage).toContainText("Breadcrumb")
    })

    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })

  test("renders ellipsis when present", async ({ page }) => {
    await page.goto(`${BASE}/with_ellipsis`)
    await expect(page.getByTestId("breadcrumb-ellipsis")).toBeVisible()
  })
})
