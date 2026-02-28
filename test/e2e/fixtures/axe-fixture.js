import AxeBuilder from "@axe-core/playwright"

/**
 * Run an axe accessibility scan on the current page.
 * Configured for WCAG 2.1 AA compliance.
 *
 * @param {import("@playwright/test").Page} page
 * @param {Object} [options]
 * @param {string[]} [options.exclude] - Additional axe rule IDs to disable
 * @returns {Promise<import("axe-core").AxeResults>}
 */
export async function checkA11y(page, { exclude = [] } = {}) {
  return new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .disableRules([
      // Lookbook preview layout issues — not component concerns
      "document-title",
      "html-has-lang",
      ...exclude,
    ])
    .analyze()
}
