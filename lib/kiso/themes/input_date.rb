module Kiso
  module Themes
    # Segmented date input — wrapper styled like a standard input.
    #
    # @example
    #   InputDate.render(variant: :outline, size: :md)
    #
    # Variants:
    # - +variant+ — :outline (default), :soft, :ghost
    # - +size+ — :sm, :md (default), :lg
    InputDate = ClassVariants.build(
      base: "text-foreground inline-flex items-center rounded-md select-none " \
            "transition-[color,box-shadow] " \
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " \
            "focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary",
      variants: {
        variant: {
          outline: "bg-background ring ring-inset ring-accented shadow-xs",
          soft: "bg-elevated/50",
          ghost: "bg-transparent"
        },
        size: {
          sm: "h-8 px-2.5 gap-0.5 text-sm",
          md: "h-9 px-3 gap-0.5 text-base md:text-sm",
          lg: "h-10 px-3 gap-0.5 text-base"
        }
      },
      defaults: {variant: :outline, size: :md}
    )

    # Individual segment within the date input (day, month, year).
    #
    # @example
    #   InputDateSegment.render(size: :md)
    InputDateSegment = ClassVariants.build(
      base: "rounded text-center outline-hidden tabular-nums " \
            "data-[placeholder]:text-muted-foreground " \
            "focus:bg-primary focus:text-primary-foreground",
      variants: {
        size: {
          sm: "py-0.5 text-sm",
          md: "py-0.5 text-base md:text-sm",
          lg: "py-1 text-base"
        }
      },
      defaults: {size: :md}
    )

    # Separator between date segments (e.g., "/").
    #
    # @example
    #   InputDateSeparator.render
    InputDateSeparator = ClassVariants.build(
      base: "text-muted-foreground select-none",
      variants: {},
      defaults: {}
    )
  end
end
