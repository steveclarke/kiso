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

    # @return [Symbol] the active app theme directory name.
    #   Theme files are loaded from +app/themes/<name>/+. Defaults to
    #   +:default+, meaning +app/themes/default/+.
    #
    # @example Switch to a custom theme
    #   Kiso.configure do |config|
    #     config.app_theme = :modern
    #   end
    attr_accessor :app_theme

    def initialize
      @icons = default_icons
      @theme = {}
      @app_theme = :default
    end

    # Resolves the active app theme directory path relative to the given root.
    #
    # @param app_root [Pathname] the Rails application root
    # @return [Pathname] the active theme directory (e.g. +app/themes/default+)
    def app_theme_path(app_root)
      app_root.join("app/themes", app_theme.to_s)
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
        panel_left_open: "panel-left-open",
        spinner: "loader-circle"
      }
    end
  end
end
