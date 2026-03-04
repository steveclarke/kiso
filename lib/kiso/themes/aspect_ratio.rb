module Kiso
  module Themes
    # Displays content within a desired width-to-height ratio.
    #
    # @example
    #   AspectRatio.render
    #
    # No variants — purely structural. The ratio is set via inline style
    # on the partial (`aspect-ratio: <ratio>`).
    #
    # shadcn: Radix AspectRatio primitive with data-slot="aspect-ratio"
    AspectRatio = ClassVariants.build(
      base: "relative w-full"
    )
  end
end
