module Kiso
  module Themes
    # Root wrapper — just provides relative positioning for the dropdown
    DropdownMenu = ClassVariants.build(
      base: "relative inline-block text-foreground"
    )

    # shadcn: (no specific classes on trigger — it wraps the child button as-is)
    DropdownMenuTrigger = ClassVariants.build(
      base: "inline-flex"
    )

    # shadcn: bg-popover text-popover-foreground z-50 max-h-(--radix-dropdown-menu-content-available-height)
    #   min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin)
    #   overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md
    #   data-[state=open]:animate-in data-[state=closed]:animate-out ...
    DropdownMenuContent = ClassVariants.build(
      base: "bg-background text-foreground z-50 min-w-32 max-h-80 " \
            "overflow-x-hidden overflow-y-auto rounded-md ring ring-inset ring-border p-1 shadow-md"
    )

    # shadcn: focus:bg-accent focus:text-accent-foreground
    #   data-[variant=destructive]:text-destructive
    #   data-[variant=destructive]:focus:bg-destructive/10
    #   data-[variant=destructive]:focus:text-destructive
    #   [&_svg:not([class*='text-'])]:text-muted-foreground
    #   relative flex cursor-default items-center gap-2 rounded-sm
    #   px-2 py-1.5 text-sm outline-hidden select-none
    #   data-[disabled]:pointer-events-none data-[disabled]:opacity-50
    #   data-[inset]:pl-8
    #   [&_svg]:pointer-events-none [&_svg]:shrink-0
    #   [&_svg:not([class*='size-'])]:size-4
    DropdownMenuItem = ClassVariants.build(
      base: "relative flex cursor-default items-center gap-2 rounded-sm " \
            "px-2 py-1.5 text-sm outline-none select-none " \
            "data-[highlighted]:bg-elevated data-[highlighted]:text-foreground " \
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 " \
            "data-[inset]:pl-8 " \
            "[&_svg]:pointer-events-none [&_svg]:shrink-0 " \
            "[&_svg:not([class*='size-'])]:size-4 " \
            "[&_svg:not([class*='text-'])]:text-muted-foreground",
      variants: {
        variant: {
          default: "",
          destructive: "text-error data-[highlighted]:bg-error/10 data-[highlighted]:text-error " \
                       "[&_svg:not([class*='text-'])]:text-error"
        }
      },
      defaults: {variant: :default}
    )

    # shadcn: focus:bg-accent focus:text-accent-foreground
    #   relative flex cursor-default items-center gap-2 rounded-sm
    #   py-1.5 pr-2 pl-8 text-sm outline-hidden select-none
    #   data-[disabled]:pointer-events-none data-[disabled]:opacity-50
    #   [&_svg]:pointer-events-none [&_svg]:shrink-0
    #   [&_svg:not([class*='size-'])]:size-4
    DropdownMenuCheckboxItem = ClassVariants.build(
      base: "relative flex cursor-default items-center gap-2 rounded-sm " \
            "py-1.5 pr-2 pl-8 text-sm outline-none select-none " \
            "data-[highlighted]:bg-elevated data-[highlighted]:text-foreground " \
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 " \
            "[&_svg]:pointer-events-none [&_svg]:shrink-0 " \
            "[&_svg:not([class*='size-'])]:size-4"
    )

    # shadcn: (no specific classes — just a wrapper div for grouping radio items)
    DropdownMenuRadioGroup = ClassVariants.build(
      base: ""
    )

    # shadcn: focus:bg-accent focus:text-accent-foreground
    #   relative flex cursor-default items-center gap-2 rounded-sm
    #   py-1.5 pr-2 pl-8 text-sm outline-hidden select-none
    #   data-[disabled]:pointer-events-none data-[disabled]:opacity-50
    #   [&_svg]:pointer-events-none [&_svg]:shrink-0
    #   [&_svg:not([class*='size-'])]:size-4
    DropdownMenuRadioItem = ClassVariants.build(
      base: "relative flex cursor-default items-center gap-2 rounded-sm " \
            "py-1.5 pr-2 pl-8 text-sm outline-none select-none " \
            "data-[highlighted]:bg-elevated data-[highlighted]:text-foreground " \
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 " \
            "[&_svg]:pointer-events-none [&_svg]:shrink-0 " \
            "[&_svg:not([class*='size-'])]:size-4"
    )

    # shadcn: px-2 py-1.5 text-sm font-medium data-[inset]:pl-8
    DropdownMenuLabel = ClassVariants.build(
      base: "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8"
    )

    # shadcn: bg-border -mx-1 my-1 h-px
    DropdownMenuSeparator = ClassVariants.build(
      base: "bg-border -mx-1 my-1 h-px"
    )

    # shadcn: text-muted-foreground ml-auto text-xs tracking-widest
    DropdownMenuShortcut = ClassVariants.build(
      base: "text-muted-foreground ml-auto text-xs tracking-widest"
    )

    # shadcn: (no specific classes — semantic grouping wrapper)
    DropdownMenuGroup = ClassVariants.build(
      base: ""
    )

    # shadcn: (no specific classes — wrapper for sub-menu trigger + content)
    DropdownMenuSub = ClassVariants.build(
      base: "relative"
    )

    # shadcn: focus:bg-accent focus:text-accent-foreground
    #   data-[state=open]:bg-accent data-[state=open]:text-accent-foreground
    #   [&_svg:not([class*='text-'])]:text-muted-foreground
    #   flex cursor-default items-center gap-2 rounded-sm
    #   px-2 py-1.5 text-sm outline-hidden select-none
    #   data-[inset]:pl-8
    #   [&_svg]:pointer-events-none [&_svg]:shrink-0
    #   [&_svg:not([class*='size-'])]:size-4
    DropdownMenuSubTrigger = ClassVariants.build(
      base: "flex cursor-default items-center gap-2 rounded-sm " \
            "px-2 py-1.5 text-sm outline-none select-none " \
            "data-[highlighted]:bg-elevated data-[highlighted]:text-foreground " \
            "data-[state=open]:bg-elevated data-[state=open]:text-foreground " \
            "data-[inset]:pl-8 " \
            "[&_svg]:pointer-events-none [&_svg]:shrink-0 " \
            "[&_svg:not([class*='size-'])]:size-4 " \
            "[&_svg:not([class*='text-'])]:text-muted-foreground"
    )

    # shadcn: same as Content but shadow-lg instead of shadow-md
    DropdownMenuSubContent = ClassVariants.build(
      base: "bg-background text-foreground z-50 min-w-32 " \
            "overflow-hidden rounded-md ring ring-inset ring-border p-1 shadow-lg"
    )
  end
end
