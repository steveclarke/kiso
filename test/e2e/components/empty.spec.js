import { test, expect } from "../fixtures/index.js"

test.describe("Empty component", () => {
  const BASE = "/preview/kiso/empty"

  test.describe("default preview", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("renders with data-slot=empty", async ({ page }) => {
      await expect(page.getByTestId("empty")).toBeVisible()
    })

    test("renders header sub-part", async ({ page }) => {
      await expect(page.getByTestId("empty-header")).toBeVisible()
    })

    test("renders title sub-part", async ({ page }) => {
      const title = page.getByTestId("empty-title")
      await expect(title).toBeVisible()
      await expect(title).toContainText("No Projects Yet")
    })

    test("renders description sub-part", async ({ page }) => {
      const description = page.getByTestId("empty-description")
      await expect(description).toBeVisible()
      await expect(description).toContainText("You haven't created any projects yet")
    })
  })

  test("renders media sub-part", async ({ page }) => {
    await page.goto(`${BASE}/with_icon`)
    await expect(page.getByTestId("empty-media")).toBeVisible()
  })

  test("renders content sub-part with actions", async ({ page }) => {
    await page.goto(`${BASE}/with_actions`)
    const content = page.getByTestId("empty-content")
    await expect(content).toBeVisible()
    await expect(content.locator("[data-slot='button']")).toHaveCount(2)
  })

  test("passes WCAG 2.1 AA", async ({ page, checkA11y }) => {
    await page.goto(`${BASE}/with_actions`)
    const results = await checkA11y()
    expect(results.violations).toEqual([])
  })
})
