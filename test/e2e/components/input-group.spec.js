import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/input_group"

test.describe("InputGroup component", () => {
  test("renders with data-slot=input-group", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const group = page.locator("[data-slot='input-group']")
    await expect(group).toBeVisible()
  })

  test("renders addon prefix sub-part", async ({ page }) => {
    await page.goto(`${BASE}/prefix_text`)
    const addon = page.locator("[data-slot='input-group-addon']").first()
    await expect(addon).toBeVisible()
    await expect(addon).toContainText("https://")
  })

  test("renders addon suffix sub-part", async ({ page }) => {
    await page.goto(`${BASE}/prefix_and_suffix`)
    const addons = page.locator("[data-slot='input-group-addon']")
    const suffix = addons.nth(1)
    await expect(suffix).toBeVisible()
    await expect(suffix).toContainText("USD")
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
