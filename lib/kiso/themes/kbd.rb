module Kiso
  module Themes
    # Keyboard shortcut indicator (e.g. +Ctrl+K+, +Cmd+S+).
    #
    # @example
    #   Kbd.render(size: :md)
    #
    # Variants:
    # - +size+ — :sm, :md (default), :lg
    #
    # Sub-parts: {KbdGroup}
    Kbd = ClassVariants.build(
      base: "bg-muted text-foreground pointer-events-none inline-flex items-center " \
            "justify-center gap-1 rounded-sm font-sans font-medium select-none " \
            "[&_svg:not([class*='size-'])]:size-3",
      variants: {
        size: {
          sm: "h-4 min-w-4 px-0.5 text-xs",
          md: "h-5 min-w-5 px-1 text-xs",
          lg: "h-6 min-w-6 px-1.5 text-xs"
        }
      },
      defaults: {size: :md}
    )

    # Inline container for multiple {Kbd} elements (e.g. +Ctrl+ + +K+).
    KbdGroup = ClassVariants.build(
      base: "inline-flex items-center gap-1"
    )
  end
end
