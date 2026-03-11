import { Controller } from "@hotwired/stimulus"

/**
 * Automatic loading state for buttons inside Turbo forms.
 *
 * When the button's form submits via Turbo, the controller saves the button's
 * original content, injects an animated spinner SVG, and disables the button.
 * On `turbo:submit-end`, the original content and state are restored.
 *
 * Attach via `data-controller="kiso--button-loading"` on the `<button>` element.
 * The Button partial adds this automatically when `loading_auto: true`.
 *
 * @example
 *   <form action="/save" method="post" data-turbo="true">
 *     <button type="submit"
 *             data-controller="kiso--button-loading"
 *             data-slot="button"
 *             class="...">
 *       Save
 *     </button>
 *   </form>
 *
 * @fires kiso--button-loading:loading - When the button enters loading state
 * @fires kiso--button-loading:complete - When the button exits loading state
 */
export default class extends Controller {
  connect() {
    this._form = this.element.closest("form")
    if (!this._form) return

    this._handleSubmitStart = this._handleSubmitStart.bind(this)
    this._handleSubmitEnd = this._handleSubmitEnd.bind(this)

    this._form.addEventListener("turbo:submit-start", this._handleSubmitStart)
    this._form.addEventListener("turbo:submit-end", this._handleSubmitEnd)
  }

  disconnect() {
    if (!this._form) return

    this._form.removeEventListener("turbo:submit-start", this._handleSubmitStart)
    this._form.removeEventListener("turbo:submit-end", this._handleSubmitEnd)
    this._restore()
  }

  /**
   * Saves original button content and enters loading state.
   *
   * @param {CustomEvent} event - turbo:submit-start event
   * @private
   */
  _handleSubmitStart(event) {
    // Only react if this button triggered the submission
    if (event.detail?.formSubmission?.submitter !== this.element) return

    this._savedNodes = Array.from(this.element.childNodes).map((n) => n.cloneNode(true))
    this._wasDisabled = this.element.disabled

    // Create spinner SVG via DOM APIs (safe, no innerHTML)
    const spinner = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    spinner.setAttribute("viewBox", "0 0 24 24")
    spinner.setAttribute("fill", "none")
    spinner.setAttribute("stroke", "currentColor")
    spinner.setAttribute("stroke-width", "2")
    spinner.setAttribute("stroke-linecap", "round")
    spinner.setAttribute("stroke-linejoin", "round")
    spinner.setAttribute("class", "animate-spin shrink-0 pointer-events-none size-4")

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    path.setAttribute("d", "M21 12a9 9 0 1 1-6.219-8.56")
    spinner.appendChild(path)

    // Replace content: spinner + original text
    const textContent = this.element.textContent?.trim()
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild)
    }
    this.element.appendChild(spinner)
    if (textContent) {
      this.element.appendChild(document.createTextNode(` ${textContent}`))
    }

    this.element.disabled = true
    this.element.setAttribute("aria-busy", "true")

    this.dispatch("loading")
  }

  /**
   * Restores original button content and state on turbo:submit-end.
   *
   * @private
   */
  _handleSubmitEnd() {
    this._restore()
    this.dispatch("complete")
  }

  /**
   * Restores the button to its pre-loading state.
   *
   * @private
   */
  _restore() {
    if (!this._savedNodes) return

    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild)
    }
    for (const node of this._savedNodes) {
      this.element.appendChild(node)
    }

    this.element.disabled = this._wasDisabled
    this.element.removeAttribute("aria-busy")

    this._savedNodes = undefined
    this._wasDisabled = undefined
  }
}
