/**
 * Shared highlight and index utilities for list-based components.
 * Used by select, combobox, command, and dropdown_menu controllers.
 *
 * @module utils/highlight
 */

/**
 * Highlights an item at the given index. Clears the attribute from all
 * clearItems, then sets it on the item at `index` within `items` and
 * scrolls it into view.
 *
 * @param {HTMLElement[]} clearItems - Items to remove the attribute from (may differ from `items` to clear a broader set)
 * @param {HTMLElement[]} items - Items to index into for highlighting
 * @param {number} index - Index to highlight, or -1 to clear only
 * @param {Object} [options]
 * @param {string} [options.attr="data-highlighted"] - The attribute to toggle
 *
 * @example
 *   // Highlight the third item, clearing all item targets first
 *   highlightItem(this.itemTargets, this._visibleEnabledItems, 2)
 *
 * @example
 *   // Use a custom attribute for command palette selection
 *   highlightItem(this.itemTargets, enabledItems, 0, { attr: "data-selected" })
 */
export function highlightItem(clearItems, items, index, { attr = "data-highlighted" } = {}) {
  clearItems.forEach((item) => item.removeAttribute(attr))

  if (index >= 0 && index < items.length) {
    items[index].setAttribute(attr, "")
    items[index].scrollIntoView({ block: "nearest" })
  }
}

/**
 * Wraps an index within a range, cycling from end to start and vice versa.
 *
 * @param {number} current - Current index
 * @param {number} direction - +1 for next, -1 for previous
 * @param {number} length - Total number of items
 * @returns {number} The wrapped index, or -1 if length is 0
 *
 * @example
 *   wrapIndex(2, 1, 5)   // => 3
 *   wrapIndex(4, 1, 5)   // => 0 (wraps to start)
 *   wrapIndex(0, -1, 5)  // => 4 (wraps to end)
 *   wrapIndex(0, 1, 0)   // => -1 (empty list)
 */
export function wrapIndex(current, direction, length) {
  if (length === 0) return -1

  let next = current + direction
  if (next < 0) next = length - 1
  if (next >= length) next = 0
  return next
}
