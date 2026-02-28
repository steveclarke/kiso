import { Controller } from "@hotwired/stimulus"

// Command dialog controller. Opens with Cmd+K (configurable), closes with Escape.
// Wraps the native <dialog> element.
//
// Values:
//   shortcut: the key to pair with Cmd/Ctrl to open the dialog (default: "k")
//
// Usage:
//   <dialog data-controller="kiso--command-dialog"
//           data-kiso--command-dialog-shortcut-value="k"
//           data-slot="command-dialog">
//     <div>
//       <div data-controller="kiso--command">...</div>
//     </div>
//   </dialog>
export default class extends Controller {
  static values = {
    shortcut: { type: String, default: "k" }
  }

  connect() {
    this._handleKeydown = this._handleKeydown.bind(this)
    this._handleCommandEscape = this._handleCommandEscape.bind(this)
    document.addEventListener("keydown", this._handleKeydown)
    this.element.addEventListener("command:escape", this._handleCommandEscape)

    // Close on click outside the dialog content (on the backdrop)
    this.element.addEventListener("click", (event) => {
      if (event.target === this.element) {
        this.close()
      }
    })
  }

  disconnect() {
    document.removeEventListener("keydown", this._handleKeydown)
    this.element.removeEventListener("command:escape", this._handleCommandEscape)
  }

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

  close() {
    this.element.close()
  }

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

  _handleCommandEscape() {
    this.close()
  }
}
