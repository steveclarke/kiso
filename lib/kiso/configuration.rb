# frozen_string_literal: true

module Kiso
  # Global configuration for the Kiso engine.
  #
  # Access via {Kiso.config} or set values in an initializer:
  #
  #   # config/initializers/kiso.rb
  #   Kiso.configure do |config|
  #     config.icons[:chevron_right] = "heroicons:chevron-right"
  #     config.theme[:button] = { base: "rounded-full" }
  #   end
  class Configuration
    # @return [Hash{Symbol => String}] semantic icon name to icon identifier mapping.
    #   Keys are semantic names used by components (e.g. +:chevron_right+),
    #   values are icon identifiers passed to +kiso_icon+ (e.g. +"heroicons:chevron-right"+).
    attr_reader :icons

    # @return [Hash{Symbol => Hash}] global theme overrides keyed by component name.
    #   Keys are snake_case component names (e.g. +:button+, +:card_header+),
    #   values are hashes accepted by +ClassVariants::Instance#merge+:
    #   +base:+, +variants:+, +compound_variants:+, +defaults:+.
    #   Applied once at boot by {ThemeOverrides.apply!}.
    attr_reader :theme

    def initialize
      @icons = default_icons
      @theme = {}
    end

    # Applies a pre-built style preset to all components.
    # Presets populate +@theme+ before {ThemeOverrides.apply!} runs,
    # so host-app overrides set after this call take priority.
    #
    # @param name [Symbol, String] the preset name (e.g. +:rounded+, +:sharp+)
    # @raise [ArgumentError] if the preset does not exist
    # @return [void]
    #
    # @example
    #   Kiso.configure do |config|
    #     config.apply_preset(:rounded)
    #     # Per-component overrides still work on top of the preset:
    #     config.theme[:button] = { base: "shadow-lg" }
    #   end
    def apply_preset(name)
      preset = Kiso::Presets.load(name)
      preset.each do |component, overrides|
        @theme[component] = (@theme[component] || {}).merge(overrides)
      end
    end

    private

    # @return [Hash{Symbol => String}] the default icon mapping using Lucide icon names
    def default_icons
      {
        chevron_right: "chevron-right",
        chevron_left: "chevron-left",
        chevron_down: "chevron-down",
        check: "check",
        ellipsis: "ellipsis",
        x: "x",
        search: "search",
        circle: "circle",
        sun: "sun",
        moon: "moon",
        monitor: "monitor",
        menu: "menu",
        minus: "minus",
        panel_left_close: "panel-left-close",
        panel_left_open: "panel-left-open"
      }
    end
  end
end
