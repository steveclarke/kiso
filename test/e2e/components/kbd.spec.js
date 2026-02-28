import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/kbd"

test.describe("Kbd component", () => {
  test("renders with data-slot=kbd", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const kbd = page.locator("[data-slot='kbd']")
    await expect(kbd).toBeVisible()
  })

  test("uses kbd HTML element", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const kbd = page.locator("kbd[data-slot='kbd']")
    await expect(kbd).toBeVisible()
  })

  test("renders key text content", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const kbd = page.locator("[data-slot='kbd']")
    await expect(kbd).toContainText("⌘K")
  })

  test("renders different sizes", async ({ page }) => {
    await page.goto(`${BASE}/sizes`)
    const kbds = page.locator("[data-slot='kbd']")
    await expect(kbds).toHaveCount(3)
  })

  test("accepts size via query param", async ({ page }) => {
    await page.goto(`${BASE}/playground?size=lg`)
    const kbd = page.locator("[data-slot='kbd']")
    await expect(kbd).toBeVisible()
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
