import { test, expect } from "../fixtures/index.js"

test.describe("InputGroup component", () => {
  const BASE = "/preview/kiso/form/input_group"

  test.describe("default preview", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("renders with data-slot=input-group", async ({ page }) => {
      await expect(page.getByTestId("input-group")).toBeVisible()
    })

    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })

  test("renders addon prefix sub-part", async ({ page }) => {
    await page.goto(`${BASE}/prefix_text`)
    const addon = page.getByTestId("input-group-addon").first()
    await expect(addon).toBeVisible()
    await expect(addon).toContainText("https://")
  })

  test("renders addon suffix sub-part", async ({ page }) => {
    await page.goto(`${BASE}/prefix_and_suffix`)
    const addons = page.getByTestId("input-group-addon")
    const suffix = addons.nth(1)
    await expect(suffix).toBeVisible()
    await expect(suffix).toContainText("USD")
  })
})
