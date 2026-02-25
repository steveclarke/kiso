import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["panel", "backdrop"]

  toggle() {
    const open = this.panelTarget.classList.toggle("-translate-x-full")
    this.backdropTarget.classList.toggle("hidden", open)
    document.body.classList.toggle("overflow-hidden", !open)
  }

  close() {
    this.panelTarget.classList.add("-translate-x-full")
    this.backdropTarget.classList.add("hidden")
    document.body.classList.remove("overflow-hidden")
  }
}
