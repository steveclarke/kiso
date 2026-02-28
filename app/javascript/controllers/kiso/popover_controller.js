import { Controller } from "@hotwired/stimulus"

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
  }

  disconnect() {
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
    this._open = true
    this.contentTarget.hidden = false
    this.contentTarget.setAttribute("data-state", "open")
    this.triggerTarget.setAttribute("aria-expanded", "true")
    this.triggerTarget.setAttribute("data-state", "open")
    this._positionContent()
    this._addGlobalListeners()

    // Focus the first focusable element inside the content
    requestAnimationFrame(() => {
      const focusable = this.contentTarget.querySelector(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
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
    this._open = false
    this.contentTarget.setAttribute("data-state", "closed")
    this.triggerTarget.setAttribute("aria-expanded", "false")
    this.triggerTarget.setAttribute("data-state", "closed")

    // Hide after animation completes
    const onEnd = () => {
      this.contentTarget.hidden = true
      this.contentTarget.removeEventListener("animationend", onEnd)
    }
    this.contentTarget.addEventListener("animationend", onEnd)

    // Fallback: if no animation, hide immediately
    setTimeout(() => {
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
   * Positions the content panel below the reference element (trigger or anchor).
   * Respects `data-align` on the content element: "start", "end", or "center" (default).
   *
   * @private
   */
  _positionContent() {
    const reference = this.hasAnchorTarget ? this.anchorTarget : this.triggerTarget
    const content = this.contentTarget
    const align = content.dataset.align || "center"

    content.style.position = "absolute"
    content.style.top = `${reference.offsetTop + reference.offsetHeight + 4}px`

    switch (align) {
      case "start":
        content.style.left = `${reference.offsetLeft}px`
        content.style.right = "auto"
        break
      case "end":
        content.style.right = `${this.element.offsetWidth - reference.offsetLeft - reference.offsetWidth}px`
        content.style.left = "auto"
        break
      case "center":
      default:
        const contentWidth = content.offsetWidth
        const triggerCenter = reference.offsetLeft + reference.offsetWidth / 2
        content.style.left = `${triggerCenter - contentWidth / 2}px`
        content.style.right = "auto"
        break
    }
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
      const focusableElements = this.contentTarget.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )

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
