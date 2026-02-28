import { Controller } from "@hotwired/stimulus"

/**
 * Combobox autocomplete with keyboard navigation, filtering, and form integration.
 * Supports single-select and multi-select (with removable chips).
 *
 * @example
 *   <div data-controller="kiso--combobox" data-kiso--combobox-multiple-value="false">
 *     <div data-slot="combobox-input">
 *       <input data-kiso--combobox-target="input"
 *              data-action="input->kiso--combobox#filter focus->kiso--combobox#onInputFocus
 *                           keydown->kiso--combobox#inputKeydown">
 *       <button data-kiso--combobox-target="trigger"
 *               data-action="click->kiso--combobox#toggle">
 *       </button>
 *     </div>
 *     <div data-kiso--combobox-target="content" hidden>
 *       <div data-kiso--combobox-target="list" role="listbox">
 *         <div data-kiso--combobox-target="item" data-value="rails"
 *              data-action="click->kiso--combobox#selectItem" role="option">
 *           <span data-slot="combobox-item-text">Rails</span>
 *           <span data-kiso--combobox-target="indicator" hidden>✓</span>
 *         </div>
 *       </div>
 *       <div data-kiso--combobox-target="empty" hidden>No results.</div>
 *     </div>
 *     <input type="hidden" data-kiso--combobox-target="hiddenInput" name="framework">
 *   </div>
 *
 * @property {HTMLInputElement} inputTarget - Text input for searching/filtering
 * @property {HTMLElement} contentTarget - The dropdown panel
 * @property {HTMLElement} listTarget - Scrollable list inside the dropdown
 * @property {HTMLElement[]} itemTargets - Selectable option elements
 * @property {HTMLElement[]} indicatorTargets - Checkmark indicators inside items
 * @property {HTMLElement} emptyTarget - "No results" message element
 * @property {HTMLInputElement} hiddenInputTarget - Hidden input for form submission
 * @property {HTMLElement} triggerTarget - Chevron button to toggle dropdown
 * @property {HTMLElement} chipsTarget - Multi-select chip container
 * @property {HTMLElement[]} chipTargets - Individual chip elements
 * @property {boolean} multipleValue - Enables multi-select mode when true
 *
 * @fires kiso--combobox:change - When selection changes.
 *   Detail: `{ value: string }` (single) or `{ value: string[] }` (multiple).
 */
export default class extends Controller {
  static targets = ["input", "content", "list", "item", "indicator", "empty", "hiddenInput", "trigger", "chips", "chip"]
  static values = { multiple: { type: Boolean, default: false } }

  connect() {
    this._open = false
    this._highlightedIndex = -1
    this._selectedValues = new Set()
    this._handleOutsideClick = this._handleOutsideClick.bind(this)

    // Initialize selected state from pre-rendered chips (multi-select)
    if (this.multipleValue && this.hasChipTarget) {
      this.chipTargets.forEach((chip) => {
        const value = chip.dataset.value
        if (value) this._selectedValues.add(value)
      })
      this._syncIndicators()
      this._syncHiddenInput()
    }
  }

  disconnect() {
    this._removeGlobalListeners()
  }

  // --- Actions ---

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

  /** Opens the dropdown when the input receives focus. */
  onInputFocus() {
    if (!this._open) {
      this.open()
    }
  }

  /**
   * Filters the item list based on the current input value.
   * Hides non-matching items, updates the empty state, and auto-highlights
   * the first visible item.
   */
  filter() {
    const query = this.hasInputTarget ? this.inputTarget.value.toLowerCase().trim() : ""
    let visibleCount = 0

    this.itemTargets.forEach((item) => {
      const text = this._itemText(item).toLowerCase()
      const matches = text.includes(query)
      item.hidden = !matches
      if (matches) visibleCount++
    })

    // Show/hide empty state
    if (this.hasEmptyTarget) {
      this.emptyTarget.hidden = visibleCount > 0
    }

    // Show/hide group labels and separators based on visible items
    this._updateGroupVisibility()

    // Reset highlighting
    this._highlightIndex(-1)

    // Auto-highlight first visible item
    const firstVisible = this._visibleEnabledItems
    if (firstVisible.length > 0) {
      this._highlightIndex(0)
    }
  }

  /**
   * Handles keyboard events on the input field.
   * Supports ArrowDown/Up, Enter, Escape, Backspace (remove last chip),
   * Tab, Home, and End.
   *
   * @param {KeyboardEvent} event
   */
  inputKeydown(event) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        if (!this._open) {
          this.open()
        } else {
          this._moveHighlight(1)
        }
        break
      case "ArrowUp":
        event.preventDefault()
        if (!this._open) {
          this.open()
        } else {
          this._moveHighlight(-1)
        }
        break
      case "Enter":
        event.preventDefault()
        if (this._open && this._highlightedIndex >= 0) {
          const items = this._visibleEnabledItems
          if (this._highlightedIndex < items.length) {
            this._doSelect(items[this._highlightedIndex])
          }
        }
        break
      case "Escape":
        event.preventDefault()
        if (this._open) {
          this.close()
        }
        break
      case "Backspace":
        // In multi-select, remove last chip if input is empty
        if (this.multipleValue && this.hasInputTarget && this.inputTarget.value === "") {
          this._removeLastChip()
        }
        break
      case "Tab":
        if (this._open) {
          this.close()
        }
        break
      case "Home":
        if (this._open) {
          event.preventDefault()
          const items = this._visibleEnabledItems
          if (items.length > 0) this._highlightIndex(0)
        }
        break
      case "End":
        if (this._open) {
          event.preventDefault()
          const items = this._visibleEnabledItems
          if (items.length > 0) this._highlightIndex(items.length - 1)
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
    this._doSelect(item)
  }

  /**
   * Removes a chip in multi-select mode.
   * Deselects the value and removes the chip element from the DOM.
   *
   * @param {Event} event - Click event from a chip's remove button
   */
  removeChip(event) {
    const value = event.currentTarget.dataset.value
    if (!value) return

    this._selectedValues.delete(value)

    // Remove the chip element
    const chip = this.chipTargets.find((c) => c.dataset.value === value)
    if (chip) chip.remove()

    this._syncIndicators()
    this._syncHiddenInput()
    this.dispatch("change", { detail: { value: Array.from(this._selectedValues) } })

    // Refocus the input
    if (this.hasInputTarget) {
      this.inputTarget.focus()
    }
  }

  // --- Open / Close ---

  /**
   * Opens the dropdown, resets filtering, and highlights the selected
   * item (single mode) or the first item (multi mode).
   */
  open() {
    if (this._open) return

    this._open = true
    if (this.hasContentTarget) {
      this.contentTarget.hidden = false
      this._positionContent()
    }

    this._addGlobalListeners()

    // Reset filter to show all items
    this.itemTargets.forEach((item) => { item.hidden = false })
    if (this.hasEmptyTarget) {
      this.emptyTarget.hidden = true
    }
    this._updateGroupVisibility()

    // Highlight the selected item (single mode) or first item
    if (!this.multipleValue) {
      const selectedIndex = this._visibleEnabledItems.findIndex(
        (item) => item.getAttribute("aria-selected") === "true"
      )
      this._highlightIndex(selectedIndex >= 0 ? selectedIndex : 0)
    } else {
      this._highlightIndex(0)
    }

    // Update trigger aria
    if (this.hasTriggerTarget) {
      this.triggerTarget.setAttribute("aria-expanded", "true")
    }
  }

  /**
   * Closes the dropdown and clears the filter text (multi-select mode only).
   */
  close() {
    if (!this._open) return

    this._open = false
    if (this.hasContentTarget) {
      this.contentTarget.hidden = true
    }
    this._highlightIndex(-1)
    this._removeGlobalListeners()

    // Update trigger aria
    if (this.hasTriggerTarget) {
      this.triggerTarget.setAttribute("aria-expanded", "false")
    }

    // Clear filter text unless it shows selected value (single mode)
    if (this.hasInputTarget && this.multipleValue) {
      this.inputTarget.value = ""
    }
  }

  // --- Private ---

  /**
   * Routes selection to single or multi-select handler.
   *
   * @param {HTMLElement} item - The item element to select
   * @private
   */
  _doSelect(item) {
    const value = item.dataset.value
    if (!value) return

    if (this.multipleValue) {
      this._toggleMultiSelect(value, item)
    } else {
      this._singleSelect(value, item)
    }
  }

  /**
   * Handles single-select: updates aria, indicators, hidden input,
   * and closes the dropdown.
   *
   * @param {string} value - The selected value
   * @param {HTMLElement} item - The selected item element
   * @private
   */
  _singleSelect(value, item) {
    const text = this._itemText(item)

    // Update selected state on all items
    this.itemTargets.forEach((i) => {
      const isSelected = i.dataset.value === value
      i.setAttribute("aria-selected", isSelected)
    })

    // Update indicators
    this._syncIndicators()

    // Set hidden input value
    if (this.hasHiddenInputTarget) {
      this.hiddenInputTarget.value = value
    }

    // Set input text to selected item
    if (this.hasInputTarget) {
      this.inputTarget.value = text
    }

    this.close()
    this.dispatch("change", { detail: { value } })

    // Focus the input after close
    if (this.hasInputTarget) {
      this.inputTarget.focus()
    }
  }

  /**
   * Handles multi-select toggle: adds/removes from selection,
   * creates/removes chips, and re-filters the list.
   *
   * @param {string} value - The toggled value
   * @param {HTMLElement} item - The toggled item element
   * @private
   */
  _toggleMultiSelect(value, item) {
    if (this._selectedValues.has(value)) {
      // Deselect
      this._selectedValues.delete(value)
      item.setAttribute("aria-selected", "false")

      // Remove the chip
      const chip = this.chipTargets.find((c) => c.dataset.value === value)
      if (chip) chip.remove()
    } else {
      // Select
      this._selectedValues.add(value)
      item.setAttribute("aria-selected", "true")

      // Create a chip
      this._createChip(value, this._itemText(item))
    }

    this._syncIndicators()
    this._syncHiddenInput()
    this.dispatch("change", { detail: { value: Array.from(this._selectedValues) } })

    // Clear input and refocus
    if (this.hasInputTarget) {
      this.inputTarget.value = ""
      this.inputTarget.focus()
    }

    // Re-filter to show all items again
    this.filter()
  }

  /**
   * Creates a chip element for a selected value in multi-select mode
   * and inserts it before the input.
   *
   * @param {string} value - The selected value
   * @param {string} text - The display text
   * @private
   */
  _createChip(value, text) {
    if (!this.hasChipsTarget) return

    const chip = document.createElement("span")
    chip.className = "bg-muted text-foreground flex h-5.5 w-fit items-center justify-center gap-1 rounded-sm px-1.5 text-xs font-medium whitespace-nowrap"
    chip.setAttribute("data-slot", "combobox-chip")
    chip.setAttribute("data-kiso--combobox-target", "chip")
    chip.setAttribute("data-value", value)

    const textSpan = document.createElement("span")
    textSpan.setAttribute("data-slot", "combobox-chip-text")
    textSpan.textContent = text

    const removeBtn = document.createElement("button")
    removeBtn.type = "button"
    removeBtn.className = "flex size-4 items-center justify-center rounded-sm opacity-50 hover:opacity-100"
    removeBtn.setAttribute("data-slot", "combobox-chip-remove")
    removeBtn.setAttribute("data-action", "click->kiso--combobox#removeChip")
    removeBtn.setAttribute("data-value", value)
    removeBtn.tabIndex = -1
    removeBtn.innerHTML = '<svg class="shrink-0 size-3 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'

    chip.appendChild(textSpan)
    chip.appendChild(removeBtn)

    // Insert chip before the input element
    const input = this.chipsTarget.querySelector("[data-slot='combobox-chip-input']")
    if (input) {
      this.chipsTarget.insertBefore(chip, input)
    } else {
      this.chipsTarget.appendChild(chip)
    }
  }

  /**
   * Removes the last chip in multi-select mode (triggered by Backspace
   * when the input is empty).
   *
   * @private
   */
  _removeLastChip() {
    const chips = this.chipTargets
    if (chips.length === 0) return

    const lastChip = chips[chips.length - 1]
    const value = lastChip.dataset.value
    if (value) {
      this._selectedValues.delete(value)
      lastChip.remove()
      this._syncIndicators()
      this._syncHiddenInput()
      this.dispatch("change", { detail: { value: Array.from(this._selectedValues) } })
    }
  }

  /**
   * Syncs checkmark indicator visibility with current selection state.
   *
   * @private
   */
  _syncIndicators() {
    this.itemTargets.forEach((item) => {
      const value = item.dataset.value
      const isSelected = this.multipleValue
        ? this._selectedValues.has(value)
        : item.getAttribute("aria-selected") === "true"

      const indicator = item.querySelector("[data-slot='combobox-item-indicator']")
      if (indicator) {
        indicator.hidden = !isSelected
      }
    })
  }

  /**
   * Syncs the hidden input value with the current selection.
   * Multi-select joins values with commas.
   *
   * @private
   */
  _syncHiddenInput() {
    if (!this.hasHiddenInputTarget) return

    if (this.multipleValue) {
      this.hiddenInputTarget.value = Array.from(this._selectedValues).join(",")
    }
  }

  /**
   * Extracts the display text from an item element.
   *
   * @param {HTMLElement} item
   * @returns {string}
   * @private
   */
  _itemText(item) {
    const textEl = item.querySelector("[data-slot='combobox-item-text']")
    return textEl ? textEl.textContent.trim() : item.dataset.value || ""
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
   * Highlights an item at the given index and scrolls it into view.
   * Pass -1 to clear all highlights.
   *
   * @param {number} index - Index within visible enabled items, or -1 to clear
   * @private
   */
  _highlightIndex(index) {
    // Remove highlight from all items
    this.itemTargets.forEach((item) => {
      item.removeAttribute("data-highlighted")
    })

    this._highlightedIndex = index
    const items = this._visibleEnabledItems

    if (index >= 0 && index < items.length) {
      items[index].setAttribute("data-highlighted", "")
      items[index].scrollIntoView({ block: "nearest" })
    }
  }

  /**
   * Moves the highlight by a given direction (+1 or -1), wrapping at boundaries.
   *
   * @param {number} direction - +1 for next, -1 for previous
   * @private
   */
  _moveHighlight(direction) {
    const items = this._visibleEnabledItems
    if (items.length === 0) return

    let newIndex = this._highlightedIndex + direction
    if (newIndex < 0) newIndex = items.length - 1
    if (newIndex >= items.length) newIndex = 0

    this._highlightIndex(newIndex)
  }

  /**
   * Shows/hides group labels and separators based on whether they
   * contain any visible items.
   *
   * @private
   */
  _updateGroupVisibility() {
    // Show/hide group labels based on whether they have visible items
    if (!this.hasListTarget) return

    const groups = this.listTarget.querySelectorAll("[data-slot='combobox-group']")
    groups.forEach((group) => {
      const items = group.querySelectorAll("[data-slot='combobox-item']")
      const hasVisible = Array.from(items).some((item) => !item.hidden)
      group.hidden = !hasVisible
    })

    // Show/hide separators based on adjacent visible groups
    const separators = this.listTarget.querySelectorAll("[data-slot='combobox-separator']")
    separators.forEach((sep) => {
      const prevGroup = sep.previousElementSibling
      const nextGroup = sep.nextElementSibling
      const prevVisible = prevGroup && !prevGroup.hidden
      const nextVisible = nextGroup && !nextGroup.hidden
      sep.hidden = !(prevVisible && nextVisible)
    })
  }

  /**
   * Positions the dropdown below the input/chips container with matching width.
   *
   * @private
   */
  _positionContent() {
    if (!this.hasContentTarget) return

    const content = this.contentTarget

    // Find the anchor — either the combobox-input wrapper, chips container, or the controller element
    const anchor = this.element.querySelector("[data-slot='combobox-input']") ||
      this.element.querySelector("[data-slot='combobox-chips']") ||
      this.element

    const rect = anchor.getBoundingClientRect()

    content.style.position = "absolute"
    content.style.top = `${anchor.offsetTop + anchor.offsetHeight + 4}px`
    content.style.left = `${anchor.offsetLeft}px`
    content.style.minWidth = `${rect.width}px`
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

  /** @private */
  _addGlobalListeners() {
    document.addEventListener("click", this._handleOutsideClick, true)
  }

  /** @private */
  _removeGlobalListeners() {
    document.removeEventListener("click", this._handleOutsideClick, true)
  }
}
