import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/button"

test.describe("Button component", () => {
  test("renders with data-slot=button", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const button = page.locator("[data-slot='button']")
    await expect(button).toBeVisible()
  })

  test("renders as button element by default", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const button = page.locator("button[data-slot='button']")
    await expect(button).toBeVisible()
  })

  test("renders with variant=outline", async ({ page }) => {
    await page.goto(`${BASE}/playground?variant=outline`)
    const button = page.locator("[data-slot='button']")
    await expect(button).toBeVisible()
  })

  test("renders with variant=ghost", async ({ page }) => {
    await page.goto(`${BASE}/playground?variant=ghost`)
    const button = page.locator("[data-slot='button']")
    await expect(button).toBeVisible()
  })

  test("renders with variant=link", async ({ page }) => {
    await page.goto(`${BASE}/playground?variant=link`)
    const button = page.locator("[data-slot='button']")
    await expect(button).toBeVisible()
  })

  test("renders with size=sm", async ({ page }) => {
    await page.goto(`${BASE}/playground?size=sm`)
    const button = page.locator("[data-slot='button']")
    await expect(button).toBeVisible()
  })

  test("renders with size=lg", async ({ page }) => {
    await page.goto(`${BASE}/playground?size=lg`)
    const button = page.locator("[data-slot='button']")
    await expect(button).toBeVisible()
  })

  test("renders as link when href is used", async ({ page }) => {
    await page.goto(`${BASE}/as_link`)
    const link = page.locator("a[data-slot='button']")
    await expect(link.first()).toBeVisible()
    await expect(link.first()).toHaveAttribute("href", "#")
  })

  test("disabled button has disabled attribute", async ({ page }) => {
    await page.goto(`${BASE}/disabled`)
    const button = page.locator("button[data-slot='button']").first()
    await expect(button).toBeDisabled()
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
