import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/form/select"

test.describe("Select component", () => {
  test("renders with data-slot=select", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const select = page.locator("[data-slot='select']")
    await expect(select).toBeVisible()
  })

  test("renders trigger and hidden content", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='select-trigger']")
    const content = page.locator("[data-slot='select-content']")
    await expect(trigger).toBeVisible()
    await expect(content).toBeHidden()
  })

  test("shows placeholder text in trigger", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const value = page.locator("[data-slot='select-value']")
    await expect(value).toContainText("Select a fruit")
  })

  test("trigger has aria-haspopup=listbox and aria-expanded=false", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='select-trigger']")
    await expect(trigger).toHaveAttribute("aria-haspopup", "listbox")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  test("click trigger opens the listbox", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='select-trigger']")
    const content = page.locator("[data-slot='select-content']")

    await trigger.click()
    await expect(content).toBeVisible()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
  })

  test("click item selects it and closes", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='select-trigger']")
    const content = page.locator("[data-slot='select-content']")

    await trigger.click()
    await expect(content).toBeVisible()

    const item = page.locator("[data-slot='select-item'][data-value='banana']")
    await item.click()

    await expect(content).toBeHidden()
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  test("selected item updates trigger display text", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='select-trigger']")
    const value = page.locator("[data-slot='select-value']")

    await trigger.click()
    await page.locator("[data-slot='select-item'][data-value='banana']").click()

    await expect(value).toContainText("Banana")
  })

  test("selected item updates hidden input value", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='select-trigger']")
    const hiddenInput = page.locator("[data-slot='select'] input[type='hidden']")

    await trigger.click()
    await page.locator("[data-slot='select-item'][data-value='banana']").click()

    await expect(hiddenInput).toHaveValue("banana")
  })

  test("selected item shows check indicator", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='select-trigger']")

    await trigger.click()
    await page.locator("[data-slot='select-item'][data-value='banana']").click()

    // Reopen to verify indicator
    await trigger.click()
    const selectedItem = page.locator("[data-slot='select-item'][data-value='banana']")
    await expect(selectedItem).toHaveAttribute("aria-selected", "true")

    const indicator = selectedItem.locator("[data-slot='select-item-indicator']")
    await expect(indicator).not.toHaveAttribute("hidden", "")
  })

  test("Space key opens the listbox", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='select-trigger']")
    const content = page.locator("[data-slot='select-content']")

    await trigger.focus()
    await page.keyboard.press("Space")

    await expect(content).toBeVisible()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
  })

  test("Enter key opens the listbox", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='select-trigger']")
    const content = page.locator("[data-slot='select-content']")

    await trigger.focus()
    await page.keyboard.press("Enter")

    await expect(content).toBeVisible()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
  })

  test("ArrowDown on trigger opens the listbox", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='select-trigger']")
    const content = page.locator("[data-slot='select-content']")

    await trigger.focus()
    await page.keyboard.press("ArrowDown")

    await expect(content).toBeVisible()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
  })

  test("ArrowDown navigates to next item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='select-trigger']")

    await trigger.click()

    // First item is highlighted on open
    const firstItem = page.locator("[data-slot='select-item']").first()
    await expect(firstItem).toHaveAttribute("data-highlighted", "")

    // ArrowDown moves to second item
    await page.keyboard.press("ArrowDown")
    const secondItem = page.locator("[data-slot='select-item']").nth(1)
    await expect(secondItem).toHaveAttribute("data-highlighted", "")
    await expect(firstItem).not.toHaveAttribute("data-highlighted")
  })

  test("ArrowUp navigates to previous item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='select-trigger']")

    await trigger.click()

    // Move down then back up
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowUp")

    const firstItem = page.locator("[data-slot='select-item']").first()
    await expect(firstItem).toHaveAttribute("data-highlighted", "")
  })

  test("Enter selects highlighted item and closes", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='select-trigger']")
    const content = page.locator("[data-slot='select-content']")
    const value = page.locator("[data-slot='select-value']")

    await trigger.click()
    await page.keyboard.press("ArrowDown") // move to second item (Banana)
    await page.keyboard.press("Enter")

    await expect(content).toBeHidden()
    await expect(value).toContainText("Banana")
  })

  test("Space selects highlighted item and closes", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='select-trigger']")
    const content = page.locator("[data-slot='select-content']")
    const value = page.locator("[data-slot='select-value']")

    await trigger.click()
    await page.keyboard.press("ArrowDown") // move to Banana
    await page.keyboard.press("Space")

    await expect(content).toBeHidden()
    await expect(value).toContainText("Banana")
  })

  test("Escape closes without selecting", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='select-trigger']")
    const content = page.locator("[data-slot='select-content']")
    const value = page.locator("[data-slot='select-value']")

    await trigger.click()
    await expect(content).toBeVisible()

    await page.keyboard.press("ArrowDown") // highlight an item
    await page.keyboard.press("Escape")

    await expect(content).toBeHidden()
    await expect(value).toContainText("Select a fruit") // placeholder unchanged
  })

  test("Home jumps to first item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='select-trigger']")

    await trigger.click()
    // Move down a few times
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")

    await page.keyboard.press("Home")
    const firstItem = page.locator("[data-slot='select-item']").first()
    await expect(firstItem).toHaveAttribute("data-highlighted", "")
  })

  test("End jumps to last item", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='select-trigger']")

    await trigger.click()
    await page.keyboard.press("End")

    const lastItem = page.locator("[data-slot='select-item']").last()
    await expect(lastItem).toHaveAttribute("data-highlighted", "")
  })

  test("clicking outside closes the dropdown", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='select-trigger']")
    const content = page.locator("[data-slot='select-content']")

    await trigger.click()
    await expect(content).toBeVisible()

    // Click outside the select
    await page.locator("body").click({ position: { x: 0, y: 0 } })
    await expect(content).toBeHidden()
  })

  test("disabled trigger does not open", async ({ page }) => {
    await page.goto(`${BASE}/disabled`)
    const trigger = page.locator("[data-slot='select-trigger']")
    const content = page.locator("[data-slot='select-content']")

    await trigger.click({ force: true })
    await expect(content).toBeHidden()
  })

  test("renders items with role=option", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-slot='select-trigger']")
    await trigger.click()

    const items = page.locator("[data-slot='select-item']")
    const count = await items.count()
    for (let i = 0; i < count; i++) {
      await expect(items.nth(i)).toHaveAttribute("role", "option")
    }
  })

  test("content has role=listbox", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const content = page.locator("[data-slot='select-content']")
    await expect(content).toHaveAttribute("role", "listbox")
  })

  test("renders groups with labels", async ({ page }) => {
    await page.goto(`${BASE}/groups`)
    const trigger = page.locator("[data-slot='select-trigger']")
    await trigger.click()

    const labels = page.locator("[data-slot='select-label']")
    await expect(labels).toHaveCount(2)
    await expect(labels.first()).toContainText("Fruits")
    await expect(labels.last()).toContainText("Vegetables")
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
