import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/empty"

test.describe("Empty component", () => {
  test("renders with data-slot=empty", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const empty = page.locator("[data-slot='empty']")
    await expect(empty).toBeVisible()
  })

  test("renders header sub-part", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const header = page.locator("[data-slot='empty-header']")
    await expect(header).toBeVisible()
  })

  test("renders media sub-part", async ({ page }) => {
    await page.goto(`${BASE}/with_icon`)
    const media = page.locator("[data-slot='empty-media']")
    await expect(media).toBeVisible()
  })

  test("renders title sub-part", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const title = page.locator("[data-slot='empty-title']")
    await expect(title).toBeVisible()
    await expect(title).toContainText("No Projects Yet")
  })

  test("renders description sub-part", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const description = page.locator("[data-slot='empty-description']")
    await expect(description).toBeVisible()
    await expect(description).toContainText("You haven't created any projects yet")
  })

  test("renders content sub-part with actions", async ({ page }) => {
    await page.goto(`${BASE}/with_actions`)
    const content = page.locator("[data-slot='empty-content']")
    await expect(content).toBeVisible()
    await expect(content.locator("[data-slot='button']")).toHaveCount(2)
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/with_actions`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
