import { Controller } from "@hotwired/stimulus"

/**
 * Kiso theme toggle controller.
 *
 * Toggles the `.dark` class on `<html>` and persists the preference
 * to both `localStorage` and a cookie. Works in concert with the
 * `kiso_theme_script` helper which prevents FOUC on initial page load.
 *
 * Supports three modes: "light", "dark", "system". The `toggle` action
 * cycles light ↔ dark. The `set` action accepts any of the three values.
 *
 * Register as `kiso--theme` (the engine index does this automatically).
 *
 * @example Toggle button (light ↔ dark)
 * <button data-controller="kiso--theme"
 *         data-action="click->kiso--theme#toggle"
 *         aria-label="Toggle dark mode">
 *   <!-- sun / moon icon -->
 * </button>
 *
 * @example Set a specific mode via kiso--select:change
 * <div data-controller="kiso--theme"
 *      data-action="kiso--select:change->kiso--theme#set">
 *   <!-- kui(:select) with light/dark/system items -->
 * </div>
 *
 * @fires kiso:theme-change on document.documentElement when theme changes
 */
export default class extends Controller {
  /**
   * Toggles dark mode on the document root.
   *
   * Cycles between light and dark. Persists the preference
   * to `localStorage` and a one-year cookie.
   */
  toggle() {
    const dark = document.documentElement.classList.toggle("dark")
    this.#persist(dark ? "dark" : "light")
  }

  /**
   * Sets a specific theme preference.
   *
   * Accepts "light", "dark", or "system" via event detail.
   * When "system", resolves to the OS preference via matchMedia.
   *
   * @param {CustomEvent} event - Event with detail.value
   */
  set(event) {
    const preference = event.detail?.value
    if (!preference) return

    this.#apply(preference)
    this.#persist(preference)
  }

  /**
   * Resolves a preference to an actual theme and applies it.
   *
   * @param {string} preference - "light", "dark", or "system"
   * @private
   */
  #apply(preference) {
    let resolved = preference
    if (preference === "system") {
      resolved = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    document.documentElement.classList.toggle("dark", resolved === "dark")
  }

  /**
   * Persists preference and dispatches change event.
   *
   * @param {string} preference - "light", "dark", or "system"
   * @private
   */
  #persist(preference) {
    localStorage.setItem("theme", preference)
    document.cookie = `theme=${preference};path=/;max-age=31536000;SameSite=Lax`

    document.documentElement.dispatchEvent(
      new CustomEvent("kiso:theme-change", {
        detail: { theme: preference },
        bubbles: true,
      }),
    )
  }
}
