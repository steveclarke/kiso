/**
 * Kiso UI Stimulus controller registry.
 *
 * Exports all Kiso Stimulus controllers and provides a `start()` helper
 * to register them with a Stimulus application in one call.
 *
 * @module controllers/kiso
 *
 * @example Using start() to register all controllers at once
 *   import KisoUi from "kiso-ui"
 *   import { Application } from "@hotwired/stimulus"
 *
 *   const application = Application.start()
 *   KisoUi.start(application)
 *
 * @example Importing individual controllers
 *   import { KisoDialogController } from "kiso-ui"
 *   application.register("kiso--dialog", KisoDialogController)
 */

import KisoAlertController from "./alert_controller.js"
import KisoComboboxController from "./combobox_controller.js"
import KisoCommandController from "./command_controller.js"
import KisoCommandDialogController from "./command_dialog_controller.js"
import KisoDialogController from "./dialog_controller.js"
import KisoDialogTriggerController from "./dialog_trigger_controller.js"
import KisoDropdownMenuController from "./dropdown_menu_controller.js"
import KisoInputOtpController from "./input_otp_controller.js"
import KisoPopoverController from "./popover_controller.js"
import KisoSelectController from "./select_controller.js"
import KisoSidebarController from "./sidebar_controller.js"
import KisoSliderController from "./slider_controller.js"
import KisoThemeController from "./theme_controller.js"
import KisoToggleController from "./toggle_controller.js"
import KisoToggleGroupController from "./toggle_group_controller.js"
import KisoTooltipController from "./tooltip_controller.js"

const KisoUi = {
  /**
   * Registers all Kiso Stimulus controllers with the given application.
   *
   * @param {import("@hotwired/stimulus").Application} application - The Stimulus application instance
   */
  start(application) {
    application.register("kiso--alert", KisoAlertController)
    application.register("kiso--combobox", KisoComboboxController)
    application.register("kiso--command", KisoCommandController)
    application.register("kiso--command-dialog", KisoCommandDialogController)
    application.register("kiso--dialog", KisoDialogController)
    application.register("kiso--dialog-trigger", KisoDialogTriggerController)
    application.register("kiso--dropdown-menu", KisoDropdownMenuController)
    application.register("kiso--input-otp", KisoInputOtpController)
    application.register("kiso--popover", KisoPopoverController)
    application.register("kiso--select", KisoSelectController)
    application.register("kiso--sidebar", KisoSidebarController)
    application.register("kiso--slider", KisoSliderController)
    application.register("kiso--theme", KisoThemeController)
    application.register("kiso--toggle", KisoToggleController)
    application.register("kiso--toggle-group", KisoToggleGroupController)
    application.register("kiso--tooltip", KisoTooltipController)
  },
}

export default KisoUi
export {
  KisoAlertController,
  KisoComboboxController,
  KisoCommandController,
  KisoCommandDialogController,
  KisoDialogController,
  KisoDialogTriggerController,
  KisoDropdownMenuController,
  KisoInputOtpController,
  KisoPopoverController,
  KisoSelectController,
  KisoSidebarController,
  KisoSliderController,
  KisoThemeController,
  KisoToggleController,
  KisoToggleGroupController,
  KisoTooltipController,
}
