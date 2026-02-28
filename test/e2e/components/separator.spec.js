import { test, expect } from "@playwright/test"

const BASE = "/preview/kiso/separator"

test.describe("Separator component", () => {
  test("renders a horizontal separator", async ({ page }) => {
    await page.goto(`${BASE}/horizontal`)
    const sep = page.locator("[data-slot='separator']").first()
    await expect(sep).toBeVisible()
  })

  test("decorative separator has role=none", async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    const sep = page.locator("[data-slot='separator']").first()
    await expect(sep).toHaveAttribute("role", "none")
  })

  test("non-decorative separator has role=separator", async ({ page }) => {
    await page.goto(`${BASE}/playground?decorative=false`)
    const sep = page.locator("[data-slot='separator']").first()
    await expect(sep).toHaveAttribute("role", "separator")
  })

  test("renders vertical separator", async ({ page }) => {
    await page.goto(`${BASE}/vertical`)
    const sep = page.locator("[data-slot='separator']")
    await expect(sep.first()).toBeVisible()
  })
})
