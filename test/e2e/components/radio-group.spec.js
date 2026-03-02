import { test, expect } from "../fixtures/index.js"

test.describe("RadioGroup component", () => {
  const BASE = "/preview/kiso/form/radio_group"

  test.describe("playground", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("renders with data-slot=radio-group", async ({ page }) => {
      const group = page.getByTestId("radio-group")
      await expect(group).toBeVisible()
    })

    test("renders radio items with data-slot=radio-group-item", async ({ page }) => {
      const items = page.getByTestId("radio-group-item")
      await expect(items).toHaveCount(3)
    })

    test("has role=radiogroup on the group", async ({ page }) => {
      const group = page.getByTestId("radio-group")
      await expect(group).toHaveAttribute("role", "radiogroup")
    })

    test("radio items have role=radio", async ({ page }) => {
      const items = page.getByTestId("radio-group-item")
      const count = await items.count()
      for (let i = 0; i < count; i++) {
        await expect(items.nth(i)).toHaveAttribute("type", "radio")
      }
    })

    test("clicking a radio selects it", async ({ page }) => {
      const second = page.getByTestId("radio-group-item").nth(1)

      await second.click()
      await expect(second).toBeChecked()
    })

    test("only one radio is selected at a time", async ({ page }) => {
      const items = page.getByTestId("radio-group-item")
      const first = items.first()
      const second = items.nth(1)

      // First is checked by default in playground
      await expect(first).toBeChecked()

      // Click second — first should uncheck
      await second.click()
      await expect(second).toBeChecked()
      await expect(first).not.toBeChecked()
    })

    test("keyboard ArrowDown moves selection to next item", async ({ page }) => {
      const items = page.getByTestId("radio-group-item")
      const first = items.first()
      const second = items.nth(1)

      // First is checked, focus it
      await first.focus()
      await page.keyboard.press("ArrowDown")
      await expect(second).toBeChecked()
      await expect(second).toBeFocused()
    })

    // Skip WebKit: native radio ArrowUp behavior differs in Safari
    test("keyboard ArrowUp moves selection to previous item", async ({ page, browserName }) => {
      test.skip(browserName === "webkit", "WebKit handles radio ArrowUp differently")
      const items = page.getByTestId("radio-group-item")
      const first = items.first()
      const second = items.nth(1)

      await second.click()
      await page.keyboard.press("ArrowUp")
      await expect(first).toBeFocused()
    })
  })

  test("disabled radio is not interactive", async ({ page }) => {
    await page.goto(`${BASE}/disabled`)
    const disabled = page.getByTestId("radio-group-item").nth(1)

    await expect(disabled).toBeDisabled()
    await disabled.click({ force: true })
    await expect(disabled).not.toBeChecked()
  })

  test("passes WCAG 2.1 AA", async ({ page, checkA11y }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y()
    expect(results.violations).toEqual([])
  })
})
