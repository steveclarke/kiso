module Kiso
  module Themes
    # Command palette (cmdk-style) with search input, grouped items, and
    # keyboard navigation.
    #
    # @example
    #   Command.render
    #
    # Sub-parts: {CommandInputWrapper}, {CommandInput}, {CommandList},
    # {CommandEmpty}, {CommandGroup}, {CommandGroupHeading}, {CommandItem},
    # {CommandSeparator}, {CommandShortcut}, {CommandDialog}, {CommandDialogContent}
    Command = ClassVariants.build(
      base: "bg-background text-foreground flex h-full w-full flex-col overflow-hidden rounded-md"
    )

    # Container for the search icon and input, separated from the list by a border.
    CommandInputWrapper = ClassVariants.build(
      base: "flex h-9 items-center gap-2 border-b border-border px-3"
    )

    # The search text input element.
    CommandInput = ClassVariants.build(
      base: "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent " \
            "py-3 text-sm outline-none " \
            "disabled:cursor-not-allowed disabled:opacity-50"
    )

    # Scrollable results container.
    CommandList = ClassVariants.build(
      base: "max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto"
    )

    # "No results" message shown when the search matches nothing.
    CommandEmpty = ClassVariants.build(
      base: "py-6 text-center text-sm"
    )

    # Logical group of related command items.
    CommandGroup = ClassVariants.build(
      base: "text-foreground overflow-hidden p-1"
    )

    # Label text displayed above a {CommandGroup}.
    CommandGroupHeading = ClassVariants.build(
      base: "text-muted-foreground px-2 py-1.5 text-xs font-medium"
    )

    # Selectable action item within the command palette.
    CommandItem = ClassVariants.build(
      base: "data-[selected]:bg-elevated data-[selected]:text-foreground " \
            "[&_svg:not([class*='text-'])]:text-muted-foreground " \
            "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm " \
            "outline-none select-none " \
            "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 " \
            "#{Shared::SVG_BASE}"
    )

    # Horizontal divider between command groups.
    CommandSeparator = ClassVariants.build(
      base: "bg-border -mx-1 h-px"
    )

    # Keyboard shortcut hint displayed on the right side of a {CommandItem}.
    CommandShortcut = ClassVariants.build(
      base: Shared::MENU_SHORTCUT
    )

    # The native +<dialog>+ element for modal command palette usage.
    CommandDialog = ClassVariants.build(
      base: "bg-transparent p-0 backdrop:bg-black/50 max-w-lg w-full rounded-lg open:flex"
    )

    # Inner content wrapper inside the {CommandDialog}.
    CommandDialogContent = ClassVariants.build(
      base: "bg-background text-foreground overflow-hidden rounded-lg ring ring-inset ring-border shadow-lg w-full"
    )
  end
end
