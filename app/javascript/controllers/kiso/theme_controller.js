import { Controller } from "@hotwired/stimulus"

/**
 * Kiso theme toggle controller.
 *
 * Toggles the `.dark` class on `<html>` and persists the preference
 * to both `localStorage` and a cookie. The cookie enables server-side
 * FOUC prevention — include `Kiso::DashboardConcern` in your controller
 * to read it and render `<html class="dark">` before JavaScript runs,
 * so the correct theme is painted on the first frame.
 *
 * Register as `kiso--theme` (the engine index does this automatically).
 *
 * @example
 * <button data-controller="kiso--theme"
 *         data-action="click->kiso--theme#toggle"
 *         aria-label="Toggle dark mode">
 *   <!-- sun / moon icon -->
 * </button>
 */
export default class extends Controller {
  /**
   * Toggles dark mode on the document root.
   *
   * Adds or removes `.dark` from `<html>`, then persists the
   * preference to `localStorage` and a one-year cookie.
   */
  toggle() {
    const dark = document.documentElement.classList.toggle("dark")
    const value = dark ? "dark" : "light"

    localStorage.setItem("theme", value)
    document.cookie = `theme=${value};path=/;max-age=31536000;SameSite=Lax`
  }
}
