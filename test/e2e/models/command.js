import { expect } from "../fixtures/index.js"

/**
 * Shared interaction model for Command component navigation with
 * `data-selected` tracking. Used by Command and CommandDialog.
 *
 * @example
 *   const command = new CommandModel(page)
 *   await command.expectSelectedAt(0)
 *   await command.arrowDown()
 *   await command.expectSelectedAt(1)
 */
export class CommandModel {
  /**
   * @param {import("@playwright/test").Page} page
   */
  constructor(page) {
    this.page = page
    this.input = page.getByTestId("command-input")
    this.items = page.getByTestId("command-item")
    this.enabledItems = page.locator("[data-slot='command-item']:not([data-disabled='true'])")
    this.groups = page.getByTestId("command-group")
    this.empty = page.getByTestId("command-empty")
  }

  /** Focus the command input */
  async focusInput() {
    await this.input.focus()
  }

  /** Type a filter query into the command input */
  async filter(text) {
    await this.input.fill(text)
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

  /** Press Home */
  async home() {
    await this.page.keyboard.press("Home")
  }

  /** Press End */
  async end() {
    await this.page.keyboard.press("End")
  }

  /** Assert the item at the given index has data-selected */
  async expectSelectedAt(index) {
    await expect(this.items.nth(index)).toHaveAttribute("data-selected", "")
  }

  /** Assert the item at the given index does NOT have data-selected */
  async expectNotSelectedAt(index) {
    await expect(this.items.nth(index)).not.toHaveAttribute("data-selected", "")
  }

  /** Assert the first enabled item has data-selected */
  async expectFirstEnabledSelected() {
    await expect(this.enabledItems.first()).toHaveAttribute("data-selected", "")
  }

  /** Assert the last enabled item has data-selected */
  async expectLastEnabledSelected() {
    await expect(this.enabledItems.last()).toHaveAttribute("data-selected", "")
  }

  /** Get visible (non-hidden) items */
  visibleItems() {
    return this.page.locator("[data-slot='command-item']:not([hidden])")
  }
}
