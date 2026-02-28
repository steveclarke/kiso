import { Controller } from "@hotwired/stimulus"

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
    this._handleKeydown = this._handleKeydown.bind(this)
    document.addEventListener("keydown", this._handleKeydown)

    // Initialize: show all items, select first
    this._updateVisibility()
  }

  disconnect() {
    document.removeEventListener("keydown", this._handleKeydown)
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
    this._clearSelection()
    if (enabledItems.length > 0) {
      this._selectedIndex = 0
      this._applySelection(enabledItems)
    } else {
      this._selectedIndex = -1
    }
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

    this._selectedIndex += direction

    if (this._selectedIndex < 0) {
      this._selectedIndex = items.length - 1
    } else if (this._selectedIndex >= items.length) {
      this._selectedIndex = 0
    }

    this._clearSelection()
    this._applySelection(items)
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
   * Removes `data-selected` from all items.
   *
   * @private
   */
  _clearSelection() {
    this.itemTargets.forEach((item) => {
      item.removeAttribute("data-selected")
    })
  }

  /**
   * Applies `data-selected` to the item at `_selectedIndex` and scrolls it into view.
   *
   * @param {HTMLElement[]} items - The visible enabled items list
   * @private
   */
  _applySelection(items) {
    if (this._selectedIndex >= 0 && this._selectedIndex < items.length) {
      const selected = items[this._selectedIndex]
      selected.setAttribute("data-selected", "true")
      selected.scrollIntoView({ block: "nearest" })
    }
  }

  /**
   * Returns visible, non-disabled items.
   *
   * @returns {HTMLElement[]}
   * @private
   */
  get _visibleEnabledItems() {
    return this.itemTargets.filter(
      (item) => !item.hidden && item.dataset.disabled !== "true"
    )
  }

  /**
   * Global keydown handler for Home/End navigation when the command
   * palette has focus.
   *
   * @param {KeyboardEvent} event
   * @private
   */
  _handleKeydown(event) {
    // Only handle events when the command palette is focused or has focus within
    if (!this.element.contains(document.activeElement)) return

    switch (event.key) {
      case "Home":
        event.preventDefault()
        this._selectedIndex = 0
        this._clearSelection()
        this._applySelection(this._visibleEnabledItems)
        break
      case "End":
        event.preventDefault()
        const items = this._visibleEnabledItems
        this._selectedIndex = items.length - 1
        this._clearSelection()
        this._applySelection(items)
        break
    }
  }
}
