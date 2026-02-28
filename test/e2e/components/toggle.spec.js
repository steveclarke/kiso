import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/toggle"

test.describe("Toggle component", () => {
  test("renders with data-slot=toggle", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const toggle = page.locator("[data-slot='toggle']")
    await expect(toggle).toBeVisible()
  })

  test("starts in off state", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const toggle = page.locator("[data-slot='toggle']")
    await expect(toggle).toHaveAttribute("data-state", "off")
    await expect(toggle).toHaveAttribute("aria-pressed", "false")
  })

  test("toggles to on state on click", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const toggle = page.locator("[data-slot='toggle']")
    await toggle.click()
    await expect(toggle).toHaveAttribute("data-state", "on")
    await expect(toggle).toHaveAttribute("aria-pressed", "true")
  })

  test("toggles back to off on second click", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const toggle = page.locator("[data-slot='toggle']")
    await toggle.click()
    await toggle.click()
    await expect(toggle).toHaveAttribute("data-state", "off")
    await expect(toggle).toHaveAttribute("aria-pressed", "false")
  })

  test("activates with Enter key", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const toggle = page.locator("[data-slot='toggle']")
    await toggle.focus()
    await page.keyboard.press("Enter")
    await expect(toggle).toHaveAttribute("data-state", "on")
  })

  test("activates with Space key", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const toggle = page.locator("[data-slot='toggle']")
    await toggle.focus()
    await page.keyboard.press("Space")
    await expect(toggle).toHaveAttribute("data-state", "on")
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
