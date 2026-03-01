import { Controller } from "@hotwired/stimulus"

/**
 * Kiso sidebar toggle controller.
 *
 * Manages the dashboard sidebar open/closed state via a single
 * `data-sidebar-open` attribute on the body element. CSS cascade
 * handles all visual changes — this controller only manages the
 * boolean attribute and persists the preference to a cookie for
 * FOUC-free server-side restoration on the next page load.
 *
 * Register as `kiso--sidebar` (the engine index does this automatically).
 *
 * @example
 * <body data-controller="kiso--sidebar" data-sidebar-open="true">
 *   <button data-kiso--sidebar-target="trigger"
 *           data-action="click->kiso--sidebar#toggle"
 *           aria-expanded="true"
 *           aria-controls="sidebar-panel">
 *     Toggle sidebar
 *   </button>
 *   <aside class="sidebar-rail" id="sidebar-panel">
 *     <nav class="sidebar-nav">
 *       <!-- sidebar content -->
 *       <button data-action="click->kiso--sidebar#toggle"
 *               class="md:hidden"
 *               aria-label="Close sidebar">
 *         <!-- X icon -->
 *       </button>
 *     </nav>
 *   </aside>
 *   <div class="sidebar-scrim"
 *        data-kiso--sidebar-target="scrim"
 *        data-action="click->kiso--sidebar#closeOnMobile"></div>
 * </body>
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
