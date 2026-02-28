import { type Application, Controller } from "@hotwired/stimulus"

declare const KisoUi: {
  start(application: Application): void
}

export default KisoUi
export const KisoComboboxController: typeof Controller
export const KisoSelectController: typeof Controller
export const KisoToggleController: typeof Controller
export const KisoToggleGroupController: typeof Controller
