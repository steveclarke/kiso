import { Controller } from "@hotwired/stimulus"

/**
 * Dialog controller. Wraps the native `<dialog>` element with `showModal()`
 * for proper focus trapping, backdrop, and Escape-to-close behavior.
 *
 * The `<dialog>` element itself is the controller root. It acts as the
 * backdrop overlay (fixed inset-0 with bg-black/50). A content wrapper
 * inside provides the centered panel.
 *
 * @example
 *   <dialog data-controller="kiso--dialog"
 *           data-kiso--dialog-open-value="true"
 *           data-slot="dialog">
 *     <div data-slot="dialog-content">
 *       <button data-action="kiso--dialog#close" data-slot="dialog-close">×</button>
 *       <h2>Title</h2>
 *       <p>Description</p>
 *     </div>
 *   </dialog>
 *
 *   <!-- Trigger from outside -->
 *   <button data-action="kiso--dialog#open">Open</button>
 *
 * @property {boolean} openValue - Whether the dialog should open on connect (default: false)
 * @property {boolean} dismissableValue - Whether backdrop click and Escape close the dialog (default: true). Set to false for alert dialogs.
 * @fires kiso--dialog:open - Dispatched when the dialog opens
 * @fires kiso--dialog:close - Dispatched when the dialog closes
 */
export default class extends Controller {
  static values = {
    open: { type: Boolean, default: false },
    dismissable: { type: Boolean, default: true },
  }

  connect() {
    this._handleBackdropClick = this._handleBackdropClick.bind(this)
    this._handleCancel = this._handleCancel.bind(this)
    this.element.addEventListener("click", this._handleBackdropClick)
    this.element.addEventListener("cancel", this._handleCancel)

    if (this.openValue) {
      this.open()
    }
  }

  disconnect() {
    this._clearCloseTimers()
    this.element.removeEventListener("click", this._handleBackdropClick)
    this.element.removeEventListener("cancel", this._handleCancel)
  }

  /**
   * Opens the dialog as a modal via `showModal()`.
   */
  open() {
    if (this.element.open) return
    this.element.showModal()
    this.dispatch("open")
  }

  /**
   * Closes the dialog with an exit animation. Sets `data-state="closing"`
   * to trigger the CSS animation, then calls `dialog.close()` after
   * the animation completes.
   */
  close() {
    if (!this.element.open || this._isClosing) return
    this._isClosing = true

    this.element.dataset.state = "closing"

    this._onCloseEnd = () => {
      this._clearCloseTimers()
      delete this.element.dataset.state
      this._isClosing = false
      this.element.close()
      this.dispatch("close")
    }
    this.element.addEventListener("animationend", this._onCloseEnd)

    // Fallback if no animation runs (e.g. prefers-reduced-motion)
    this._closingTimeout = setTimeout(this._onCloseEnd, 250)
  }

  /**
   * Responds to Stimulus Value changes for external open/close control.
   */
  openValueChanged() {
    // Skip during connect — handled in connect() directly
    if (!this.element.isConnected) return

    if (this.openValue) {
      this.open()
    } else {
      this.close()
    }
  }

  /**
   * Removes pending close animation listeners and timeouts.
   *
   * @private
   */
  _clearCloseTimers() {
    clearTimeout(this._closingTimeout)
    if (this._onCloseEnd) {
      this.element.removeEventListener("animationend", this._onCloseEnd)
      this._onCloseEnd = null
    }
  }

  /**
   * Closes the dialog when clicking the backdrop (the `<dialog>` element
   * itself, outside the content panel).
   *
   * @param {MouseEvent} event
   * @private
   */
  _handleBackdropClick(event) {
    if (!this.dismissableValue) return
    if (event.target === this.element) {
      this.close()
    }
  }

  /**
   * Intercepts the native `cancel` event (fired on Escape) to route
   * through our `close()` method for exit animation.
   *
   * @param {Event} event
   * @private
   */
  _handleCancel(event) {
    event.preventDefault()
    if (this.dismissableValue) {
      this.close()
    }
  }
}
