module Kiso
  module Themes
    # Two-state toggle button (on/off). Uses +data-[state=on]+ for the
    # pressed state.
    #
    # @example
    #   Toggle.render(variant: :default, size: :default)
    #
    # Variants:
    # - +variant+ — :default, :outline
    # - +size+ — :sm, :default, :lg
    #
    # See also: {ToggleGroup} for grouped toggle buttons, {ToggleGroupItem}
    # for items within a group.
    Toggle = ClassVariants.build(
      base: "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium text-foreground " \
            "bg-transparent " \
            "hover:bg-muted hover:text-muted-foreground " \
            "disabled:pointer-events-none disabled:opacity-50 " \
            "data-[state=on]:bg-muted data-[state=on]:text-foreground " \
            "#{Shared::SVG_BASE} " \
            "focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none " \
            "transition-[color,box-shadow] " \
            "whitespace-nowrap",
      variants: {
        variant: {
          default: "",
          outline: "ring ring-inset ring-border shadow-xs"
        },
        size: {
          sm: "h-8 px-1.5 min-w-8",
          default: "h-9 px-2 min-w-9",
          lg: "h-10 px-2.5 min-w-10"
        }
      },
      defaults: {variant: :default, size: :default}
    )

    # Individual item within a {ToggleGroup}. Renders flush (no gap) with
    # rounded corners on the first and last items for a joined pill appearance.
    #
    # Variants:
    # - +variant+ — :default, :outline
    # - +size+ — :sm, :default, :lg
    ToggleGroupItem = ClassVariants.build(
      base: "inline-flex items-center justify-center gap-2 text-sm font-medium text-foreground " \
            "bg-transparent min-w-0 " \
            "rounded-none first:rounded-l-md last:rounded-r-md " \
            "hover:bg-muted hover:text-muted-foreground " \
            "disabled:pointer-events-none disabled:opacity-50 " \
            "data-[state=on]:bg-muted data-[state=on]:text-foreground " \
            "#{Shared::SVG_BASE} " \
            "focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none " \
            "transition-[color,box-shadow] " \
            "whitespace-nowrap " \
            "shrink-0 focus:z-10 focus-visible:z-10",
      variants: {
        variant: {
          default: "",
          outline: "border border-border shadow-xs -ml-px first:ml-0"
        },
        size: {
          sm: "h-8 px-3",
          default: "h-9 px-3",
          lg: "h-10 px-3"
        }
      },
      defaults: {variant: :default, size: :default}
    )
  end
end
