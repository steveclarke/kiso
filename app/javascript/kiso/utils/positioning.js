/**
 * Shared positioning utilities for dropdown-style components.
 * Used by select, combobox, popover, and dropdown_menu controllers.
 *
 * @module utils/positioning
 */

/**
 * Positions a content panel below an anchor element using absolute positioning.
 *
 * @param {HTMLElement} anchor - The reference element to position below
 * @param {HTMLElement} content - The panel to position
 * @param {Object} [options]
 * @param {number} [options.gap=4] - Pixel gap between anchor and content
 * @param {"start"|"center"|"end"} [options.align="start"] - Horizontal alignment
 * @param {HTMLElement} [options.container] - Parent container for "end" alignment calculation
 */
export function positionBelow(
  anchor,
  content,
  { gap = 4, align = "start", container = null } = {},
) {
  const rect = anchor.getBoundingClientRect()

  content.style.position = "absolute"
  content.style.top = `${anchor.offsetTop + anchor.offsetHeight + gap}px`
  content.style.minWidth = `${rect.width}px`

  switch (align) {
    case "end":
      if (container) {
        content.style.right = `${container.offsetWidth - anchor.offsetLeft - anchor.offsetWidth}px`
        content.style.left = "auto"
      }
      break
    case "center": {
      const contentWidth = content.offsetWidth
      const center = anchor.offsetLeft + anchor.offsetWidth / 2
      content.style.left = `${center - contentWidth / 2}px`
      content.style.right = "auto"
      break
    }
    case "start":
    default:
      content.style.left = `${anchor.offsetLeft}px`
      content.style.right = "auto"
      break
  }
}
