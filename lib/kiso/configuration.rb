# frozen_string_literal: true

module Kiso
  class Configuration
    attr_reader :icons

    def initialize
      @icons = default_icons
    end

    private

    def default_icons
      {
        chevron_right: "chevron-right",
        chevron_left: "chevron-left",
        ellipsis: "ellipsis"
      }
    end
  end
end
