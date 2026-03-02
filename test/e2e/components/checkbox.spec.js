import { test, expect } from "../fixtures/index.js"

test.describe("Checkbox component", () => {
  const BASE = "/preview/kiso/form/checkbox"

  test.describe("playground", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("renders with data-slot=checkbox", async ({ page }) => {
      const checkbox = page.getByTestId("checkbox")
      await expect(checkbox).toBeVisible()
    })

    test("click toggles checked state", async ({ page }) => {
      const checkbox = page.getByTestId("checkbox")
      await expect(checkbox).not.toBeChecked()

      await checkbox.click()
      await expect(checkbox).toBeChecked()

      await checkbox.click()
      await expect(checkbox).not.toBeChecked()
    })

    test("keyboard space toggles checkbox", async ({ page }) => {
      const checkbox = page.getByTestId("checkbox")
      await expect(checkbox).not.toBeChecked()

      await checkbox.focus()
      await page.keyboard.press("Space")
      await expect(checkbox).toBeChecked()
    })

    test("has implicit role=checkbox as native input", async ({ page }) => {
      const checkbox = page.getByTestId("checkbox")
      await expect(checkbox).toHaveAttribute("type", "checkbox")
    })
  })

  test("disabled checkbox is not interactive", async ({ page }) => {
    await page.goto(`${BASE}/disabled`)
    const checkbox = page.getByTestId("checkbox").first()
    await expect(checkbox).toBeDisabled()

    await checkbox.click({ force: true })
    await expect(checkbox).not.toBeChecked()
  })

  test("renders with different colors", async ({ page }) => {
    await page.goto(`${BASE}/playground?color=success`)
    const checkbox = page.getByTestId("checkbox")
    await expect(checkbox).toBeVisible()
  })

  test("renders 7 checkboxes on the colors page", async ({ page }) => {
    await page.goto(`${BASE}/colors`)
    const checkboxes = page.getByTestId("checkbox")
    await expect(checkboxes).toHaveCount(7)
  })

  test("passes WCAG 2.1 AA", async ({ page, checkA11y }) => {
    await page.goto(`${BASE}/with_field`)
    const results = await checkA11y()
    expect(results.violations).toEqual([])
  })
})
