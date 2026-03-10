import { type Application, Controller } from "@hotwired/stimulus"

declare const KisoUi: {
  start(application: Application): void
}

export default KisoUi
export const KisoAlertController: typeof Controller
export const KisoComboboxController: typeof Controller
export const KisoCommandController: typeof Controller
export const KisoCommandDialogController: typeof Controller
export const KisoDialogController: typeof Controller
export const KisoDialogTriggerController: typeof Controller
export const KisoDropdownMenuController: typeof Controller
export const KisoInputOtpController: typeof Controller
export const KisoPopoverController: typeof Controller
export const KisoSelectController: typeof Controller
export const KisoSidebarController: typeof Controller
export const KisoSliderController: typeof Controller
export const KisoThemeController: typeof Controller
export const KisoToggleController: typeof Controller
export const KisoToggleGroupController: typeof Controller
export const KisoTooltipController: typeof Controller
