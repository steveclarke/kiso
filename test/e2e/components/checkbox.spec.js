import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/form/checkbox"

test.describe("Checkbox component", () => {
  test("renders with data-slot=checkbox", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const checkbox = page.locator("[data-slot='checkbox']")
    await expect(checkbox).toBeVisible()
  })

  test("click toggles checked state", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const checkbox = page.locator("[data-slot='checkbox']")
    await expect(checkbox).not.toBeChecked()

    await checkbox.click()
    await expect(checkbox).toBeChecked()

    await checkbox.click()
    await expect(checkbox).not.toBeChecked()
  })

  test("keyboard space toggles checkbox", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const checkbox = page.locator("[data-slot='checkbox']")
    await expect(checkbox).not.toBeChecked()

    await checkbox.focus()
    await page.keyboard.press("Space")
    await expect(checkbox).toBeChecked()
  })

  test("has implicit role=checkbox as native input", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const checkbox = page.locator("[data-slot='checkbox']")
    await expect(checkbox).toHaveAttribute("type", "checkbox")
  })

  test("disabled checkbox is not interactive", async ({ page }) => {
    await page.goto(`${BASE}/disabled`)
    const checkbox = page.locator("[data-slot='checkbox']").first()
    await expect(checkbox).toBeDisabled()

    await checkbox.click({ force: true })
    await expect(checkbox).not.toBeChecked()
  })

  test("renders with different colors", async ({ page }) => {
    await page.goto(`${BASE}/playground?color=success`)
    const checkbox = page.locator("[data-slot='checkbox']")
    await expect(checkbox).toBeVisible()
  })

  test("renders 7 checkboxes on the colors page", async ({ page }) => {
    await page.goto(`${BASE}/colors`)
    const checkboxes = page.locator("[data-slot='checkbox']")
    await expect(checkboxes).toHaveCount(7)
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/with_field`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
