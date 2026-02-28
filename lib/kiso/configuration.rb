# frozen_string_literal: true

module Kiso
  # Global configuration for the Kiso engine.
  #
  # Access via {Kiso.config} or set values in an initializer:
  #
  #   # config/initializers/kiso.rb
  #   Kiso.configure do |config|
  #     config.icons[:chevron_right] = "heroicons:chevron-right"
  #   end
  class Configuration
    # @return [Hash{Symbol => String}] semantic icon name to icon identifier mapping.
    #   Keys are semantic names used by components (e.g. +:chevron_right+),
    #   values are icon identifiers passed to +kiso_icon+ (e.g. +"heroicons:chevron-right"+).
    attr_reader :icons

    def initialize
      @icons = default_icons
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
        circle: "circle"
      }
    end
  end
end
