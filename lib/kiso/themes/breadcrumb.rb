module Kiso
  module Themes
    # Navigation breadcrumb trail rendered as a +<nav>+ element.
    #
    # @example
    #   Breadcrumb.render
    #
    # Sub-parts: {BreadcrumbList}, {BreadcrumbItem}, {BreadcrumbLink},
    # {BreadcrumbPage}, {BreadcrumbSeparator}, {BreadcrumbEllipsis}
    Breadcrumb = ClassVariants.build(
      base: ""
    )

    # Ordered list (+<ol>+) containing breadcrumb items.
    BreadcrumbList = ClassVariants.build(
      base: "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5"
    )

    # List item (+<li>+) wrapping a link or page indicator.
    BreadcrumbItem = ClassVariants.build(
      base: "inline-flex items-center gap-1.5"
    )

    # Clickable link to an ancestor page.
    BreadcrumbLink = ClassVariants.build(
      base: "hover:text-foreground transition-colors"
    )

    # Current page indicator (non-interactive, +aria-current="page"+).
    BreadcrumbPage = ClassVariants.build(
      base: "text-foreground font-normal"
    )

    # Chevron or custom separator between breadcrumb items.
    BreadcrumbSeparator = ClassVariants.build(
      base: "[&>svg]:size-3.5"
    )

    # Ellipsis indicator for collapsed breadcrumb levels.
    BreadcrumbEllipsis = ClassVariants.build(
      base: "flex size-9 items-center justify-center"
    )
  end
end
