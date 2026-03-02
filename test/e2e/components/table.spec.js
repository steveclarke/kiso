import { test, expect } from "../fixtures/index.js"

test.describe("Table component", () => {
  const BASE = "/preview/kiso/table"

  test.describe("default preview", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("renders with data-slot=table", async ({ page }) => {
      await expect(page.getByTestId("table")).toBeVisible()
    })

    test("uses table HTML element", async ({ page }) => {
      const table = page.locator("table[data-slot='table']")
      await expect(table).toBeVisible()
    })

    test("renders table-header sub-part", async ({ page }) => {
      await expect(page.getByTestId("table-header")).toBeVisible()
    })

    test("renders table-body sub-part", async ({ page }) => {
      await expect(page.getByTestId("table-body")).toBeVisible()
    })

    test("renders table-row sub-parts", async ({ page }) => {
      const rows = page.getByTestId("table-row")
      // 1 header row + 5 body rows = 6 total
      await expect(rows).toHaveCount(6)
    })

    test("renders table-head sub-parts", async ({ page }) => {
      const heads = page.getByTestId("table-head")
      // 4 column headers: Invoice, Status, Method, Amount
      await expect(heads).toHaveCount(4)
    })

    test("renders table-cell sub-parts", async ({ page }) => {
      const cells = page.getByTestId("table-cell")
      // 5 rows x 4 columns = 20 cells
      await expect(cells).toHaveCount(20)
    })

    test("renders table-caption if present", async ({ page }) => {
      const caption = page.getByTestId("table-caption")
      await expect(caption).toBeVisible()
      await expect(caption).toContainText("A list of your recent invoices.")
    })

    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })

  test("renders table-footer if present", async ({ page }) => {
    await page.goto(`${BASE}/with_footer`)
    const footer = page.getByTestId("table-footer")
    await expect(footer).toBeVisible()
    await expect(footer).toContainText("Total")
    await expect(footer).toContainText("$2,500.00")
  })
})
