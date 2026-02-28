import { Controller } from "@hotwired/stimulus"

// Custom select dropdown with keyboard navigation and form integration.
//
// Targets:
//   trigger: the button that opens/closes the dropdown
//   content: the dropdown panel (listbox)
//   item: each selectable option
//   indicator: checkmark indicator inside each item
//   hiddenInput: hidden input for form submission
//   valueDisplay: span showing the current selection text
//
// Usage:
//   <div data-controller="kiso--select" data-slot="select">
//     <button data-kiso--select-target="trigger"
//             data-action="click->kiso--select#toggle keydown->kiso--select#triggerKeydown">
//       <span data-kiso--select-target="valueDisplay" data-placeholder="Pick one...">
//         <span class="text-muted-foreground">Pick one...</span>
//       </span>
//     </button>
//     <div data-kiso--select-target="content" role="listbox" hidden>
//       <div data-kiso--select-target="item" data-value="apple"
//            data-action="click->kiso--select#selectItem" role="option">
//         <span data-kiso--select-target="indicator" hidden>✓</span>
//         <span>Apple</span>
//       </div>
//     </div>
//     <input type="hidden" data-kiso--select-target="hiddenInput" name="fruit">
//   </div>
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

  toggle(event) {
    event.preventDefault()
    if (this._open) {
      this.close()
    } else {
      this.open()
    }
  }

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

  close() {
    this._open = false
    this.contentTarget.hidden = true
    this.triggerTarget.setAttribute("aria-expanded", "false")
    this._highlightIndex(-1)
    this._removeGlobalListeners()
    this.triggerTarget.focus()
  }

  selectItem(event) {
    const item = event.currentTarget
    if (item.dataset.disabled === "true") return

    const value = item.dataset.value
    const text = item.querySelector("[data-slot='select-item-text']")?.textContent?.trim() || value

    this._setValue(value, text)
    this.close()
  }

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

  get _enabledItems() {
    return this.itemTargets.filter((item) => item.dataset.disabled !== "true")
  }

  _highlightIndex(index) {
    // Remove highlight from all items
    this.itemTargets.forEach((item) => {
      item.removeAttribute("data-highlighted")
    })

    this._highlightedIndex = index
    const items = this._enabledItems

    if (index >= 0 && index < items.length) {
      items[index].setAttribute("data-highlighted", "")
      items[index].scrollIntoView({ block: "nearest" })
    }
  }

  _positionContent() {
    const trigger = this.triggerTarget
    const content = this.contentTarget
    const rect = trigger.getBoundingClientRect()

    content.style.position = "absolute"
    content.style.top = `${trigger.offsetHeight + 4}px`
    content.style.left = "0"
    content.style.minWidth = `${rect.width}px`
  }

  _handleOutsideClick(event) {
    if (!this.element.contains(event.target)) {
      this.close()
    }
  }

  _handleKeydown(event) {
    if (!this._open) return

    const items = this._enabledItems

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        this._highlightIndex(
          this._highlightedIndex < items.length - 1
            ? this._highlightedIndex + 1
            : 0
        )
        break
      case "ArrowUp":
        event.preventDefault()
        this._highlightIndex(
          this._highlightedIndex > 0
            ? this._highlightedIndex - 1
            : items.length - 1
        )
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

  _addGlobalListeners() {
    document.addEventListener("click", this._handleOutsideClick, true)
    document.addEventListener("keydown", this._handleKeydown)
  }

  _removeGlobalListeners() {
    document.removeEventListener("click", this._handleOutsideClick, true)
    document.removeEventListener("keydown", this._handleKeydown)
  }
}
