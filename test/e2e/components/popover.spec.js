import { test, expect } from "@playwright/test"

import { checkA11y } from "../fixtures/axe-fixture.js"

const BASE = "/preview/kiso/popover"

test.describe("Popover component", () => {
  test("renders with data-slot=popover", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const popover = page.locator("[data-slot='popover']")
    await expect(popover).toBeVisible()
  })

  test("trigger button has aria-haspopup=dialog and aria-expanded=false", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const button = page.locator("[data-slot='popover-trigger'] button")
    await expect(button).toHaveAttribute("aria-haspopup", "dialog")
    await expect(button).toHaveAttribute("aria-expanded", "false")
  })

  test("content is hidden by default", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const content = page.locator("[data-slot='popover-content']")
    await expect(content).toBeHidden()
  })

  test("content has role=dialog", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const content = page.locator("[data-slot='popover-content']")
    await expect(content).toHaveAttribute("role", "dialog")
  })

  test("click trigger opens popover and sets aria-expanded=true", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='popover-trigger']")
    const content = page.locator("[data-slot='popover-content']")

    await trigger.click()
    await expect(content).toBeVisible()
    const button = page.locator("[data-slot='popover-trigger'] button")
    await expect(button).toHaveAttribute("aria-expanded", "true")
    await expect(content).toHaveAttribute("data-state", "open")
  })

  test("click trigger again closes popover", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='popover-trigger']")
    const content = page.locator("[data-slot='popover-content']")

    await trigger.click()
    await expect(content).toBeVisible()

    await trigger.click()
    await expect(content).toBeHidden()
    const button = page.locator("[data-slot='popover-trigger'] button")
    await expect(button).toHaveAttribute("aria-expanded", "false")
  })

  test("Escape closes popover and returns focus to trigger", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='popover-trigger']")
    const content = page.locator("[data-slot='popover-content']")

    await trigger.click()
    await expect(content).toBeVisible()

    await page.keyboard.press("Escape")
    await expect(content).toBeHidden()
    // Focus returns to the button inside the trigger wrapper
    const button = trigger.locator("button")
    await expect(button).toBeFocused()
  })

  test("outside click closes popover", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='popover-trigger']")
    const content = page.locator("[data-slot='popover-content']")

    await trigger.click()
    await expect(content).toBeVisible()

    await page.locator("body").click({ position: { x: 10, y: 10 } })
    await expect(content).toBeHidden()
  })

  test("focus moves to first focusable element on open", async ({ page }) => {
    await page.goto(`${BASE}/with_form`)
    const trigger = page.locator("[data-slot='popover-trigger']")

    await trigger.click()
    const content = page.locator("[data-slot='popover-content']")
    await expect(content).toBeVisible()

    // The first focusable element inside the popover should be focused
    const firstInput = content.locator("input").first()
    await expect(firstInput).toBeFocused()
  })

  test("data-state reflects open/closed on trigger", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='popover-trigger']")

    await trigger.click()
    await expect(trigger).toHaveAttribute("data-state", "open")

    await page.keyboard.press("Escape")
    await expect(trigger).toHaveAttribute("data-state", "closed")
  })

  test("renders sub-parts: header, title, description", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const trigger = page.locator("[data-slot='popover-trigger']")
    await trigger.click()

    const content = page.locator("[data-slot='popover-content']")
    await expect(content).toBeVisible()

    const header = page.locator("[data-slot='popover-header']")
    const title = page.locator("[data-slot='popover-title']")
    const description = page.locator("[data-slot='popover-description']")

    await expect(header).toBeVisible()
    await expect(title).toContainText("Dimensions")
    await expect(description).toContainText("Set the dimensions for the layer.")
  })

  test("accepts align parameter", async ({ page }) => {
    await page.goto(`${BASE}/playground?align=start`)
    const trigger = page.locator("[data-slot='popover-trigger']")
    await trigger.click()

    const content = page.locator("[data-slot='popover-content']")
    await expect(content).toBeVisible()
    await expect(content).toHaveAttribute("data-align", "start")
  })

  test("passes WCAG 2.1 AA", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const results = await checkA11y(page)
    expect(results.violations).toEqual([])
  })
})
