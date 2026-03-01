import { Controller } from "@hotwired/stimulus"

/**
 * Dark mode toggle controller.
 *
 * Toggles the `.dark` class on `<html>` and persists the preference
 * to both `localStorage` and a cookie. The cookie enables server-side
 * FOUC prevention — the server reads it and renders `<html class="dark">`
 * before JavaScript runs, so the correct theme is painted immediately.
 *
 * @example
 * <button data-controller="theme" data-action="click->theme#toggle">
 *   Toggle dark mode
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
