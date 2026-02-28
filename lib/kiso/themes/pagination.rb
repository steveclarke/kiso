module Kiso
  module Themes
    # @return [String] shared base classes for all pagination link-type elements.
    #   Matches shadcn's buttonVariants base (ghost/outline neutral).
    PAGINATION_LINK_BASE = "inline-flex items-center justify-center whitespace-nowrap rounded-md " \
                           "text-sm font-medium transition-all " \
                           "focus-visible:outline-2 focus-visible:outline-offset-2 " \
                           "disabled:pointer-events-none disabled:opacity-50 " \
                           "aria-disabled:cursor-not-allowed aria-disabled:opacity-50 " \
                           "#{Shared::SVG_BASE}"

    # @return [Hash] shared active/inactive variants for pagination links.
    #   +active: true+ renders outline neutral style, +active: false+ renders ghost.
    PAGINATION_ACTIVE_VARIANTS = {
      active: {
        true => "ring ring-inset text-foreground bg-background ring-accented " \
                "hover:bg-elevated focus-visible:ring-2 focus-visible:ring-inverted",
        false => "text-foreground hover:bg-elevated active:bg-accented/75 focus-visible:outline-inverted"
      }
    }.freeze

    # Page navigation with numbered links, prev/next buttons, and ellipsis.
    #
    # @example
    #   Pagination.render
    #
    # Sub-parts: {PaginationContent}, {PaginationItem}, {PaginationLink},
    # {PaginationPrevious}, {PaginationNext}, {PaginationEllipsis}
    Pagination = ClassVariants.build(
      base: "mx-auto flex w-full justify-center"
    )

    # Flex row container for pagination items.
    PaginationContent = ClassVariants.build(
      base: "flex flex-row items-center gap-1"
    )

    # Wrapper for a single pagination element (link, ellipsis, etc.).
    PaginationItem = ClassVariants.build(
      base: ""
    )

    # Square button for a page number. Switches between ghost and outline
    # style based on the +active+ variant.
    #
    # Variants:
    # - +active+ — +true+ (outline, current page), +false+ (default, ghost)
    PaginationLink = ClassVariants.build(
      base: "#{PAGINATION_LINK_BASE} size-9",
      variants: PAGINATION_ACTIVE_VARIANTS,
      defaults: {active: false}
    )

    # "Previous" navigation link with chevron icon.
    PaginationPrevious = ClassVariants.build(
      base: "#{PAGINATION_LINK_BASE} h-9 gap-1 px-2.5 sm:pl-2.5",
      variants: PAGINATION_ACTIVE_VARIANTS,
      defaults: {active: false}
    )

    # "Next" navigation link with chevron icon.
    PaginationNext = ClassVariants.build(
      base: "#{PAGINATION_LINK_BASE} h-9 gap-1 px-2.5 sm:pr-2.5",
      variants: PAGINATION_ACTIVE_VARIANTS,
      defaults: {active: false}
    )

    # Ellipsis indicator for skipped page ranges.
    PaginationEllipsis = ClassVariants.build(
      base: "pointer-events-none flex size-9 items-center justify-center text-muted-foreground"
    )
  end
end
