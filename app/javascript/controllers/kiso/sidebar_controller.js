import { Controller } from "@hotwired/stimulus"

/**
 * Kiso sidebar toggle controller.
 *
 * Manages the dashboard sidebar open/closed state via a single
 * `data-sidebar-open` attribute on the controller element. CSS cascade
 * handles all visual changes — this controller only manages the
 * boolean attribute and persists the preference to a cookie for
 * FOUC-free server-side restoration on the next page load.
 *
 * Register as `kiso--sidebar` (the engine index does this automatically).
 *
 * @example
 * <div data-slot="dashboard-group"
 *      data-controller="kiso--sidebar"
 *      data-sidebar-open="true">
 *   <header data-slot="dashboard-navbar">
 *     <button data-kiso--sidebar-target="trigger"
 *             data-action="click->kiso--sidebar#toggle"
 *             aria-expanded="true"
 *             aria-controls="dashboard-sidebar">
 *       <!-- hamburger icon -->
 *     </button>
 *   </header>
 *   <aside data-slot="dashboard-sidebar" id="dashboard-sidebar">
 *     <div data-slot="dashboard-sidebar-inner">
 *       <!-- sidebar content -->
 *     </div>
 *   </aside>
 *   <main data-slot="dashboard-panel"><!-- page content --></main>
 *   <div data-slot="dashboard-scrim"
 *        data-kiso--sidebar-target="scrim"
 *        data-action="click->kiso--sidebar#closeOnMobile"
 *        aria-hidden="true"></div>
 * </div>
 *
 * @property {Element} triggerTarget - The topbar toggle button
 * @property {Element} scrimTarget   - The mobile overlay scrim
 */
export default class extends Controller {
  static targets = ["trigger", "scrim"]

  /**
   * Toggles the sidebar open/closed state.
   *
   * Flips `data-sidebar-open` on the controller element, syncs
   * `aria-expanded` on the trigger target, and persists the new
   * state to a one-year cookie for FOUC-free server-side restoration.
   */
  toggle() {
    const isOpen = this.element.dataset.sidebarOpen !== "false"
    this.#setState(!isOpen)
  }

  /**
   * Closes the sidebar on mobile viewports only.
   *
   * Connected to the scrim click event. Tapping the overlay outside
   * the mobile sidebar dismisses it without affecting desktop layout.
   */
  closeOnMobile() {
    if (matchMedia("(max-width: 767px)").matches) {
      this.#setState(false)
    }
  }

  /**
   * Sets the sidebar state, syncs aria-expanded, and persists to cookie.
   *
   * @param {boolean} open - Whether the sidebar should be open
   * @private
   */
  #setState(open) {
    const value = String(open)

    this.element.dataset.sidebarOpen = value
    document.cookie = `sidebar_open=${value};path=/;max-age=31536000;SameSite=Lax`

    if (this.hasTriggerTarget) {
      this.triggerTarget.setAttribute("aria-expanded", value)
    }
  }
}
