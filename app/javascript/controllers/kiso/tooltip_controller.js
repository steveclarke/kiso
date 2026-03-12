import { Controller } from "@hotwired/stimulus"
import { startPositioning } from "kiso-ui/utils/positioning"

/**
 * Tooltip controller — shows a floating tooltip on hover or keyboard focus.
 * Uses Floating UI for positioning and the native `[popover]` attribute for
 * top-layer rendering (no z-index issues).
 *
 * @example
 *   <div data-controller="kiso--tooltip"
 *        data-kiso--tooltip-side-value="top"
 *        data-kiso--tooltip-align-value="center"
 *        data-kiso--tooltip-delay-value="0"
 *        data-slot="tooltip">
 *     <div data-kiso--tooltip-target="trigger"
 *          data-action="mouseenter->kiso--tooltip#show mouseleave->kiso--tooltip#hide
 *                       focusin->kiso--tooltip#show focusout->kiso--tooltip#hide"
 *          data-slot="tooltip-trigger">
 *       <button type="button">Hover me</button>
 *     </div>
 *     <div data-kiso--tooltip-target="content"
 *          data-slot="tooltip-content"
 *          popover="manual"
 *          role="tooltip">
 *       Tooltip text
 *       <div data-kiso--tooltip-target="arrow" data-slot="tooltip-arrow"></div>
 *     </div>
 *   </div>
 *
 * @property {HTMLElement} triggerTarget - Element that activates the tooltip on hover/focus
 * @property {HTMLElement} contentTarget - The floating tooltip panel (popover)
 * @property {HTMLElement} arrowTarget - Arrow element positioned by Floating UI
 * @property {string} sideValue - Which side to place the tooltip: "top", "bottom", "left", or "right" (default: "top")
 * @property {string} alignValue - Alignment along the side: "start", "center", or "end" (default: "center")
 * @property {number} delayValue - Delay in milliseconds before showing the tooltip (default: 0)
 *
 * @fires kiso--tooltip:show - When the tooltip becomes visible
 * @fires kiso--tooltip:hide - When the tooltip is hidden
 */
export default class extends Controller {
  static targets = ["trigger", "content", "arrow"]
  static values = {
    side: { type: String, default: "top" },
    align: { type: String, default: "center" },
    delay: { type: Number, default: 0 },
  }

  connect() {
    this._open = false

    // Link trigger to tooltip content via aria-describedby
    this._triggerEl =
      this.triggerTarget.querySelector("button, a, [tabindex]") || this.triggerTarget
    this._tooltipId = this.contentTarget.id || `tooltip-${crypto.randomUUID().slice(0, 8)}`
    this.contentTarget.id = this._tooltipId
    this._triggerEl.setAttribute("aria-describedby", this._tooltipId)

    // Strip native title tooltip to prevent double tooltip
    if (this._triggerEl.hasAttribute("title")) {
      this._originalTitle = this._triggerEl.getAttribute("title")
      this._triggerEl.removeAttribute("title")
    }
  }

  disconnect() {
    this._cleanupPosition?.()
    this._clearTimers()

    // Restore native title attribute
    if (this._originalTitle != null) {
      this._triggerEl.setAttribute("title", this._originalTitle)
      this._originalTitle = null
    }
  }

  /**
   * Shows the tooltip after the configured delay.
   * Called on mouseenter and focusin on the trigger.
   */
  show() {
    this._clearHideTimeout()

    if (this._open) return

    const delay = this.delayValue
    if (delay > 0) {
      this._showTimeout = setTimeout(() => this._doShow(), delay)
    } else {
      this._doShow()
    }
  }

  /**
   * Hides the tooltip with a small delay to allow the mouse to cross
   * the gap between trigger and tooltip content.
   * Called on mouseleave and focusout on the trigger.
   */
  hide() {
    this._clearShowTimeout()

    if (!this._open) return

    // Small delay lets the mouse cross the offset gap to the content
    this._hideTimeout = setTimeout(() => this._doHide(), 100)
  }

  /**
   * Cancels a pending hide when the mouse enters the tooltip content.
   * Keeps the tooltip visible while the user reads it.
   */
  contentMouseEnter() {
    this._clearHideTimeout()
  }

  /**
   * Hides the tooltip when the mouse leaves the tooltip content.
   */
  contentMouseLeave() {
    this._doHide()
  }

  // --- Private ---

  /**
   * Shows the tooltip immediately: opens the popover, positions it,
   * and triggers the entry animation.
   *
   * @private
   */
  _doShow() {
    if (this._open) return
    this._open = true

    this.contentTarget.showPopover()
    this.contentTarget.setAttribute("data-state", "open")

    const placement = this._buildPlacement()
    const options = {
      placement,
      strategy: "fixed",
      offset: 8,
    }
    if (this.hasArrowTarget) {
      options.arrow = this.arrowTarget
    }

    this._cleanupPosition = startPositioning(this.triggerTarget, this.contentTarget, options)

    this.dispatch("show")
  }

  /**
   * Hides the tooltip: triggers exit animation, then hides the popover.
   *
   * @private
   */
  _doHide() {
    if (!this._open) return
    this._open = false

    this._cleanupPosition?.()
    this._cleanupPosition = null
    this._clearTimers()

    this.contentTarget.setAttribute("data-state", "closed")

    // Hide after exit animation completes
    this._animHandler = () => {
      this.contentTarget.hidePopover()
      this.contentTarget.removeEventListener("animationend", this._animHandler)
      this._animHandler = null
    }
    this.contentTarget.addEventListener("animationend", this._animHandler)

    // Fallback: hide immediately if no animation runs
    this._closeTimeout = setTimeout(() => {
      if (!this._open && this.contentTarget.matches(":popover-open")) {
        this.contentTarget.hidePopover()
      }
    }, 150)

    this.dispatch("hide")
  }

  /**
   * Builds a Floating UI placement string from side and align values.
   *
   * @returns {string} e.g. "top", "top-start", "bottom-end"
   * @private
   */
  _buildPlacement() {
    const side = this.sideValue
    const align = this.alignValue
    if (align === "center") return side
    return `${side}-${align}`
  }

  /** @private */
  _clearShowTimeout() {
    if (this._showTimeout) {
      clearTimeout(this._showTimeout)
      this._showTimeout = null
    }
  }

  /** @private */
  _clearHideTimeout() {
    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout)
      this._hideTimeout = null
    }
  }

  /** @private */
  _clearTimers() {
    this._clearShowTimeout()
    this._clearHideTimeout()
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout)
      this._closeTimeout = null
    }
    if (this._animHandler) {
      this.contentTarget.removeEventListener("animationend", this._animHandler)
      this._animHandler = null
    }
  }
}
