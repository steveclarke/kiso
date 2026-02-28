module Kiso
  module Themes
    # Floating panel anchored to a trigger element.
    #
    # @example
    #   PopoverContent.render
    #
    # Sub-parts: {PopoverContent}, {PopoverHeader}, {PopoverTitle},
    # {PopoverDescription}

    # The floating panel itself. Positioned via the Popover Stimulus controller.
    PopoverContent = ClassVariants.build(
      base: "bg-background text-foreground z-50 w-72 rounded-md " \
            "ring ring-inset ring-border p-4 shadow-md outline-hidden"
    )

    # Header section with title and description.
    PopoverHeader = ClassVariants.build(
      base: "flex flex-col gap-1 text-sm"
    )

    # Popover heading text.
    PopoverTitle = ClassVariants.build(
      base: "font-medium"
    )

    # Popover body text.
    PopoverDescription = ClassVariants.build(
      base: "text-muted-foreground"
    )
  end
end
