import { Controller } from "@hotwired/stimulus"

// Command palette with search filtering, keyboard navigation, and item selection.
//
// Targets:
//   input: the search input field
//   list: the scrollable results container
//   empty: the "no results found" message
//   group: each command group
//   item: each selectable command item
//
// Usage:
//   <div data-controller="kiso--command" data-slot="command">
//     <input data-kiso--command-target="input"
//            data-action="input->kiso--command#filter keydown->kiso--command#inputKeydown">
//     <div data-kiso--command-target="list" role="listbox">
//       <div data-kiso--command-target="empty" hidden>No results found.</div>
//       <div data-kiso--command-target="group" role="group">
//         <div data-kiso--command-target="item" data-value="calendar"
//              data-action="click->kiso--command#selectItem" role="option">
//           Calendar
//         </div>
//       </div>
//     </div>
//   </div>
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

  filter() {
    this._updateVisibility()
  }

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

  selectItem(event) {
    const item = event.currentTarget
    if (item.dataset.disabled === "true") return

    const value = item.dataset.value
    this.dispatch("select", { detail: { value, item } })
  }

  // --- Private ---

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

  _selectCurrent() {
    const items = this._visibleEnabledItems
    if (this._selectedIndex >= 0 && this._selectedIndex < items.length) {
      const item = items[this._selectedIndex]
      const value = item.dataset.value
      this.dispatch("select", { detail: { value, item } })
    }
  }

  _clearSelection() {
    this.itemTargets.forEach((item) => {
      item.removeAttribute("data-selected")
    })
  }

  _applySelection(items) {
    if (this._selectedIndex >= 0 && this._selectedIndex < items.length) {
      const selected = items[this._selectedIndex]
      selected.setAttribute("data-selected", "true")
      selected.scrollIntoView({ block: "nearest" })
    }
  }

  get _visibleEnabledItems() {
    return this.itemTargets.filter(
      (item) => !item.hidden && item.dataset.disabled !== "true"
    )
  }

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
