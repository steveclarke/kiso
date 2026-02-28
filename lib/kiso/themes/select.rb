module Kiso
  module Themes
    # Native-like select dropdown with custom styling and keyboard navigation.
    #
    # @example
    #   Select.render
    #
    # Sub-parts: {SelectTrigger}, {SelectValue}, {SelectContent}, {SelectGroup},
    # {SelectLabel}, {SelectItem}, {SelectItemIndicator}, {SelectSeparator}
    Select = ClassVariants.build(
      base: "relative text-foreground"
    )

    # Button that displays the selected value and opens the dropdown.
    #
    # Variants:
    # - +size+ — :sm, :md (default)
    SelectTrigger = ClassVariants.build(
      base: "text-foreground flex w-full items-center justify-between gap-2 rounded-md " \
            "bg-background px-3 py-2 text-sm whitespace-nowrap shadow-xs " \
            "ring ring-inset ring-accented " \
            "outline-none transition-[color,box-shadow] " \
            "focus-visible:ring-2 focus-visible:ring-primary " \
            "aria-invalid:ring-error aria-invalid:focus-visible:ring-error " \
            "disabled:cursor-not-allowed disabled:opacity-50 " \
            "#{Shared::SVG_BASE} " \
            "[&_svg:not([class*='text-'])]:text-muted-foreground",
      variants: {
        size: {
          sm: "h-8",
          md: "h-9"
        }
      },
      defaults: {size: :md}
    )

    # Display area for the currently selected value inside {SelectTrigger}.
    SelectValue = ClassVariants.build(
      base: "line-clamp-1 flex items-center gap-2"
    )

    # Dropdown panel containing the selectable items.
    SelectContent = ClassVariants.build(
      base: "relative bg-background text-foreground z-50 max-h-60 min-w-32 " \
            "overflow-x-hidden overflow-y-auto rounded-md shadow-md ring ring-inset ring-border p-1"
    )

    # Semantic grouping wrapper for related select items.
    SelectGroup = ClassVariants.build(
      base: ""
    )

    # Non-interactive heading for a {SelectGroup}.
    SelectLabel = ClassVariants.build(
      base: Shared::MENU_LABEL
    )

    # Selectable option within the dropdown.
    SelectItem = ClassVariants.build(
      base: "relative flex w-full cursor-default items-center gap-2 rounded-sm " \
            "py-1.5 pr-8 pl-2 text-sm outline-none select-none " \
            "data-[highlighted]:bg-elevated data-[highlighted]:text-foreground " \
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 " \
            "#{Shared::SVG_BASE} " \
            "[&_svg:not([class*='text-'])]:text-muted-foreground"
    )

    # Check mark indicator shown on the selected item.
    SelectItemIndicator = ClassVariants.build(
      base: "absolute right-2 flex size-3.5 items-center justify-center"
    )

    # Horizontal divider between select items or groups.
    SelectSeparator = ClassVariants.build(
      base: "bg-border pointer-events-none -mx-1 my-1 h-px"
    )
  end
end
