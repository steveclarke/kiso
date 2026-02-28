import KisoPopoverController from "./popover_controller.js"
import KisoSelectController from "./select_controller.js"
import KisoToggleController from "./toggle_controller.js"
import KisoToggleGroupController from "./toggle_group_controller.js"

const KisoUi = {
  start(application) {
    application.register("kiso--popover", KisoPopoverController)
    application.register("kiso--select", KisoSelectController)
    application.register("kiso--toggle", KisoToggleController)
    application.register("kiso--toggle-group", KisoToggleGroupController)
  }
}

export default KisoUi
export { KisoPopoverController, KisoSelectController, KisoToggleController, KisoToggleGroupController }
