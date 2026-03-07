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

    test("renders wrapper sub-part", async ({ page }) => {
      await expect(page.getByTestId("alert-wrapper")).toBeVisible()
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

  test.describe("with icon", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/with_icon`)
    })

    test("renders icon as SVG", async ({ page }) => {
      const alert = page.getByTestId("alert").first()
      await expect(alert.locator("svg").first()).toBeVisible()
    })

    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })

  test.describe("dismissible", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/dismissible`)
    })

    test("renders close button", async ({ page }) => {
      const close = page.getByTestId("alert-close").first()
      await expect(close).toBeVisible()
      await expect(close).toHaveAttribute("aria-label", "Dismiss")
    })

    test("clicking close removes the alert", async ({ page }) => {
      const alerts = page.getByTestId("alert")
      await expect(alerts).toHaveCount(3)

      const close = page.getByTestId("alert-close").first()
      await close.click()

      await expect(alerts).toHaveCount(2)
    })

    test("dispatches kiso--alert:close event", async ({ page }) => {
      const eventFired = await page.evaluate(() => {
        return new Promise((resolve) => {
          const el = document.querySelector("[data-slot='alert']")
          el.addEventListener("kiso--alert:close", () => resolve(true))
          el.querySelector("[data-slot='alert-close']").click()
        })
      })

      expect(eventFired).toBe(true)
    })

    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })

  test.describe("description only", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/description_only`)
    })

    test("renders description without title", async ({ page }) => {
      const alert = page.getByTestId("alert").first()
      await expect(alert.getByTestId("alert-description")).toBeVisible()
      await expect(alert.getByTestId("alert-title")).toHaveCount(0)
    })

    test("inline content stays on one line", async ({ page }) => {
      const description = page.getByTestId("alert-description").first()
      const strong = description.locator("strong")
      const descBox = await description.boundingBox()
      const strongBox = await strong.boundingBox()

      // strong element and description share the same top line
      expect(Math.abs(strongBox.y - descBox.y)).toBeLessThan(5)
    })

    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })

  test.describe("with actions", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/with_actions`)
    })

    test("renders actions sub-part", async ({ page }) => {
      const actions = page.getByTestId("alert-actions").first()
      await expect(actions).toBeVisible()
    })

    test("renders action buttons inside actions", async ({ page }) => {
      const actions = page.getByTestId("alert-actions").first()
      const buttons = actions.locator("button")
      await expect(buttons).toHaveCount(2)
    })

    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })
})
