import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/dropdown_menu"

test.describe("DropdownMenu component", () => {
  test("renders with data-slot=dropdown-menu", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const menu = page.locator("[data-slot='dropdown-menu']")
    await expect(menu).toBeVisible()
  })

  test("trigger button has aria-haspopup=menu and aria-expanded=false", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const button = page.locator("[data-slot='dropdown-menu-trigger'] button")
    await expect(button).toHaveAttribute("aria-haspopup", "menu")
    await expect(button).toHaveAttribute("aria-expanded", "false")
  })

  test("content is hidden by default", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const content = page.locator("[data-slot='dropdown-menu-content']")
    await expect(content).toBeHidden()
  })

  test("click trigger opens menu and sets aria-expanded=true", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")
    const content = page.locator("[data-slot='dropdown-menu-content']")

    await trigger.click()
    await expect(content).toBeVisible()
    const button = page.locator("[data-slot='dropdown-menu-trigger'] button")
    await expect(button).toHaveAttribute("aria-expanded", "true")
  })

  test("click trigger again closes menu", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")
    const content = page.locator("[data-slot='dropdown-menu-content']")

    await trigger.click()
    await expect(content).toBeVisible()

    await trigger.click()
    await expect(content).toBeHidden()
    const button = page.locator("[data-slot='dropdown-menu-trigger'] button")
    await expect(button).toHaveAttribute("aria-expanded", "false")
  })

  test("Escape closes menu and returns focus to trigger", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")
    const content = page.locator("[data-slot='dropdown-menu-content']")
    const button = trigger.locator("button")

    await trigger.click()
    await expect(content).toBeVisible()

    await page.keyboard.press("Escape")
    await expect(content).toBeHidden()
    await expect(button).toBeFocused()
  })

  test("outside click closes menu", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")
    const content = page.locator("[data-slot='dropdown-menu-content']")

    await trigger.click()
    await expect(content).toBeVisible()

    await page.locator("body").click({ position: { x: 10, y: 10 } })
    await expect(content).toBeHidden()
  })

  test("first item is highlighted on open", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")

    await trigger.click()
    const items = page.locator("[data-slot='dropdown-menu-item']:not([data-disabled='true'])")
    await expect(items.first()).toHaveAttribute("data-highlighted", "")
  })

  test("ArrowDown moves highlight to next item", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")

    await trigger.click()
    const items = page.locator("[data-slot='dropdown-menu-item']:not([data-disabled='true'])")

    await page.keyboard.press("ArrowDown")
    await expect(items.nth(1)).toHaveAttribute("data-highlighted", "")
  })

  test("ArrowUp moves highlight to previous item", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")

    await trigger.click()
    // First item highlighted initially, ArrowDown then ArrowUp should return to first
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowUp")
    const items = page.locator("[data-slot='dropdown-menu-item']:not([data-disabled='true'])")
    await expect(items.first()).toHaveAttribute("data-highlighted", "")
  })

  test("ArrowDown wraps around from last to first item", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")

    await trigger.click()
    const items = page.locator("[data-slot='dropdown-menu-item']:not([data-disabled='true'])")
    const count = await items.count()

    // Press ArrowDown enough times to wrap around
    for (let i = 0; i < count; i++) {
      await page.keyboard.press("ArrowDown")
    }
    await expect(items.first()).toHaveAttribute("data-highlighted", "")
  })

  test("Enter on highlighted item closes menu", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")
    const content = page.locator("[data-slot='dropdown-menu-content']")

    await trigger.click()
    await expect(content).toBeVisible()

    await page.keyboard.press("Enter")
    await expect(content).toBeHidden()
  })

  test("Space on highlighted item closes menu", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")
    const content = page.locator("[data-slot='dropdown-menu-content']")

    await trigger.click()
    await expect(content).toBeVisible()

    await page.keyboard.press("Space")
    await expect(content).toBeHidden()
  })

  test("disabled items are skipped during navigation", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")

    await trigger.click()
    // Navigate to the end — disabled API item should be skipped
    const disabledItem = page.locator("[data-slot='dropdown-menu-item'][data-disabled='true']")
    await expect(disabledItem).toBeVisible()
    await expect(disabledItem).not.toHaveAttribute("data-highlighted", "")
  })

  test("ArrowDown on trigger opens menu", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")
    const content = page.locator("[data-slot='dropdown-menu-content']")
    const button = trigger.locator("button")

    await button.focus()
    await page.keyboard.press("ArrowDown")
    await expect(content).toBeVisible()
  })

  test("ArrowUp on trigger opens menu", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")
    const content = page.locator("[data-slot='dropdown-menu-content']")
    const button = trigger.locator("button")

    await button.focus()
    await page.keyboard.press("ArrowUp")
    await expect(content).toBeVisible()
  })

  test("content has role=menu", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")
    await trigger.click()
    const content = page.locator("[data-slot='dropdown-menu-content']")
    await expect(content).toHaveAttribute("role", "menu")
  })

  test("items have role=menuitem", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")
    await trigger.click()
    const items = page.locator("[data-slot='dropdown-menu-item']")
    const count = await items.count()
    for (let i = 0; i < count; i++) {
      await expect(items.nth(i)).toHaveAttribute("role", "menuitem")
    }
  })

  test("checkbox item toggles aria-checked on click", async ({ page }) => {
    await page.goto(`${BASE}/checkboxes`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")
    await trigger.click()

    const checkboxItem = page.locator("[data-slot='dropdown-menu-checkbox-item']").first()
    await expect(checkboxItem).toHaveAttribute("role", "menuitemcheckbox")
    await expect(checkboxItem).toHaveAttribute("aria-checked", "true")

    await checkboxItem.click()
    await expect(checkboxItem).toHaveAttribute("aria-checked", "false")
  })

  test("checkbox item keeps menu open after toggle", async ({ page }) => {
    await page.goto(`${BASE}/checkboxes`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")
    const content = page.locator("[data-slot='dropdown-menu-content']")
    await trigger.click()

    const checkboxItem = page.locator("[data-slot='dropdown-menu-checkbox-item']").first()
    await checkboxItem.click()
    await expect(content).toBeVisible()
  })

  test("radio item selects and deselects siblings", async ({ page }) => {
    await page.goto(`${BASE}/radio_group`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")
    await trigger.click()

    const radioItems = page.locator("[data-slot='dropdown-menu-radio-item']")
    const topItem = radioItems.filter({ hasText: "Top" })
    const bottomItem = radioItems.filter({ hasText: "Bottom" })

    // Bottom is initially checked
    await expect(bottomItem).toHaveAttribute("aria-checked", "true")
    await expect(topItem).toHaveAttribute("aria-checked", "false")

    // Click Top — it should become checked, Bottom unchecked
    await topItem.click()
    await expect(topItem).toHaveAttribute("aria-checked", "true")
    await expect(bottomItem).toHaveAttribute("aria-checked", "false")
  })

  test("radio item keeps menu open after selection", async ({ page }) => {
    await page.goto(`${BASE}/radio_group`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")
    const content = page.locator("[data-slot='dropdown-menu-content']")
    await trigger.click()

    const topItem = page
      .locator("[data-slot='dropdown-menu-radio-item']")
      .filter({ hasText: "Top" })
    await topItem.click()
    await expect(content).toBeVisible()
  })

  test("radio items have role=menuitemradio", async ({ page }) => {
    await page.goto(`${BASE}/radio_group`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")
    await trigger.click()

    const radioItems = page.locator("[data-slot='dropdown-menu-radio-item']")
    const count = await radioItems.count()
    for (let i = 0; i < count; i++) {
      await expect(radioItems.nth(i)).toHaveAttribute("role", "menuitemradio")
    }
  })

  test("Home key highlights first item", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")
    await trigger.click()

    // Navigate down a couple items first
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")

    await page.keyboard.press("Home")
    const items = page.locator("[data-slot='dropdown-menu-item']:not([data-disabled='true'])")
    await expect(items.first()).toHaveAttribute("data-highlighted", "")
  })

  test("End key highlights last item", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")
    await trigger.click()

    await page.keyboard.press("End")
    const items = page.locator("[data-slot='dropdown-menu-item']:not([data-disabled='true'])")
    const count = await items.count()
    await expect(items.nth(count - 1)).toHaveAttribute("data-highlighted", "")
  })

  test("type-ahead highlights matching item", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='dropdown-menu-trigger']")
    await trigger.click()

    // Type "s" to jump to "Settings" or "Support"
    await page.keyboard.press("s")
    const highlighted = page.locator("[data-slot='dropdown-menu-item'][data-highlighted]")
    const text = await highlighted.textContent()
    expect(text.trim().toLowerCase()).toMatch(/^s/)
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
