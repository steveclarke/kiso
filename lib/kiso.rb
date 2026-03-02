# frozen_string_literal: true

require "class_variants"
require "tailwind_merge"
require "kiso/version"
require "kiso/configuration"
require "kiso/theme_overrides"
require "kiso/engine"
require "kiso/themes/shared"
require "kiso/themes/badge"
require "kiso/themes/alert"
require "kiso/themes/button"
require "kiso/themes/card"
require "kiso/themes/separator"
require "kiso/themes/empty"
require "kiso/themes/stats_card"
require "kiso/themes/table"
require "kiso/themes/pagination"
require "kiso/themes/label"
require "kiso/themes/field"
require "kiso/themes/field_group"
require "kiso/themes/field_set"
require "kiso/themes/input"
require "kiso/themes/textarea"
require "kiso/themes/input_group"
require "kiso/themes/checkbox"
require "kiso/themes/radio_group"
require "kiso/themes/switch"
require "kiso/themes/breadcrumb"
require "kiso/themes/toggle"
require "kiso/themes/toggle_group"
require "kiso/themes/select"
require "kiso/themes/popover"
require "kiso/themes/combobox"
require "kiso/themes/command"
require "kiso/themes/dropdown_menu"
require "kiso/themes/kbd"
require "kiso/themes/color_mode_button"
require "kiso/themes/color_mode_select"
require "kiso/themes/dashboard"
require "kiso/icons"

# Kiso — a Rails engine providing UI components inspired by shadcn/ui and Nuxt UI.
#
# Components are rendered via ERB partials with computed Tailwind classes
# from theme modules ({Themes}). Use the {ComponentHelper#kui kui} helper
# to render components in views.
#
# @example Rendering a badge
#   kui(:badge, color: :success, variant: :soft) { "Active" }
#
# @example Configuring icons
#   Kiso.configure do |config|
#     config.icons[:chevron_right] = "heroicons:chevron-right"
#   end
#
# @example Global theme overrides
#   Kiso.configure do |config|
#     config.theme[:button] = { base: "rounded-full", defaults: { variant: :outline } }
#     config.theme[:card_header] = { base: "p-8 sm:p-10" }
#   end
#
# @see ComponentHelper#kui
# @see Themes
module Kiso
  class << self
    # @return [Configuration] the global configuration instance
    def configuration
      @configuration ||= Configuration.new
    end
    alias_method :config, :configuration

    # Yields the global {Configuration} for modification.
    #
    # @yieldparam config [Configuration]
    # @return [void]
    def configure
      yield(configuration)
    end
  end
end
