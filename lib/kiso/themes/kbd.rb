module Kiso
  module Themes
    # shadcn Kbd:
    #   bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5
    #   items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium select-none
    #   [&_svg:not([class*='size-'])]:size-3
    Kbd = ClassVariants.build(
      base: "bg-muted text-muted-foreground pointer-events-none inline-flex items-center " \
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

    # shadcn KbdGroup: inline-flex items-center gap-1
    KbdGroup = ClassVariants.build(
      base: "inline-flex items-center gap-1"
    )
  end
end
