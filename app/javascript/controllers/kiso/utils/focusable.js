/**
 * CSS selector for all natively focusable elements that are not disabled
 * or explicitly removed from the tab order.
 *
 * @type {string}
 */
export const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
