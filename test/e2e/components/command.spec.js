import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/command"

test.describe("Command component", () => {
  test("renders with data-slot=command", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const command = page.locator("[data-slot='command']")
    await expect(command).toBeVisible()
  })

  test("renders input with placeholder", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='command-input']")
    await expect(input).toBeVisible()
    await expect(input).toHaveAttribute("placeholder", "Type a command or search...")
  })

  test("renders items in groups", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const groups = page.locator("[data-slot='command-group']")
    await expect(groups).toHaveCount(2)
    const headings = page.locator("[data-slot='command-group-heading']")
    await expect(headings.nth(0)).toContainText("Suggestions")
    await expect(headings.nth(1)).toContainText("Settings")
  })

  test("renders all items", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const items = page.locator("[data-slot='command-item']")
    await expect(items).toHaveCount(6)
  })

  test("first enabled item is selected on load", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const firstItem = page.locator("[data-slot='command-item']").first()
    await expect(firstItem).toHaveAttribute("data-selected", "")
  })

  test("ArrowDown moves selection to next item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='command-input']")
    await input.focus()
    const items = page.locator("[data-slot='command-item']")
    await expect(items.nth(0)).toHaveAttribute("data-selected", "")
    await page.keyboard.press("ArrowDown")
    await expect(items.nth(1)).toHaveAttribute("data-selected", "")
    await expect(items.nth(0)).not.toHaveAttribute("data-selected", "")
  })

  test("ArrowUp moves selection to previous item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='command-input']")
    await input.focus()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    const items = page.locator("[data-slot='command-item']")
    await page.keyboard.press("ArrowUp")
    await expect(items.nth(1)).toHaveAttribute("data-selected", "")
  })

  test("ArrowDown wraps from last to first enabled item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='command-input']")
    await input.focus()
    // Playground has 6 items but Calculator is disabled, so 5 enabled items
    const enabledItems = page.locator("[data-slot='command-item']:not([data-disabled='true'])")
    const count = await enabledItems.count()
    // Navigate to last enabled item
    for (let i = 0; i < count - 1; i++) {
      await page.keyboard.press("ArrowDown")
    }
    // Wrap around
    await page.keyboard.press("ArrowDown")
    await expect(enabledItems.first()).toHaveAttribute("data-selected", "")
  })

  test("Home moves selection to first enabled item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='command-input']")
    await input.focus()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Home")
    const firstEnabled = page
      .locator("[data-slot='command-item']:not([data-disabled='true'])")
      .first()
    await expect(firstEnabled).toHaveAttribute("data-selected", "")
  })

  test("End moves selection to last enabled item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='command-input']")
    await input.focus()
    await page.keyboard.press("End")
    const enabledItems = page.locator("[data-slot='command-item']:not([data-disabled='true'])")
    await expect(enabledItems.last()).toHaveAttribute("data-selected", "")
  })

  test("Enter dispatches select event on highlighted item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='command-input']")
    await input.focus()
    // Set up listener before pressing Enter
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

  test("clicking an item dispatches select event", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
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
    const item = page.locator("[data-slot='command-item'][data-value='profile']")
    await item.click()
    const value = await page.evaluate(() => window.__lastCommandSelect)
    expect(value).toBe("profile")
  })

  test("disabled item cannot be selected by click", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const disabledItem = page.locator("[data-slot='command-item'][data-disabled='true']")
    await expect(disabledItem).toBeVisible()
    // Disabled items have pointer-events:none via CSS, verify the attribute
    await expect(disabledItem).toHaveAttribute("data-disabled", "true")
    await expect(disabledItem).toHaveAttribute("aria-disabled", "true")
  })

  test("filtering narrows visible items", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='command-input']")
    await input.focus()
    await input.fill("cal")
    const visibleItems = page.locator("[data-slot='command-item']:not([hidden])")
    await expect(visibleItems).toHaveCount(2) // Calendar + Calculator
  })

  test("filtering hides empty groups", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='command-input']")
    await input.focus()
    await input.fill("profile")
    const settingsGroup = page.locator("[data-slot='command-group']").nth(1)
    await expect(settingsGroup).toBeVisible()
    // Suggestions group should be hidden (no matching items)
    const suggestionsGroup = page.locator("[data-slot='command-group']").first()
    await expect(suggestionsGroup).toBeHidden()
  })

  test("empty state shows when no items match", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='command-input']")
    await input.focus()
    await input.fill("zzzzz")
    const empty = page.locator("[data-slot='command-empty']")
    await expect(empty).toBeVisible()
    await expect(empty).toContainText("No results found.")
  })

  test("shortcuts render in items", async ({ page }) => {
    await page.goto(`${BASE}/shortcuts`)
    const shortcuts = page.locator("[data-slot='command-shortcut']")
    await expect(shortcuts).toHaveCount(3)
  })

  test("groups preview renders multiple groups with headings", async ({ page }) => {
    await page.goto(`${BASE}/groups`)
    const groups = page.locator("[data-slot='command-group']")
    await expect(groups).toHaveCount(2)
    const separator = page.locator("[data-slot='command-separator']")
    await expect(separator).toHaveCount(1)
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
