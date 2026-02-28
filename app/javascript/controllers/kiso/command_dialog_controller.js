import { Controller } from "@hotwired/stimulus"

/**
 * Command dialog controller. Opens with a configurable keyboard shortcut
 * (default: Cmd/Ctrl+K) and closes with Escape. Wraps the native `<dialog>` element.
 *
 * @example
 *   <dialog data-controller="kiso--command-dialog"
 *           data-kiso--command-dialog-shortcut-value="k"
 *           data-slot="command-dialog">
 *     <div>
 *       <div data-controller="kiso--command">...</div>
 *     </div>
 *   </dialog>
 *
 * @property {string} shortcutValue - The key paired with Cmd/Ctrl to open the dialog (default: "k")
 */
export default class extends Controller {
  static values = {
    shortcut: { type: String, default: "k" },
  }

  connect() {
    this._handleKeydown = this._handleKeydown.bind(this)
    this._handleCommandEscape = this._handleCommandEscape.bind(this)
    this._handleBackdropClick = this._handleBackdropClick.bind(this)
    document.addEventListener("keydown", this._handleKeydown)
    this.element.addEventListener("command:escape", this._handleCommandEscape)
    this.element.addEventListener("click", this._handleBackdropClick)
  }

  disconnect() {
    document.removeEventListener("keydown", this._handleKeydown)
    this.element.removeEventListener("command:escape", this._handleCommandEscape)
    this.element.removeEventListener("click", this._handleBackdropClick)
  }

  /**
   * Opens the dialog as a modal, focuses the command input,
   * clears its value, and resets the filter.
   */
  open() {
    this.element.showModal()
    // Focus the input inside the command palette
    const input = this.element.querySelector("[data-slot='command-input']")
    if (input) {
      input.focus()
      input.value = ""
      // Trigger filter to reset visibility
      input.dispatchEvent(new Event("input", { bubbles: true }))
    }
  }

  /** Closes the dialog. */
  close() {
    this.element.close()
  }

  /**
   * Handles the keyboard shortcut (Cmd/Ctrl + shortcutValue) to toggle
   * the dialog, and Escape to close it.
   *
   * @param {KeyboardEvent} event
   * @private
   */
  _handleKeydown(event) {
    if (event.key === this.shortcutValue && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      if (this.element.open) {
        this.close()
      } else {
        this.open()
      }
    }

    // Close on Escape when dialog is open
    if (event.key === "Escape" && this.element.open) {
      event.preventDefault()
      this.close()
    }
  }

  /**
   * Handles the custom "command:escape" event bubbled up from the
   * command controller's input.
   *
   * @private
   */
  _handleCommandEscape() {
    this.close()
  }

  /**
   * Closes the dialog when clicking the backdrop (the `<dialog>` element itself).
   *
   * @param {MouseEvent} event
   * @private
   */
  _handleBackdropClick(event) {
    if (event.target === this.element) {
      this.close()
    }
  }
}
