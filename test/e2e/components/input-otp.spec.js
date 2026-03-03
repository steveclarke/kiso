import { test, expect } from "../fixtures/index.js"

test.describe("InputOTP component", () => {
  const BASE = "/preview/kiso/form/input_otp"

  test.describe("playground", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("renders with data-slot=input-otp", async ({ page }) => {
      await expect(page.getByTestId("input-otp")).toBeVisible()
    })

    test("renders 6 slot elements", async ({ page }) => {
      await expect(page.getByTestId("input-otp-slot")).toHaveCount(6)
    })

    test("renders separator", async ({ page }) => {
      await expect(page.getByTestId("input-otp-separator")).toBeVisible()
    })

    test("typing fills slots sequentially", async ({ page }) => {
      const input = page.locator("[data-slot='input-otp'] input")
      await input.focus()
      await page.keyboard.type("123")

      const chars = page.locator("[data-slot='input-otp-slot-char']")
      await expect(chars.nth(0)).toHaveText("1")
      await expect(chars.nth(1)).toHaveText("2")
      await expect(chars.nth(2)).toHaveText("3")
      await expect(chars.nth(3)).toHaveText("")
    })

    test("paste fills all slots", async ({ page }) => {
      const input = page.locator("[data-slot='input-otp'] input")
      await input.focus()
      await input.fill("123456")
      // fill() triggers input event, controller syncs
      await input.dispatchEvent("input")

      const chars = page.locator("[data-slot='input-otp-slot-char']")
      await expect(chars.nth(0)).toHaveText("1")
      await expect(chars.nth(5)).toHaveText("6")
    })

    test("active slot shows caret on focus", async ({ page }) => {
      const input = page.locator("[data-slot='input-otp'] input")
      await input.focus()

      const firstSlot = page.getByTestId("input-otp-slot").first()
      await expect(firstSlot).toHaveAttribute("data-active", "true")

      const caret = firstSlot.locator("[data-slot='input-otp-caret']")
      await expect(caret).not.toHaveAttribute("hidden", "")
    })

    test("blur hides all carets", async ({ page }) => {
      const input = page.locator("[data-slot='input-otp'] input")
      await input.focus()
      await input.blur()

      const carets = page.locator("[data-slot='input-otp-caret']")
      const count = await carets.count()
      for (let i = 0; i < count; i++) {
        await expect(carets.nth(i)).toHaveAttribute("hidden", "")
      }
    })

    test("rejects non-digit characters with default pattern", async ({ page }) => {
      const input = page.locator("[data-slot='input-otp'] input")
      await input.focus()
      await page.keyboard.type("1a2b3")

      await expect(input).toHaveValue("123")
    })

    test("clicking component focuses input", async ({ page }) => {
      await page.getByTestId("input-otp").click()
      const input = page.locator("[data-slot='input-otp'] input")
      await expect(input).toBeFocused()
    })
  })

  test("disabled state shows pre-filled value", async ({ page }) => {
    await page.goto(`${BASE}/disabled`)
    const input = page.locator("[data-slot='input-otp'] input")
    await expect(input).toBeDisabled()

    const chars = page.locator("[data-slot='input-otp-slot-char']")
    await expect(chars.nth(0)).toHaveText("1")
    await expect(chars.nth(5)).toHaveText("6")
  })

  test("four digits variant renders 4 slots", async ({ page }) => {
    await page.goto(`${BASE}/four_digits`)
    await expect(page.getByTestId("input-otp-slot")).toHaveCount(4)
  })

  test("with_separator renders 3 groups of 2 with separators", async ({ page }) => {
    await page.goto(`${BASE}/with_separator`)
    await expect(page.getByTestId("input-otp-group")).toHaveCount(3)
    await expect(page.getByTestId("input-otp-separator")).toHaveCount(2)
  })

  test("passes WCAG 2.1 AA", async ({ page, checkA11y }) => {
    await page.goto(`${BASE}/with_field`)
    const results = await checkA11y({ exclude: ["color-contrast"] })
    expect(results.violations).toEqual([])
  })
})
