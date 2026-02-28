import KisoComboboxController from "./combobox_controller.js"
import KisoCommandController from "./command_controller.js"
import KisoCommandDialogController from "./command_dialog_controller.js"
import KisoPopoverController from "./popover_controller.js"
import KisoSelectController from "./select_controller.js"
import KisoToggleController from "./toggle_controller.js"
import KisoToggleGroupController from "./toggle_group_controller.js"

const KisoUi = {
  start(application) {
    application.register("kiso--combobox", KisoComboboxController)
    application.register("kiso--command", KisoCommandController)
    application.register("kiso--command-dialog", KisoCommandDialogController)
    application.register("kiso--popover", KisoPopoverController)
    application.register("kiso--select", KisoSelectController)
    application.register("kiso--toggle", KisoToggleController)
    application.register("kiso--toggle-group", KisoToggleGroupController)
  }
}

export default KisoUi
export { KisoComboboxController, KisoCommandController, KisoCommandDialogController, KisoPopoverController, KisoSelectController, KisoToggleController, KisoToggleGroupController }
