module Kiso
  module Themes
    Select = ClassVariants.build(
      base: "relative text-foreground"
    )

    # shadcn SelectTrigger:
    #   border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground
    #   focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20
    #   dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30
    #   dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border
    #   bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow]
    #   outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50
    #   data-[size=default]:h-9 data-[size=sm]:h-8
    #   *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex
    #   *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2
    #   [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4
    SelectTrigger = ClassVariants.build(
      base: "text-foreground flex w-full items-center justify-between gap-2 rounded-md " \
            "bg-background px-3 py-2 text-sm whitespace-nowrap shadow-xs " \
            "ring ring-inset ring-accented " \
            "outline-none transition-[color,box-shadow] " \
            "focus-visible:ring-2 focus-visible:ring-primary " \
            "aria-invalid:ring-error aria-invalid:focus-visible:ring-error " \
            "disabled:cursor-not-allowed disabled:opacity-50 " \
            "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 " \
            "[&_svg:not([class*='text-'])]:text-muted-foreground",
      variants: {
        size: {
          sm: "h-8",
          md: "h-9"
        }
      },
      defaults: {size: :md}
    )

    # shadcn SelectValue: data-[placeholder]:text-muted-foreground
    #   *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex
    #   *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2
    SelectValue = ClassVariants.build(
      base: "line-clamp-1 flex items-center gap-2"
    )

    # shadcn SelectContent:
    #   bg-popover text-popover-foreground relative z-50 max-h-(--radix-select-content-available-height)
    #   min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border shadow-md p-1
    SelectContent = ClassVariants.build(
      base: "relative bg-background text-foreground z-50 max-h-60 min-w-32 " \
            "overflow-x-hidden overflow-y-auto rounded-md shadow-md ring ring-inset ring-border p-1"
    )

    # shadcn SelectGroup: (no specific classes, just a wrapper)
    SelectGroup = ClassVariants.build(
      base: ""
    )

    # shadcn SelectLabel: text-muted-foreground px-2 py-1.5 text-xs
    SelectLabel = ClassVariants.build(
      base: Shared::MENU_LABEL
    )

    # shadcn SelectItem:
    #   focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default
    #   items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none
    #   data-[disabled]:pointer-events-none data-[disabled]:opacity-50
    #   [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4
    SelectItem = ClassVariants.build(
      base: "relative flex w-full cursor-default items-center gap-2 rounded-sm " \
            "py-1.5 pr-8 pl-2 text-sm outline-none select-none " \
            "data-[highlighted]:bg-elevated data-[highlighted]:text-foreground " \
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 " \
            "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 " \
            "[&_svg:not([class*='text-'])]:text-muted-foreground"
    )

    # shadcn SelectItemIndicator:
    #   absolute right-2 flex size-3.5 items-center justify-center
    SelectItemIndicator = ClassVariants.build(
      base: "absolute right-2 flex size-3.5 items-center justify-center"
    )

    # shadcn SelectSeparator: bg-border pointer-events-none -mx-1 my-1 h-px
    SelectSeparator = ClassVariants.build(
      base: "bg-border pointer-events-none -mx-1 my-1 h-px"
    )
  end
end
