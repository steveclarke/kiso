import { test, expect } from "../fixtures/index.js"

const BASE = "/preview/kiso/button"

test.describe("Button component", () => {
  test.describe("default preview", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("renders with data-slot=button", async ({ page }) => {
      await expect(page.getByTestId("button")).toBeVisible()
    })

    test("renders as button element by default", async ({ page }) => {
      await expect(page.locator("button[data-slot='button']")).toBeVisible()
    })
  })

  test("renders with variant=outline", async ({ page }) => {
    await page.goto(`${BASE}/playground?variant=outline`)
    await expect(page.getByTestId("button")).toBeVisible()
  })

  test("renders with variant=ghost", async ({ page }) => {
    await page.goto(`${BASE}/playground?variant=ghost`)
    await expect(page.getByTestId("button")).toBeVisible()
  })

  test("renders with variant=link", async ({ page }) => {
    await page.goto(`${BASE}/playground?variant=link`)
    await expect(page.getByTestId("button")).toBeVisible()
  })

  test("renders with size=sm", async ({ page }) => {
    await page.goto(`${BASE}/playground?size=sm`)
    await expect(page.getByTestId("button")).toBeVisible()
  })

  test("renders with size=lg", async ({ page }) => {
    await page.goto(`${BASE}/playground?size=lg`)
    await expect(page.getByTestId("button")).toBeVisible()
  })

  test("renders as link when href is used", async ({ page }) => {
    await page.goto(`${BASE}/as_link`)
    const link = page.locator("a[data-slot='button']")
    await expect(link.first()).toBeVisible()
    await expect(link.first()).toHaveAttribute("href", "#")
  })

  test("disabled button has disabled attribute", async ({ page }) => {
    await page.goto(`${BASE}/disabled`)
    await expect(page.locator("button[data-slot='button']").first()).toBeDisabled()
  })

  test.describe("form method", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/form_method`)
    })

    test("renders form with class=contents when method is present", async ({ page }) => {
      const form = page.locator("form.contents").first()
      await expect(form).toBeAttached()
    })

    test("form contains hidden _method input", async ({ page }) => {
      const hidden = page.locator("form.contents input[name='_method']").first()
      await expect(hidden).toHaveAttribute("value", "delete")
    })

    test("inner button has data-slot and theme classes", async ({ page }) => {
      const button = page.locator("form.contents button[data-slot='button']").first()
      await expect(button).toBeVisible()
      await expect(button).toHaveAttribute("type", "submit")
    })

    test("disabled button inside form", async ({ page }) => {
      const button = page.locator("form.contents button[disabled]")
      await expect(button).toBeVisible()
    })
  })

  test("passes WCAG 2.1 AA", async ({ page, checkA11y }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y()
    expect(results.violations).toEqual([])
  })
})
