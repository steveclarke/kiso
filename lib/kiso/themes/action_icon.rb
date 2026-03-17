module Kiso
  module Themes
    # Inline icon-only action trigger for table cells, card headers,
    # and text rows.
    #
    # Quiet by default — muted foreground that brightens on hover with
    # a subtle background. No fixed height; flows inline with
    # surrounding text.
    #
    # @example
    #   ActionIcon.render(size: :sm)
    #
    # Variants:
    # - +size+ — :xs, :sm (default), :md
    #
    # shadcn base: n/a (no shadcn equivalent — inspired by Mantine ActionIcon
    # and Outport's appui(:icon_action))
    ActionIcon = ClassVariants.build(
      base: "inline-flex items-center justify-center " \
            "text-muted-foreground hover:text-foreground " \
            "hover:bg-accent rounded-md " \
            "cursor-pointer transition-colors duration-150 " \
            "disabled:pointer-events-none disabled:opacity-50 " \
            "aria-disabled:cursor-not-allowed aria-disabled:opacity-50 " \
            "focus-visible:outline-2 focus-visible:outline-offset-2 " \
            "focus-visible:outline-inverted " \
            "#{Shared::SVG_BASE}",
      variants: {
        size: {
          xs: "p-0.5 [&_svg:not([class*='size-'])]:size-3",
          sm: "p-1 [&_svg:not([class*='size-'])]:size-3.5",
          md: "p-1.5 [&_svg:not([class*='size-'])]:size-4"
        }
      },
      defaults: {size: :sm}
    )
  end
end
