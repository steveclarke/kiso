import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/card"

test.describe("Card component", () => {
  test("renders with data-slot=card", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const card = page.locator("[data-slot='card']")
    await expect(card).toBeVisible()
  })

  test("renders header sub-part", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const header = page.locator("[data-slot='card-header']")
    await expect(header).toBeVisible()
  })

  test("renders title sub-part", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const title = page.locator("[data-slot='card-title']")
    await expect(title).toBeVisible()
    await expect(title).toContainText("Card Title")
  })

  test("renders description sub-part", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const description = page.locator("[data-slot='card-description']")
    await expect(description).toBeVisible()
    await expect(description).toContainText("Card description goes here.")
  })

  test("renders content sub-part", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const content = page.locator("[data-slot='card-content']")
    await expect(content).toBeVisible()
  })

  test("renders footer sub-part", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const footer = page.locator("[data-slot='card-footer']")
    await expect(footer).toBeVisible()
  })

  test("renders with variant=soft", async ({ page }) => {
    await page.goto(`${BASE}/playground?variant=soft`)
    const card = page.locator("[data-slot='card']")
    await expect(card).toBeVisible()
  })

  test("renders with variant=subtle", async ({ page }) => {
    await page.goto(`${BASE}/playground?variant=subtle`)
    const card = page.locator("[data-slot='card']")
    await expect(card).toBeVisible()
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
