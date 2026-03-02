import { test, expect } from "../fixtures/index.js"
import { OverlayModel } from "../models/overlay.js"

const BASE = "/preview/kiso/dropdown_menu"

test.describe("DropdownMenu component", () => {
  let overlay

  test.describe("rendering", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/basic`)
      overlay = new OverlayModel(page, "dropdown-menu")
    })

    test("renders with data-slot=dropdown-menu", async ({ page }) => {
      await expect(page.getByTestId("dropdown-menu")).toBeVisible()
    })

    test("trigger button has aria-haspopup=menu and aria-expanded=false", async () => {
      await expect(overlay.triggerButton).toHaveAttribute("aria-haspopup", "menu")
      await expect(overlay.triggerButton).toHaveAttribute("aria-expanded", "false")
    })

    test("content is hidden by default", async () => {
      await expect(overlay.content).toBeHidden()
    })

    test("content has role=menu", async () => {
      await overlay.open()
      await expect(overlay.content).toHaveAttribute("role", "menu")
    })

    test("items have role=menuitem", async ({ page }) => {
      await overlay.open()
      const items = page.getByTestId("dropdown-menu-item")
      const count = await items.count()
      for (let i = 0; i < count; i++) {
        await expect(items.nth(i)).toHaveAttribute("role", "menuitem")
      }
    })
  })

  test.describe("open/close", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/basic`)
      overlay = new OverlayModel(page, "dropdown-menu")
    })

    test("click trigger opens menu and sets aria-expanded=true", async () => {
      await overlay.open()
      await overlay.expectOpen()
    })

    test("click trigger again closes menu", async () => {
      await overlay.open()
      await overlay.trigger.click()
      await overlay.expectClosed()
    })

    test("Escape closes menu and returns focus to trigger", async () => {
      await overlay.open()
      await overlay.closeWithEscape()
      await expect(overlay.triggerButton).toBeFocused()
    })

    test("outside click closes menu", async () => {
      await overlay.open()
      await overlay.closeWithOutsideClick()
    })

    test("ArrowDown on trigger opens menu", async ({ page }) => {
      await overlay.triggerButton.focus()
      await page.keyboard.press("ArrowDown")
      await expect(overlay.content).toBeVisible()
    })

    test("ArrowUp on trigger opens menu", async ({ page }) => {
      await overlay.triggerButton.focus()
      await page.keyboard.press("ArrowUp")
      await expect(overlay.content).toBeVisible()
    })
  })

  test.describe("keyboard navigation", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/basic`)
      overlay = new OverlayModel(page, "dropdown-menu")
      await overlay.open()
    })

    test("first item is highlighted on open", async ({ page }) => {
      const items = page.locator("[data-slot='dropdown-menu-item']:not([data-disabled='true'])")
      await expect(items.first()).toHaveAttribute("data-highlighted", "")
    })

    test("ArrowDown moves highlight to next item", async ({ page }) => {
      const items = page.locator("[data-slot='dropdown-menu-item']:not([data-disabled='true'])")
      await page.keyboard.press("ArrowDown")
      await expect(items.nth(1)).toHaveAttribute("data-highlighted", "")
    })

    test("ArrowUp moves highlight to previous item", async ({ page }) => {
      const items = page.locator("[data-slot='dropdown-menu-item']:not([data-disabled='true'])")
      await page.keyboard.press("ArrowDown")
      await page.keyboard.press("ArrowUp")
      await expect(items.first()).toHaveAttribute("data-highlighted", "")
    })

    test("ArrowDown wraps around from last to first item", async ({ page }) => {
      const items = page.locator("[data-slot='dropdown-menu-item']:not([data-disabled='true'])")
      const count = await items.count()
      for (let i = 0; i < count; i++) {
        await page.keyboard.press("ArrowDown")
      }
      await expect(items.first()).toHaveAttribute("data-highlighted", "")
    })

    test("Enter on highlighted item closes menu", async ({ page }) => {
      await page.keyboard.press("Enter")
      await expect(overlay.content).toBeHidden()
    })

    test("Space on highlighted item closes menu", async ({ page }) => {
      await page.keyboard.press("Space")
      await expect(overlay.content).toBeHidden()
    })

    test("Home key highlights first item", async ({ page }) => {
      const items = page.locator("[data-slot='dropdown-menu-item']:not([data-disabled='true'])")
      await page.keyboard.press("ArrowDown")
      await page.keyboard.press("ArrowDown")
      await page.keyboard.press("Home")
      await expect(items.first()).toHaveAttribute("data-highlighted", "")
    })

    test("End key highlights last item", async ({ page }) => {
      const items = page.locator("[data-slot='dropdown-menu-item']:not([data-disabled='true'])")
      await page.keyboard.press("End")
      const count = await items.count()
      await expect(items.nth(count - 1)).toHaveAttribute("data-highlighted", "")
    })

    test("type-ahead highlights matching item", async ({ page }) => {
      await page.keyboard.press("s")
      const highlighted = page.locator("[data-slot='dropdown-menu-item'][data-highlighted]")
      const text = await highlighted.textContent()
      expect(text.trim().toLowerCase()).toMatch(/^s/)
    })

    test("disabled items are skipped during navigation", async ({ page }) => {
      const disabledItem = page.locator("[data-slot='dropdown-menu-item'][data-disabled='true']")
      await expect(disabledItem).toBeVisible()
      await expect(disabledItem).not.toHaveAttribute("data-highlighted", "")
    })
  })

  test.describe("checkbox items", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/checkboxes`)
      await page.getByTestId("dropdown-menu-trigger").click()
    })

    test("checkbox item toggles aria-checked on click", async ({ page }) => {
      const checkboxItem = page.getByTestId("dropdown-menu-checkbox-item").first()
      await expect(checkboxItem).toHaveAttribute("role", "menuitemcheckbox")
      await expect(checkboxItem).toHaveAttribute("aria-checked", "true")
      await checkboxItem.click()
      await expect(checkboxItem).toHaveAttribute("aria-checked", "false")
    })

    test("checkbox item keeps menu open after toggle", async ({ page }) => {
      const content = page.getByTestId("dropdown-menu-content")
      const checkboxItem = page.getByTestId("dropdown-menu-checkbox-item").first()
      await checkboxItem.click()
      await expect(content).toBeVisible()
    })
  })

  test.describe("radio items", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/radio_group`)
      await page.getByTestId("dropdown-menu-trigger").click()
    })

    test("radio item selects and deselects siblings", async ({ page }) => {
      const radioItems = page.getByTestId("dropdown-menu-radio-item")
      const topItem = radioItems.filter({ hasText: "Top" })
      const bottomItem = radioItems.filter({ hasText: "Bottom" })

      await expect(bottomItem).toHaveAttribute("aria-checked", "true")
      await expect(topItem).toHaveAttribute("aria-checked", "false")

      await topItem.click()
      await expect(topItem).toHaveAttribute("aria-checked", "true")
      await expect(bottomItem).toHaveAttribute("aria-checked", "false")
    })

    test("radio item keeps menu open after selection", async ({ page }) => {
      const content = page.getByTestId("dropdown-menu-content")
      const topItem = page.getByTestId("dropdown-menu-radio-item").filter({ hasText: "Top" })
      await topItem.click()
      await expect(content).toBeVisible()
    })

    test("radio items have role=menuitemradio", async ({ page }) => {
      const radioItems = page.getByTestId("dropdown-menu-radio-item")
      const count = await radioItems.count()
      for (let i = 0; i < count; i++) {
        await expect(radioItems.nth(i)).toHaveAttribute("role", "menuitemradio")
      }
    })
  })

  test("passes WCAG 2.1 AA", async ({ page, checkA11y }) => {
    await page.goto(`${BASE}/basic`)
    const results = await checkA11y()
    expect(results.violations).toEqual([])
  })
})
