import "$styles/index.css"
import "$styles/syntax-highlighting.css"

import { Application } from "@hotwired/stimulus"
import SidebarController from "./controllers/sidebar_controller.js"
import ThemeController from "./controllers/theme_controller.js"

const application = Application.start()
application.register("sidebar", SidebarController)
application.register("theme", ThemeController)
