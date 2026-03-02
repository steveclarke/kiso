import { test, expect } from "../fixtures/index.js"
import { ListboxModel } from "../models/listbox.js"

const BASE = "/preview/kiso/combobox"

test.describe("Combobox component", () => {
  let listbox

  test.describe("rendering", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("renders with data-slot=combobox", async ({ page }) => {
      await expect(page.getByTestId("combobox")).toBeVisible()
    })

    test("renders input and trigger", async ({ page }) => {
      await expect(page.getByTestId("combobox-input")).toBeVisible()
      await expect(page.getByTestId("combobox-trigger")).toBeVisible()
    })

    test("content is hidden by default", async ({ page }) => {
      await expect(page.getByTestId("combobox-content")).toBeHidden()
    })
  })

  test.describe("open/close", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("opens dropdown when trigger is clicked", async ({ page }) => {
      await page.getByTestId("combobox-trigger").click()
      await expect(page.getByTestId("combobox-content")).toBeVisible()
    })

    test("opens dropdown when input is focused", async ({ page }) => {
      await page.locator("[data-slot='combobox-input'] input").focus()
      await expect(page.getByTestId("combobox-content")).toBeVisible()
    })

    test("closes dropdown with Escape", async ({ page }) => {
      const input = page.locator("[data-slot='combobox-input'] input")
      const content = page.getByTestId("combobox-content")
      await input.focus()
      await expect(content).toBeVisible()
      await page.keyboard.press("Escape")
      await expect(content).toBeHidden()
    })

    test("closes dropdown when clicking outside", async ({ page }) => {
      const input = page.locator("[data-slot='combobox-input'] input")
      const content = page.getByTestId("combobox-content")
      await input.focus()
      await expect(content).toBeVisible()
      await page.locator("body").click({ position: { x: 1, y: 1 } })
      await expect(content).toBeHidden()
    })

    test("trigger aria-expanded updates on open/close", async ({ page }) => {
      const trigger = page.getByTestId("combobox-trigger")
      const input = page.locator("[data-slot='combobox-input'] input")
      await input.focus()
      await expect(trigger).toHaveAttribute("aria-expanded", "true")
      await page.keyboard.press("Escape")
      await expect(trigger).toHaveAttribute("aria-expanded", "false")
    })

    test("ArrowDown opens closed dropdown", async ({ page }) => {
      const input = page.locator("[data-slot='combobox-input'] input")
      const content = page.getByTestId("combobox-content")
      await input.focus()
      await page.keyboard.press("Escape")
      await expect(content).toBeHidden()
      await page.keyboard.press("ArrowDown")
      await expect(content).toBeVisible()
    })
  })

  test.describe("keyboard navigation", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
      listbox = new ListboxModel(page, "combobox")
      await page.locator("[data-slot='combobox-input'] input").focus()
    })

    test("renders all items in the list", async () => {
      await expect(listbox.items).toHaveCount(5)
    })

    test("items have correct text content", async () => {
      await expect(listbox.items.first()).toContainText("Next.js")
    })

    test("ArrowDown navigates to next item", async () => {
      await listbox.expectHighlightedAt(0)
      await listbox.arrowDown()
      await listbox.expectHighlightedAt(1)
      await listbox.expectNotHighlightedAt(0)
    })

    test("ArrowUp navigates to previous item", async () => {
      await listbox.arrowDown(2)
      await listbox.expectHighlightedAt(2)
      await listbox.arrowUp()
      await listbox.expectHighlightedAt(1)
    })

    test("ArrowDown wraps from last to first item", async () => {
      await listbox.arrowDown(4)
      await listbox.expectHighlightedAt(4)
      await listbox.arrowDown()
      await listbox.expectHighlightedAt(0)
    })

    test("Home moves highlight to first item", async () => {
      await listbox.arrowDown(2)
      await listbox.expectHighlightedAt(2)
      await listbox.home()
      await listbox.expectHighlightedAt(0)
    })

    test("End moves highlight to last item", async () => {
      await listbox.end()
      await listbox.expectHighlightedAt(4)
    })
  })

  test.describe("selection", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
      listbox = new ListboxModel(page, "combobox")
    })

    test("Enter selects highlighted item", async ({ page }) => {
      const input = page.locator("[data-slot='combobox-input'] input")
      await input.focus()
      await listbox.arrowDown()
      await page.keyboard.press("Enter")
      await expect(page.getByTestId("combobox-content")).toBeHidden()
      await expect(input).toHaveValue("SvelteKit")
    })

    test("clicking an item selects it and closes dropdown", async ({ page }) => {
      const input = page.locator("[data-slot='combobox-input'] input")
      await input.focus()
      await page.locator("[data-slot='combobox-item'][data-value='remix']").click()
      await expect(page.getByTestId("combobox-content")).toBeHidden()
      await expect(input).toHaveValue("Remix")
      await expect(input).toBeFocused()
    })

    test("selected item gets aria-selected=true", async ({ page }) => {
      const input = page.locator("[data-slot='combobox-input'] input")
      await input.focus()
      const item = page.locator("[data-slot='combobox-item'][data-value='nuxtjs']")
      await item.click()
      await page.getByTestId("combobox-trigger").click()
      await expect(item).toHaveAttribute("aria-selected", "true")
    })

    test("selected item shows indicator", async ({ page }) => {
      const input = page.locator("[data-slot='combobox-input'] input")
      await input.focus()
      const item = page.locator("[data-slot='combobox-item'][data-value='astro']")
      await item.click()
      await page.getByTestId("combobox-trigger").click()
      await expect(item.locator("[data-slot='combobox-item-indicator']")).toBeVisible()
    })

    test("hidden input is updated on selection", async ({ page }) => {
      const input = page.locator("[data-slot='combobox-input'] input")
      await input.focus()
      await page.locator("[data-slot='combobox-item'][data-value='sveltekit']").click()
      await expect(page.locator("input[type='hidden'][name='framework']")).toHaveValue("sveltekit")
    })

    test("focus returns to input after selection", async ({ page }) => {
      const input = page.locator("[data-slot='combobox-input'] input")
      await input.focus()
      await page.keyboard.press("Enter")
      await expect(input).toBeFocused()
    })
  })

  test.describe("filtering", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
      await page.locator("[data-slot='combobox-input'] input").focus()
    })

    test("filtering narrows visible items", async ({ page }) => {
      await page.locator("[data-slot='combobox-input'] input").fill("next")
      const visibleItems = page.locator("[data-slot='combobox-item']:not([hidden])")
      await expect(visibleItems).toHaveCount(1)
      await expect(visibleItems.first()).toContainText("Next.js")
    })

    test("empty state shows when no items match filter", async ({ page }) => {
      await page.locator("[data-slot='combobox-input'] input").fill("zzzzz")
      const empty = page.getByTestId("combobox-empty")
      await expect(empty).toBeVisible()
      await expect(empty).toContainText("No frameworks found.")
    })
  })

  test.describe("variants", () => {
    test("disabled combobox does not open", async ({ page }) => {
      await page.goto(`${BASE}/disabled`)
      await expect(page.locator("[data-slot='combobox-input'] input")).toBeDisabled()
      await expect(page.getByTestId("combobox-content")).toBeHidden()
    })

    test("groups preview renders group labels", async ({ page }) => {
      await page.goto(`${BASE}/groups`)
      await page.locator("[data-slot='combobox-input'] input").focus()
      const labels = page.getByTestId("combobox-label")
      await expect(labels).toHaveCount(3)
      await expect(labels.nth(0)).toContainText("Americas")
      await expect(labels.nth(1)).toContainText("Europe")
      await expect(labels.nth(2)).toContainText("Asia/Pacific")
    })
  })

  test("passes WCAG 2.1 AA", async ({ page, checkA11y }) => {
    await page.goto(`${BASE}/with_field`)
    const results = await checkA11y()
    expect(results.violations).toEqual([])
  })
})
