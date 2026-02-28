import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/toggle_group"

test.describe("ToggleGroup component", () => {
  test("renders with data-slot=toggle-group", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const group = page.locator("[data-slot='toggle-group']")
    await expect(group).toBeVisible()
  })

  test("renders items with data-slot=toggle-group-item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const items = page.locator("[data-slot='toggle-group-item']")
    await expect(items).toHaveCount(3)
  })

  test("group has role=group", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const group = page.locator("[data-slot='toggle-group']")
    await expect(group).toHaveAttribute("role", "group")
  })

  test("items start in off state by default", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const items = page.locator("[data-slot='toggle-group-item']")
    const count = await items.count()
    for (let i = 0; i < count; i++) {
      await expect(items.nth(i)).toHaveAttribute("data-state", "off")
      await expect(items.nth(i)).toHaveAttribute("aria-pressed", "false")
    }
  })

  test("clicking an item toggles it on", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const item = page.locator("[data-slot='toggle-group-item']").first()

    await item.click()
    await expect(item).toHaveAttribute("data-state", "on")
    await expect(item).toHaveAttribute("aria-pressed", "true")
  })

  test("clicking an on item toggles it off in multiple mode", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const item = page.locator("[data-slot='toggle-group-item']").first()

    await item.click()
    await expect(item).toHaveAttribute("data-state", "on")

    await item.click()
    await expect(item).toHaveAttribute("data-state", "off")
    await expect(item).toHaveAttribute("aria-pressed", "false")
  })

  test("multiple mode allows multiple items on", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const items = page.locator("[data-slot='toggle-group-item']")
    const first = items.first()
    const second = items.nth(1)

    await first.click()
    await second.click()

    await expect(first).toHaveAttribute("data-state", "on")
    await expect(second).toHaveAttribute("data-state", "on")
  })

  test("single mode deselects others when selecting one", async ({ page }) => {
    await page.goto(`${BASE}/outline`)
    // Outline preview uses type: :single
    const items = page.locator("[data-slot='toggle-group-item']")
    const first = items.first()
    const second = items.nth(1)

    // First item starts pressed (pressed: true in template)
    await expect(first).toHaveAttribute("data-state", "on")

    // Click second item — first should deselect
    await second.click()
    await expect(second).toHaveAttribute("data-state", "on")
    await expect(second).toHaveAttribute("aria-pressed", "true")
    await expect(first).toHaveAttribute("data-state", "off")
    await expect(first).toHaveAttribute("aria-pressed", "false")
  })

  test("single mode allows deselecting the active item", async ({ page }) => {
    await page.goto(`${BASE}/outline`)
    const first = page.locator("[data-slot='toggle-group-item']").first()

    // First starts on
    await expect(first).toHaveAttribute("data-state", "on")

    // Click it again to deselect
    await first.click()
    await expect(first).toHaveAttribute("data-state", "off")
    await expect(first).toHaveAttribute("aria-pressed", "false")
  })

  test("pre-pressed item renders with correct state", async ({ page }) => {
    await page.goto(`${BASE}/outline`)
    const first = page.locator("[data-slot='toggle-group-item']").first()
    await expect(first).toHaveAttribute("data-state", "on")
    await expect(first).toHaveAttribute("aria-pressed", "true")
  })

  test("ArrowRight moves focus to next item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const items = page.locator("[data-slot='toggle-group-item']")
    const first = items.first()
    const second = items.nth(1)

    await first.focus()
    await page.keyboard.press("ArrowRight")
    await expect(second).toBeFocused()
  })

  test("ArrowDown moves focus to next item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const items = page.locator("[data-slot='toggle-group-item']")
    const first = items.first()
    const second = items.nth(1)

    await first.focus()
    await page.keyboard.press("ArrowDown")
    await expect(second).toBeFocused()
  })

  test("ArrowLeft moves focus to previous item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const items = page.locator("[data-slot='toggle-group-item']")
    const first = items.first()
    const second = items.nth(1)

    await second.focus()
    await page.keyboard.press("ArrowLeft")
    await expect(first).toBeFocused()
  })

  test("ArrowUp moves focus to previous item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const items = page.locator("[data-slot='toggle-group-item']")
    const first = items.first()
    const second = items.nth(1)

    await second.focus()
    await page.keyboard.press("ArrowUp")
    await expect(first).toBeFocused()
  })

  test("ArrowRight wraps from last to first", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const items = page.locator("[data-slot='toggle-group-item']")
    const last = items.last()
    const first = items.first()

    await last.focus()
    await page.keyboard.press("ArrowRight")
    await expect(first).toBeFocused()
  })

  test("ArrowLeft wraps from first to last", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const items = page.locator("[data-slot='toggle-group-item']")
    const first = items.first()
    const last = items.last()

    await first.focus()
    await page.keyboard.press("ArrowLeft")
    await expect(last).toBeFocused()
  })

  test("Home moves focus to first item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const items = page.locator("[data-slot='toggle-group-item']")
    const last = items.last()
    const first = items.first()

    await last.focus()
    await page.keyboard.press("Home")
    await expect(first).toBeFocused()
  })

  test("End moves focus to last item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const items = page.locator("[data-slot='toggle-group-item']")
    const first = items.first()
    const last = items.last()

    await first.focus()
    await page.keyboard.press("End")
    await expect(last).toBeFocused()
  })

  test("disabled items are not interactive", async ({ page }) => {
    await page.goto(`${BASE}/disabled`)
    const items = page.locator("[data-slot='toggle-group-item']")
    const first = items.first()

    // Items have disabled attribute
    await expect(first).toBeDisabled()

    // Click should not change state
    await first.click({ force: true })
    await expect(first).toHaveAttribute("data-state", "off")
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
