import { test, expect } from "./fixtures/index.js"

/**
 * Dark mode E2E tests — verify every component renders correctly
 * when .dark is on <html>. Uses the darkMode fixture which sets
 * prefers-color-scheme: dark via Playwright's emulateMedia, causing
 * the Lookbook preview layout to apply .dark before page scripts run.
 *
 * Run in isolation: npx playwright test dark-mode
 */

test.describe("Dark mode activation", () => {
  test("sets .dark on <html>", async ({ page, darkMode }) => {
    await darkMode("/preview/kiso/badge/playground")
    await expect(page.locator("html")).toHaveClass(/dark/)
  })

  test("body has dark background", async ({ page, darkMode }) => {
    await darkMode("/preview/kiso/badge/playground")
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    const [r, g, b] = bg.match(/\d+/g).map(Number)
    expect(r + g + b).toBeLessThan(200) // dark background (zinc-950 via oklch)
  })
})

test.describe("Dark mode accessibility", () => {
  /**
   * A11y scans for every component in dark mode. Contrast ratios
   * change with dark tokens — this catches violations that only
   * appear on dark backgrounds (e.g., text-muted-foreground = zinc-400
   * on bg-background = zinc-950).
   *
   * URLs and axe exclusions match the existing light-mode a11y tests
   * in each component's spec file.
   */
  const COMPONENTS = [
    { name: "alert", url: "/preview/kiso/alert/playground" },
    { name: "avatar", url: "/preview/kiso/avatar/playground" },
    { name: "badge", url: "/preview/kiso/badge/playground" },
    { name: "breadcrumb", url: "/preview/kiso/breadcrumb/playground" },
    { name: "button", url: "/preview/kiso/button/playground" },
    { name: "card", url: "/preview/kiso/card/playground" },
    { name: "checkbox", url: "/preview/kiso/form/checkbox/with_field" },
    { name: "color-mode-button", url: "/preview/kiso/color_mode/color_mode_button/playground" },
    { name: "color-mode-select", url: "/preview/kiso/color_mode/color_mode_select/playground" },
    { name: "combobox", url: "/preview/kiso/combobox/with_field" },
    { name: "command", url: "/preview/kiso/command/playground" },
    { name: "dialog", url: "/preview/kiso/dialog/playground?open=true" },
    { name: "dropdown-menu", url: "/preview/kiso/dropdown_menu/basic" },
    { name: "empty", url: "/preview/kiso/empty/with_actions" },
    { name: "field", url: "/preview/kiso/form/field/textarea" },
    { name: "input", url: "/preview/kiso/form/input/with_field", exclude: ["color-contrast"] },
    {
      name: "select-native",
      url: "/preview/kiso/form/select_native/with_field",
      exclude: ["color-contrast"],
    },
    { name: "input-group", url: "/preview/kiso/form/input_group/playground" },
    { name: "input-otp", url: "/preview/kiso/form/input_otp/playground" },
    { name: "kbd", url: "/preview/kiso/kbd/playground" },
    { name: "pagination", url: "/preview/kiso/pagination/playground" },
    { name: "popover", url: "/preview/kiso/popover/basic" },
    { name: "radio-group", url: "/preview/kiso/form/radio_group/playground" },
    { name: "select", url: "/preview/kiso/form/select/playground" },
    { name: "separator", url: "/preview/kiso/separator/playground" },
    { name: "slider", url: "/preview/kiso/form/slider/playground" },
    { name: "stats-card", url: "/preview/kiso/stats_card/playground" },
    { name: "switch", url: "/preview/kiso/form/switch/playground" },
    { name: "table", url: "/preview/kiso/table/playground" },
    {
      name: "textarea",
      url: "/preview/kiso/form/textarea/with_field",
      exclude: ["color-contrast"],
    },
    { name: "toggle", url: "/preview/kiso/toggle/playground" },
    { name: "toggle-group", url: "/preview/kiso/toggle_group/playground" },
  ]

  for (const { name, url, exclude } of COMPONENTS) {
    test(`${name} passes WCAG 2.1 AA in dark mode`, async ({ darkMode, checkA11y }) => {
      await darkMode(url)
      const results = await checkA11y(exclude ? { exclude } : {})
      expect(results.violations).toEqual([])
    })
  }
})

test.describe("Dark mode text visibility", () => {
  /**
   * Components that set text-foreground on their root container must
   * have visible (light) text in dark mode. Without text-foreground,
   * the browser default is black — invisible on a dark background.
   */
  const CONTAINERS = [
    { name: "card", url: "/preview/kiso/card/playground", slot: "card" },
    { name: "table", url: "/preview/kiso/table/playground", slot: "table" },
    { name: "empty", url: "/preview/kiso/empty/playground", slot: "empty" },
    { name: "stats-card", url: "/preview/kiso/stats_card/playground", slot: "stats-card" },
  ]

  for (const { name, url, slot } of CONTAINERS) {
    test(`${name} has visible text in dark mode`, async ({ page, darkMode }) => {
      await darkMode(url)
      const el = page.getByTestId(slot)
      await expect(el).toBeVisible()
      // In dark mode, foreground should be light (zinc-50), NOT browser default black
      const color = await el.evaluate((e) => getComputedStyle(e).color)
      expect(color).not.toBe("rgb(0, 0, 0)")
    })
  }
})

test.describe("Dark mode token verification", () => {
  test("badge solid uses dark primary token", async ({ page, darkMode }) => {
    await darkMode("/preview/kiso/badge/playground?color=primary&variant=solid")
    const badge = page.getByTestId("badge")
    await expect(badge).toBeVisible()
    // Dark primary = blue-400, NOT light primary blue-600 = rgb(37, 99, 235)
    const bg = await badge.evaluate((e) => getComputedStyle(e).backgroundColor)
    expect(bg).not.toBe("rgb(37, 99, 235)")
  })

  test("badge variants page renders all 28 in dark mode", async ({ page, darkMode }) => {
    await darkMode("/preview/kiso/badge/variants")
    await expect(page.getByTestId("badge")).toHaveCount(28)
  })

  test("alert error variant renders in dark mode", async ({ page, darkMode }) => {
    await darkMode("/preview/kiso/alert/playground?color=error&variant=solid")
    await expect(page.getByTestId("alert")).toBeVisible()
  })
})
