import { expect } from "../fixtures/index.js"

/**
 * Shared interaction model for trigger-based overlay components
 * (Popover, DropdownMenu, Select). Encapsulates the open/close/escape/
 * outside-click cycle and aria-expanded tracking.
 *
 * Not used for CommandDialog — it uses `<dialog>` with `open` attribute
 * instead of aria-expanded on a trigger.
 *
 * @example
 *   const overlay = new OverlayModel(page, "popover")
 *   await overlay.open()
 *   await overlay.expectOpen()
 *   await overlay.closeWithEscape()
 *   await overlay.expectClosed()
 */
export class OverlayModel {
  /**
   * @param {import("@playwright/test").Page} page
   * @param {string} slotPrefix - Component slot prefix (e.g. "popover", "dropdown-menu", "select")
   * @param {Object} [options]
   * @param {boolean} [options.triggerIsButton] - If true, aria-expanded lives on the trigger
   *   itself rather than a nested button. Used by Select where the trigger IS the button.
   */
  constructor(page, slotPrefix, { triggerIsButton = false } = {}) {
    this.page = page
    this.trigger = page.getByTestId(`${slotPrefix}-trigger`)
    this.triggerButton = triggerIsButton ? this.trigger : this.trigger.locator("button")
    this.content = page.getByTestId(`${slotPrefix}-content`)
  }

  /** Click the trigger to open the overlay */
  async open() {
    await this.trigger.click()
    await expect(this.content).toBeVisible()
  }

  /** Press Escape to close and verify focus returns to trigger */
  async closeWithEscape() {
    await this.page.keyboard.press("Escape")
    await expect(this.content).toBeHidden()
  }

  /** Click outside the overlay to close it */
  async closeWithOutsideClick() {
    await this.page.locator("body").click({ position: { x: 1, y: 1 } })
    await expect(this.content).toBeHidden()
  }

  /** Assert the overlay is open with correct aria state */
  async expectOpen() {
    await expect(this.content).toBeVisible()
    await expect(this.triggerButton).toHaveAttribute("aria-expanded", "true")
  }

  /** Assert the overlay is closed with correct aria state */
  async expectClosed() {
    await expect(this.content).toBeHidden()
    await expect(this.triggerButton).toHaveAttribute("aria-expanded", "false")
  }
}
