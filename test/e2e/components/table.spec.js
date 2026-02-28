import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/table"

test.describe("Table component", () => {
  test("renders with data-slot=table", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const table = page.locator("[data-slot='table']")
    await expect(table).toBeVisible()
  })

  test("uses table HTML element", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const table = page.locator("table[data-slot='table']")
    await expect(table).toBeVisible()
  })

  test("renders table-header sub-part", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const header = page.locator("[data-slot='table-header']")
    await expect(header).toBeVisible()
  })

  test("renders table-body sub-part", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const body = page.locator("[data-slot='table-body']")
    await expect(body).toBeVisible()
  })

  test("renders table-row sub-parts", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const rows = page.locator("[data-slot='table-row']")
    // 1 header row + 5 body rows = 6 total
    await expect(rows).toHaveCount(6)
  })

  test("renders table-head sub-parts", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const heads = page.locator("[data-slot='table-head']")
    // 4 column headers: Invoice, Status, Method, Amount
    await expect(heads).toHaveCount(4)
  })

  test("renders table-cell sub-parts", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const cells = page.locator("[data-slot='table-cell']")
    // 5 rows x 4 columns = 20 cells
    await expect(cells).toHaveCount(20)
  })

  test("renders table-footer if present", async ({ page }) => {
    await page.goto(`${BASE}/with_footer`)
    const footer = page.locator("[data-slot='table-footer']")
    await expect(footer).toBeVisible()
    await expect(footer).toContainText("Total")
    await expect(footer).toContainText("$2,500.00")
  })

  test("renders table-caption if present", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const caption = page.locator("[data-slot='table-caption']")
    await expect(caption).toBeVisible()
    await expect(caption).toContainText("A list of your recent invoices.")
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
