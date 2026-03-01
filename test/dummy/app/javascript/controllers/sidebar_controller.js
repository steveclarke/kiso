import { Controller } from "@hotwired/stimulus"

/**
 * Sidebar toggle controller.
 *
 * Manages the dashboard sidebar open/closed state via a single
 * `data-sidebar-open` attribute on the body element. CSS cascade
 * handles all visual changes — this controller only manages the
 * boolean attribute and persists the preference to a cookie for
 * FOUC-free server-side restoration on the next Turbo navigation.
 *
 * @example
 * <body data-controller="sidebar" data-sidebar-open="true">
 *   <button data-sidebar-target="trigger"
 *           data-action="click->sidebar#toggle"
 *           aria-expanded="true">
 *     Toggle
 *   </button>
 *   <aside class="sidebar-rail">...</aside>
 *   <div class="sidebar-scrim"
 *        data-sidebar-target="scrim"
 *        data-action="click->sidebar#closeOnMobile"></div>
 * </body>
 *
 * @property {Element} triggerTarget - The toggle button element
 * @property {Element} scrimTarget   - The mobile overlay scrim element
 */
export default class extends Controller {
  static targets = ["trigger", "scrim"]

  /**
   * Toggles the sidebar open/closed state.
   *
   * Flips `data-sidebar-open` on the controller element, updates
   * `aria-expanded` on the trigger target, and writes the new state
   * to a one-year cookie for server-side FOUC prevention.
   */
  toggle() {
    const isOpen = this.element.dataset.sidebarOpen !== "false"
    const next = String(!isOpen)

    this.element.dataset.sidebarOpen = next
    document.cookie = `sidebar_open=${next};path=/;max-age=31536000;SameSite=Lax`

    if (this.hasTriggerTarget) {
      this.triggerTarget.setAttribute("aria-expanded", next)
    }
  }

  /**
   * Closes the sidebar on mobile viewports only.
   *
   * Connected to the scrim click event. Tapping the overlay outside
   * the mobile sidebar dismisses it without affecting desktop layout.
   */
  closeOnMobile() {
    if (window.innerWidth < 768) {
      this.element.dataset.sidebarOpen = "false"
      document.cookie = "sidebar_open=false;path=/;max-age=31536000;SameSite=Lax"
    }
  }
}
