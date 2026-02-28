module Kiso
  module Themes
    # shadcn toggleVariants:
    #   base: inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium
    #         hover:bg-muted hover:text-muted-foreground
    #         disabled:pointer-events-none disabled:opacity-50
    #         data-[state=on]:bg-accent data-[state=on]:text-accent-foreground
    #         [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0
    #         focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
    #         outline-none transition-[color,box-shadow] whitespace-nowrap
    #   variant default: bg-transparent
    #   variant outline: border border-input bg-transparent shadow-xs
    #                    hover:bg-accent hover:text-accent-foreground
    #   size default: h-9 px-2 min-w-9
    #   size sm: h-8 px-1.5 min-w-8
    #   size lg: h-10 px-2.5 min-w-10
    #
    # Kiso adaptations:
    #   - bg-accent/text-accent-foreground -> bg-muted/text-foreground (semantic tokens)
    #   - border -> ring ring-inset ring-border (Kiso convention)
    #   - data-[state=on] for pressed state
    #   - text-foreground on root for dark mode

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

    # ToggleGroupItem extends Toggle base with group-specific overrides.
    # shadcn ToggleGroupItem adds:
    #   w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10
    #   data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none
    #   data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md
    #   data-[spacing=0]:data-[variant=outline]:border-l-0
    #   data-[spacing=0]:data-[variant=outline]:first:border-l
    #
    # Kiso: uses ring instead of border for outline variant, so the
    # border-l-0/first:border-l rules adapt to ring-based approach.
    # Default spacing is 0 (items flush), so joined pill appearance is
    # applied directly: rounded-none + first/last rounding.

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
