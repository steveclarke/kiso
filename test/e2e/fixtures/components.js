/**
 * Shared component inventory for cross-cutting E2E tests.
 *
 * Used by dark-mode.spec.js (a11y sweep), mobile-audit.js (responsive audit),
 * and any future test that iterates over all components.
 *
 * When adding a new component, add it here and all sweeps pick it up.
 *
 * @module fixtures/components
 */

/**
 * All Kiso components with their Lookbook preview URLs.
 *
 * Each entry has:
 * - `name` — human-readable component name (used in test titles and reports)
 * - `url` — Lookbook preview URL (bypasses iframe, serves component directly)
 * - `exclude` — (optional) axe rule IDs to disable for a11y scans
 */
export const COMPONENTS = [
  { name: "action-icon", url: "/preview/kiso/action_icon/playground" },
  { name: "alert", url: "/preview/kiso/alert/playground" },
  { name: "alert-dialog", url: "/preview/kiso/alert_dialog/playground?open=true" },
  { name: "app", url: "/preview/kiso/layout/app/playground" },
  { name: "aspect-ratio", url: "/preview/kiso/aspect_ratio/playground" },
  { name: "avatar", url: "/preview/kiso/avatar/playground" },
  { name: "badge", url: "/preview/kiso/badge/playground" },
  { name: "breadcrumb", url: "/preview/kiso/breadcrumb/playground" },
  { name: "button", url: "/preview/kiso/button/playground" },
  { name: "card", url: "/preview/kiso/card/playground" },
  { name: "checkbox", url: "/preview/kiso/form/checkbox/with_field" },
  { name: "color-mode-button", url: "/preview/kiso/color_mode/color_mode_button/playground" },
  { name: "color-mode-select", url: "/preview/kiso/color_mode/color_mode_select/playground" },
  { name: "combobox", url: "/preview/kiso/combobox/with_field" },
  { name: "command", url: "/preview/kiso/command/playground" },
  { name: "container", url: "/preview/kiso/layout/container/playground" },
  { name: "dialog", url: "/preview/kiso/dialog/playground?open=true" },
  { name: "dropdown-menu", url: "/preview/kiso/dropdown_menu/basic" },
  { name: "empty", url: "/preview/kiso/empty/with_actions" },
  { name: "field", url: "/preview/kiso/form/field/textarea" },
  { name: "footer", url: "/preview/kiso/layout/footer/playground" },
  { name: "header", url: "/preview/kiso/layout/header/playground" },
  { name: "input", url: "/preview/kiso/form/input/with_field", exclude: ["color-contrast"] },
  {
    name: "select-native",
    url: "/preview/kiso/form/select_native/with_field",
    exclude: ["color-contrast"],
  },
  { name: "input-group", url: "/preview/kiso/form/input_group/playground" },
  { name: "input-otp", url: "/preview/kiso/form/input_otp/playground" },
  { name: "kbd", url: "/preview/kiso/kbd/playground" },
  { name: "main", url: "/preview/kiso/layout/main/playground" },
  { name: "page", url: "/preview/kiso/page/page/playground" },
  { name: "pagination", url: "/preview/kiso/pagination/playground" },
  { name: "popover", url: "/preview/kiso/popover/basic" },
  { name: "progress", url: "/preview/kiso/progress/playground" },
  { name: "radio-group", url: "/preview/kiso/form/radio_group/playground" },
  { name: "select", url: "/preview/kiso/form/select/playground" },
  { name: "separator", url: "/preview/kiso/separator/playground" },
  { name: "skeleton", url: "/preview/kiso/skeleton/playground" },
  { name: "slider", url: "/preview/kiso/form/slider/playground" },
  { name: "spinner", url: "/preview/kiso/spinner/playground" },
  { name: "stats-card", url: "/preview/kiso/stats_card/playground" },
  { name: "switch", url: "/preview/kiso/form/switch/playground" },
  { name: "table", url: "/preview/kiso/table/playground" },
  { name: "textarea", url: "/preview/kiso/form/textarea/with_field", exclude: ["color-contrast"] },
  { name: "toggle", url: "/preview/kiso/toggle/playground" },
  { name: "toggle-group", url: "/preview/kiso/toggle_group/playground" },
  { name: "tooltip", url: "/preview/kiso/tooltip/playground" },
]
