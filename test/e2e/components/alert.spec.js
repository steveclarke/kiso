import { test, expect } from "../fixtures/index.js"

test.describe("Alert component", () => {
  const BASE = "/preview/kiso/alert"

  test.describe("default preview", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("renders with data-slot=alert", async ({ page }) => {
      await expect(page.getByTestId("alert")).toBeVisible()
    })

    test("has role=alert attribute", async ({ page }) => {
      await expect(page.getByTestId("alert")).toHaveAttribute("role", "alert")
    })

    test("renders title sub-part", async ({ page }) => {
      const title = page.getByTestId("alert-title")
      await expect(title).toBeVisible()
      await expect(title).toContainText("Heads up!")
    })

    test("renders description sub-part", async ({ page }) => {
      const description = page.getByTestId("alert-description")
      await expect(description).toBeVisible()
      await expect(description).toContainText("You can add components to your app using the CLI.")
    })

    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })

  test("renders with color=success and variant=solid", async ({ page }) => {
    await page.goto(`${BASE}/playground?color=success&variant=solid`)
    const alert = page.getByTestId("alert")
    await expect(alert).toBeVisible()
    await expect(alert).toHaveAttribute("role", "alert")
  })

  test("renders with color=error and variant=outline", async ({ page }) => {
    await page.goto(`${BASE}/playground?color=error&variant=outline`)
    await expect(page.getByTestId("alert")).toBeVisible()
  })

  test("renders with color=warning and variant=subtle", async ({ page }) => {
    await page.goto(`${BASE}/playground?color=warning&variant=subtle`)
    await expect(page.getByTestId("alert")).toBeVisible()
  })
})
