module Kiso
  # Namespace for all Kiso component theme definitions.
  #
  # Each constant is a +ClassVariants+ instance that maps variant options
  # to Tailwind CSS class strings. Call +.render+ with variant options to
  # get the resolved class string:
  #
  #   Kiso::Themes::Badge.render(color: :success, variant: :soft, size: :md)
  #   # => "inline-flex items-center ... bg-success/10 text-success ..."
  #
  # Compound components (Card, Table, Field, etc.) have multiple constants
  # for the root and each sub-part (e.g. +Card+, +CardHeader+, +CardTitle+).
  #
  # @see project/design-system.md for compound variant formulas and token mapping
  # @see project/component-strategy.md for architecture patterns
  module Themes
    # Shared class strings for patterns that are identical across multiple
    # components. Using shared constants prevents drift when updating styles.
    #
    # Only extract constants that are byte-for-byte identical across components.
    # Component-specific variations (e.g., CommandSeparator missing +my-1+,
    # SelectSeparator with +pointer-events-none+) should remain inline to
    # preserve shadcn fidelity.
    module Shared
      # SVG child element base classes: disables pointer events, prevents shrinking,
      # and sets default icon size when not explicitly sized.
      #
      # Used by: Button, Toggle, ToggleGroupItem, SelectTrigger, SelectItem,
      # ComboboxItem, CommandItem, DropdownMenuItem, DropdownMenuSubTrigger,
      # DropdownMenuCheckboxItem, DropdownMenuRadioItem (via CHECKABLE_ITEM),
      # PaginationLink/Previous/Next (via PAGINATION_LINK_BASE)
      #
      # @return [String]
      SVG_BASE = "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

      # Horizontal separator line for items in dropdown-style menus.
      #
      # Used by: ComboboxSeparator, DropdownMenuSeparator.
      # CommandSeparator omits +my-1+, SelectSeparator adds +pointer-events-none+ --
      # both per shadcn, so they remain inline.
      #
      # @return [String]
      ITEM_SEPARATOR = "bg-border -mx-1 my-1 h-px"

      # Non-interactive group heading in dropdown-style menus.
      #
      # Used by: ComboboxLabel, SelectLabel.
      # CommandGroupHeading adds +font-medium+ per shadcn, so it remains inline.
      #
      # @return [String]
      MENU_LABEL = "text-muted-foreground px-2 py-1.5 text-xs"

      # Keyboard shortcut hint aligned to the right of a menu item.
      #
      # Used by: CommandShortcut, DropdownMenuShortcut.
      #
      # @return [String]
      MENU_SHORTCUT = "text-muted-foreground ml-auto text-xs tracking-widest"

      # Shared base for checkbox and radio items in DropdownMenu.
      # These are structurally identical -- same layout, same interactive states.
      #
      # @return [String]
      CHECKABLE_ITEM = "relative flex cursor-default items-center gap-2 rounded-sm " \
                       "py-1.5 pr-2 pl-8 text-sm outline-none select-none " \
                       "data-[highlighted]:bg-elevated data-[highlighted]:text-foreground " \
                       "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 " \
                       "#{SVG_BASE}"
    end
  end
end
