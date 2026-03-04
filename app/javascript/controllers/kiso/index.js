import KisoCollapsibleController from "./collapsible_controller.js"
import KisoComboboxController from "./combobox_controller.js"
import KisoCommandController from "./command_controller.js"
import KisoCommandDialogController from "./command_dialog_controller.js"
import KisoDropdownMenuController from "./dropdown_menu_controller.js"
import KisoInputOtpController from "./input_otp_controller.js"
import KisoPopoverController from "./popover_controller.js"
import KisoSelectController from "./select_controller.js"
import KisoSidebarController from "./sidebar_controller.js"
import KisoThemeController from "./theme_controller.js"
import KisoToggleController from "./toggle_controller.js"
import KisoToggleGroupController from "./toggle_group_controller.js"

const KisoUi = {
  start(application) {
    application.register("kiso--collapsible", KisoCollapsibleController)
    application.register("kiso--combobox", KisoComboboxController)
    application.register("kiso--command", KisoCommandController)
    application.register("kiso--command-dialog", KisoCommandDialogController)
    application.register("kiso--dropdown-menu", KisoDropdownMenuController)
    application.register("kiso--input-otp", KisoInputOtpController)
    application.register("kiso--popover", KisoPopoverController)
    application.register("kiso--select", KisoSelectController)
    application.register("kiso--sidebar", KisoSidebarController)
    application.register("kiso--theme", KisoThemeController)
    application.register("kiso--toggle", KisoToggleController)
    application.register("kiso--toggle-group", KisoToggleGroupController)
  },
}

export default KisoUi
export {
  KisoCollapsibleController,
  KisoComboboxController,
  KisoCommandController,
  KisoCommandDialogController,
  KisoDropdownMenuController,
  KisoInputOtpController,
  KisoPopoverController,
  KisoSelectController,
  KisoSidebarController,
  KisoThemeController,
  KisoToggleController,
  KisoToggleGroupController,
}
