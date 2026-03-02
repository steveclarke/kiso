import { test, expect } from "../fixtures/index.js"

test.describe("Field component", () => {
  const BASE = "/preview/kiso/form/field"

  test.describe("input preview", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/input`)
    })

    test("renders with data-slot=field", async ({ page }) => {
      const field = page.getByTestId("field").first()
      await expect(field).toBeVisible()
    })

    test("has role=group attribute", async ({ page }) => {
      const field = page.getByTestId("field").first()
      await expect(field).toHaveAttribute("role", "group")
    })

    test("renders label sub-part", async ({ page }) => {
      const label = page.getByTestId("label").first()
      await expect(label).toBeVisible()
      await expect(label).toContainText("Username")
    })

    test("renders description sub-part", async ({ page }) => {
      const description = page.getByTestId("field-description").first()
      await expect(description).toBeVisible()
      await expect(description).toContainText("This is your public display name")
    })

    test("renders error sub-part when invalid", async ({ page }) => {
      const error = page.getByTestId("field-error")
      await expect(error).toBeVisible()
      await expect(error).toContainText("Must be at least 8 characters")
    })

    test("invalid state has data-invalid attribute", async ({ page }) => {
      const invalidField = page.locator("[data-slot='field'][data-invalid]")
      await expect(invalidField).toBeVisible()
    })
  })

  test("passes WCAG 2.1 AA", async ({ page, checkA11y }) => {
    await page.goto(`${BASE}/textarea`)
    const results = await checkA11y()
    expect(results.violations).toEqual([])
  })
})
