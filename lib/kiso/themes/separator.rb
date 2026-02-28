module Kiso
  module Themes
    # Visual divider between content sections.
    #
    # @example
    #   Separator.render(orientation: :horizontal)
    #
    # Variants:
    # - +orientation+ — :horizontal (default), :vertical
    #
    # shadcn base: bg-border shrink-0
    Separator = ClassVariants.build(
      base: "bg-border shrink-0",
      variants: {
        orientation: {
          horizontal: "h-px w-full",
          vertical: "h-full w-px"
        }
      },
      defaults: {orientation: :horizontal}
    )
  end
end
