import { Controller } from "@hotwired/stimulus"

/**
 * Alert controller. Handles dismissing an alert by removing it from the DOM.
 *
 * Attach to the alert root element with `data-controller="kiso--alert"`.
 * The close button dispatches the `close` action on click.
 *
 * @example
 *   <div data-controller="kiso--alert" data-slot="alert" role="alert">
 *     <div data-slot="alert-wrapper">
 *       <div data-slot="alert-title">Heads up!</div>
 *       <div data-slot="alert-description">You can dismiss this alert.</div>
 *     </div>
 *     <button data-action="click->kiso--alert#close" data-slot="alert-close">
 *       <svg>...</svg>
 *     </button>
 *   </div>
 *
 * @fires kiso--alert:close - Dispatched before the alert is removed from the DOM
 */
export default class extends Controller {
  /**
   * Dismisses the alert. Dispatches a `close` event and removes the element.
   * The event can be cancelled with `event.preventDefault()` to prevent removal.
   */
  close() {
    const event = this.dispatch("close", { cancelable: true })
    if (!event.defaultPrevented) {
      this.element.remove()
    }
  }
}
