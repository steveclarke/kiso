import { Controller } from "@hotwired/stimulus"
import { positionBelow } from "./utils/positioning"
import { highlightItem, wrapIndex } from "./utils/highlight"

/**
 * Custom select dropdown with keyboard navigation and form integration.
 * Renders a trigger button, hidden listbox, and syncs selection to a hidden input.
 *
 * @example
 *   <div data-controller="kiso--select" data-slot="select">
 *     <button data-kiso--select-target="trigger"
 *             data-action="click->kiso--select#toggle keydown->kiso--select#triggerKeydown">
 *       <span data-kiso--select-target="valueDisplay" data-placeholder="Pick one...">
 *         <span class="text-muted-foreground">Pick one...</span>
 *       </span>
 *     </button>
 *     <div data-kiso--select-target="content" role="listbox" hidden>
 *       <div data-kiso--select-target="item" data-value="apple"
 *            data-action="click->kiso--select#selectItem" role="option">
 *         <span data-kiso--select-target="indicator" hidden>✓</span>
 *         <span>Apple</span>
 *       </div>
 *     </div>
 *     <input type="hidden" data-kiso--select-target="hiddenInput" name="fruit">
 *   </div>
 *
 * @property {HTMLElement} triggerTarget - Button that opens/closes the dropdown
 * @property {HTMLElement} contentTarget - The dropdown panel (listbox)
 * @property {HTMLElement[]} itemTargets - Selectable option elements
 * @property {HTMLElement[]} indicatorTargets - Checkmark indicators inside items
 * @property {HTMLInputElement} hiddenInputTarget - Hidden input for form submission
 * @property {HTMLElement} valueDisplayTarget - Span showing the current selection text
 *
 * @fires kiso--select:change - When selection changes. Detail: `{ value: string }`.
 */
export default class extends Controller {
  static targets = ["trigger", "content", "item", "indicator", "hiddenInput", "valueDisplay"]

  connect() {
    this._open = false
    this._highlightedIndex = -1
    this._handleOutsideClick = this._handleOutsideClick.bind(this)
    this._handleKeydown = this._handleKeydown.bind(this)
  }

  disconnect() {
    this._removeGlobalListeners()
  }

  /**
   * Toggles the dropdown open or closed.
   *
   * @param {Event} event
   */
  toggle(event) {
    event.preventDefault()
    if (this._open) {
      this.close()
    } else {
      this.open()
    }
  }

  /** Opens the dropdown, positions it, and highlights the selected or first item. */
  open() {
    if (this.triggerTarget.disabled) return

    this._open = true
    this.contentTarget.hidden = false
    this.triggerTarget.setAttribute("aria-expanded", "true")
    this._positionContent()
    this._addGlobalListeners()

    // Highlight the currently selected item, or the first item
    const selectedIndex = this._enabledItems.findIndex(
      (item) => item.getAttribute("aria-selected") === "true"
    )
    this._highlightIndex(selectedIndex >= 0 ? selectedIndex : 0)
  }

  /** Closes the dropdown and returns focus to the trigger. */
  close() {
    this._open = false
    this.contentTarget.hidden = true
    this.triggerTarget.setAttribute("aria-expanded", "false")
    this._highlightIndex(-1)
    this._removeGlobalListeners()
    this.triggerTarget.focus()
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
    const text = item.querySelector("[data-slot='select-item-text']")?.textContent?.trim() || value

    this._setValue(value, text)
    this.close()
  }

  /**
   * Opens the dropdown on ArrowDown, ArrowUp, Space, or Enter when trigger is focused.
   *
   * @param {KeyboardEvent} event
   */
  triggerKeydown(event) {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
      case " ":
      case "Enter":
        event.preventDefault()
        if (!this._open) {
          this.open()
        }
        break
    }
  }

  // --- Private ---

  /**
   * Updates the hidden input, display text, aria-selected states, and indicators.
   *
   * @param {string} value - The selected value
   * @param {string} text - The display text for the selection
   * @private
   */
  _setValue(value, text) {
    // Update hidden input
    if (this.hasHiddenInputTarget) {
      this.hiddenInputTarget.value = value
    }

    // Update displayed value
    if (this.hasValueDisplayTarget) {
      this.valueDisplayTarget.innerHTML = ""
      this.valueDisplayTarget.textContent = text
    }

    // Update aria-selected on items and show/hide indicators
    this.itemTargets.forEach((item, index) => {
      const isSelected = item.dataset.value === value
      item.setAttribute("aria-selected", isSelected)

      // Find the indicator within this item
      const indicator = item.querySelector("[data-slot='select-item-indicator']")
      if (indicator) {
        indicator.hidden = !isSelected
      }
    })

    // Dispatch change event
    this.dispatch("change", { detail: { value } })
  }

  /**
   * Returns items that are not disabled.
   *
   * @returns {HTMLElement[]}
   * @private
   */
  get _enabledItems() {
    return this.itemTargets.filter((item) => item.dataset.disabled !== "true")
  }

  /**
   * Highlights an item at the given index and scrolls it into view.
   * Pass -1 to clear all highlights.
   *
   * @param {number} index - Index within enabled items, or -1 to clear
   * @private
   */
  _highlightIndex(index) {
    this._highlightedIndex = index
    highlightItem(this.itemTargets, this._enabledItems, index)
  }

  /**
   * Positions the dropdown below the trigger with matching width.
   *
   * @private
   */
  _positionContent() {
    positionBelow(this.triggerTarget, this.contentTarget)
  }

  /**
   * Closes the dropdown when clicking outside the component.
   *
   * @param {MouseEvent} event
   * @private
   */
  _handleOutsideClick(event) {
    if (!this.element.contains(event.target)) {
      this.close()
    }
  }

  /**
   * Handles keyboard navigation while the dropdown is open.
   * Supports ArrowDown/Up, Enter, Space, Escape, Home, End, Tab, and type-ahead.
   *
   * @param {KeyboardEvent} event
   * @private
   */
  _handleKeydown(event) {
    if (!this._open) return

    const items = this._enabledItems

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        this._highlightIndex(wrapIndex(this._highlightedIndex, 1, items.length))
        break
      case "ArrowUp":
        event.preventDefault()
        this._highlightIndex(wrapIndex(this._highlightedIndex, -1, items.length))
        break
      case "Enter":
      case " ":
        event.preventDefault()
        if (this._highlightedIndex >= 0 && this._highlightedIndex < items.length) {
          const item = items[this._highlightedIndex]
          if (item.dataset.disabled !== "true") {
            const value = item.dataset.value
            const text = item.querySelector("[data-slot='select-item-text']")?.textContent?.trim() || value
            this._setValue(value, text)
            this.close()
          }
        }
        break
      case "Escape":
        event.preventDefault()
        this.close()
        break
      case "Home":
        event.preventDefault()
        this._highlightIndex(0)
        break
      case "End":
        event.preventDefault()
        this._highlightIndex(items.length - 1)
        break
      case "Tab":
        this.close()
        break
      default:
        // Type-ahead: focus first item starting with typed character
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
          const char = event.key.toLowerCase()
          const startIndex = this._highlightedIndex + 1
          const matchIndex = items.findIndex((item, i) => {
            const actualIndex = (startIndex + i) % items.length
            const text = items[actualIndex]
              .querySelector("[data-slot='select-item-text']")
              ?.textContent?.trim()
              .toLowerCase()
            return text?.startsWith(char)
          })
          if (matchIndex >= 0) {
            const actualIndex = (startIndex + matchIndex) % items.length
            this._highlightIndex(actualIndex)
          }
        }
        break
    }
  }

  /** @private */
  _addGlobalListeners() {
    document.addEventListener("click", this._handleOutsideClick, true)
    document.addEventListener("keydown", this._handleKeydown)
  }

  /** @private */
  _removeGlobalListeners() {
    document.removeEventListener("click", this._handleOutsideClick, true)
    document.removeEventListener("keydown", this._handleKeydown)
  }
}
