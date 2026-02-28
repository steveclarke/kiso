import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/stats_card"

test.describe("StatsCard component", () => {
  test("renders with data-slot=stats-card", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const statsCard = page.locator("[data-slot='stats-card']")
    await expect(statsCard).toBeVisible()
  })

  test("renders header sub-part", async ({ page }) => {
    await page.goto(`${BASE}/with_icon`)
    const header = page.locator("[data-slot='stats-card-header']")
    await expect(header).toBeVisible()
  })

  test("renders label sub-part", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const label = page.locator("[data-slot='stats-card-label']")
    await expect(label).toBeVisible()
    await expect(label).toContainText("Total Revenue")
  })

  test("renders value sub-part", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const value = page.locator("[data-slot='stats-card-value']")
    await expect(value).toBeVisible()
    await expect(value).toContainText("$45,231.89")
  })

  test("renders description sub-part", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const description = page.locator("[data-slot='stats-card-description']")
    await expect(description).toBeVisible()
    await expect(description).toContainText("+20.1% from last month")
  })

  test("renders with different variants", async ({ page }) => {
    await page.goto(`${BASE}/variants`)
    const cards = page.locator("[data-slot='stats-card']")
    await expect(cards).toHaveCount(3)
  })

  test("accepts variant via query params", async ({ page }) => {
    await page.goto(`${BASE}/playground?variant=soft`)
    const statsCard = page.locator("[data-slot='stats-card']")
    await expect(statsCard).toBeVisible()
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
