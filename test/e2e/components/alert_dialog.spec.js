import { test, expect } from "../fixtures/index.js"

const BASE = "/preview/kiso/alert_dialog"

test.describe("Alert Dialog component", () => {
  test("renders with data-slot=alert-dialog, hidden by default", async ({ page }) => {
    await page.goto(`${BASE}/destructive`)
    const dialog = page.locator("dialog[data-slot='alert-dialog']")
    await expect(dialog).toBeAttached()
    await expect(dialog).not.toBeVisible()
  })

  test("opens via trigger button", async ({ page }) => {
    await page.goto(`${BASE}/destructive`)
    await page.locator("button[onclick]").click()
    const dialog = page.locator("dialog[data-slot='alert-dialog']")
    await expect(dialog).toBeVisible()
  })

  test("has role=alertdialog", async ({ page }) => {
    await page.goto(`${BASE}/playground?open=true`)
    const dialog = page.locator("dialog[data-slot='alert-dialog']")
    await expect(dialog).toHaveAttribute("role", "alertdialog")
  })

  test("has aria-labelledby and aria-describedby", async ({ page }) => {
    await page.goto(`${BASE}/playground?open=true`)
    const dialog = page.locator("dialog[data-slot='alert-dialog']")
    await expect(dialog).toHaveAttribute("aria-labelledby", "playground-alert-title")
    await expect(dialog).toHaveAttribute("aria-describedby", "playground-alert-description")
  })

  test("Escape does NOT close the dialog", async ({ page }) => {
    await page.goto(`${BASE}/destructive`)
    await page.locator("button[onclick]").click()
    const dialog = page.locator("dialog[data-slot='alert-dialog']")
    await expect(dialog).toBeVisible()
    await page.keyboard.press("Escape")
    // Wait briefly and confirm still visible
    await page.waitForTimeout(300)
    await expect(dialog).toBeVisible()
  })

  test("backdrop click does NOT close the dialog", async ({ page }) => {
    await page.goto(`${BASE}/playground?open=true`)
    const dialog = page.locator("dialog[data-slot='alert-dialog']")
    await expect(dialog).toBeVisible()
    // Click on the dialog backdrop (top-left corner, outside content)
    await dialog.click({ position: { x: 5, y: 5 } })
    await page.waitForTimeout(300)
    await expect(dialog).toBeVisible()
  })

  test("Cancel button closes the dialog", async ({ page }) => {
    await page.goto(`${BASE}/destructive`)
    await page.locator("button[onclick]").click()
    const dialog = page.locator("dialog[data-slot='alert-dialog']")
    await expect(dialog).toBeVisible()
    await page.locator("[data-slot='alert-dialog-cancel']").click()
    await expect(dialog).not.toBeVisible()
  })

  test("Action button closes the dialog", async ({ page }) => {
    await page.goto(`${BASE}/destructive`)
    await page.locator("button[onclick]").click()
    const dialog = page.locator("dialog[data-slot='alert-dialog']")
    await expect(dialog).toBeVisible()
    await page.locator("[data-slot='alert-dialog-action']").click()
    await expect(dialog).not.toBeVisible()
  })

  test("open: true opens dialog on page load", async ({ page }) => {
    await page.goto(`${BASE}/playground?open=true`)
    const dialog = page.locator("dialog[data-slot='alert-dialog']")
    await expect(dialog).toBeVisible()
  })

  test("sub-parts render correctly", async ({ page }) => {
    await page.goto(`${BASE}/playground?open=true`)
    await expect(page.locator("[data-slot='alert-dialog-header']")).toBeVisible()
    await expect(page.locator("[data-slot='alert-dialog-title']")).toBeVisible()
    await expect(page.locator("[data-slot='alert-dialog-description']")).toBeVisible()
    await expect(page.locator("[data-slot='alert-dialog-footer']")).toBeVisible()
    await expect(page.locator("[data-slot='alert-dialog-action']")).toBeVisible()
    await expect(page.locator("[data-slot='alert-dialog-cancel']")).toBeVisible()
  })

  test("media sub-part renders", async ({ page }) => {
    await page.goto(`${BASE}/with_media`)
    await page.locator("button[onclick]").click()
    await expect(page.locator("[data-slot='alert-dialog-media']")).toBeVisible()
  })

  test("sm size renders with max-w-xs", async ({ page }) => {
    await page.goto(`${BASE}/with_media_sm`)
    await page.locator("button[onclick]").click()
    const content = page.locator("[data-slot='alert-dialog-content']")
    await expect(content).toBeVisible()
    await expect(content).toHaveAttribute("data-size", "sm")
  })

  test("passes WCAG 2.1 AA", async ({ page, checkA11y }) => {
    await page.goto(`${BASE}/playground?open=true`)
    const results = await checkA11y()
    expect(results.violations).toEqual([])
  })
})
