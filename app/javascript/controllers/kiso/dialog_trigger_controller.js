import { Controller } from "@hotwired/stimulus"

/**
 * Opens or closes a dialog from anywhere on the page by ID.
 *
 * Use when the trigger button lives outside the dialog's DOM scope
 * (e.g., a toolbar button opening a confirmation dialog rendered
 * elsewhere on the page).
 *
 * Works with both `kui(:dialog)` and `kui(:alert_dialog)` since
 * both use the `kiso--dialog` Stimulus controller internally.
 *
 * @example
 *   <!-- Dialog rendered anywhere -->
 *   <dialog id="invite-dialog" data-controller="kiso--dialog" ...>
 *     ...
 *   </dialog>
 *
 *   <!-- Trigger from a toolbar, sidebar, or any other scope -->
 *   <button data-controller="kiso--dialog-trigger"
 *           data-kiso--dialog-trigger-dialog-id-value="invite-dialog"
 *           data-action="kiso--dialog-trigger#open">
 *     Invite
 *   </button>
 *
 * @property {string} dialogIdValue - The DOM id of the target dialog element
 *
 * @fires kiso--dialog:open - Forwarded from the target dialog controller
 * @fires kiso--dialog:close - Forwarded from the target dialog controller
 */
export default class extends Controller {
  static values = {
    dialogId: String,
  }

  /**
   * Opens the target dialog.
   */
  open() {
    this._withDialogController((controller) => controller.open())
  }

  /**
   * Closes the target dialog.
   */
  close() {
    this._withDialogController((controller) => controller.close())
  }

  /**
   * Toggles the target dialog open or closed.
   */
  toggle() {
    this._withDialogController((controller) => {
      if (controller.element.open) {
        controller.close()
      } else {
        controller.open()
      }
    })
  }

  /**
   * Finds the dialog element and its Stimulus controller, then
   * calls the provided callback with the controller instance.
   *
   * @param {function} callback - Receives the dialog controller
   * @private
   */
  _withDialogController(callback) {
    const dialog = document.getElementById(this.dialogIdValue)
    if (!dialog) return

    const controller = this.application.getControllerForElementAndIdentifier(dialog, "kiso--dialog")

    if (controller) {
      callback(controller)
    }
  }
}
