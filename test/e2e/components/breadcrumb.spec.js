import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/breadcrumb"

test.describe("Breadcrumb component", () => {
  test("renders with data-slot=breadcrumb", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const breadcrumb = page.locator("[data-slot='breadcrumb']")
    await expect(breadcrumb).toBeVisible()
  })

  test("contains nav element", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const nav = page.locator("nav[data-slot='breadcrumb']")
    await expect(nav).toBeVisible()
  })

  test("renders breadcrumb list", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const list = page.locator("[data-slot='breadcrumb-list']")
    await expect(list).toBeVisible()
  })

  test("renders breadcrumb items", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const items = page.locator("[data-slot='breadcrumb-item']")
    await expect(items).toHaveCount(3)
  })

  test("renders separators", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const separators = page.locator("[data-slot='breadcrumb-separator']")
    await expect(separators).toHaveCount(2)
  })

  test("current page item has aria-current=page", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const currentPage = page.locator("[data-slot='breadcrumb-page']")
    await expect(currentPage).toHaveAttribute("aria-current", "page")
    await expect(currentPage).toContainText("Breadcrumb")
  })

  test("renders ellipsis when present", async ({ page }) => {
    await page.goto(`${BASE}/with_ellipsis`)
    const ellipsis = page.locator("[data-slot='breadcrumb-ellipsis']")
    await expect(ellipsis).toBeVisible()
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
