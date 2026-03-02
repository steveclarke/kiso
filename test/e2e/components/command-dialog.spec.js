import { test, expect } from "../fixtures/index.js"

const BASE = "/preview/kiso/command"

/**
 * Wait for the command controller to initialize by checking for an
 * auto-selected item (signals Stimulus JS is loaded and connected).
 */
async function waitForCommand(page) {
  await page.locator("[data-slot='command-item'][data-selected]").waitFor({ state: "attached" })
}

test.describe("CommandDialog component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/dialog`)
    await waitForCommand(page)
  })

  test.describe("rendering", () => {
    test("renders with data-slot=command-dialog", async ({ page }) => {
      await expect(page.getByTestId("command-dialog")).toBeAttached()
    })

    test("dialog is closed by default", async ({ page }) => {
      await expect(page.getByTestId("command-dialog")).not.toHaveAttribute("open")
    })
  })

  test.describe("open/close", () => {
    test("opens with Cmd+K keyboard shortcut", async ({ page }) => {
      const dialog = page.getByTestId("command-dialog")
      await page.keyboard.press("Meta+k")
      await expect(dialog).toHaveAttribute("open", "")
    })

    test("closes with Escape", async ({ page }) => {
      const dialog = page.getByTestId("command-dialog")
      await page.keyboard.press("Meta+k")
      await expect(dialog).toHaveAttribute("open", "")
      await page.keyboard.press("Escape")
      await expect(dialog).not.toHaveAttribute("open")
    })

    test("toggles with repeated Cmd+K", async ({ page }) => {
      const dialog = page.getByTestId("command-dialog")
      await page.keyboard.press("Meta+k")
      await expect(dialog).toHaveAttribute("open", "")
      await page.keyboard.press("Meta+k")
      await expect(dialog).not.toHaveAttribute("open")
    })

    test("clicking backdrop closes dialog", async ({ page }) => {
      const dialog = page.getByTestId("command-dialog")
      await page.keyboard.press("Meta+k")
      await expect(dialog).toHaveAttribute("open", "")
      await dialog.click({ position: { x: 5, y: 5 } })
      await expect(dialog).not.toHaveAttribute("open")
    })
  })

  test.describe("interaction", () => {
    test.beforeEach(async ({ page }) => {
      await page.keyboard.press("Meta+k")
    })

    test("focuses command input when opened", async ({ page }) => {
      await expect(page.getByTestId("command-input")).toBeFocused()
    })

    test("clears input value when reopened", async ({ page }) => {
      const input = page.getByTestId("command-input")
      await input.fill("some search")
      await page.keyboard.press("Escape")
      await page.keyboard.press("Meta+k")
      await expect(input).toHaveValue("")
    })

    test("contains command items inside dialog", async ({ page }) => {
      await expect(page.getByTestId("command-item")).toHaveCount(6)
    })

    test("keyboard navigation works inside dialog", async ({ page }) => {
      const items = page.getByTestId("command-item")
      await expect(items.nth(0)).toHaveAttribute("data-selected", "")
      await page.keyboard.press("ArrowDown")
      await expect(items.nth(1)).toHaveAttribute("data-selected", "")
    })

    test("Enter selects item inside dialog", async ({ page, captureEvent }) => {
      await expect(page.getByTestId("command-input")).toBeFocused()
      const getValue = await captureEvent("[data-slot='command']", "kiso--command:select")
      await page.keyboard.press("Enter")
      const detail = await getValue()
      expect(detail.value).toBe("calendar")
    })

    test("filtering works inside dialog", async ({ page }) => {
      await page.getByTestId("command-input").fill("billing")
      const visibleItems = page.locator("[data-slot='command-item']:not([hidden])")
      await expect(visibleItems).toHaveCount(1)
      await expect(visibleItems.first()).toContainText("Billing")
    })
  })

  test("passes WCAG 2.1 AA when dialog is open", async ({ page, checkA11y }) => {
    await page.keyboard.press("Meta+k")
    await expect(page.getByTestId("command-dialog")).toHaveAttribute("open", "")
    const results = await checkA11y()
    expect(results.violations).toEqual([])
  })
})
