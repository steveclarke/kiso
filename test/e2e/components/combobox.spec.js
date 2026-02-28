import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/combobox"

test.describe("Combobox component", () => {
  test("renders with data-slot=combobox", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const combobox = page.locator("[data-slot='combobox']")
    await expect(combobox).toBeVisible()
  })

  test("renders input and trigger", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='combobox-input']")
    const trigger = page.locator("[data-slot='combobox-trigger']")
    await expect(input).toBeVisible()
    await expect(trigger).toBeVisible()
  })

  test("content is hidden by default", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const content = page.locator("[data-slot='combobox-content']")
    await expect(content).toBeHidden()
  })

  test("opens dropdown when trigger is clicked", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='combobox-trigger']")
    const content = page.locator("[data-slot='combobox-content']")
    await trigger.click()
    await expect(content).toBeVisible()
  })

  test("opens dropdown when input is focused", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='combobox-input'] input")
    const content = page.locator("[data-slot='combobox-content']")
    await input.focus()
    await expect(content).toBeVisible()
  })

  test("closes dropdown with Escape", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='combobox-input'] input")
    const content = page.locator("[data-slot='combobox-content']")
    await input.focus()
    await expect(content).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(content).toBeHidden()
  })

  test("closes dropdown when clicking outside", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='combobox-input'] input")
    const content = page.locator("[data-slot='combobox-content']")
    await input.focus()
    await expect(content).toBeVisible()
    await page.locator("body").click({ position: { x: 0, y: 0 } })
    await expect(content).toBeHidden()
  })

  test("trigger aria-expanded updates on open/close", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='combobox-trigger']")
    const content = page.locator("[data-slot='combobox-content']")
    const input = page.locator("[data-slot='combobox-input'] input")
    await input.focus()
    await expect(content).toBeVisible()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await page.keyboard.press("Escape")
    await expect(content).toBeHidden()
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  test("renders all items in the list", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='combobox-input'] input")
    await input.focus()
    const items = page.locator("[data-slot='combobox-item']")
    await expect(items).toHaveCount(5)
  })

  test("items have correct text content", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='combobox-input'] input")
    await input.focus()
    const firstItem = page.locator("[data-slot='combobox-item']").first()
    await expect(firstItem).toContainText("Next.js")
  })

  test("ArrowDown navigates to next item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='combobox-input'] input")
    await input.focus()
    // First item is auto-highlighted on open
    const items = page.locator("[data-slot='combobox-item']")
    await expect(items.nth(0)).toHaveAttribute("data-highlighted", "")
    await page.keyboard.press("ArrowDown")
    await expect(items.nth(1)).toHaveAttribute("data-highlighted", "")
    await expect(items.nth(0)).not.toHaveAttribute("data-highlighted", "")
  })

  test("ArrowUp navigates to previous item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='combobox-input'] input")
    await input.focus()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    const items = page.locator("[data-slot='combobox-item']")
    await expect(items.nth(2)).toHaveAttribute("data-highlighted", "")
    await page.keyboard.press("ArrowUp")
    await expect(items.nth(1)).toHaveAttribute("data-highlighted", "")
  })

  test("ArrowDown wraps from last to first item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='combobox-input'] input")
    await input.focus()
    const items = page.locator("[data-slot='combobox-item']")
    // Navigate to last item
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press("ArrowDown")
    }
    await expect(items.nth(4)).toHaveAttribute("data-highlighted", "")
    // Wrap around
    await page.keyboard.press("ArrowDown")
    await expect(items.nth(0)).toHaveAttribute("data-highlighted", "")
  })

  test("Home moves highlight to first item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='combobox-input'] input")
    await input.focus()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    const items = page.locator("[data-slot='combobox-item']")
    await expect(items.nth(2)).toHaveAttribute("data-highlighted", "")
    await page.keyboard.press("Home")
    await expect(items.nth(0)).toHaveAttribute("data-highlighted", "")
  })

  test("End moves highlight to last item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='combobox-input'] input")
    await input.focus()
    const items = page.locator("[data-slot='combobox-item']")
    await page.keyboard.press("End")
    await expect(items.nth(4)).toHaveAttribute("data-highlighted", "")
  })

  test("Enter selects highlighted item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='combobox-input'] input")
    const content = page.locator("[data-slot='combobox-content']")
    await input.focus()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    // Dropdown closes after selection
    await expect(content).toBeHidden()
    // Input displays selected text
    await expect(input).toHaveValue("SvelteKit")
  })

  test("clicking an item selects it", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='combobox-input'] input")
    await input.focus()
    const item = page.locator("[data-slot='combobox-item'][data-value='remix']")
    await item.click()
    // Combobox re-opens after selection (focus returns to input triggering open)
    await expect(input).toHaveValue("Remix")
  })

  test("selected item gets aria-selected=true", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='combobox-input'] input")
    await input.focus()
    const item = page.locator("[data-slot='combobox-item'][data-value='nuxtjs']")
    await item.click()
    // Re-open to check the aria state
    await input.focus()
    await expect(item).toHaveAttribute("aria-selected", "true")
  })

  test("selected item shows indicator", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='combobox-input'] input")
    await input.focus()
    const item = page.locator("[data-slot='combobox-item'][data-value='astro']")
    await item.click()
    // Re-open to check indicator
    await input.focus()
    const indicator = item.locator("[data-slot='combobox-item-indicator']")
    await expect(indicator).toBeVisible()
  })

  test("hidden input is updated on selection", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='combobox-input'] input")
    await input.focus()
    const item = page.locator("[data-slot='combobox-item'][data-value='sveltekit']")
    await item.click()
    const hidden = page.locator("input[type='hidden'][name='framework']")
    await expect(hidden).toHaveValue("sveltekit")
  })

  test("filtering narrows visible items", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='combobox-input'] input")
    await input.focus()
    await input.fill("next")
    const visibleItems = page.locator("[data-slot='combobox-item']:not([hidden])")
    await expect(visibleItems).toHaveCount(1)
    await expect(visibleItems.first()).toContainText("Next.js")
  })

  test("empty state shows when no items match filter", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='combobox-input'] input")
    await input.focus()
    await input.fill("zzzzz")
    const empty = page.locator("[data-slot='combobox-empty']")
    await expect(empty).toBeVisible()
    await expect(empty).toContainText("No frameworks found.")
  })

  test("focus returns to input after selection", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='combobox-input'] input")
    await input.focus()
    await page.keyboard.press("Enter")
    await expect(input).toBeFocused()
  })

  test("ArrowDown opens closed dropdown", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const input = page.locator("[data-slot='combobox-input'] input")
    const content = page.locator("[data-slot='combobox-content']")
    await input.focus()
    await page.keyboard.press("Escape")
    await expect(content).toBeHidden()
    await page.keyboard.press("ArrowDown")
    await expect(content).toBeVisible()
  })

  test("disabled combobox does not open", async ({ page }) => {
    await page.goto(`${BASE}/disabled`)
    const input = page.locator("[data-slot='combobox-input'] input")
    const content = page.locator("[data-slot='combobox-content']")
    await expect(input).toBeDisabled()
    await expect(content).toBeHidden()
  })

  test("groups preview renders group labels", async ({ page }) => {
    await page.goto(`${BASE}/groups`)
    const input = page.locator("[data-slot='combobox-input'] input")
    await input.focus()
    const labels = page.locator("[data-slot='combobox-label']")
    await expect(labels).toHaveCount(3)
    await expect(labels.nth(0)).toContainText("Americas")
    await expect(labels.nth(1)).toContainText("Europe")
    await expect(labels.nth(2)).toContainText("Asia/Pacific")
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/with_field`)
    const results = await checkA11y(page, { exclude: ["button-name"] })
    expect(results.violations).toEqual([])
  })
})
