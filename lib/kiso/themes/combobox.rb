module Kiso
  module Themes
    # Combobox root — just a wrapper with relative positioning for the dropdown.
    # No visible styling — structure only.
    Combobox = ClassVariants.build(
      base: "relative text-foreground"
    )

    # shadcn ComboboxInput wraps InputGroup + Input + trigger button.
    # We replicate the InputGroup pattern with an embedded text input.
    # shadcn: InputGroup w-auto + InputGroupInput + InputGroupAddon inline-end
    ComboboxInput = ClassVariants.build(
      base: "text-foreground flex w-full items-center rounded-md " \
            "bg-background ring ring-inset ring-accented shadow-xs " \
            "h-9 min-w-0 " \
            "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-primary " \
            "has-[[aria-invalid]]:ring-error " \
            "[&_input]:flex-1 [&_input]:rounded-none [&_input]:border-0 [&_input]:shadow-none " \
            "[&_input]:ring-0 [&_input]:bg-transparent [&_input]:focus-visible:ring-0 " \
            "[&_input]:h-full [&_input]:px-3 [&_input]:py-1 [&_input]:text-base [&_input]:md:text-sm " \
            "[&_input]:outline-none [&_input]:placeholder:text-muted-foreground " \
            "[&_input]:disabled:cursor-not-allowed [&_input]:disabled:opacity-50"
    )

    # shadcn ComboboxContent:
    #   bg-popover text-popover-foreground ... ring-foreground/10 ... relative max-h-96
    #   min-w-[calc(var(--anchor-width)+--spacing(7))] ... rounded-md shadow-md ring-1
    ComboboxContent = ClassVariants.build(
      base: "bg-background text-foreground z-50 max-h-96 min-w-32 " \
            "overflow-hidden rounded-md shadow-md ring ring-inset ring-border"
    )

    # shadcn ComboboxList:
    #   max-h-[min(calc(--spacing(96)---spacing(9)),calc(var(--available-height)---spacing(9)))]
    #   scroll-py-1 overflow-y-auto p-1 data-empty:p-0
    ComboboxList = ClassVariants.build(
      base: "scroll-py-1 overflow-y-auto p-1"
    )

    # shadcn ComboboxItem:
    #   data-highlighted:bg-accent data-highlighted:text-accent-foreground
    #   relative flex w-full cursor-default items-center gap-2 rounded-sm
    #   py-1.5 pr-8 pl-2 text-sm outline-hidden select-none
    #   data-[disabled]:pointer-events-none data-[disabled]:opacity-50
    #   [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4
    ComboboxItem = ClassVariants.build(
      base: "relative flex w-full cursor-default items-center gap-2 rounded-sm " \
            "py-1.5 pr-8 pl-2 text-sm outline-none select-none " \
            "data-[highlighted]:bg-elevated data-[highlighted]:text-foreground " \
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 " \
            "#{Shared::SVG_BASE}"
    )

    # shadcn ComboboxItemIndicator:
    #   pointer-events-none absolute right-2 flex size-4 items-center justify-center
    ComboboxItemIndicator = ClassVariants.build(
      base: "pointer-events-none absolute right-2 flex size-4 items-center justify-center"
    )

    # shadcn ComboboxGroup: (no specific classes)
    ComboboxGroup = ClassVariants.build(
      base: ""
    )

    # shadcn ComboboxLabel:
    #   text-muted-foreground px-2 py-1.5 text-xs
    ComboboxLabel = ClassVariants.build(
      base: Shared::MENU_LABEL
    )

    # shadcn ComboboxEmpty:
    #   text-muted-foreground hidden w-full justify-center py-2 text-center text-sm
    ComboboxEmpty = ClassVariants.build(
      base: "text-muted-foreground flex w-full justify-center py-2 text-center text-sm"
    )

    # shadcn ComboboxSeparator:
    #   bg-border -mx-1 my-1 h-px
    ComboboxSeparator = ClassVariants.build(
      base: Shared::ITEM_SEPARATOR
    )

    # shadcn ComboboxChips:
    #   border-input focus-within:border-ring focus-within:ring-ring/50
    #   flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border
    #   bg-transparent bg-clip-padding px-2.5 py-1.5 text-sm shadow-xs
    #   transition-[color,box-shadow] focus-within:ring-[3px]
    ComboboxChips = ClassVariants.build(
      base: "text-foreground flex min-h-9 flex-wrap items-center gap-1.5 rounded-md " \
            "bg-background ring ring-inset ring-accented shadow-xs " \
            "px-2.5 py-1.5 text-sm transition-[color,box-shadow] " \
            "focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary " \
            "has-[[aria-invalid]]:ring-error"
    )

    # shadcn ComboboxChip:
    #   bg-muted text-foreground flex h-[calc(--spacing(5.5))] w-fit items-center
    #   justify-center gap-1 rounded-sm px-1.5 text-xs font-medium whitespace-nowrap
    ComboboxChip = ClassVariants.build(
      base: "bg-muted text-foreground flex h-5.5 w-fit items-center " \
            "justify-center gap-1 rounded-sm px-1.5 text-xs font-medium whitespace-nowrap"
    )

    # shadcn ComboboxChipsInput:
    #   min-w-16 flex-1 outline-none
    ComboboxChipsInput = ClassVariants.build(
      base: "min-w-16 flex-1 bg-transparent outline-none text-base md:text-sm " \
            "placeholder:text-muted-foreground " \
            "disabled:cursor-not-allowed disabled:opacity-50"
    )
  end
end
