import { test, expect } from "../fixtures/index.js"

const BASE = "/preview/kiso/collapsible"

test.describe("Collapsible component", () => {
  // --- Rendering ---
  test("renders with correct data-slot", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    await expect(page.locator("[data-slot='collapsible']")).toBeVisible()
  })

  test("renders trigger and content sub-parts", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const collapsible = page.locator("[data-slot='collapsible']")
    await expect(collapsible).toBeVisible()
    // Content should be hidden by default
    const content = page.locator("[data-slot='collapsible-content']")
    await expect(content).toBeHidden()
  })

  test("starts closed by default", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const collapsible = page.locator("[data-slot='collapsible']")
    await expect(collapsible).toHaveAttribute("data-state", "closed")
  })

  // --- Open/Close ---
  test("opens when trigger is clicked", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const collapsible = page.locator("[data-slot='collapsible']")
    const content = page.locator("[data-slot='collapsible-content']")

    // Click the toggle button
    await page.locator("[data-action*='kiso--collapsible#toggle']").first().click()

    await expect(collapsible).toHaveAttribute("data-state", "open")
    await expect(content).toBeVisible()
  })

  test("closes when trigger is clicked again", async ({ page }) => {
    await page.goto(`${BASE}/playground?open=true`)
    const collapsible = page.locator("[data-slot='collapsible']")
    const content = page.locator("[data-slot='collapsible-content']")

    await expect(content).toBeVisible()

    // Click the toggle button to close
    await page.locator("[data-action*='kiso--collapsible#toggle']").first().click()

    await expect(collapsible).toHaveAttribute("data-state", "closed")
    // Content hidden after animation
    await expect(content).toBeHidden()
  })

  test("open: true renders content visible on page load", async ({ page }) => {
    await page.goto(`${BASE}/playground?open=true`)
    const collapsible = page.locator("[data-slot='collapsible']")
    const content = page.locator("[data-slot='collapsible-content']")

    await expect(collapsible).toHaveAttribute("data-state", "open")
    await expect(content).toBeVisible()
  })

  // --- ARIA state ---
  test("trigger has aria-expanded", async ({ page }) => {
    await page.goto(`${BASE}/playground`)

    // Find the trigger with the target attribute
    const trigger = page.locator("[data-kiso--collapsible-target='trigger']").first()
    await expect(trigger).toHaveAttribute("aria-expanded", "false")

    // Click to open
    await trigger.click()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")

    // Click to close
    await trigger.click()
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  test("data-state is set on trigger element", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const trigger = page.locator("[data-kiso--collapsible-target='trigger']").first()

    await expect(trigger).toHaveAttribute("data-state", "closed")

    await trigger.click()
    await expect(trigger).toHaveAttribute("data-state", "open")
  })

  // --- Composition ---
  test("basic preview renders inside a card", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    await expect(page.locator("[data-slot='card']")).toBeVisible()
    await expect(page.locator("[data-slot='collapsible']")).toBeVisible()
  })

  test("basic preview toggles product details", async ({ page }) => {
    await page.goto(`${BASE}/basic`)
    const content = page.locator("[data-slot='collapsible-content']")

    await expect(content).toBeHidden()

    // Click the "Product details" button
    await page.locator("[data-action*='kiso--collapsible#toggle']").click()
    await expect(content).toBeVisible()
    await expect(content).toContainText("expanded or collapsed")
  })

  // --- Nested collapsibles ---
  test("file tree has multiple collapsibles", async ({ page }) => {
    await page.goto(`${BASE}/file_tree`)
    const collapsibles = page.locator("[data-slot='collapsible']")
    // 5 top-level folders (components, lib, hooks, types, public) + 1 nested (ui)
    await expect(collapsibles).toHaveCount(6)
  })

  test("nested collapsibles toggle independently", async ({ page }) => {
    await page.goto(`${BASE}/file_tree`)

    // Get the first folder toggle (components)
    const firstToggle = page
      .locator("[data-slot='collapsible']")
      .first()
      .locator("[data-action*='kiso--collapsible#toggle']")
      .first()

    // Open the first folder
    await firstToggle.click()

    const firstCollapsible = page.locator("[data-slot='collapsible']").first()
    await expect(firstCollapsible).toHaveAttribute("data-state", "open")

    // Other folders should still be closed
    const secondCollapsible = page.locator("[data-slot='collapsible']").nth(2)
    await expect(secondCollapsible).toHaveAttribute("data-state", "closed")
  })

  // --- Accessibility ---
  test("passes WCAG 2.1 AA", async ({ page, checkA11y }) => {
    await page.goto(`${BASE}/playground`)
    const results = await checkA11y()
    expect(results.violations).toEqual([])
  })

  test("passes WCAG 2.1 AA when open", async ({ page, checkA11y }) => {
    await page.goto(`${BASE}/playground?open=true`)
    const results = await checkA11y()
    expect(results.violations).toEqual([])
  })
})
