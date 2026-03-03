import { Controller } from "@hotwired/stimulus"

/**
 * Manages a one-time password input with individual visual character slots.
 *
 * A single transparent `<input>` overlays the visual slots. The browser handles
 * all native input behavior (focus, paste, mobile autofill). This controller
 * distributes the input value to slot elements and tracks the active slot via
 * `selectionStart`.
 *
 * @example
 *   <div data-controller="kiso--input-otp"
 *        data-kiso--input-otp-length-value="6"
 *        data-kiso--input-otp-pattern-value="\\d">
 *     <input data-kiso--input-otp-target="input"
 *            type="text" maxlength="6" autocomplete="one-time-code"
 *            class="absolute inset-0 z-10 w-full h-full opacity-0">
 *     <div data-slot="input-otp-group">
 *       <div data-kiso--input-otp-target="slot" data-slot="input-otp-slot">
 *         <span data-slot="input-otp-slot-char"></span>
 *         <div data-slot="input-otp-caret" hidden>
 *           <div class="bg-foreground h-4 w-px animate-caret-blink"></div>
 *         </div>
 *       </div>
 *     </div>
 *   </div>
 *
 * @property {HTMLInputElement} inputTarget - The transparent real input element
 * @property {HTMLElement[]} slotTargets - Visual slot div elements
 * @property {Number} lengthValue - Expected OTP code length
 * @property {String} patternValue - Regex pattern for allowed characters (default: digits only)
 *
 * @fires kiso--input-otp:change - When the OTP value changes.
 *   Detail: `{ value: string }`
 * @fires kiso--input-otp:complete - When all slots are filled.
 *   Detail: `{ value: string }`
 */
export default class extends Controller {
  static targets = ["input", "slot"]
  static values = {
    length: { type: Number, default: 6 },
    pattern: { type: String, default: "\\d" },
  }

  /**
   * Binds event listeners and syncs slots from any pre-filled value.
   */
  connect() {
    this._handleInput = this._handleInput.bind(this)
    this._handleKeydown = this._handleKeydown.bind(this)
    this._handleFocus = this._handleFocus.bind(this)
    this._handleBlur = this._handleBlur.bind(this)
    this._handleClick = this._handleClick.bind(this)

    this.inputTarget.addEventListener("input", this._handleInput)
    this.inputTarget.addEventListener("keydown", this._handleKeydown)
    this.inputTarget.addEventListener("focus", this._handleFocus)
    this.inputTarget.addEventListener("blur", this._handleBlur)
    this.element.addEventListener("click", this._handleClick)

    this._syncSlots()
  }

  /**
   * Removes event listeners.
   */
  disconnect() {
    this.inputTarget.removeEventListener("input", this._handleInput)
    this.inputTarget.removeEventListener("keydown", this._handleKeydown)
    this.inputTarget.removeEventListener("focus", this._handleFocus)
    this.inputTarget.removeEventListener("blur", this._handleBlur)
    this.element.removeEventListener("click", this._handleClick)
  }

  /**
   * Filters input against the pattern, syncs slots, and dispatches events.
   *
   * @private
   */
  _handleInput() {
    const regex = new RegExp(this.patternValue)
    const filtered = this.inputTarget.value
      .split("")
      .filter((char) => regex.test(char))
      .join("")
      .slice(0, this.lengthValue)

    if (filtered !== this.inputTarget.value) {
      this.inputTarget.value = filtered
    }

    this._syncSlots()
    this._updateActiveSlot()

    this.dispatch("change", { detail: { value: filtered } })

    if (filtered.length === this.lengthValue) {
      this.dispatch("complete", { detail: { value: filtered } })
    }
  }

  /**
   * Re-syncs the active slot after keydown events that may change selection
   * (arrow keys, backspace, delete, home, end).
   *
   * @private
   */
  _handleKeydown() {
    requestAnimationFrame(() => this._updateActiveSlot())
  }

  /**
   * Shows the caret on the active slot when the input receives focus.
   *
   * @private
   */
  _handleFocus() {
    this._updateActiveSlot()
  }

  /**
   * Clears all active states and hides all carets on blur.
   *
   * @private
   */
  _handleBlur() {
    this._clearActiveSlots()
  }

  /**
   * Focuses the transparent input when clicking anywhere on the component.
   * Places the cursor at the end of the current value.
   *
   * @private
   */
  _handleClick() {
    this.inputTarget.focus()
    const len = this.inputTarget.value.length
    this.inputTarget.setSelectionRange(len, len)
    this._updateActiveSlot()
  }

  /**
   * Distributes input value characters to visual slot elements.
   * Each slot's `[data-slot="input-otp-slot-char"]` span gets its character.
   *
   * @private
   */
  _syncSlots() {
    const value = this.inputTarget.value
    this.slotTargets.forEach((slot, index) => {
      const charEl = slot.querySelector("[data-slot='input-otp-slot-char']")
      if (charEl) {
        charEl.textContent = value[index] || ""
      }
    })
  }

  /**
   * Sets `data-active="true"` on the slot matching the cursor position.
   * Shows the blinking caret on the active empty slot.
   *
   * @private
   */
  _updateActiveSlot() {
    if (document.activeElement !== this.inputTarget) return

    const pos = Math.min(this.inputTarget.selectionStart ?? 0, this.lengthValue - 1)

    this.slotTargets.forEach((slot, index) => {
      const isActive = index === pos
      const charEl = slot.querySelector("[data-slot='input-otp-slot-char']")
      const caretEl = slot.querySelector("[data-slot='input-otp-caret']")
      const hasChar = charEl && charEl.textContent !== ""

      slot.dataset.active = isActive
      if (caretEl) {
        caretEl.hidden = !(isActive && !hasChar)
      }
    })
  }

  /**
   * Removes all active states and hides all carets.
   *
   * @private
   */
  _clearActiveSlots() {
    this.slotTargets.forEach((slot) => {
      delete slot.dataset.active
      const caretEl = slot.querySelector("[data-slot='input-otp-caret']")
      if (caretEl) caretEl.hidden = true
    })
  }
}
