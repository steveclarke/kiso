import { Controller } from "@hotwired/stimulus"

// Manages pressed state for a standalone toggle button.
// Toggles data-state between "on" and "off" and updates aria-pressed.
//
// Usage:
//   <button data-controller="kiso--toggle" data-action="click->kiso--toggle#toggle"
//           data-state="off" aria-pressed="false">
//     Bold
//   </button>
export default class extends Controller {
  toggle() {
    const pressed = this.element.dataset.state === "on"
    this.element.dataset.state = pressed ? "off" : "on"
    this.element.setAttribute("aria-pressed", !pressed)
  }
}
