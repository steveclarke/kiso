module Kiso
  module Themes
    # Searchable dropdown (autocomplete) with keyboard navigation.
    #
    # @example
    #   Combobox.render
    #
    # Sub-parts: {ComboboxInput}, {ComboboxContent}, {ComboboxList},
    # {ComboboxItem}, {ComboboxItemIndicator}, {ComboboxGroup}, {ComboboxLabel},
    # {ComboboxEmpty}, {ComboboxSeparator}, {ComboboxChips}, {ComboboxChip},
    # {ComboboxChipsInput}
    Combobox = ClassVariants.build(
      base: "relative text-foreground"
    )

    # Input wrapper (replicates {InputGroup} pattern with embedded text input).
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

    # Dropdown panel containing the filtered list of items.
    ComboboxContent = ClassVariants.build(
      base: "bg-background text-foreground z-50 max-h-96 min-w-32 " \
            "overflow-hidden rounded-md shadow-md ring ring-inset ring-border"
    )

    # Scrollable list container inside {ComboboxContent}.
    ComboboxList = ClassVariants.build(
      base: "scroll-py-1 overflow-y-auto p-1"
    )

    # Selectable option within the combobox dropdown.
    ComboboxItem = ClassVariants.build(
      base: "relative flex w-full cursor-default items-center gap-2 rounded-sm " \
            "py-1.5 pr-8 pl-2 text-sm outline-none select-none " \
            "data-[highlighted]:bg-elevated data-[highlighted]:text-foreground " \
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 " \
            "#{Shared::SVG_BASE}"
    )

    # Check mark indicator on the selected item.
    ComboboxItemIndicator = ClassVariants.build(
      base: "pointer-events-none absolute right-2 flex size-4 items-center justify-center"
    )

    # Semantic grouping wrapper for related combobox items.
    ComboboxGroup = ClassVariants.build(
      base: ""
    )

    # Non-interactive heading for a {ComboboxGroup}.
    ComboboxLabel = ClassVariants.build(
      base: Shared::MENU_LABEL
    )

    # "No results" message shown when the filter matches nothing.
    ComboboxEmpty = ClassVariants.build(
      base: "text-muted-foreground flex w-full justify-center py-2 text-center text-sm"
    )

    # Horizontal divider between combobox items or groups.
    ComboboxSeparator = ClassVariants.build(
      base: Shared::ITEM_SEPARATOR
    )

    # Multi-select input container displaying selected values as chips.
    ComboboxChips = ClassVariants.build(
      base: "text-foreground flex min-h-9 flex-wrap items-center gap-1.5 rounded-md " \
            "bg-background ring ring-inset ring-accented shadow-xs " \
            "px-2.5 py-1.5 text-sm transition-[color,box-shadow] " \
            "focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary " \
            "has-[[aria-invalid]]:ring-error"
    )

    # Individual chip representing a selected value in {ComboboxChips}.
    ComboboxChip = ClassVariants.build(
      base: "bg-muted text-foreground flex h-5.5 w-fit items-center " \
            "justify-center gap-1 rounded-sm px-1.5 text-xs font-medium whitespace-nowrap"
    )

    # Inline text input within the {ComboboxChips} container.
    ComboboxChipsInput = ClassVariants.build(
      base: "min-w-16 flex-1 bg-transparent outline-none text-base md:text-sm " \
            "placeholder:text-muted-foreground " \
            "disabled:cursor-not-allowed disabled:opacity-50"
    )
  end
end
