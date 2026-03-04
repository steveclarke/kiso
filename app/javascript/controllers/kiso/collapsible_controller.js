import { Controller } from "@hotwired/stimulus"

/**
 * Collapsible controller. Manages expand/collapse state for a content
 * panel with CSS animations. Sets `data-state` on the root element,
 * trigger elements, and content element for CSS targeting and animation
 * triggers.
 *
 * The content panel uses CSS animations (`kiso-collapsible-down` /
 * `kiso-collapsible-up`) defined in `collapsible.css`. The controller
 * measures the content height and sets `--kiso-collapsible-height`
 * so the CSS animation can transition between 0 and the natural height.
 * When closed, the content is hidden via `hidden` attribute after the
 * animation completes.
 *
 * @example
 *   <div data-controller="kiso--collapsible"
 *        data-kiso--collapsible-open-value="false"
 *        data-state="closed"
 *        data-slot="collapsible">
 *     <button type="button"
 *             data-action="kiso--collapsible#toggle"
 *             data-kiso--collapsible-target="trigger"
 *             data-slot="collapsible-trigger">
 *       Toggle
 *     </button>
 *     <div data-kiso--collapsible-target="content"
 *          data-slot="collapsible-content">
 *       Content here
 *     </div>
 *   </div>
 *
 * @property {boolean} openValue - Whether the collapsible is open (default: false)
 * @fires kiso--collapsible:open - Dispatched when the collapsible opens
 * @fires kiso--collapsible:close - Dispatched when the collapsible closes
 */
export default class extends Controller {
  static values = {
    open: { type: Boolean, default: false },
  }

  static targets = ["content", "trigger"]

  connect() {
    this._handleAnimationEnd = this._handleAnimationEnd.bind(this)

    if (this.hasContentTarget) {
      this.contentTarget.addEventListener("animationend", this._handleAnimationEnd)
    }

    // Apply initial state without animation
    this._applyState(this.openValue, false)
  }

  disconnect() {
    if (this.hasContentTarget) {
      this.contentTarget.removeEventListener("animationend", this._handleAnimationEnd)
    }
  }

  /**
   * Toggles the collapsible open/closed.
   */
  toggle() {
    this.openValue = !this.openValue
  }

  /**
   * Opens the collapsible.
   */
  open() {
    this.openValue = true
  }

  /**
   * Closes the collapsible.
   */
  close() {
    this.openValue = false
  }

  /**
   * Responds to Stimulus Value changes.
   */
  openValueChanged() {
    if (!this.element.isConnected) return
    this._applyState(this.openValue, true)
  }

  /**
   * Measures the natural height of the content and sets it as a CSS
   * custom property so the animation can transition to/from it.
   *
   * @private
   */
  _measureAndSetHeight() {
    if (!this.hasContentTarget) return

    const content = this.contentTarget
    const wasHidden = content.hidden
    content.hidden = false
    content.style.height = "auto"

    const height = content.scrollHeight
    content.style.setProperty("--kiso-collapsible-height", `${height}px`)

    content.style.height = ""
    if (wasHidden && !this.openValue) {
      content.hidden = true
    }
  }

  /**
   * Applies the open/closed state to the DOM. Sets `data-state` on the
   * root element, all trigger targets, and the content target.
   *
   * @param {boolean} isOpen - Whether the collapsible should be open
   * @param {boolean} animate - Whether to animate the transition
   * @private
   */
  _applyState(isOpen, animate) {
    const state = isOpen ? "open" : "closed"
    this.element.dataset.state = state

    // Set data-state on triggers (matches Radix behavior for CSS targeting)
    for (const trigger of this.triggerTargets) {
      trigger.dataset.state = state
      trigger.setAttribute("aria-expanded", String(isOpen))
    }

    if (!this.hasContentTarget) return

    this.contentTarget.dataset.state = state

    if (isOpen) {
      this._measureAndSetHeight()
      this.contentTarget.hidden = false

      if (animate) {
        this.dispatch("open")
      }
    } else {
      if (animate) {
        this._measureAndSetHeight()
        this.dispatch("close")

        // With reduced motion, animations are disabled so animationend
        // never fires. Hide content immediately instead.
        if (this._prefersReducedMotion()) {
          this.contentTarget.hidden = true
        }
      } else {
        this.contentTarget.hidden = true
      }
    }
  }

  /**
   * Checks if the user prefers reduced motion.
   *
   * @returns {boolean}
   * @private
   */
  _prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }

  /**
   * Hides the content element after the close animation finishes.
   *
   * @param {AnimationEvent} event
   * @private
   */
  _handleAnimationEnd(event) {
    if (event.target !== this.contentTarget) return

    if (this.contentTarget.dataset.state === "closed") {
      this.contentTarget.hidden = true
    }
  }
}
