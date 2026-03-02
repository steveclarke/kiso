import { test, expect } from "../fixtures/index.js"

test.describe("Kbd component", () => {
  const BASE = "/preview/kiso/kbd"

  test.describe("default preview", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("renders with data-slot=kbd", async ({ page }) => {
      await expect(page.getByTestId("kbd")).toBeVisible()
    })

    test("uses kbd HTML element", async ({ page }) => {
      const kbd = page.locator("kbd[data-slot='kbd']")
      await expect(kbd).toBeVisible()
    })

    test("renders key text content", async ({ page }) => {
      await expect(page.getByTestId("kbd")).toContainText("⌘K")
    })

    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })

  test("renders different sizes", async ({ page }) => {
    await page.goto(`${BASE}/sizes`)
    const kbds = page.getByTestId("kbd")
    await expect(kbds).toHaveCount(3)
  })

  test("accepts size via query param", async ({ page }) => {
    await page.goto(`${BASE}/playground?size=lg`)
    await expect(page.getByTestId("kbd")).toBeVisible()
  })
})
