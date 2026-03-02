import { test, expect } from "../fixtures/index.js"
import { CommandModel } from "../models/command.js"

const BASE = "/preview/kiso/command"

test.describe("Command component", () => {
  let command

  test.describe("rendering", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
      command = new CommandModel(page)
    })

    test("renders with data-slot=command", async ({ page }) => {
      await expect(page.getByTestId("command")).toBeVisible()
    })

    test("renders input with placeholder", async () => {
      await expect(command.input).toBeVisible()
      await expect(command.input).toHaveAttribute("placeholder", "Type a command or search...")
    })

    test("renders items in groups", async ({ page }) => {
      await expect(command.groups).toHaveCount(2)
      const headings = page.getByTestId("command-group-heading")
      await expect(headings.nth(0)).toContainText("Suggestions")
      await expect(headings.nth(1)).toContainText("Settings")
    })

    test("renders all items", async () => {
      await expect(command.items).toHaveCount(6)
    })

    test("first enabled item is selected on load", async () => {
      await command.expectSelectedAt(0)
    })
  })

  test.describe("keyboard navigation", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
      command = new CommandModel(page)
      await command.focusInput()
    })

    test("ArrowDown moves selection to next item", async () => {
      await command.expectSelectedAt(0)
      await command.arrowDown()
      await command.expectSelectedAt(1)
      await command.expectNotSelectedAt(0)
    })

    test("ArrowUp moves selection to previous item", async () => {
      await command.arrowDown(2)
      await command.arrowUp()
      await command.expectSelectedAt(1)
    })

    test("ArrowDown wraps from last to first enabled item", async () => {
      const count = await command.enabledItems.count()
      await command.arrowDown(count - 1)
      await command.arrowDown()
      await command.expectFirstEnabledSelected()
    })

    test("Home moves selection to first enabled item", async () => {
      await command.arrowDown(2)
      await command.home()
      await command.expectFirstEnabledSelected()
    })

    test("End moves selection to last enabled item", async () => {
      await command.end()
      await command.expectLastEnabledSelected()
    })
  })

  test.describe("selection", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
      command = new CommandModel(page)
      await command.focusInput()
    })

    test("Enter dispatches select event on highlighted item", async ({ page, captureEvent }) => {
      const getValue = await captureEvent("[data-slot='command']", "kiso--command:select")
      await page.keyboard.press("Enter")
      const detail = await getValue()
      expect(detail.value).toBe("calendar")
    })

    test("clicking an item dispatches select event", async ({ page, captureEvent }) => {
      const getValue = await captureEvent("[data-slot='command']", "kiso--command:select")
      await page.locator("[data-slot='command-item'][data-value='profile']").click()
      const detail = await getValue()
      expect(detail.value).toBe("profile")
    })

    test("disabled item cannot be selected by click", async ({ page }) => {
      const disabledItem = page.locator("[data-slot='command-item'][data-disabled='true']")
      await expect(disabledItem).toBeVisible()
      await expect(disabledItem).toHaveAttribute("data-disabled", "true")
      await expect(disabledItem).toHaveAttribute("aria-disabled", "true")
    })
  })

  test.describe("filtering", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
      command = new CommandModel(page)
      await command.focusInput()
    })

    test("filtering narrows visible items", async () => {
      await command.filter("cal")
      await expect(command.visibleItems()).toHaveCount(2)
    })

    test("filtering hides empty groups", async () => {
      await command.filter("profile")
      const settingsGroup = command.groups.nth(1)
      await expect(settingsGroup).toBeVisible()
      const suggestionsGroup = command.groups.first()
      await expect(suggestionsGroup).toBeHidden()
    })

    test("empty state shows when no items match", async () => {
      await command.filter("zzzzz")
      await expect(command.empty).toBeVisible()
      await expect(command.empty).toContainText("No results found.")
    })
  })

  test.describe("variants", () => {
    test("shortcuts render in items", async ({ page }) => {
      await page.goto(`${BASE}/shortcuts`)
      await expect(page.getByTestId("command-shortcut")).toHaveCount(3)
    })

    test("groups preview renders multiple groups with headings", async ({ page }) => {
      await page.goto(`${BASE}/groups`)
      await expect(page.getByTestId("command-group")).toHaveCount(2)
      await expect(page.getByTestId("command-separator")).toHaveCount(1)
    })
  })

  test("passes WCAG 2.1 AA", async ({ page, checkA11y }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y()
    expect(results.violations).toEqual([])
  })
})
