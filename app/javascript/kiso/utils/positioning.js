/**
 * Shared positioning utilities for floating components.
 * Wraps Floating UI for smart positioning with flip, shift, and auto-update.
 *
 * Used by select, combobox, popover, and dropdown_menu controllers.
 *
 * @module utils/positioning
 */

import { autoUpdate, computePosition, flip, offset, shift, size } from "@floating-ui/dom"

/**
 * Starts positioning a floating element relative to a reference element.
 * Computes position immediately and re-computes on scroll, resize, and
 * layout shift via Floating UI's `autoUpdate`.
 *
 * Sets `data-side` on the floating element ("top", "bottom", "left", "right")
 * for CSS animation selectors (e.g., `[data-side="top"] { ... }`).
 *
 * @param {HTMLElement} reference - The anchor element to position against
 * @param {HTMLElement} floating - The floating element to position
 * @param {Object} [options]
 * @param {"bottom-start"|"bottom"|"bottom-end"|"top-start"|"top"|"top-end"|"right-start"|"right"|"right-end"|"left-start"|"left"|"left-end"} [options.placement="bottom-start"] - Preferred placement
 * @param {number} [options.offset=4] - Pixel gap between reference and floating element
 * @param {"absolute"|"fixed"} [options.strategy="absolute"] - CSS positioning strategy
 * @param {boolean} [options.matchWidth=false] - Set floating element minWidth to reference width
 * @returns {Function} Cleanup function — call on close or disconnect to remove listeners
 *
 * @example
 *   // In a Stimulus controller:
 *   open() {
 *     this.contentTarget.hidden = false
 *     this._cleanupPosition = startPositioning(
 *       this.triggerTarget,
 *       this.contentTarget,
 *       { placement: "bottom-start", matchWidth: true }
 *     )
 *   }
 *
 *   close() {
 *     this._cleanupPosition?.()
 *     this._cleanupPosition = null
 *     this.contentTarget.hidden = true
 *   }
 */
export function startPositioning(reference, floating, options = {}) {
  const {
    placement = "bottom-start",
    offset: offsetDistance = 4,
    strategy = "absolute",
    matchWidth = false,
  } = options

  const middleware = [offset(offsetDistance), flip(), shift({ padding: 8 })]

  if (matchWidth) {
    middleware.push(
      size({
        apply({ rects, elements }) {
          elements.floating.style.minWidth = `${rects.reference.width}px`
        },
      }),
    )
  }

  const update = () => {
    computePosition(reference, floating, {
      placement,
      strategy,
      middleware,
    }).then(({ x, y, placement: finalPlacement }) => {
      Object.assign(floating.style, {
        position: strategy,
        left: `${x}px`,
        top: `${y}px`,
      })

      const side = finalPlacement.split("-")[0]
      if (floating.dataset.side !== side) {
        floating.dataset.side = side
      }
    })
  }

  return autoUpdate(reference, floating, update)
}
