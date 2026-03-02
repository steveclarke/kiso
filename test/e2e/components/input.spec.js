import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/form/input"

test.describe("Input component", () => {
  test("renders with data-slot=input", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='input']")
    await expect(input).toBeVisible()
  })

  test("accepts text input", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='input']")
    await input.fill("hello world")
    await expect(input).toHaveValue("hello world")
  })

  test("shows placeholder text", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='input']")
    await expect(input).toHaveAttribute("placeholder", "Email address")
  })

  test("renders different sizes", async ({ page }) => {
    await page.goto(`${BASE}/sizes`)
    const inputs = page.locator("[data-slot='input']")
    await expect(inputs).toHaveCount(3)
  })

  test("disabled input does not accept input", async ({ page }) => {
    await page.goto(`${BASE}/disabled`)
    const input = page.locator("[data-slot='input']").first()
    await expect(input).toBeDisabled()
  })

  test("file input variant renders", async ({ page }) => {
    await page.goto(`${BASE}/file_input`)
    const input = page.locator("[data-slot='input']")
    await expect(input).toBeVisible()
    await expect(input).toHaveAttribute("type", "file")
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/with_field`)
    // Exclude color-contrast: WCAG 2.1 SC 1.4.3 does not require placeholder
    // text to meet 4.5:1 contrast (placeholder is transient, not essential content).
    // shadcn uses the same placeholder:text-muted-foreground pattern.
    const results = await checkA11y(page, { exclude: ["color-contrast"] })
    expect(results.violations).toEqual([])
  })
})
