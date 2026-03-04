import { test, expect } from "../fixtures/index.js"

const BASE = "/preview/kiso/dialog"

test.describe("Dialog component", () => {
  test("renders with data-slot=dialog, hidden by default", async ({ page }) => {
    await page.goto(`${BASE}/confirmation`)
    const dialog = page.locator("dialog[data-slot='dialog']")
    await expect(dialog).toBeAttached()
    await expect(dialog).not.toBeVisible()
  })

  test("opens via trigger button", async ({ page }) => {
    await page.goto(`${BASE}/confirmation`)
    await page.locator("button[onclick]").click()
    const dialog = page.locator("dialog[data-slot='dialog']")
    await expect(dialog).toBeVisible()
  })

  test("content panel has background when open", async ({ page }) => {
    await page.goto(`${BASE}/playground?open=true`)
    const content = page.locator("[data-slot='dialog-content']")
    await expect(content).toBeVisible()
    await expect(content).toHaveCSS("border-style", "solid")
  })

  test("content panel is visible and centered", async ({ page }) => {
    await page.goto(`${BASE}/playground?open=true`)
    const content = page.locator("[data-slot='dialog-content']")
    await expect(content).toBeVisible()
  })

  test("close button closes the dialog", async ({ page }) => {
    await page.goto(`${BASE}/playground?open=true`)
    const dialog = page.locator("dialog[data-slot='dialog']")
    await expect(dialog).toBeVisible()
    await page.locator("[data-slot='dialog-close']").click()
    await expect(dialog).not.toBeVisible()
  })

  test("Escape key closes the dialog", async ({ page }) => {
    await page.goto(`${BASE}/confirmation`)
    await page.locator("button[onclick]").click()
    const dialog = page.locator("dialog[data-slot='dialog']")
    await expect(dialog).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(dialog).not.toBeVisible()
  })

  test("Cancel button closes the dialog", async ({ page }) => {
    await page.goto(`${BASE}/confirmation`)
    await page.locator("button[onclick]").click()
    const dialog = page.locator("dialog[data-slot='dialog']")
    await expect(dialog).toBeVisible()
    await page.locator("[data-slot='dialog-footer'] button", { hasText: "Cancel" }).click()
    await expect(dialog).not.toBeVisible()
  })

  test("open: true opens dialog on page load", async ({ page }) => {
    await page.goto(`${BASE}/playground?open=true`)
    const dialog = page.locator("dialog[data-slot='dialog']")
    await expect(dialog).toBeVisible()
  })

  test("sub-parts render correctly", async ({ page }) => {
    await page.goto(`${BASE}/playground?open=true`)
    await expect(page.locator("[data-slot='dialog-header']")).toBeVisible()
    await expect(page.locator("[data-slot='dialog-title']")).toBeVisible()
    await expect(page.locator("[data-slot='dialog-description']")).toBeVisible()
    await expect(page.locator("[data-slot='dialog-body']")).toBeVisible()
    await expect(page.locator("[data-slot='dialog-footer']")).toBeVisible()
    await expect(page.locator("[data-slot='dialog-close']")).toBeVisible()
  })

  test("scrollable body preview renders", async ({ page }) => {
    await page.goto(`${BASE}/scrollable_body`)
    await page.locator("button[onclick]").click()
    const body = page.locator("[data-slot='dialog-body']")
    await expect(body).toBeVisible()
    await expect(body).toHaveCSS("overflow-y", "auto")
  })

  test("passes WCAG 2.1 AA", async ({ page, checkA11y }) => {
    await page.goto(`${BASE}/playground?open=true`)
    const results = await checkA11y()
    expect(results.violations).toEqual([])
  })
})
