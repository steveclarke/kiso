import { test, expect } from "../fixtures/index.js"

test.describe("SelectNative component", () => {
  const BASE = "/preview/kiso/form/select_native"

  test.describe("default preview", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("renders with data-slot=select-native", async ({ page }) => {
      await expect(page.getByTestId("select-native")).toBeVisible()
    })

    test("renders wrapper with data-slot=select-native-wrapper", async ({ page }) => {
      await expect(page.getByTestId("select-native-wrapper")).toBeVisible()
    })

    test("renders chevron icon", async ({ page }) => {
      await expect(page.getByTestId("select-native-icon")).toBeVisible()
    })

    test("chevron icon is aria-hidden", async ({ page }) => {
      await expect(page.getByTestId("select-native-icon")).toHaveAttribute("aria-hidden", "true")
    })

    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })

  test.describe("disabled state", () => {
    test("select has disabled attribute", async ({ page }) => {
      await page.goto(`${BASE}/disabled`)
      const select = page.getByTestId("select-native")
      await expect(select).toBeDisabled()
    })

    test("wrapper has reduced opacity when disabled", async ({ page }) => {
      await page.goto(`${BASE}/disabled`)
      const wrapper = page.getByTestId("select-native-wrapper")
      const opacity = await wrapper.evaluate((el) => getComputedStyle(el).opacity)
      expect(Number(opacity)).toBeLessThan(1)
    })
  })

  test.describe("with field", () => {
    test("renders inside a field with label", async ({ page }) => {
      await page.goto(`${BASE}/with_field`)
      await expect(page.getByTestId("field")).toBeVisible()
      await expect(page.getByTestId("select-native")).toBeVisible()
      await expect(page.getByTestId("label")).toBeVisible()
    })
  })
})
