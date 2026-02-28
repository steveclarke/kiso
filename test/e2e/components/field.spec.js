import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/field"

test.describe("Field component", () => {
  test("renders with data-slot=field", async ({ page }) => {
    await page.goto(`${BASE}/input`)
    const field = page.locator("[data-slot='field']").first()
    await expect(field).toBeVisible()
  })

  test("has role=group attribute", async ({ page }) => {
    await page.goto(`${BASE}/input`)
    const field = page.locator("[data-slot='field']").first()
    await expect(field).toHaveAttribute("role", "group")
  })

  test("renders label sub-part", async ({ page }) => {
    await page.goto(`${BASE}/input`)
    const label = page.locator("[data-slot='label']").first()
    await expect(label).toBeVisible()
    await expect(label).toContainText("Username")
  })

  test("renders description sub-part", async ({ page }) => {
    await page.goto(`${BASE}/input`)
    const description = page.locator("[data-slot='field-description']").first()
    await expect(description).toBeVisible()
    await expect(description).toContainText("This is your public display name")
  })

  test("renders error sub-part when invalid", async ({ page }) => {
    await page.goto(`${BASE}/input`)
    const error = page.locator("[data-slot='field-error']")
    await expect(error).toBeVisible()
    await expect(error).toContainText("Must be at least 8 characters")
  })

  test("invalid state has data-invalid attribute", async ({ page }) => {
    await page.goto(`${BASE}/input`)
    const invalidField = page.locator("[data-slot='field'][data-invalid]")
    await expect(invalidField).toBeVisible()
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/textarea`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
