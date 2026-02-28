import KisoToggleController from "./toggle_controller.js"
import KisoToggleGroupController from "./toggle_group_controller.js"

function registerKisoControllers(application) {
  application.register("kiso--toggle", KisoToggleController)
  application.register("kiso--toggle-group", KisoToggleGroupController)
}

export {
  registerKisoControllers,
  KisoToggleController,
  KisoToggleGroupController
}
