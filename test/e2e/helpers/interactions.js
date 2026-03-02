/**
 * Click outside any component to dismiss overlays.
 * Uses a consistent top-left position to avoid hitting interactive elements.
 *
 * @param {import("@playwright/test").Page} page
 */
export async function clickOutside(page) {
  await page.locator("body").click({ position: { x: 1, y: 1 } })
}

/**
 * Wait for a Stimulus controller to connect after navigation.
 * Polls for the presence of a `data-controller` attribute containing
 * the given prefix.
 *
 * @param {import("@playwright/test").Page} page
 * @param {string} controller - Controller identifier prefix (e.g. "kiso--combobox")
 */
export async function waitForStimulus(page, controller) {
  await page.waitForFunction(
    (ctrl) => document.querySelector(`[data-controller*="${ctrl}"]`) !== null,
    controller,
    { timeout: 5000 },
  )
}
