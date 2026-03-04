import { test, expect } from "../fixtures/index.js"

const BASE = "/preview/kiso/aspect_ratio"

test.describe("AspectRatio component", () => {
  // --- Rendering ---
  test("renders with data-slot=aspect-ratio", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    await expect(page.locator("[data-slot='aspect-ratio']")).toBeVisible()
  })

  test("sets aspect-ratio inline style from ratio prop", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const el = page.locator("[data-slot='aspect-ratio']")
    const style = await el.getAttribute("style")
    expect(style).toContain("aspect-ratio")
  })

  // --- Content ---
  test("renders children inside the container", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const el = page.locator("[data-slot='aspect-ratio']")
    await expect(el).toContainText("16 : 9")
  })

  // --- Variants ---
  test("renders square ratio", async ({ page }) => {
    await page.goto(`${BASE}/square`)
    const el = page.locator("[data-slot='aspect-ratio']")
    await expect(el).toBeVisible()
    await expect(el).toContainText("1 : 1")
  })

  test("renders portrait ratio", async ({ page }) => {
    await page.goto(`${BASE}/portrait`)
    const el = page.locator("[data-slot='aspect-ratio']")
    await expect(el).toBeVisible()
    await expect(el).toContainText("9 : 16")
  })

  // --- Accessibility ---
  test("passes WCAG 2.1 AA", async ({ page, checkA11y }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y()
    expect(results.violations).toEqual([])
  })
})
