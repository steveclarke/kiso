import { Controller } from "@hotwired/stimulus"
import { FOCUSABLE_SELECTOR } from "kiso-ui/utils/focusable"
import { positionBelow } from "kiso-ui/utils/positioning"

/**
 * Popover controller — toggles a floating panel anchored to a trigger element.
 * Supports configurable alignment (start, center, end), focus trapping,
 * and close-on-outside-click / Escape.
 *
 * @example
 *   <div data-controller="kiso--popover" data-slot="popover">
 *     <button data-kiso--popover-target="trigger"
 *             data-action="click->kiso--popover#toggle keydown->kiso--popover#triggerKeydown">
 *       Open
 *     </button>
 *     <div data-kiso--popover-target="content" data-align="center" role="dialog" hidden>
 *       Content here
 *     </div>
 *   </div>
 *
 * @property {HTMLElement} triggerTarget - Button that opens/closes the popover
 * @property {HTMLElement} contentTarget - The floating panel
 * @property {HTMLElement} [anchorTarget] - Optional alternate positioning reference
 */
export default class extends Controller {
  static targets = ["trigger", "content", "anchor"]

  connect() {
    this._open = false
    this._handleOutsideClick = this._handleOutsideClick.bind(this)
    this._handleKeydown = this._handleKeydown.bind(this)

    // Set ARIA attrs on the interactive element inside the trigger wrapper
    this._triggerButton =
      this.triggerTarget.querySelector("button, [tabindex]") || this.triggerTarget
    this._triggerButton.setAttribute("aria-haspopup", "dialog")
    this._triggerButton.setAttribute("aria-expanded", "false")
  }

  disconnect() {
    this._clearCloseTimers()
    this._removeGlobalListeners()
  }

  /**
   * Toggles the popover open or closed.
   *
   * @param {Event} event
   */
  toggle(event) {
    event.preventDefault()
    if (this._open) {
      this.close()
    } else {
      this.open()
    }
  }

  /**
   * Opens the popover, positions it relative to the trigger (or anchor),
   * and focuses the first focusable element inside.
   */
  open() {
    if (this._open) return

    this._clearCloseTimers()
    this._open = true
    this.contentTarget.hidden = false
    this.contentTarget.setAttribute("data-state", "open")
    this._triggerButton.setAttribute("aria-expanded", "true")
    this.triggerTarget.setAttribute("data-state", "open")
    this._positionContent()
    this._addGlobalListeners()

    // Focus the first focusable element inside the content
    this._focusRaf = requestAnimationFrame(() => {
      const focusable = this.contentTarget.querySelector(FOCUSABLE_SELECTOR)
      if (focusable) {
        focusable.focus()
      }
    })
  }

  /**
   * Closes the popover with a closing animation, then hides it.
   * Returns focus to the trigger button.
   */
  close() {
    if (!this._open) return

    this._clearCloseTimers()
    this._open = false
    this.contentTarget.setAttribute("data-state", "closed")
    this._triggerButton.setAttribute("aria-expanded", "false")
    this.triggerTarget.setAttribute("data-state", "closed")

    // Hide after animation completes
    this._animationEndHandler = () => {
      this.contentTarget.hidden = true
      this.contentTarget.removeEventListener("animationend", this._animationEndHandler)
    }
    this.contentTarget.addEventListener("animationend", this._animationEndHandler)

    // Fallback: if no animation, hide immediately
    this._closeTimeout = setTimeout(() => {
      if (this.contentTarget.getAttribute("data-state") === "closed") {
        this.contentTarget.hidden = true
      }
    }, 200)

    this._removeGlobalListeners()
    // Focus the button inside the trigger wrapper, or the trigger itself
    const btn = this.triggerTarget.querySelector("button, [tabindex]")
    ;(btn || this.triggerTarget).focus()
  }

  /**
   * Opens the popover on ArrowDown, Space, or Enter when trigger is focused.
   *
   * @param {KeyboardEvent} event
   */
  triggerKeydown(event) {
    switch (event.key) {
      case "ArrowDown":
      case " ":
      case "Enter":
        event.preventDefault()
        if (!this._open) {
          this.open()
        }
        break
    }
  }

  // --- Private ---

  /**
   * Cancels any pending close timers and animation handlers.
   *
   * @private
   */
  _clearCloseTimers() {
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout)
      this._closeTimeout = null
    }
    if (this._focusRaf) {
      cancelAnimationFrame(this._focusRaf)
      this._focusRaf = null
    }
    if (this._animationEndHandler) {
      this.contentTarget.removeEventListener("animationend", this._animationEndHandler)
      this._animationEndHandler = null
    }
  }

  /**
   * Positions the content panel below the reference element (trigger or anchor).
   * Respects `data-align` on the content element: "start", "end", or "center" (default).
   *
   * @private
   */
  _positionContent() {
    const reference = this.hasAnchorTarget ? this.anchorTarget : this.triggerTarget
    const align = this.contentTarget.dataset.align || "center"

    positionBelow(reference, this.contentTarget, {
      align,
      container: this.element,
    })
  }

  /**
   * Closes the popover when clicking outside the component.
   *
   * @param {MouseEvent} event
   * @private
   */
  _handleOutsideClick(event) {
    if (!this.element.contains(event.target)) {
      this.close()
    }
  }

  /**
   * Handles Escape to close and Tab to trap focus within the popover content.
   *
   * @param {KeyboardEvent} event
   * @private
   */
  _handleKeydown(event) {
    if (!this._open) return

    if (event.key === "Escape") {
      event.preventDefault()
      this.close()
    }

    // Trap focus inside content
    if (event.key === "Tab") {
      const focusableElements = this.contentTarget.querySelectorAll(FOCUSABLE_SELECTOR)

      if (focusableElements.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
  }

  /** @private */
  _addGlobalListeners() {
    document.addEventListener("click", this._handleOutsideClick, true)
    document.addEventListener("keydown", this._handleKeydown)
  }

  /** @private */
  _removeGlobalListeners() {
    document.removeEventListener("click", this._handleOutsideClick, true)
    document.removeEventListener("keydown", this._handleKeydown)
  }
}
