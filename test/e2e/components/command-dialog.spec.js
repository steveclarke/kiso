import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/command"

/**
 * Wait for Stimulus controllers to connect by checking that the command
 * controller has auto-selected the first item (signals JS is loaded).
 */
async function waitForStimulus(page) {
  await page.locator("[data-slot='command-item'][data-selected]").waitFor({ state: "attached" })
}

test.describe("CommandDialog component", () => {
  test("renders with data-slot=command-dialog", async ({ page }) => {
    await page.goto(`${BASE}/dialog`)
    const dialog = page.locator("[data-slot='command-dialog']")
    await expect(dialog).toBeAttached()
  })

  test("dialog is closed by default", async ({ page }) => {
    await page.goto(`${BASE}/dialog`)
    const dialog = page.locator("[data-slot='command-dialog']")
    await expect(dialog).not.toHaveAttribute("open")
  })

  test("opens with Cmd+K keyboard shortcut", async ({ page }) => {
    await page.goto(`${BASE}/dialog`)
    await waitForStimulus(page)
    const dialog = page.locator("[data-slot='command-dialog']")
    await page.keyboard.press("Meta+k")
    await expect(dialog).toHaveAttribute("open", "")
  })

  test("closes with Escape", async ({ page }) => {
    await page.goto(`${BASE}/dialog`)
    await waitForStimulus(page)
    const dialog = page.locator("[data-slot='command-dialog']")
    await page.keyboard.press("Meta+k")
    await expect(dialog).toHaveAttribute("open", "")
    await page.keyboard.press("Escape")
    await expect(dialog).not.toHaveAttribute("open")
  })

  test("toggles with repeated Cmd+K", async ({ page }) => {
    await page.goto(`${BASE}/dialog`)
    await waitForStimulus(page)
    const dialog = page.locator("[data-slot='command-dialog']")
    await page.keyboard.press("Meta+k")
    await expect(dialog).toHaveAttribute("open", "")
    await page.keyboard.press("Meta+k")
    await expect(dialog).not.toHaveAttribute("open")
  })

  test("focuses command input when opened", async ({ page }) => {
    await page.goto(`${BASE}/dialog`)
    await waitForStimulus(page)
    await page.keyboard.press("Meta+k")
    const input = page.locator("[data-slot='command-input']")
    await expect(input).toBeFocused()
  })

  test("clears input value when reopened", async ({ page }) => {
    await page.goto(`${BASE}/dialog`)
    await waitForStimulus(page)
    await page.keyboard.press("Meta+k")
    const input = page.locator("[data-slot='command-input']")
    await input.fill("some search")
    await page.keyboard.press("Escape")
    await page.keyboard.press("Meta+k")
    await expect(input).toHaveValue("")
  })

  test("contains command items inside dialog", async ({ page }) => {
    await page.goto(`${BASE}/dialog`)
    await waitForStimulus(page)
    await page.keyboard.press("Meta+k")
    const items = page.locator("[data-slot='command-item']")
    await expect(items).toHaveCount(6)
  })

  test("keyboard navigation works inside dialog", async ({ page }) => {
    await page.goto(`${BASE}/dialog`)
    await waitForStimulus(page)
    await page.keyboard.press("Meta+k")
    const items = page.locator("[data-slot='command-item']")
    await expect(items.nth(0)).toHaveAttribute("data-selected", "")
    await page.keyboard.press("ArrowDown")
    await expect(items.nth(1)).toHaveAttribute("data-selected", "")
  })

  test("Enter selects item inside dialog", async ({ page }) => {
    await page.goto(`${BASE}/dialog`)
    await waitForStimulus(page)
    await page.keyboard.press("Meta+k")
    const input = page.locator("[data-slot='command-input']")
    await expect(input).toBeFocused()
    // Set up event listener before pressing Enter
    await page.evaluate(() => {
      window.__lastCommandSelect = null
      document.querySelector("[data-slot='command']").addEventListener(
        "kiso--command:select",
        (e) => {
          window.__lastCommandSelect = e.detail.value
        },
        { once: true },
      )
    })
    await page.keyboard.press("Enter")
    const value = await page.evaluate(() => window.__lastCommandSelect)
    expect(value).toBe("calendar")
  })

  test("filtering works inside dialog", async ({ page }) => {
    await page.goto(`${BASE}/dialog`)
    await waitForStimulus(page)
    await page.keyboard.press("Meta+k")
    const input = page.locator("[data-slot='command-input']")
    await input.fill("billing")
    const visibleItems = page.locator("[data-slot='command-item']:not([hidden])")
    await expect(visibleItems).toHaveCount(1)
    await expect(visibleItems.first()).toContainText("Billing")
  })

  test("clicking backdrop closes dialog", async ({ page }) => {
    await page.goto(`${BASE}/dialog`)
    await waitForStimulus(page)
    await page.keyboard.press("Meta+k")
    const dialog = page.locator("[data-slot='command-dialog']")
    await expect(dialog).toHaveAttribute("open", "")

    // Click the backdrop area (top-left corner, outside the centered content)
    await dialog.click({ position: { x: 5, y: 5 } })
    await expect(dialog).not.toHaveAttribute("open")
  })

  test("passes WCAG 2.1 AA when dialog is open", async ({ page }) => {
    await page.goto(`${BASE}/dialog`)
    await waitForStimulus(page)
    await page.keyboard.press("Meta+k")
    const dialog = page.locator("[data-slot='command-dialog']")
    await expect(dialog).toHaveAttribute("open", "")
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
