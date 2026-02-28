module Kiso
  module Themes
    # Context menu or action menu triggered by a button click.
    #
    # @example
    #   DropdownMenu.render
    #
    # Sub-parts: {DropdownMenuTrigger}, {DropdownMenuContent}, {DropdownMenuItem},
    # {DropdownMenuCheckboxItem}, {DropdownMenuRadioGroup}, {DropdownMenuRadioItem},
    # {DropdownMenuLabel}, {DropdownMenuSeparator}, {DropdownMenuShortcut},
    # {DropdownMenuGroup}, {DropdownMenuSub}, {DropdownMenuSubTrigger},
    # {DropdownMenuSubContent}
    DropdownMenu = ClassVariants.build(
      base: "relative inline-block text-foreground"
    )

    # Wrapper for the button that opens the menu.
    DropdownMenuTrigger = ClassVariants.build(
      base: "inline-flex"
    )

    # The dropdown panel containing menu items.
    DropdownMenuContent = ClassVariants.build(
      base: "bg-background text-foreground z-50 min-w-32 " \
            "overflow-x-hidden overflow-y-auto rounded-md ring ring-inset ring-border p-1 shadow-md"
    )

    # Clickable menu action. Supports a +destructive+ variant for
    # dangerous actions (delete, remove, etc.).
    #
    # Variants:
    # - +variant+ — :default, :destructive
    DropdownMenuItem = ClassVariants.build(
      base: "relative flex cursor-default items-center gap-2 rounded-sm " \
            "px-2 py-1.5 text-sm outline-none select-none " \
            "data-[highlighted]:bg-elevated data-[highlighted]:text-foreground " \
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 " \
            "data-[inset]:pl-8 " \
            "#{Shared::SVG_BASE} " \
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

    # Menu item with a checkbox indicator. Uses {Shared::CHECKABLE_ITEM} base.
    DropdownMenuCheckboxItem = ClassVariants.build(
      base: Shared::CHECKABLE_ITEM
    )

    # Wrapper for a set of mutually exclusive {DropdownMenuRadioItem} elements.
    DropdownMenuRadioGroup = ClassVariants.build(
      base: ""
    )

    # Menu item with a radio indicator. Uses {Shared::CHECKABLE_ITEM} base.
    DropdownMenuRadioItem = ClassVariants.build(
      base: Shared::CHECKABLE_ITEM
    )

    # Non-interactive heading within the menu.
    DropdownMenuLabel = ClassVariants.build(
      base: "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8"
    )

    # Horizontal divider between menu sections.
    DropdownMenuSeparator = ClassVariants.build(
      base: Shared::ITEM_SEPARATOR
    )

    # Keyboard shortcut hint on the right side of a {DropdownMenuItem}.
    DropdownMenuShortcut = ClassVariants.build(
      base: Shared::MENU_SHORTCUT
    )

    # Semantic grouping wrapper for related menu items.
    DropdownMenuGroup = ClassVariants.build(
      base: ""
    )

    # Wrapper for a nested sub-menu (trigger + content pair).
    DropdownMenuSub = ClassVariants.build(
      base: "relative"
    )

    # Menu item that opens a nested {DropdownMenuSubContent} on hover.
    DropdownMenuSubTrigger = ClassVariants.build(
      base: "flex cursor-default items-center gap-2 rounded-sm " \
            "px-2 py-1.5 text-sm outline-none select-none " \
            "data-[highlighted]:bg-elevated data-[highlighted]:text-foreground " \
            "data-[state=open]:bg-elevated data-[state=open]:text-foreground " \
            "data-[inset]:pl-8 " \
            "#{Shared::SVG_BASE} " \
            "[&_svg:not([class*='text-'])]:text-muted-foreground"
    )

    # Panel for nested sub-menu items (same as {DropdownMenuContent} but +shadow-lg+).
    DropdownMenuSubContent = ClassVariants.build(
      base: "bg-background text-foreground z-50 min-w-32 " \
            "overflow-hidden rounded-md ring ring-inset ring-border p-1 shadow-lg"
    )
  end
end
