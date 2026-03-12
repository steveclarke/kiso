module Kiso
  module Themes
    # Floating tooltip content panel with inverted colors.
    #
    # @example
    #   TooltipContent.render
    #
    # No variants — tooltip always uses inverted colors. Inherits position
    # from Floating UI via the Stimulus controller.
    #
    # shadcn base: bg-foreground text-background px-3 py-1.5 text-xs rounded-md
    # Kiso: bg-inverted text-inverted-foreground (semantic equivalents)
    TooltipContent = ClassVariants.build(
      base: "bg-inverted text-inverted-foreground px-3 py-1.5 text-xs rounded-md " \
            "flex items-center gap-1.5 select-none w-max max-w-xs overflow-hidden"
    )

    # Arrow element pointing from tooltip content to the trigger.
    #
    # Positioned by Floating UI arrow middleware. CSS rotates 45° to form
    # a diamond, with half hidden behind the tooltip edge.
    TooltipArrow = ClassVariants.build(
      base: "absolute size-2 rotate-45 bg-inverted"
    )
  end
end
