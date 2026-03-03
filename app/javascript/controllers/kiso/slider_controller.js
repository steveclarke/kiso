import { Controller } from "@hotwired/stimulus"

/**
 * Connects a visual slider (track, range, thumb) to a hidden `<input type="range">`
 * for form submission and accessibility.
 *
 * The hidden input stores the value for form submission. The thumb element has
 * `role="slider"` with ARIA attributes for screen readers. Mouse drag, touch drag,
 * track click, and keyboard navigation all update both the visual position and the
 * hidden input value.
 *
 * @example
 *   <div data-controller="kiso--slider"
 *        data-kiso--slider-min-value="0"
 *        data-kiso--slider-max-value="100"
 *        data-kiso--slider-step-value="1">
 *     <input type="range" data-kiso--slider-target="input" class="sr-only"
 *            min="0" max="100" step="1" value="50">
 *     <div data-kiso--slider-target="track" data-slot="slider-track">
 *       <div data-kiso--slider-target="range" data-slot="slider-range"
 *            style="width: 50%"></div>
 *     </div>
 *     <div data-kiso--slider-target="thumb" data-slot="slider-thumb"
 *          role="slider" tabindex="0"
 *          aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"
 *          style="position: absolute; left: 50%"></div>
 *   </div>
 *
 * @property {HTMLInputElement} inputTarget - The hidden range input for form submission
 * @property {HTMLElement} trackTarget - The background track element
 * @property {HTMLElement} rangeTarget - The filled range portion
 * @property {HTMLElement} thumbTarget - The draggable thumb handle
 * @property {Number} minValue - Minimum slider value
 * @property {Number} maxValue - Maximum slider value
 * @property {Number} stepValue - Step increment
 *
 * @fires kiso--slider:change - When the slider value changes.
 *   Detail: `{ value: number }`
 */
export default class extends Controller {
  static targets = ["input", "track", "range", "thumb"]
  static values = {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
  }

  /**
   * Binds event listeners for mouse, touch, keyboard, and track click.
   */
  connect() {
    this._handleMouseDown = this._handleMouseDown.bind(this)
    this._handleMouseMove = this._handleMouseMove.bind(this)
    this._handleMouseUp = this._handleMouseUp.bind(this)
    this._handleTouchStart = this._handleTouchStart.bind(this)
    this._handleTouchMove = this._handleTouchMove.bind(this)
    this._handleTouchEnd = this._handleTouchEnd.bind(this)
    this._handleTrackClick = this._handleTrackClick.bind(this)
    this._handleKeyDown = this._handleKeyDown.bind(this)

    this.thumbTarget.addEventListener("mousedown", this._handleMouseDown)
    this.thumbTarget.addEventListener("touchstart", this._handleTouchStart, { passive: false })
    this.thumbTarget.addEventListener("keydown", this._handleKeyDown)
    this.trackTarget.addEventListener("click", this._handleTrackClick)

    this._dragging = false
  }

  /**
   * Removes all event listeners.
   */
  disconnect() {
    this.thumbTarget.removeEventListener("mousedown", this._handleMouseDown)
    this.thumbTarget.removeEventListener("touchstart", this._handleTouchStart)
    this.thumbTarget.removeEventListener("keydown", this._handleKeyDown)
    this.trackTarget.removeEventListener("click", this._handleTrackClick)

    // Clean up any lingering global listeners from an interrupted drag
    document.removeEventListener("mousemove", this._handleMouseMove)
    document.removeEventListener("mouseup", this._handleMouseUp)
    document.removeEventListener("touchmove", this._handleTouchMove)
    document.removeEventListener("touchend", this._handleTouchEnd)
  }

  /**
   * @returns {boolean} Whether the slider is disabled
   * @private
   */
  get _isDisabled() {
    return this.inputTarget.disabled
  }

  /**
   * Starts mouse drag tracking.
   *
   * @param {MouseEvent} event
   * @private
   */
  _handleMouseDown(event) {
    if (this._isDisabled) return
    event.preventDefault()

    this._dragging = true
    document.addEventListener("mousemove", this._handleMouseMove)
    document.addEventListener("mouseup", this._handleMouseUp)
    this.thumbTarget.focus()
  }

  /**
   * Updates slider position during mouse drag.
   *
   * @param {MouseEvent} event
   * @private
   */
  _handleMouseMove(event) {
    if (!this._dragging) return
    this._updateFromPointer(event.clientX)
  }

  /**
   * Ends mouse drag tracking.
   *
   * @private
   */
  _handleMouseUp() {
    this._dragging = false
    document.removeEventListener("mousemove", this._handleMouseMove)
    document.removeEventListener("mouseup", this._handleMouseUp)
  }

  /**
   * Starts touch drag tracking.
   *
   * @param {TouchEvent} event
   * @private
   */
  _handleTouchStart(event) {
    if (this._isDisabled) return
    event.preventDefault()

    this._dragging = true
    document.addEventListener("touchmove", this._handleTouchMove, { passive: false })
    document.addEventListener("touchend", this._handleTouchEnd)
    this.thumbTarget.focus()
  }

  /**
   * Updates slider position during touch drag.
   *
   * @param {TouchEvent} event
   * @private
   */
  _handleTouchMove(event) {
    if (!this._dragging) return
    event.preventDefault()
    this._updateFromPointer(event.touches[0].clientX)
  }

  /**
   * Ends touch drag tracking.
   *
   * @private
   */
  _handleTouchEnd() {
    this._dragging = false
    document.removeEventListener("touchmove", this._handleTouchMove)
    document.removeEventListener("touchend", this._handleTouchEnd)
  }

  /**
   * Jumps the thumb to the clicked position on the track.
   *
   * @param {MouseEvent} event
   * @private
   */
  _handleTrackClick(event) {
    if (this._isDisabled) return
    this._updateFromPointer(event.clientX)
    this.thumbTarget.focus()
  }

  /**
   * Handles keyboard navigation on the thumb.
   *
   * Arrow keys adjust by step, Page Up/Down by 10x step, Home/End jump to min/max.
   *
   * @param {KeyboardEvent} event
   * @private
   */
  _handleKeyDown(event) {
    if (this._isDisabled) return

    const current = parseFloat(this.inputTarget.value)
    const step = this.stepValue
    let newValue = current

    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        newValue = current + step
        break
      case "ArrowLeft":
      case "ArrowDown":
        newValue = current - step
        break
      case "PageUp":
        newValue = current + step * 10
        break
      case "PageDown":
        newValue = current - step * 10
        break
      case "Home":
        newValue = this.minValue
        break
      case "End":
        newValue = this.maxValue
        break
      default:
        return
    }

    event.preventDefault()
    this._setValue(newValue)
  }

  /**
   * Calculates value from a pointer's X coordinate relative to the track.
   *
   * @param {number} clientX - The pointer's X coordinate
   * @private
   */
  _updateFromPointer(clientX) {
    const rect = this.trackTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const rawValue = this.minValue + ratio * (this.maxValue - this.minValue)
    this._setValue(rawValue)
  }

  /**
   * Snaps a value to the nearest step, clamps to min/max, and updates
   * the hidden input, visual position, and ARIA attributes.
   *
   * @param {number} rawValue - The unsnapped value
   * @private
   */
  _setValue(rawValue) {
    const step = this.stepValue
    const snapped = Math.round(rawValue / step) * step
    const clamped = Math.max(this.minValue, Math.min(this.maxValue, snapped))

    // Round to avoid floating point artifacts
    const decimals = step.toString().includes(".") ? step.toString().split(".")[1].length : 0
    const value = parseFloat(clamped.toFixed(decimals))

    if (parseFloat(this.inputTarget.value) === value) return

    this.inputTarget.value = value
    this._updateVisual(value)

    this.dispatch("change", { detail: { value } })
  }

  /**
   * Updates the visual position of the range and thumb elements,
   * and syncs ARIA attributes.
   *
   * @param {number} value - The current slider value
   * @private
   */
  _updateVisual(value) {
    const percent = ((value - this.minValue) / (this.maxValue - this.minValue)) * 100
    this.rangeTarget.style.width = `${percent}%`
    this.thumbTarget.style.left = `${percent}%`
    this.thumbTarget.setAttribute("aria-valuenow", value)
  }
}
