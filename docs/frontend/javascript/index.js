import "$styles/index.css"
import "$styles/syntax-highlighting.css"

import { Application } from "@hotwired/stimulus"
import SidebarController from "./controllers/sidebar_controller.js"
import ThemeController from "./controllers/theme_controller.js"
import { syncLookbookEmbeds } from "./helpers/lookbook_embeds.js"

const application = Application.start()
application.register("sidebar", SidebarController)
application.register("theme", ThemeController)

// Sync Lookbook embeds to current dark mode state on page load.
// The _head.erb inline script applies "dark" class from localStorage before
// the DOM builds, so by DOMContentLoaded the class is already present.
document.addEventListener("DOMContentLoaded", () => {
  if (document.documentElement.classList.contains("dark")) {
    syncLookbookEmbeds(true)
  }
})
