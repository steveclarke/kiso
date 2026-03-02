import { test, expect } from "../fixtures/index.js"
import { ListboxModel } from "../models/listbox.js"
import { OverlayModel } from "../models/overlay.js"

const BASE = "/preview/kiso/form/select"

test.describe("Select component", () => {
  let overlay
  let listbox

  test.describe("rendering", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
      overlay = new OverlayModel(page, "select", { triggerIsButton: true })
      listbox = new ListboxModel(page, "select")
    })

    test("renders with data-slot=select", async ({ page }) => {
      await expect(page.getByTestId("select")).toBeVisible()
    })

    test("renders trigger and hidden content", async () => {
      await expect(overlay.trigger).toBeVisible()
      await expect(overlay.content).toBeHidden()
    })

    test("shows placeholder text in trigger", async ({ page }) => {
      await expect(page.getByTestId("select-value")).toContainText("Select a fruit")
    })

    test("trigger has aria-haspopup=listbox and aria-expanded=false", async () => {
      await expect(overlay.trigger).toHaveAttribute("aria-haspopup", "listbox")
      await expect(overlay.trigger).toHaveAttribute("aria-expanded", "false")
    })

    test("content has role=listbox", async () => {
      await expect(overlay.content).toHaveAttribute("role", "listbox")
    })

    test("renders items with role=option", async () => {
      await overlay.open()
      const count = await listbox.count()
      for (let i = 0; i < count; i++) {
        await expect(listbox.items.nth(i)).toHaveAttribute("role", "option")
      }
    })
  })

  test.describe("open/close", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
      overlay = new OverlayModel(page, "select", { triggerIsButton: true })
    })

    test("click trigger opens the listbox", async () => {
      await overlay.open()
      await overlay.expectOpen()
    })

    test("Escape closes without selecting", async ({ page }) => {
      await overlay.open()
      await page.keyboard.press("ArrowDown")
      await overlay.closeWithEscape()
      await expect(page.getByTestId("select-value")).toContainText("Select a fruit")
    })

    test("clicking outside closes the dropdown", async () => {
      await overlay.open()
      await overlay.closeWithOutsideClick()
    })

    test("Space key opens the listbox", async ({ page }) => {
      await overlay.triggerButton.focus()
      await page.keyboard.press("Space")
      await overlay.expectOpen()
    })

    test("Enter key opens the listbox", async ({ page }) => {
      await overlay.triggerButton.focus()
      await page.keyboard.press("Enter")
      await overlay.expectOpen()
    })

    test("ArrowDown on trigger opens the listbox", async ({ page }) => {
      await overlay.triggerButton.focus()
      await page.keyboard.press("ArrowDown")
      await overlay.expectOpen()
    })
  })

  test.describe("keyboard navigation", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
      overlay = new OverlayModel(page, "select", { triggerIsButton: true })
      listbox = new ListboxModel(page, "select")
      await overlay.open()
    })

    test("first item is highlighted on open", async () => {
      await listbox.expectHighlightedAt(0)
    })

    test("ArrowDown navigates to next item", async () => {
      await listbox.arrowDown()
      await listbox.expectHighlightedAt(1)
      await listbox.expectNotHighlightedAt(0)
    })

    test("ArrowUp navigates to previous item", async () => {
      await listbox.arrowDown()
      await listbox.arrowUp()
      await listbox.expectHighlightedAt(0)
    })

    test("Home jumps to first item", async () => {
      await listbox.arrowDown(3)
      await listbox.home()
      await listbox.expectHighlightedAt(0)
    })

    test("End jumps to last item", async () => {
      await listbox.end()
      await expect(listbox.items.last()).toHaveAttribute("data-highlighted", "")
    })
  })

  test.describe("selection", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
      overlay = new OverlayModel(page, "select", { triggerIsButton: true })
      listbox = new ListboxModel(page, "select")
    })

    test("click item selects it and closes", async ({ page }) => {
      await overlay.open()
      await page.locator("[data-slot='select-item'][data-value='banana']").click()
      await overlay.expectClosed()
    })

    test("selected item updates trigger display text", async ({ page }) => {
      await overlay.open()
      await page.locator("[data-slot='select-item'][data-value='banana']").click()
      await expect(page.getByTestId("select-value")).toContainText("Banana")
    })

    test("selected item updates hidden input value", async ({ page }) => {
      await overlay.open()
      await page.locator("[data-slot='select-item'][data-value='banana']").click()
      await expect(page.locator("[data-slot='select'] input[type='hidden']")).toHaveValue("banana")
    })

    test("selected item shows check indicator", async ({ page }) => {
      await overlay.open()
      await page.locator("[data-slot='select-item'][data-value='banana']").click()
      await overlay.open()
      const selectedItem = page.locator("[data-slot='select-item'][data-value='banana']")
      await expect(selectedItem).toHaveAttribute("aria-selected", "true")
      await expect(selectedItem.locator("[data-slot='select-item-indicator']")).not.toHaveAttribute(
        "hidden",
        "",
      )
    })

    test("Enter selects highlighted item and closes", async ({ page }) => {
      await overlay.open()
      await listbox.arrowDown()
      await listbox.selectWithEnter()
      await expect(overlay.content).toBeHidden()
      await expect(page.getByTestId("select-value")).toContainText("Banana")
    })

    test("Space selects highlighted item and closes", async ({ page }) => {
      await overlay.open()
      await listbox.arrowDown()
      await listbox.selectWithSpace()
      await expect(overlay.content).toBeHidden()
      await expect(page.getByTestId("select-value")).toContainText("Banana")
    })
  })

  test.describe("variants", () => {
    test("disabled trigger does not open", async ({ page }) => {
      await page.goto(`${BASE}/disabled`)
      await page.getByTestId("select-trigger").click({ force: true })
      await expect(page.getByTestId("select-content")).toBeHidden()
    })

    test("renders groups with labels", async ({ page }) => {
      await page.goto(`${BASE}/groups`)
      await page.getByTestId("select-trigger").click()
      const labels = page.getByTestId("select-label")
      await expect(labels).toHaveCount(2)
      await expect(labels.first()).toContainText("Fruits")
      await expect(labels.last()).toContainText("Vegetables")
    })
  })

  test("passes WCAG 2.1 AA", async ({ page, checkA11y }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y()
    expect(results.violations).toEqual([])
  })
})
