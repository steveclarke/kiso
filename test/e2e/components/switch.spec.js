import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/switch"

test.describe("Switch component", () => {
  test("renders with data-slot=switch", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const switchEl = page.locator("[data-slot='switch']")
    await expect(switchEl).toBeVisible()
  })

  test("has role=switch on the input", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='switch'] input[role='switch']")
    await expect(input).toHaveCount(1)
  })

  test("click toggles on and off", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const switchEl = page.locator("[data-slot='switch']")
    const input = switchEl.locator("input[role='switch']")

    // Starts unchecked
    await expect(input).not.toBeChecked()

    // Click to toggle on
    await switchEl.click()
    await expect(input).toBeChecked()

    // Click to toggle off
    await switchEl.click()
    await expect(input).not.toBeChecked()
  })

  test("keyboard Space toggles switch", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const switchEl = page.locator("[data-slot='switch']")
    const input = switchEl.locator("input[role='switch']")

    // Focus the input and press Space
    await input.focus()
    await page.keyboard.press("Space")
    await expect(input).toBeChecked()

    // Press Space again to toggle off
    await page.keyboard.press("Space")
    await expect(input).not.toBeChecked()
  })

  test("disabled switch is not interactive", async ({ page }) => {
    await page.goto(`${BASE}/disabled`)
    const firstSwitch = page.locator("[data-slot='switch']").first()
    const input = firstSwitch.locator("input[role='switch']")

    await expect(input).toBeDisabled()
    await expect(input).not.toBeChecked()

    // Click should not toggle
    await firstSwitch.click({ force: true })
    await expect(input).not.toBeChecked()
  })

  test("renders with different colors", async ({ page }) => {
    await page.goto(`${BASE}/playground?color=success&checked=true`)
    const switchEl = page.locator("[data-slot='switch']")
    await expect(switchEl).toBeVisible()
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
