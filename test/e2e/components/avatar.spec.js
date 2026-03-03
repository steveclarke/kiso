import { test, expect } from "../fixtures/index.js"

test.describe("Avatar component", () => {
  const BASE = "/preview/kiso/avatar"

  test.describe("default preview", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/playground`)
    })

    test("renders with data-slot=avatar", async ({ page }) => {
      await expect(page.getByTestId("avatar").first()).toBeVisible()
    })

    test("renders fallback text", async ({ page }) => {
      const fallback = page.getByTestId("avatar-fallback").first()
      await expect(fallback).toBeVisible()
      await expect(fallback).toContainText("CN")
    })

    test("passes WCAG 2.1 AA", async ({ checkA11y }) => {
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })

  test("renders all three sizes", async ({ page }) => {
    await page.goto(`${BASE}/sizes`)
    const avatars = page.getByTestId("avatar")
    await expect(avatars).toHaveCount(3)
  })

  test("renders badge sub-part", async ({ page }) => {
    await page.goto(`${BASE}/with_badge`)
    const badge = page.getByTestId("avatar-badge").first()
    await expect(badge).toBeVisible()
  })

  test("renders avatar group with overlapping avatars", async ({ page }) => {
    await page.goto(`${BASE}/group`)
    const group = page.getByTestId("avatar-group").first()
    await expect(group).toBeVisible()
    const avatars = group.getByTestId("avatar")
    await expect(avatars).toHaveCount(3)
  })

  test("renders group count", async ({ page }) => {
    await page.goto(`${BASE}/group`)
    const count = page.getByTestId("avatar-group-count").first()
    await expect(count).toBeVisible()
    await expect(count).toContainText("+3")
  })
})
