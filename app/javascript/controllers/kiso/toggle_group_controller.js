import { Controller } from "@hotwired/stimulus"

// Manages selection state for a group of toggle buttons.
// Supports single (radio-like) and multiple (checkbox-like) selection modes.
//
// Values:
//   type: "single" (default) or "multiple"
//   variant: inherited variant for styling context
//   size: inherited size for styling context
//
// Targets:
//   item: each toggle button in the group
//
// Usage:
//   <div data-controller="kiso--toggle-group"
//        data-kiso--toggle-group-type-value="single">
//     <button data-kiso--toggle-group-target="item"
//             data-action="click->kiso--toggle-group#toggle"
//             data-value="left" data-state="off" aria-pressed="false">
//       Left
//     </button>
//   </div>
export default class extends Controller {
  static targets = ["item"]
  static values = {
    type: { type: String, default: "single" },
    variant: { type: String, default: "default" },
    size: { type: String, default: "default" }
  }

  toggle(event) {
    const item = event.currentTarget
    const pressed = item.dataset.state === "on"

    if (this.typeValue === "single") {
      // In single mode, deselect all others first
      this.itemTargets.forEach((target) => {
        target.dataset.state = "off"
        target.setAttribute("aria-pressed", "false")
      })

      // Toggle the clicked item (allow deselect in single mode)
      if (!pressed) {
        item.dataset.state = "on"
        item.setAttribute("aria-pressed", "true")
      }
    } else {
      // In multiple mode, toggle independently
      item.dataset.state = pressed ? "off" : "on"
      item.setAttribute("aria-pressed", !pressed)
    }

    this.#dispatchChange()
  }

  // Keyboard navigation: arrow keys move focus between items
  connect() {
    this.element.addEventListener("keydown", this.#handleKeydown)
  }

  disconnect() {
    this.element.removeEventListener("keydown", this.#handleKeydown)
  }

  #handleKeydown = (event) => {
    const items = this.itemTargets.filter((item) => !item.disabled)
    const currentIndex = items.indexOf(document.activeElement)

    if (currentIndex === -1) return

    let nextIndex
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault()
        nextIndex = (currentIndex + 1) % items.length
        items[nextIndex].focus()
        break
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault()
        nextIndex = (currentIndex - 1 + items.length) % items.length
        items[nextIndex].focus()
        break
      case "Home":
        event.preventDefault()
        items[0].focus()
        break
      case "End":
        event.preventDefault()
        items[items.length - 1].focus()
        break
    }
  }

  #dispatchChange() {
    const selectedValues = this.itemTargets
      .filter((item) => item.dataset.state === "on")
      .map((item) => item.dataset.value)

    this.dispatch("change", {
      detail: {
        value: this.typeValue === "single" ? selectedValues[0] || null : selectedValues
      }
    })
  }
}
