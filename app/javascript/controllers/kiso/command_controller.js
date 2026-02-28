import { Controller } from "@hotwired/stimulus"

import { highlightItem, wrapIndex } from "kiso-ui/utils/highlight"

/**
 * Command palette with search filtering, keyboard navigation, and item selection.
 * Filters items by text content, hides empty groups, and dispatches a "select"
 * event when an item is chosen.
 *
 * @example
 *   <div data-controller="kiso--command" data-slot="command">
 *     <input data-kiso--command-target="input"
 *            data-action="input->kiso--command#filter keydown->kiso--command#inputKeydown">
 *     <div data-kiso--command-target="list" role="listbox">
 *       <div data-kiso--command-target="empty" hidden>No results found.</div>
 *       <div data-kiso--command-target="group" role="group">
 *         <div data-kiso--command-target="item" data-value="calendar"
 *              data-action="click->kiso--command#selectItem" role="option">
 *           Calendar
 *         </div>
 *       </div>
 *     </div>
 *   </div>
 *
 * @property {HTMLInputElement} inputTarget - The search input field
 * @property {HTMLElement} listTarget - Scrollable results container
 * @property {HTMLElement} emptyTarget - "No results found" message
 * @property {HTMLElement[]} groupTargets - Command groups
 * @property {HTMLElement[]} itemTargets - Selectable command items
 *
 * @fires kiso--command:select - When an item is selected.
 *   Detail: `{ value: string, item: HTMLElement }`.
 */
export default class extends Controller {
  static targets = ["input", "list", "empty", "group", "item"]

  connect() {
    this._selectedIndex = -1

    // Initialize: show all items, select first
    this._updateVisibility()
  }

  /** Filters visible items based on the current input value. */
  filter() {
    this._updateVisibility()
  }

  /**
   * Handles keyboard navigation on the input: ArrowDown/Up to move selection,
   * Enter to select, Escape to bubble up for dialog to handle.
   *
   * @param {KeyboardEvent} event
   */
  inputKeydown(event) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        this._moveSelection(1)
        break
      case "ArrowUp":
        event.preventDefault()
        this._moveSelection(-1)
        break
      case "Enter":
        event.preventDefault()
        this._selectCurrent()
        break
      case "Escape":
        event.preventDefault()
        // Let it bubble up for dialog to handle
        this.element.dispatchEvent(new CustomEvent("command:escape", { bubbles: true }))
        break
      case "Home":
        event.preventDefault()
        this._selectedIndex = 0
        highlightItem(this.itemTargets, this._visibleEnabledItems, 0, { attr: "data-selected" })
        break
      case "End":
        event.preventDefault()
        {
          const items = this._visibleEnabledItems
          this._selectedIndex = items.length - 1
          highlightItem(this.itemTargets, items, this._selectedIndex, { attr: "data-selected" })
        }
        break
    }
  }

  /**
   * Selects an item when clicked.
   *
   * @param {Event} event - Click event from an item element
   */
  selectItem(event) {
    const item = event.currentTarget
    if (item.dataset.disabled === "true") return

    const value = item.dataset.value
    this.dispatch("select", { detail: { value, item } })
  }

  // --- Private ---

  /**
   * Filters items by the input query, hides empty groups, shows/hides
   * the empty state, and resets selection to the first visible enabled item.
   *
   * @private
   */
  _updateVisibility() {
    const query = this.hasInputTarget ? this.inputTarget.value.trim().toLowerCase() : ""

    let visibleCount = 0
    const enabledItems = []

    this.itemTargets.forEach((item) => {
      const text = item.textContent.trim().toLowerCase()
      const matches = !query || text.includes(query)

      item.hidden = !matches
      if (matches) {
        visibleCount++
        if (item.dataset.disabled !== "true") {
          enabledItems.push(item)
        }
      }
    })

    // Hide groups with no visible items
    if (this.hasGroupTarget) {
      this.groupTargets.forEach((group) => {
        const visibleItems = group.querySelectorAll("[data-slot='command-item']:not([hidden])")
        group.hidden = visibleItems.length === 0
      })
    }

    // Show/hide empty state
    if (this.hasEmptyTarget) {
      this.emptyTarget.hidden = visibleCount > 0
    }

    // Reset selection to first visible enabled item
    this._selectedIndex = enabledItems.length > 0 ? 0 : -1
    highlightItem(this.itemTargets, enabledItems, this._selectedIndex, { attr: "data-selected" })
  }

  /**
   * Moves the selection highlight by a given direction, wrapping at boundaries.
   *
   * @param {number} direction - +1 for next, -1 for previous
   * @private
   */
  _moveSelection(direction) {
    const items = this._visibleEnabledItems
    if (items.length === 0) return

    this._selectedIndex = wrapIndex(this._selectedIndex, direction, items.length)
    highlightItem(this.itemTargets, items, this._selectedIndex, { attr: "data-selected" })
  }

  /**
   * Dispatches a "select" event for the currently highlighted item.
   *
   * @private
   */
  _selectCurrent() {
    const items = this._visibleEnabledItems
    if (this._selectedIndex >= 0 && this._selectedIndex < items.length) {
      const item = items[this._selectedIndex]
      const value = item.dataset.value
      this.dispatch("select", { detail: { value, item } })
    }
  }

  /**
   * Returns visible, non-disabled items.
   *
   * @returns {HTMLElement[]}
   * @private
   */
  get _visibleEnabledItems() {
    return this.itemTargets.filter((item) => !item.hidden && item.dataset.disabled !== "true")
  }
}
