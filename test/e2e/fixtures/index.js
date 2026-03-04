import AxeBuilder from "@axe-core/playwright"
import { test as base, expect } from "@playwright/test"

/**
 * Extended Playwright test with shared fixtures for Kiso component testing.
 *
 * Usage:
 *   import { test, expect } from "../fixtures/index.js"
 *
 *   test("passes WCAG 2.1 AA", async ({ page, checkA11y }) => {
 *     await page.goto("/preview/kiso/badge/playground")
 *     const results = await checkA11y()
 *     expect(results.violations).toEqual([])
 *   })
 */
export const test = base.extend({
  /**
   * Run an axe accessibility scan on the current page.
   * Configured for WCAG 2.1 AA compliance with baked-in exclusions:
   * - document-title, html-has-lang: Lookbook preview chrome, not component code
   * - color-contrast: Kiso is a UI framework — host apps own their palette
   * - meta-viewport: Lookbook layout sets user-scalable=0, not component code
   *
   * @param {Object} [options]
   * @param {string[]} [options.exclude] - Additional axe rule IDs to disable
   * @param {string} [options.include] - CSS selector to scope the scan
   * @returns {Promise<import("axe-core").AxeResults>}
   */
  checkA11y: async ({ page }, use) => {
    const check = async ({ exclude = [], include } = {}) => {
      let builder = new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .disableRules([
          "document-title",
          "html-has-lang",
          "color-contrast",
          "meta-viewport",
          ...exclude,
        ])
      if (include) builder = builder.include(include)
      return builder.analyze()
    }
    await use(check)
  },

  /**
   * Navigate to a URL with dark mode active. Uses Playwright's
   * emulateMedia to set prefers-color-scheme: dark, which the
   * Lookbook preview layout reads to set .dark on <html>.
   *
   * @example
   *   test("badge a11y in dark", async ({ darkMode, checkA11y }) => {
   *     await darkMode("/preview/kiso/badge/playground")
   *     const results = await checkA11y()
   *     expect(results.violations).toEqual([])
   *   })
   *
   * @param {string} url - Lookbook preview URL to navigate to
   */
  darkMode: async ({ page }, use) => {
    const gotoDark = async (url) => {
      await page.emulateMedia({ colorScheme: "dark" })
      await page.goto(url)
    }
    await use(gotoDark)
  },

  /**
   * Capture a Stimulus custom event dispatched on an element.
   * Sets up a one-time listener and returns an async function
   * that resolves to the event detail.
   *
   * @example
   *   const getValue = await captureEvent("[data-slot='command']", "kiso--command:select")
   *   await page.keyboard.press("Enter")
   *   const detail = await getValue()
   *   expect(detail.value).toBe("calendar")
   *
   * @param {string} selector - CSS selector for the element to listen on
   * @param {string} eventName - The custom event name to capture
   * @returns {Promise<() => Promise<any>>} Async function that returns the event detail
   */
  captureEvent: async ({ page }, use) => {
    const capture = async (selector, eventName) => {
      await page.evaluate(
        ([sel, evt]) => {
          window.__capturedEventDetail = null
          document.querySelector(sel).addEventListener(
            evt,
            (e) => {
              window.__capturedEventDetail = e.detail
            },
            { once: true },
          )
        },
        [selector, eventName],
      )
      return () => page.evaluate(() => window.__capturedEventDetail)
    }
    await use(capture)
  },
})

export { expect }
