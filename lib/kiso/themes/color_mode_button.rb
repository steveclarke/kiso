module Kiso
  module Themes
    # Light/dark mode toggle button with sun and moon icons.
    #
    # Uses the +kiso--theme+ Stimulus controller to cycle between
    # light and dark modes. Icon visibility is controlled via CSS
    # (see +color-mode-button.css+).
    #
    # @example
    #   ColorModeButton.render(size: :md)
    #
    # Variants:
    # - +size+ -- :sm, :md (default), :lg
    ColorModeButton = ClassVariants.build(
      base: "inline-flex items-center justify-center rounded-md text-foreground/50 hover:text-foreground hover:bg-accent transition-colors duration-150 shrink-0 cursor-pointer",
      variants: {
        size: {
          sm: "w-7 h-7 [&>svg]:size-3.5",
          md: "w-8 h-8 [&>svg]:size-4",
          lg: "w-9 h-9 [&>svg]:size-5"
        }
      },
      defaults: {size: :md}
    )
  end
end
