import { test, expect } from "../fixtures/index.js"
import { OverlayModel } from "../models/overlay.js"

const BASE = "/preview/kiso/popover"

test.describe("Popover component", () => {
  let overlay

  test.describe("rendering", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/basic`)
      overlay = new OverlayModel(page, "popover")
    })

    test("renders with data-slot=popover", async ({ page }) => {
      await expect(page.getByTestId("popover")).toBeVisible()
    })

    test("trigger button has aria-haspopup=dialog and aria-expanded=false", async () => {
      await expect(overlay.triggerButton).toHaveAttribute("aria-haspopup", "dialog")
      await expect(overlay.triggerButton).toHaveAttribute("aria-expanded", "false")
    })

    test("content is hidden by default", async () => {
      await expect(overlay.content).toBeHidden()
    })

    test("content has role=dialog", async () => {
      await expect(overlay.content).toHaveAttribute("role", "dialog")
    })
  })

  test.describe("open/close", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/basic`)
      overlay = new OverlayModel(page, "popover")
    })

    test("click trigger opens popover and sets aria-expanded=true", async () => {
      await overlay.open()
      await overlay.expectOpen()
      await expect(overlay.content).toHaveAttribute("data-state", "open")
    })

    test("click trigger again closes popover", async () => {
      await overlay.open()
      await overlay.trigger.click()
      await overlay.expectClosed()
    })

    test("Escape closes popover and returns focus to trigger", async () => {
      await overlay.open()
      await overlay.closeWithEscape()
      await expect(overlay.triggerButton).toBeFocused()
    })

    test("outside click closes popover", async () => {
      await overlay.open()
      await overlay.closeWithOutsideClick()
    })

    test("data-state reflects open/closed on trigger", async ({ page }) => {
      await overlay.open()
      await expect(overlay.trigger).toHaveAttribute("data-state", "open")
      await page.keyboard.press("Escape")
      await expect(overlay.trigger).toHaveAttribute("data-state", "closed")
    })

    test("Space key opens popover", async ({ page }) => {
      await overlay.triggerButton.focus()
      await page.keyboard.press("Space")
      await expect(overlay.content).toBeVisible()
      await expect(overlay.triggerButton).toHaveAttribute("aria-expanded", "true")
    })

    test("Enter key opens popover", async ({ page }) => {
      await overlay.triggerButton.focus()
      await page.keyboard.press("Enter")
      await expect(overlay.content).toBeVisible()
      await expect(overlay.triggerButton).toHaveAttribute("aria-expanded", "true")
    })
  })

  test.describe("content", () => {
    test("focus moves to first focusable element on open", async ({ page }) => {
      await page.goto(`${BASE}/with_form`)
      const trigger = page.getByTestId("popover-trigger")
      await trigger.click()
      const content = page.getByTestId("popover-content")
      await expect(content).toBeVisible()
      await expect(content.locator("input").first()).toBeFocused()
    })

    test("renders sub-parts: header, title, description", async ({ page }) => {
      await page.goto(`${BASE}/basic`)
      await page.getByTestId("popover-trigger").click()
      await expect(page.getByTestId("popover-content")).toBeVisible()
      await expect(page.getByTestId("popover-header")).toBeVisible()
      await expect(page.getByTestId("popover-title")).toContainText("Dimensions")
      await expect(page.getByTestId("popover-description")).toContainText(
        "Set the dimensions for the layer.",
      )
    })

    test("accepts align parameter", async ({ page }) => {
      await page.goto(`${BASE}/playground?align=start`)
      await page.getByTestId("popover-trigger").click()
      const content = page.getByTestId("popover-content")
      await expect(content).toBeVisible()
      await expect(content).toHaveAttribute("data-align", "start")
    })
  })

  test("passes WCAG 2.1 AA", async ({ page, checkA11y }) => {
    await page.goto(`${BASE}/basic`)
    const results = await checkA11y()
    expect(results.violations).toEqual([])
  })
})
