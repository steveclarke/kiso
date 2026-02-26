import { Controller } from "@hotwired/stimulus"
import { syncLookbookEmbeds } from "../helpers/lookbook_embeds"

export default class extends Controller {
  toggle() {
    const isDark = document.documentElement.classList.toggle("dark")
    localStorage.theme = isDark ? "dark" : "light"
    syncLookbookEmbeds(isDark)
  }
}
