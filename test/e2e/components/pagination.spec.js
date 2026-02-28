import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/pagination"

test.describe("Pagination component", () => {
  test("renders with data-slot=pagination", async ({ page }) => {
    await page.goto(`${BASE}/default`)
    const pagination = page.locator("[data-slot='pagination']")
    await expect(pagination).toBeVisible()
  })

  test("contains nav element", async ({ page }) => {
    await page.goto(`${BASE}/default`)
    const nav = page.locator("nav[data-slot='pagination']")
    await expect(nav).toBeVisible()
    await expect(nav).toHaveAttribute("role", "navigation")
    await expect(nav).toHaveAttribute("aria-label", "pagination")
  })

  test("renders pagination items", async ({ page }) => {
    await page.goto(`${BASE}/default`)
    const items = page.locator("[data-slot='pagination-item']")
    await expect(items.first()).toBeVisible()
    expect(await items.count()).toBeGreaterThan(0)
  })

  test("renders previous and next links", async ({ page }) => {
    await page.goto(`${BASE}/default`)
    const previous = page.locator("[data-slot='pagination-previous']")
    const next = page.locator("[data-slot='pagination-next']")
    await expect(previous).toBeVisible()
    await expect(next).toBeVisible()
  })

  test("active page has aria-current=page", async ({ page }) => {
    await page.goto(`${BASE}/default`)
    const activeLink = page.locator("[data-slot='pagination-link'][aria-current='page']")
    await expect(activeLink).toBeVisible()
    await expect(activeLink).toContainText("5")
  })

  test("renders ellipsis", async ({ page }) => {
    await page.goto(`${BASE}/default`)
    const ellipsis = page.locator("[data-slot='pagination-ellipsis']")
    await expect(ellipsis.first()).toBeVisible()
    expect(await ellipsis.count()).toBeGreaterThan(0)
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/default`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
