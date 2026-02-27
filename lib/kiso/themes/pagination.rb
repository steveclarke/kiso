module Kiso
  module Themes
    # Shared base for all pagination link-type elements.
    # Matches shadcn's buttonVariants base (ghost/outline neutral).
    PAGINATION_LINK_BASE = "inline-flex items-center justify-center whitespace-nowrap rounded-md " \
                           "text-sm font-medium transition-all " \
                           "focus-visible:outline-2 focus-visible:outline-offset-2 " \
                           "disabled:pointer-events-none disabled:opacity-50 " \
                           "aria-disabled:cursor-not-allowed aria-disabled:opacity-50 " \
                           "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

    # active: true  → outline neutral (ring, bg-background)
    # active: false → ghost neutral (transparent until hover)
    PAGINATION_ACTIVE_VARIANTS = {
      active: {
        true => "ring ring-inset text-foreground bg-background ring-accented " \
                "hover:bg-elevated focus-visible:ring-2 focus-visible:ring-inverted",
        false => "text-foreground hover:bg-elevated active:bg-accented/75 focus-visible:outline-inverted"
      }
    }.freeze

    Pagination = ClassVariants.build(
      base: "mx-auto flex w-full justify-center"
    )

    PaginationContent = ClassVariants.build(
      base: "flex flex-row items-center gap-1"
    )

    PaginationItem = ClassVariants.build(
      base: ""
    )

    # Square icon-sized button for page number links (size-9 = h-9 w-9)
    PaginationLink = ClassVariants.build(
      base: "#{PAGINATION_LINK_BASE} size-9",
      variants: PAGINATION_ACTIVE_VARIANTS,
      defaults: {active: false}
    )

    # Prev link: default button height with responsive text
    PaginationPrevious = ClassVariants.build(
      base: "#{PAGINATION_LINK_BASE} h-9 gap-1 px-2.5 sm:pl-2.5",
      variants: PAGINATION_ACTIVE_VARIANTS,
      defaults: {active: false}
    )

    # Next link: default button height with responsive text
    PaginationNext = ClassVariants.build(
      base: "#{PAGINATION_LINK_BASE} h-9 gap-1 px-2.5 sm:pr-2.5",
      variants: PAGINATION_ACTIVE_VARIANTS,
      defaults: {active: false}
    )

    PaginationEllipsis = ClassVariants.build(
      base: "pointer-events-none flex size-9 items-center justify-center text-muted-foreground"
    )
  end
end
