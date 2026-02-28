import { Controller } from "@hotwired/stimulus"

// Combobox autocomplete with keyboard navigation, filtering, and form integration.
// Supports single select and multi-select (with chips).
//
// Targets:
//   input: the text input for searching/filtering
//   content: the dropdown panel
//   list: the scrollable list inside the dropdown
//   item: each selectable option
//   indicator: checkmark indicator inside each item
//   empty: "no results" message
//   hiddenInput: hidden input for form submission
//   trigger: chevron button to toggle dropdown
//   chips: multi-select chip container
//   chip: individual chip elements
//
// Values:
//   multiple: boolean (default false) — enables multi-select mode
//
// Usage:
//   <div data-controller="kiso--combobox" data-kiso--combobox-multiple-value="false">
//     <div data-slot="combobox-input">
//       <input data-kiso--combobox-target="input"
//              data-action="input->kiso--combobox#filter focus->kiso--combobox#onInputFocus
//                           keydown->kiso--combobox#inputKeydown">
//       <button data-kiso--combobox-target="trigger"
//               data-action="click->kiso--combobox#toggle">
//       </button>
//     </div>
//     <div data-kiso--combobox-target="content" hidden>
//       <div data-kiso--combobox-target="list" role="listbox">
//         <div data-kiso--combobox-target="item" data-value="rails"
//              data-action="click->kiso--combobox#selectItem" role="option">
//           <span data-slot="combobox-item-text">Rails</span>
//           <span data-kiso--combobox-target="indicator" hidden>✓</span>
//         </div>
//       </div>
//       <div data-kiso--combobox-target="empty" hidden>No results.</div>
//     </div>
//     <input type="hidden" data-kiso--combobox-target="hiddenInput" name="framework">
//   </div>
export default class extends Controller {
  static targets = ["input", "content", "list", "item", "indicator", "empty", "hiddenInput", "trigger", "chips", "chip"]
  static values = { multiple: { type: Boolean, default: false } }

  connect() {
    this._open = false
    this._highlightedIndex = -1
    this._selectedValues = new Set()
    this._handleOutsideClick = this._handleOutsideClick.bind(this)
    this._handleKeydown = this._handleKeydown.bind(this)

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

  toggle(event) {
    event.preventDefault()
    if (this._open) {
      this.close()
    } else {
      this.open()
    }
  }

  onInputFocus() {
    if (!this._open) {
      this.open()
    }
  }

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

  selectItem(event) {
    const item = event.currentTarget
    if (item.dataset.disabled === "true") return
    this._doSelect(item)
  }

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

  _doSelect(item) {
    const value = item.dataset.value
    if (!value) return

    if (this.multipleValue) {
      this._toggleMultiSelect(value, item)
    } else {
      this._singleSelect(value, item)
    }
  }

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
    const input = this.chipsTarget.querySelector("[data-slot='combobox-chips-input']")
    if (input) {
      this.chipsTarget.insertBefore(chip, input)
    } else {
      this.chipsTarget.appendChild(chip)
    }
  }

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

  _syncHiddenInput() {
    if (!this.hasHiddenInputTarget) return

    if (this.multipleValue) {
      this.hiddenInputTarget.value = Array.from(this._selectedValues).join(",")
    }
  }

  _itemText(item) {
    const textEl = item.querySelector("[data-slot='combobox-item-text']")
    return textEl ? textEl.textContent.trim() : item.dataset.value || ""
  }

  get _visibleEnabledItems() {
    return this.itemTargets.filter(
      (item) => !item.hidden && item.dataset.disabled !== "true"
    )
  }

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

  _moveHighlight(direction) {
    const items = this._visibleEnabledItems
    if (items.length === 0) return

    let newIndex = this._highlightedIndex + direction
    if (newIndex < 0) newIndex = items.length - 1
    if (newIndex >= items.length) newIndex = 0

    this._highlightIndex(newIndex)
  }

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

  _handleOutsideClick(event) {
    if (!this.element.contains(event.target)) {
      this.close()
    }
  }

  _handleKeydown(event) {
    // Global keydown handler is not needed — the inputKeydown action handles all keys.
    // This is a safety net for edge cases.
  }

  _addGlobalListeners() {
    document.addEventListener("click", this._handleOutsideClick, true)
  }

  _removeGlobalListeners() {
    document.removeEventListener("click", this._handleOutsideClick, true)
  }
}
