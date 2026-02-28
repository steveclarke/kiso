import { Controller } from "@hotwired/stimulus"

/**
 * Manages pressed state for a standalone toggle button.
 * Toggles `data-state` between "on" and "off" and updates `aria-pressed`.
 *
 * @example
 *   <button data-controller="kiso--toggle"
 *           data-action="click->kiso--toggle#toggle"
 *           data-state="off" aria-pressed="false">
 *     Bold
 *   </button>
 */
export default class extends Controller {
  /**
   * Toggles the pressed state of the element.
   * Flips `data-state` between "on"/"off" and syncs `aria-pressed`.
   */
  toggle() {
    const pressed = this.element.dataset.state === "on"
    this.element.dataset.state = pressed ? "off" : "on"
    this.element.setAttribute("aria-pressed", !pressed)
  }
}
