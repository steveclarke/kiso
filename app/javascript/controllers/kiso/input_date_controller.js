import { Controller } from "@hotwired/stimulus"

/**
 * Segmented date input controller — renders individual day, month, and year
 * segments that respond to keyboard input for precise date entry.
 *
 * Each segment is a focusable `<span>` element that supports:
 * - **Arrow keys** — increment/decrement the segment value
 * - **Number typing** — type-ahead with auto-advance (e.g., typing "03" sets month)
 * - **Tab / Shift+Tab** — navigate between segments
 * - **Backspace** — clear the segment back to placeholder
 *
 * Syncs the combined value to a hidden `<input>` for form submission in
 * ISO 8601 format (YYYY-MM-DD).
 *
 * @example
 *   <div data-controller="kiso--input-date" data-slot="input-date">
 *     <input type="hidden" name="date" data-kiso--input-date-target="input">
 *     <span data-kiso--input-date-target="segment" data-segment="month"
 *           tabindex="0" role="spinbutton" aria-label="Month">MM</span>
 *     <span data-slot="input-date-separator">/</span>
 *     <span data-kiso--input-date-target="segment" data-segment="day"
 *           tabindex="0" role="spinbutton" aria-label="Day">DD</span>
 *     <span data-slot="input-date-separator">/</span>
 *     <span data-kiso--input-date-target="segment" data-segment="year"
 *           tabindex="0" role="spinbutton" aria-label="Year">YYYY</span>
 *   </div>
 *
 * @property {HTMLInputElement} inputTarget - Hidden input for form submission
 * @property {HTMLElement[]} segmentTargets - The editable segment spans
 *
 * @fires change - Dispatched when a complete valid date is entered
 */
export default class extends Controller {
  static targets = ["input", "segment"]
  static values = {
    value: String,
    min: String,
    max: String,
  }

  /** @type {{ month: number|null, day: number|null, year: number|null }} */
  _segments = { month: null, day: null, year: null }

  /** @type {string} */
  _typeBuffer = ""

  /** @type {number|null} */
  _typeTimeout = null

  connect() {
    if (this.hasValueValue && this.valueValue) {
      this._parseValue(this.valueValue)
    }
    this._render()
  }

  /**
   * Handles keydown events on segment elements.
   * Dispatched via `data-action="keydown->kiso--input-date#keydown"`.
   *
   * @param {KeyboardEvent} event
   */
  keydown(event) {
    const segment = event.currentTarget
    const type = segment.dataset.segment

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault()
        this._increment(type, 1)
        break
      case "ArrowDown":
        event.preventDefault()
        this._increment(type, -1)
        break
      case "ArrowRight":
        event.preventDefault()
        this._focusNext(segment)
        break
      case "ArrowLeft":
        event.preventDefault()
        this._focusPrev(segment)
        break
      case "Backspace":
      case "Delete":
        event.preventDefault()
        this._clearSegment(type)
        break
      default:
        if (event.key >= "0" && event.key <= "9") {
          event.preventDefault()
          this._typeDigit(type, event.key)
        }
    }
  }

  /**
   * Parses an ISO date string into segment values.
   *
   * @param {string} iso - ISO 8601 date string (YYYY-MM-DD)
   * @private
   */
  _parseValue(iso) {
    const [year, month, day] = iso.split("-").map(Number)
    if (year && month && day) {
      this._segments = { year, month, day }
    }
  }

  /**
   * Increments or decrements a segment value, wrapping at boundaries.
   *
   * @param {string} type - "month", "day", or "year"
   * @param {number} delta - 1 or -1
   * @private
   */
  _increment(type, delta) {
    const { min, max } = this._segmentRange(type)
    let val = this._segments[type]

    if (val === null) {
      val = delta > 0 ? min : max
    } else {
      val += delta
      if (val > max) val = min
      if (val < min) val = max
    }

    this._segments[type] = val
    this._render()
    this._syncInput()
  }

  /**
   * Handles digit typing with type-ahead and auto-advance.
   *
   * @param {string} type - "month", "day", or "year"
   * @param {string} digit - Single digit character "0"-"9"
   * @private
   */
  _typeDigit(type, digit) {
    clearTimeout(this._typeTimeout)
    this._typeBuffer += digit

    const { min, max, digits } = this._segmentRange(type)
    const num = parseInt(this._typeBuffer, 10)

    if (this._typeBuffer.length >= digits) {
      // Full number entered — clamp, set, and advance
      this._segments[type] = Math.max(min, Math.min(max, num))
      this._typeBuffer = ""
      this._render()
      this._syncInput()
      this._focusNextFromType(type)
    } else if (num > max / 10) {
      // Single digit that can't form a valid prefix — set and advance
      this._segments[type] = Math.max(min, Math.min(max, num))
      this._typeBuffer = ""
      this._render()
      this._syncInput()
      this._focusNextFromType(type)
    } else {
      // Partial entry — wait for more digits
      this._segments[type] = num || null
      this._render()
      this._typeTimeout = setTimeout(() => {
        if (this._typeBuffer) {
          this._segments[type] = Math.max(min, Math.min(max, parseInt(this._typeBuffer, 10)))
          this._typeBuffer = ""
          this._render()
          this._syncInput()
        }
      }, 800)
    }
  }

  /**
   * Clears a segment back to its placeholder.
   *
   * @param {string} type
   * @private
   */
  _clearSegment(type) {
    this._segments[type] = null
    this._typeBuffer = ""
    this._render()
    this._syncInput()
  }

  /**
   * Returns the valid range and digit count for a segment type.
   *
   * @param {string} type
   * @returns {{ min: number, max: number, digits: number }}
   * @private
   */
  _segmentRange(type) {
    switch (type) {
      case "month":
        return { min: 1, max: 12, digits: 2 }
      case "day":
        return { min: 1, max: this._daysInMonth(), digits: 2 }
      case "year":
        return { min: 1900, max: 2099, digits: 4 }
      default:
        return { min: 0, max: 99, digits: 2 }
    }
  }

  /**
   * Returns the number of days in the currently selected month/year.
   *
   * @returns {number}
   * @private
   */
  _daysInMonth() {
    const { month, year } = this._segments
    if (!month) return 31
    return new Date(year || 2026, month, 0).getDate()
  }

  /**
   * Renders all segment displays based on current values.
   *
   * @private
   */
  _render() {
    for (const el of this.segmentTargets) {
      const type = el.dataset.segment
      const val = this._segments[type]
      const { digits } = this._segmentRange(type)

      if (val === null) {
        el.textContent = type === "year" ? "YYYY" : type === "month" ? "MM" : "DD"
        el.setAttribute("data-placeholder", "")
        el.removeAttribute("aria-valuenow")
      } else {
        el.textContent = String(val).padStart(digits, "0")
        el.removeAttribute("data-placeholder")
        el.setAttribute("aria-valuenow", val)
      }

      const { min, max } = this._segmentRange(type)
      el.setAttribute("aria-valuemin", min)
      el.setAttribute("aria-valuemax", max)
    }
  }

  /**
   * Syncs the combined segment values to the hidden input.
   * Only sets a value when all three segments are filled.
   *
   * @private
   */
  _syncInput() {
    const { year, month, day } = this._segments

    if (year !== null && month !== null && day !== null) {
      const iso = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      this.inputTarget.value = iso
      this.dispatch("change", { detail: { value: iso } })
    } else {
      this.inputTarget.value = ""
    }
  }

  /**
   * Focuses the next segment element.
   *
   * @param {HTMLElement} current
   * @private
   */
  _focusNext(current) {
    const idx = this.segmentTargets.indexOf(current)
    if (idx < this.segmentTargets.length - 1) {
      this.segmentTargets[idx + 1].focus()
    }
  }

  /**
   * Focuses the previous segment element.
   *
   * @param {HTMLElement} current
   * @private
   */
  _focusPrev(current) {
    const idx = this.segmentTargets.indexOf(current)
    if (idx > 0) {
      this.segmentTargets[idx - 1].focus()
    }
  }

  /**
   * Focuses the next segment after type-ahead completes.
   *
   * @param {string} type - Current segment type
   * @private
   */
  _focusNextFromType(type) {
    const order = ["month", "day", "year"]
    const idx = order.indexOf(type)
    if (idx < order.length - 1) {
      const nextType = order[idx + 1]
      const nextEl = this.segmentTargets.find((el) => el.dataset.segment === nextType)
      nextEl?.focus()
    }
  }
}
