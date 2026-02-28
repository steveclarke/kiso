import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/badge"

test.describe("Badge component", () => {
  test("renders with data-slot=badge", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const badge = page.locator("[data-slot='badge']")
    await expect(badge).toBeVisible()
  })

  test("renders default text content", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    await expect(page.locator("[data-slot='badge']")).toContainText("Badge")
  })

  test("accepts color and variant via query params", async ({ page }) => {
    await page.goto(`${BASE}/playground?color=success&variant=solid`)
    const badge = page.locator("[data-slot='badge']")
    await expect(badge).toBeVisible()
    await expect(badge).toHaveAttribute("data-slot", "badge")
  })

  test("renders 28 badges on the variants page (7 colors x 4 variants)", async ({ page }) => {
    await page.goto(`${BASE}/variants`)
    const badges = page.locator("[data-slot='badge']")
    await expect(badges).toHaveCount(28)
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
