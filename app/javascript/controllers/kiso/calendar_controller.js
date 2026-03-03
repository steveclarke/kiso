import { Controller } from "@hotwired/stimulus"
import "cally"

/**
 * Calendar controller — initializes Cally web component theming by setting
 * CSS custom properties that Cally's Shadow DOM reads internally.
 *
 * Cally's `<calendar-month>` declares `--color-accent: black` in its
 * `:host` rule. External CSS cannot override `:host`-declared custom
 * properties due to Shadow DOM encapsulation. This controller bridges
 * Kiso's semantic tokens into Cally by reading the computed values
 * from the wrapper and applying them as inline styles on each
 * `<calendar-month>` element.
 *
 * @example
 *   <div data-controller="kiso--calendar" data-slot="calendar">
 *     <calendar-date>
 *       <calendar-month></calendar-month>
 *     </calendar-date>
 *   </div>
 *
 * @property {HTMLElement[]} monthTargets - The calendar-month elements
 */
export default class extends Controller {
  connect() {
    this._applyTheme()
    this._observer = new MutationObserver(() => this._applyTheme())
    this._observer.observe(this.element, { childList: true, subtree: true })
  }

  disconnect() {
    this._observer?.disconnect()
  }

  /**
   * Reads Kiso's calendar tokens from the wrapper element and applies
   * them as inline styles on each calendar-month element.
   *
   * @private
   */
  _applyTheme() {
    const style = getComputedStyle(this.element)
    const hoverBg = style.getPropertyValue("--kiso-cal-hover-bg").trim()
    const hoverFg = style.getPropertyValue("--kiso-cal-hover-fg").trim()
    const callyColor = style.getPropertyValue("--cally-color").trim()
    const callyColorFg = style.getPropertyValue("--cally-color-fg").trim()

    this.element.querySelectorAll("calendar-month").forEach((month) => {
      // Override Cally's :host --color-accent (default: black)
      if (hoverBg) month.style.setProperty("--color-accent", hoverBg)
      if (hoverFg) month.style.setProperty("--color-text-on-accent", hoverFg)
    })
  }
}
