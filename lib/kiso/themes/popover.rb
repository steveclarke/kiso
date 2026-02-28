module Kiso
  module Themes
    # shadcn Popover: (root wrapper — no classes, just data-slot)

    # shadcn PopoverContent:
    #   bg-popover text-popover-foreground
    #   data-[state=open]:animate-in data-[state=closed]:animate-out
    #   data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
    #   data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
    #   data-[side=bottom]:slide-in-from-top-2
    #   data-[side=left]:slide-in-from-right-2
    #   data-[side=right]:slide-in-from-left-2
    #   data-[side=top]:slide-in-from-bottom-2
    #   z-50 w-72
    #   origin-(--radix-popover-content-transform-origin)
    #   rounded-md border p-4 shadow-md outline-hidden
    PopoverContent = ClassVariants.build(
      base: "bg-background text-foreground z-50 w-72 rounded-md " \
            "ring ring-inset ring-border p-4 shadow-md outline-hidden"
    )

    # shadcn PopoverHeader: flex flex-col gap-1 text-sm
    PopoverHeader = ClassVariants.build(
      base: "flex flex-col gap-1 text-sm"
    )

    # shadcn PopoverTitle: font-medium
    PopoverTitle = ClassVariants.build(
      base: "font-medium"
    )

    # shadcn PopoverDescription: text-muted-foreground
    PopoverDescription = ClassVariants.build(
      base: "text-muted-foreground"
    )
  end
end
