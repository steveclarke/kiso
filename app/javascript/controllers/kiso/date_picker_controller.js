import { Controller } from "@hotwired/stimulus"
import { startPositioning } from "kiso-ui/utils/positioning"
import "cally"

/**
 * Date picker controller — wires a trigger button, native popover, and Cally
 * calendar web component together. Syncs the selected date to a hidden input
 * for form submission and formats the display using Intl.DateTimeFormat.
 *
 * Uses the native Popover API (`[popover]` + `popovertarget`) for open/close
 * and Floating UI for positioning below the trigger.
 *
 * Attaches a change listener directly on the `<calendar-date>` or
 * `<calendar-range>` element inside the popover, since Cally dispatches
 * its `change` event with `bubbles: false`.
 *
 * @example
 *   <div data-controller="kiso--date-picker" data-slot="date-picker"
 *        data-kiso--date-picker-format-value="long">
 *     <input type="hidden" name="date" data-kiso--date-picker-target="input">
 *     <button type="button" popovertarget="dp-abc123"
 *             data-kiso--date-picker-target="trigger">
 *       <span data-kiso--date-picker-target="display">Pick a date</span>
 *     </button>
 *     <div id="dp-abc123" popover data-kiso--date-picker-target="popover">
 *       <calendar-date>
 *         <calendar-month></calendar-month>
 *       </calendar-date>
 *     </div>
 *   </div>
 *
 * @property {HTMLInputElement} inputTarget - Hidden input for form submission (ISO 8601)
 * @property {HTMLElement} triggerTarget - Button that opens the popover
 * @property {HTMLElement} displayTarget - Span showing the formatted date
 * @property {HTMLElement} popoverTarget - The popover container
 *
 * @fires change - Dispatched on the controller element when a date is selected
 */
export default class extends Controller {
  static targets = ["input", "trigger", "display", "popover"]
  static values = {
    format: { type: String, default: "long" },
    locale: String,
  }

  connect() {
    this._handleToggle = this._handleToggle.bind(this)
    this._handleChange = this._handleChange.bind(this)

    this.popoverTarget.addEventListener("toggle", this._handleToggle)
    this._attachCalendarListener()
  }

  disconnect() {
    this._cleanupPosition?.()
    this.popoverTarget.removeEventListener("toggle", this._handleToggle)
    this._callyEl?.removeEventListener("change", this._handleChange)
  }

  /**
   * Finds the Cally element inside the popover and attaches a change listener.
   * Waits for the custom element to be defined if it hasn't upgraded yet.
   *
   * @private
   */
  _attachCalendarListener() {
    const callyEl = this.popoverTarget.querySelector("calendar-date, calendar-range")
    if (!callyEl) return

    this._callyEl = callyEl
    const tagName = callyEl.tagName.toLowerCase()

    customElements.whenDefined(tagName).then(() => {
      callyEl.addEventListener("change", this._handleChange)
    })
  }

  /**
   * Handles date selection from the Cally calendar's change event.
   * Updates the display text, hidden input value, and closes the popover.
   *
   * @param {Event} event - The change event from calendar-date
   * @private
   */
  _handleChange(event) {
    const value = event.target.value
    if (!value) return

    this._updateDisplay(value)
    this.inputTarget.value = value
    this.popoverTarget.hidePopover()

    this.dispatch("change", { detail: { value } })
  }

  /**
   * Handles the popover toggle event to start/stop Floating UI positioning.
   *
   * @param {ToggleEvent} event
   * @private
   */
  _handleToggle(event) {
    if (event.newState === "open") {
      this._startPositioning()
    } else {
      this._cleanupPosition?.()
      this._cleanupPosition = null
    }
  }

  /**
   * Positions the popover below the trigger using Floating UI.
   *
   * @private
   */
  _startPositioning() {
    // Native [popover] renders in the top-layer with default inset/margin.
    // Reset these so Floating UI can position it with fixed strategy.
    this.popoverTarget.style.inset = "unset"

    this._cleanupPosition = startPositioning(this.triggerTarget, this.popoverTarget, {
      placement: "bottom-start",
      strategy: "fixed",
    })
  }

  /**
   * Formats and displays the selected date using Intl.DateTimeFormat.
   *
   * @param {string} isoDate - ISO 8601 date string (YYYY-MM-DD)
   * @private
   */
  _updateDisplay(isoDate) {
    const date = new Date(isoDate + "T00:00:00")
    const options = this._dateFormatOptions()
    const locale = this.hasLocaleValue ? this.localeValue : undefined

    this.displayTarget.textContent = new Intl.DateTimeFormat(locale, options).format(date)
    this.displayTarget.classList.remove("text-muted-foreground")
  }

  /**
   * Returns Intl.DateTimeFormat options based on the format value.
   *
   * @returns {Intl.DateTimeFormatOptions}
   * @private
   */
  _dateFormatOptions() {
    switch (this.formatValue) {
      case "short":
        return { month: "numeric", day: "numeric", year: "numeric" }
      case "medium":
        return { month: "short", day: "numeric", year: "numeric" }
      case "long":
        return { month: "long", day: "numeric", year: "numeric" }
      default:
        return { month: "long", day: "numeric", year: "numeric" }
    }
  }
}
