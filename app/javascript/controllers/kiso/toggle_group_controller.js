import { Controller } from "@hotwired/stimulus"

/**
 * Manages selection state for a group of toggle buttons.
 * Supports single (radio-like) and multiple (checkbox-like) selection modes.
 *
 * @example
 *   <div data-controller="kiso--toggle-group"
 *        data-kiso--toggle-group-type-value="single">
 *     <button data-kiso--toggle-group-target="item"
 *             data-action="click->kiso--toggle-group#toggle"
 *             data-value="left" data-state="off" aria-pressed="false">
 *       Left
 *     </button>
 *   </div>
 *
 * @property {HTMLElement[]} itemTargets - Toggle buttons in the group
 * @property {string} typeValue - Selection mode: "single" or "multiple"
 * @property {string} variantValue - Inherited variant for styling context
 * @property {string} sizeValue - Inherited size for styling context
 *
 * @fires kiso--toggle-group:change - When selection changes.
 *   Detail: `{ value: string | null }` (single) or `{ value: string[] }` (multiple).
 */
export default class extends Controller {
  static targets = ["item"]
  static values = {
    type: { type: String, default: "single" },
    variant: { type: String, default: "default" },
    size: { type: String, default: "default" }
  }

  /**
   * Handles a toggle click on one of the group items.
   * In single mode, deselects all others first (allows deselect).
   * In multiple mode, toggles the clicked item independently.
   *
   * @param {Event} event - The click event from a group item
   */
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

  /** Sets up arrow-key navigation between items. */
  connect() {
    this.element.addEventListener("keydown", this.#handleKeydown)
  }

  /** Tears down the keydown listener. */
  disconnect() {
    this.element.removeEventListener("keydown", this.#handleKeydown)
  }

  /**
   * Handles arrow key, Home, and End navigation between items.
   * Wraps around at boundaries.
   *
   * @param {KeyboardEvent} event
   */
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

  /**
   * Dispatches a "change" event with the currently selected value(s).
   * Single mode emits `{ value: string | null }`,
   * multiple mode emits `{ value: string[] }`.
   */
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
