module Kiso
  module Themes
    # Container for a set of mutually exclusive {ToggleGroupItem} buttons.
    #
    # @example
    #   ToggleGroup.render
    #
    # Sub-parts: {ToggleGroupItem}
    ToggleGroup = ClassVariants.build(
      base: "flex w-fit items-center rounded-md text-foreground"
    )
  end
end
