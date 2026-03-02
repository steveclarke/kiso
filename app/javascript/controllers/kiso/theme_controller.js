import { Controller } from "@hotwired/stimulus"

/**
 * Kiso theme toggle controller.
 *
 * Toggles the `.dark` class on `<html>` and persists the preference
 * to both `localStorage` and a cookie. Works in concert with the
 * `kiso_theme_script` helper which prevents FOUC on initial page load.
 *
 * Register as `kiso--theme` (the engine index does this automatically).
 *
 * @example
 * <button data-controller="kiso--theme"
 *         data-action="click->kiso--theme#toggle"
 *         aria-label="Toggle dark mode">
 *   <!-- sun / moon icon -->
 * </button>
 *
 * @fires kiso:theme-change on document.documentElement when theme changes
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

    document.documentElement.dispatchEvent(
      new CustomEvent("kiso:theme-change", {
        detail: { theme: value },
        bubbles: true,
      }),
    )
  }
}
