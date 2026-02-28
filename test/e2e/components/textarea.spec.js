import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/textarea"

test.describe("Textarea component", () => {
  test("renders with data-slot=textarea", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const textarea = page.locator("[data-slot='textarea']")
    await expect(textarea).toBeVisible()
  })

  test("accepts text input", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const textarea = page.locator("[data-slot='textarea']")
    await textarea.fill("hello world")
    await expect(textarea).toHaveValue("hello world")
  })

  test("shows placeholder text", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const textarea = page.locator("[data-slot='textarea']")
    await expect(textarea).toHaveAttribute("placeholder", "Tell us more...")
  })

  test("renders different sizes", async ({ page }) => {
    await page.goto(`${BASE}/sizes`)
    const textareas = page.locator("[data-slot='textarea']")
    await expect(textareas).toHaveCount(3)
  })

  test("disabled textarea does not accept input", async ({ page }) => {
    await page.goto(`${BASE}/disabled`)
    const textarea = page.locator("[data-slot='textarea']").first()
    await expect(textarea).toBeDisabled()
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/with_field`)
    const results = await checkA11y(page, { exclude: ["color-contrast"] })
    expect(results.violations).toEqual([])
  })
})
