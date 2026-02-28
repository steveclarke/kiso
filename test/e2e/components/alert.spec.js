import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/alert"

test.describe("Alert component", () => {
  test("renders with data-slot=alert", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const alert = page.locator("[data-slot='alert']")
    await expect(alert).toBeVisible()
  })

  test("has role=alert attribute", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const alert = page.locator("[data-slot='alert']")
    await expect(alert).toHaveAttribute("role", "alert")
  })

  test("renders title sub-part", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const title = page.locator("[data-slot='alert-title']")
    await expect(title).toBeVisible()
    await expect(title).toContainText("Heads up!")
  })

  test("renders description sub-part", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const description = page.locator("[data-slot='alert-description']")
    await expect(description).toBeVisible()
    await expect(description).toContainText("You can add components to your app using the CLI.")
  })

  test("renders with color=success and variant=solid", async ({ page }) => {
    await page.goto(`${BASE}/playground?color=success&variant=solid`)
    const alert = page.locator("[data-slot='alert']")
    await expect(alert).toBeVisible()
    await expect(alert).toHaveAttribute("role", "alert")
  })

  test("renders with color=error and variant=outline", async ({ page }) => {
    await page.goto(`${BASE}/playground?color=error&variant=outline`)
    const alert = page.locator("[data-slot='alert']")
    await expect(alert).toBeVisible()
  })

  test("renders with color=warning and variant=subtle", async ({ page }) => {
    await page.goto(`${BASE}/playground?color=warning&variant=subtle`)
    const alert = page.locator("[data-slot='alert']")
    await expect(alert).toBeVisible()
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
