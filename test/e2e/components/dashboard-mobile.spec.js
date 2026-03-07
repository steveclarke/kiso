import { test, expect } from "../fixtures/index.js"
import { waitForStimulus } from "../helpers/interactions.js"

const BASE = "/preview/kiso/dashboard/dashboard_group"

// Mobile viewport: 390x844 (iPhone 13 dimensions), triggers max-width: 767px
const MOBILE = { viewport: { width: 390, height: 844 } }

test.describe("Dashboard mobile sidebar", () => {
  test.use(MOBILE)

  test.describe("button visibility", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/sidebar_closed`)
      await waitForStimulus(page, "kiso--sidebar")
    })

    test("toggle button (hamburger) is visible on mobile", async ({ page }) => {
      const toggle = page.getByTestId("dashboard-sidebar-toggle")
      await expect(toggle).toBeVisible()
    })

    test("collapse button is hidden on mobile", async ({ page }) => {
      const collapse = page.getByTestId("dashboard-sidebar-collapse")
      await expect(collapse).toBeHidden()
    })
  })

  test.describe("sidebar open/close", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/sidebar_closed`)
      await waitForStimulus(page, "kiso--sidebar")
    })

    test("sidebar starts off-screen when closed", async ({ page }) => {
      const sidebar = page.getByTestId("dashboard-sidebar")
      // Mobile sidebar should be position: fixed and translated off-screen
      const position = await sidebar.evaluate((el) => getComputedStyle(el).position)
      expect(position).toBe("fixed")
      const transform = await sidebar.evaluate((el) => getComputedStyle(el).transform)
      // translateX(-100dvw) computes to a matrix with negative X translation
      expect(transform).not.toBe("none")
    })

    test("toggle opens the sidebar overlay", async ({ page }) => {
      const toggle = page.getByTestId("dashboard-sidebar-toggle")
      const group = page.getByTestId("dashboard-group")

      await toggle.click()
      await expect(group).toHaveAttribute("data-sidebar-open", "true")

      // Wait for slide animation
      await page.waitForTimeout(300)

      // Sidebar should now be on-screen
      const sidebar = page.getByTestId("dashboard-sidebar")
      const box = await sidebar.boundingBox()
      // Sidebar should be on-screen (x >= 0)
      expect(box).toBeTruthy()
      expect(box.x).toBeGreaterThanOrEqual(0)
    })

    // BUG (#172): sidebar is 100dvw at z-index 40, covering the navbar (z-index 30)
    // and the toggle button. Once open, the sidebar intercepts all pointer events
    // and the toggle button is unreachable. Fix: use shadcn-style 18rem drawer width.
    test.fixme("sidebar does not cover the toggle button when open", async ({ page }) => {
      const toggle = page.getByTestId("dashboard-sidebar-toggle")

      await toggle.click()
      await page.waitForTimeout(300)

      // Try clicking the toggle again to close
      await toggle.click({ timeout: 3000 })
      const group = page.getByTestId("dashboard-group")
      await expect(group).toHaveAttribute("data-sidebar-open", "false")
    })
  })

  test.describe("scrim", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/sidebar_closed`)
      await waitForStimulus(page, "kiso--sidebar")
    })

    test("scrim is hidden when sidebar is closed", async ({ page }) => {
      const scrim = page.getByTestId("dashboard-scrim")
      await expect(scrim).toBeHidden()
    })

    test("scrim is visible when sidebar is open", async ({ page }) => {
      const toggle = page.getByTestId("dashboard-sidebar-toggle")
      await toggle.click()
      await page.waitForTimeout(300)

      const scrim = page.getByTestId("dashboard-scrim")
      // BUG: scrim is z-index 39 behind the 100dvw sidebar at z-index 40,
      // so it's completely covered and not clickable
      await expect(scrim).toBeVisible()
    })

    // BUG (#172): scrim click fires closeOnMobile() but the scrim sits behind
    // the 100dvw sidebar (z-index 39 vs 40), so users can never reach it.
    // force:true bypasses the z-index issue but closeOnMobile checks
    // matchMedia which doesn't match Playwright's viewport emulation.
    test.fixme("clicking scrim closes the sidebar", async ({ page }) => {
      const toggle = page.getByTestId("dashboard-sidebar-toggle")
      const scrim = page.getByTestId("dashboard-scrim")
      const group = page.getByTestId("dashboard-group")

      await toggle.click()
      await page.waitForTimeout(300)

      // Click scrim to dismiss
      await scrim.click({ force: true, timeout: 3000 })
      await expect(group).toHaveAttribute("data-sidebar-open", "false")
    })
  })

  test.describe("aria attributes", () => {
    test("toggle has aria-expanded synced with sidebar state", async ({ page }) => {
      await page.goto(`${BASE}/sidebar_closed`)
      await waitForStimulus(page, "kiso--sidebar")

      const toggle = page.getByTestId("dashboard-sidebar-toggle")

      // Starts closed
      await expect(toggle).toHaveAttribute("aria-expanded", "false")

      // Open
      await toggle.click()
      await expect(toggle).toHaveAttribute("aria-expanded", "true")
    })
  })

  test.describe("accessibility", () => {
    test("mobile view (closed) passes WCAG 2.1 AA", async ({ page, checkA11y }) => {
      await page.goto(`${BASE}/sidebar_closed`)
      await waitForStimulus(page, "kiso--sidebar")
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })

    test("mobile view (open) passes WCAG 2.1 AA", async ({ page, checkA11y }) => {
      await page.goto(`${BASE}/sidebar_closed`)
      await waitForStimulus(page, "kiso--sidebar")
      const toggle = page.getByTestId("dashboard-sidebar-toggle")
      await toggle.click()
      await page.waitForTimeout(300)
      const results = await checkA11y()
      expect(results.violations).toEqual([])
    })
  })
})

test.describe("Dashboard desktop sidebar (baseline)", () => {
  // Default viewport (Desktop Chrome) — confirms desktop behavior still works

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/playground`)
    await waitForStimulus(page, "kiso--sidebar")
  })

  test("toggle button (hamburger) is hidden on desktop", async ({ page }) => {
    const toggle = page.getByTestId("dashboard-sidebar-toggle")
    await expect(toggle).toBeHidden()
  })

  test("collapse button is visible on desktop", async ({ page }) => {
    const collapse = page.getByTestId("dashboard-sidebar-collapse")
    await expect(collapse).toBeVisible()
  })

  test("sidebar is visible inline (not overlay) on desktop", async ({ page }) => {
    const sidebar = page.getByTestId("dashboard-sidebar")
    await expect(sidebar).toBeVisible()
    const position = await sidebar.evaluate((el) => getComputedStyle(el).position)
    expect(position).not.toBe("fixed")
  })

  test("scrim is hidden on desktop", async ({ page }) => {
    const scrim = page.getByTestId("dashboard-scrim")
    await expect(scrim).toBeHidden()
  })
})
