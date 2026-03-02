import { expect } from "../fixtures/index.js"

/**
 * Shared interaction model for item-list navigation with `data-highlighted`
 * tracking. Used by Select, Combobox, and DropdownMenu.
 *
 * @example
 *   const listbox = new ListboxModel(page, "select")
 *   await listbox.expectHighlightedAt(0)
 *   await listbox.arrowDown()
 *   await listbox.expectHighlightedAt(1)
 */
export class ListboxModel {
  /**
   * @param {import("@playwright/test").Page} page
   * @param {string} slotPrefix - Item slot prefix (e.g. "select", "combobox", "dropdown-menu")
   * @param {Object} [options]
   * @param {string} [options.itemSlot] - Override the item slot name (default: `${slotPrefix}-item`)
   * @param {string} [options.highlightAttr] - Data attribute for highlight (default: "data-highlighted")
   */
  constructor(page, slotPrefix, { itemSlot, highlightAttr = "data-highlighted" } = {}) {
    this.page = page
    this.items = page.getByTestId(itemSlot ?? `${slotPrefix}-item`)
    this.highlightAttr = highlightAttr
  }

  /** Press ArrowDown n times */
  async arrowDown(n = 1) {
    for (let i = 0; i < n; i++) {
      await this.page.keyboard.press("ArrowDown")
    }
  }

  /** Press ArrowUp n times */
  async arrowUp(n = 1) {
    for (let i = 0; i < n; i++) {
      await this.page.keyboard.press("ArrowUp")
    }
  }

  /** Press Home to jump to first item */
  async home() {
    await this.page.keyboard.press("Home")
  }

  /** Press End to jump to last item */
  async end() {
    await this.page.keyboard.press("End")
  }

  /** Press Enter to select the highlighted item */
  async selectWithEnter() {
    await this.page.keyboard.press("Enter")
  }

  /** Press Space to select the highlighted item */
  async selectWithSpace() {
    await this.page.keyboard.press("Space")
  }

  /** Assert the item at the given index has the highlight attribute */
  async expectHighlightedAt(index) {
    await expect(this.items.nth(index)).toHaveAttribute(this.highlightAttr, "")
  }

  /** Assert the item at the given index does NOT have the highlight attribute */
  async expectNotHighlightedAt(index) {
    await expect(this.items.nth(index)).not.toHaveAttribute(this.highlightAttr)
  }

  /** Get the total item count */
  async count() {
    return this.items.count()
  }

  /** Navigate to the last item by pressing ArrowDown (count - 1) times from first */
  async navigateToLast() {
    const total = await this.count()
    await this.arrowDown(total - 1)
  }
}
