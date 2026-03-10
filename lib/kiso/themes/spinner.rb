module Kiso
  module Themes
    # Spinning loading indicator.
    #
    # @example
    #   Spinner.render
    #
    # No variants — size is controlled via +css_classes:+. Inherits
    # +currentColor+ from the parent context.
    #
    # shadcn base: size-4 animate-spin
    Spinner = ClassVariants.build(
      base: "animate-spin size-4"
    )
  end
end
