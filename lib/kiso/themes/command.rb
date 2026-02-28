module Kiso
  module Themes
    # shadcn Command: bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md
    Command = ClassVariants.build(
      base: "bg-background text-foreground flex h-full w-full flex-col overflow-hidden rounded-md"
    )

    # shadcn CommandInput wrapper: flex h-9 items-center gap-2 border-b px-3
    CommandInputWrapper = ClassVariants.build(
      base: "flex h-9 items-center gap-2 border-b border-border px-3"
    )

    # shadcn CommandInput (input element):
    #   placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent
    #   py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50
    CommandInput = ClassVariants.build(
      base: "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent " \
            "py-3 text-sm outline-none " \
            "disabled:cursor-not-allowed disabled:opacity-50"
    )

    # shadcn CommandList: max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto
    CommandList = ClassVariants.build(
      base: "max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto"
    )

    # shadcn CommandEmpty: py-6 text-center text-sm
    CommandEmpty = ClassVariants.build(
      base: "py-6 text-center text-sm"
    )

    # shadcn CommandGroup:
    #   text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1
    #   [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5
    #   [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium
    CommandGroup = ClassVariants.build(
      base: "text-foreground overflow-hidden p-1"
    )

    # Group heading: text-muted-foreground px-2 py-1.5 text-xs font-medium
    CommandGroupHeading = ClassVariants.build(
      base: "text-muted-foreground px-2 py-1.5 text-xs font-medium"
    )

    # shadcn CommandItem:
    #   data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground
    #   [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default
    #   items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none
    #   data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50
    #   [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4
    CommandItem = ClassVariants.build(
      base: "data-[selected=true]:bg-elevated data-[selected=true]:text-foreground " \
            "[&_svg:not([class*='text-'])]:text-muted-foreground " \
            "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm " \
            "outline-none select-none " \
            "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 " \
            "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
    )

    # shadcn CommandSeparator: bg-border -mx-1 h-px
    CommandSeparator = ClassVariants.build(
      base: "bg-border -mx-1 h-px"
    )

    # shadcn CommandShortcut: text-muted-foreground ml-auto text-xs tracking-widest
    CommandShortcut = ClassVariants.build(
      base: "text-muted-foreground ml-auto text-xs tracking-widest"
    )
  end
end
