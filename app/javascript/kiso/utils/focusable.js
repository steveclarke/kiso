/**
 * Shared focusable element utilities.
 * Provides a CSS selector for querying focusable elements in the DOM.
 *
 * Used by popover, dropdown_menu, and other controllers that need
 * focus trapping or focus management.
 *
 * @module utils/focusable
 */

/**
 * CSS selector for all natively focusable elements that are not disabled
 * or explicitly removed from the tab order.
 *
 * @type {string}
 *
 * @example
 *   const focusable = container.querySelectorAll(FOCUSABLE_SELECTOR)
 *   focusable[0]?.focus()
 */
export const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
