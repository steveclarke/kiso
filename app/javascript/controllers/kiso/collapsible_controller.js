import { Controller } from "@hotwired/stimulus"

/**
 * Collapsible controller. Manages expand/collapse state for a content
 * panel. Sets `data-state` on the root element, trigger elements, and
 * content element for CSS targeting.
 *
 * By default, content shows/hides instantly (matching shadcn/Radix).
 * Host apps can add CSS animations targeting `[data-state="open"]` /
 * `[data-state="closed"]` on the content element. The controller
 * measures content height and sets `--kiso-collapsible-height` for
 * use in custom keyframe animations. When animations are present,
 * the `hidden` attribute is applied after the close animation ends.
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

    // Apply initial state without events
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
   * Applies the open/closed state to the DOM. Sets `data-state` on the
   * root element, all trigger targets, and the content target. Measures
   * content height for optional CSS animations.
   *
   * @param {boolean} isOpen - Whether the collapsible should be open
   * @param {boolean} notify - Whether to dispatch events
   * @private
   */
  _applyState(isOpen, notify) {
    const state = isOpen ? "open" : "closed"
    this.element.dataset.state = state

    for (const trigger of this.triggerTargets) {
      trigger.dataset.state = state
      trigger.setAttribute("aria-expanded", String(isOpen))
    }

    if (!this.hasContentTarget) return

    this.contentTarget.dataset.state = state

    if (isOpen) {
      this.contentTarget.hidden = false
      this._measureAndSetHeight()

      if (notify) {
        this.dispatch("open")
      }
    } else {
      this._measureAndSetHeight()

      // If the content has a CSS animation, let animationend handle hiding.
      // Otherwise, hide immediately (the default — matches shadcn/Radix).
      if (!this._hasAnimation()) {
        this.contentTarget.hidden = true
      }

      if (notify) {
        this.dispatch("close")
      }
    }
  }

  /**
   * Measures the natural height of the content and sets it as a CSS
   * custom property for optional animation keyframes.
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
   * Checks if the content element has a CSS animation applied.
   *
   * @returns {boolean}
   * @private
   */
  _hasAnimation() {
    if (!this.hasContentTarget) return false
    const animation = getComputedStyle(this.contentTarget).animationName
    return animation && animation !== "none"
  }

  /**
   * Hides the content element after a close animation finishes.
   * Only relevant when host apps add custom CSS animations.
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
