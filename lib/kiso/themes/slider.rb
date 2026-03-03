module Kiso
  module Themes
    # Range slider with track, filled range, and draggable thumb.
    #
    # @example
    #   Slider.render(size: :md)
    #
    # Variants:
    # - +size+ — :sm, :md (default), :lg
    #
    # Sub-parts: {SliderTrack}, {SliderRange}, {SliderThumb}
    #
    # shadcn base: relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50
    Slider = ClassVariants.build(
      base: "relative flex w-full touch-none items-center select-none"
    )

    # shadcn: relative grow overflow-hidden rounded-full bg-muted h-1.5 w-full
    SliderTrack = ClassVariants.build(
      base: "relative grow cursor-pointer overflow-hidden rounded-full bg-muted w-full",
      variants: {
        size: {
          sm: "h-1",
          md: "h-1.5",
          lg: "h-2"
        }
      },
      defaults: {size: :md}
    )

    # shadcn: absolute h-full bg-primary
    SliderRange = ClassVariants.build(
      base: "absolute h-full bg-primary"
    )

    # shadcn: block size-4 shrink-0 rounded-full border border-primary bg-white shadow-sm
    #         ring-ring/50 transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4
    #         focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50
    SliderThumb = ClassVariants.build(
      base: "block shrink-0 rounded-full border border-primary bg-white shadow-sm " \
            "ring-ring/50 transition-[color,box-shadow] hover:ring-4 " \
            "focus-visible:ring-4 focus-visible:outline-hidden",
      variants: {
        size: {
          sm: "size-3",
          md: "size-4",
          lg: "size-5"
        }
      },
      defaults: {size: :md}
    )
  end
end
