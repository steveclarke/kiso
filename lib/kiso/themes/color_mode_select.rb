module Kiso
  module Themes
    # Dropdown select for choosing between Light, Dark, and System color modes.
    #
    # Wraps a {SelectNative} element with the +kiso--theme+ Stimulus controller.
    # No variants -- styling is handled by the inner select component.
    #
    # @example
    #   ColorModeSelect.render
    ColorModeSelect = ClassVariants.build(
      base: ""
    )
  end
end
