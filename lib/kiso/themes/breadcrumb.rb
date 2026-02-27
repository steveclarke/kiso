module Kiso
  module Themes
    # shadcn Breadcrumb: <nav aria-label="breadcrumb">
    # No classes on the nav element itself.
    Breadcrumb = ClassVariants.build(
      base: ""
    )

    # shadcn BreadcrumbList: text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5
    BreadcrumbList = ClassVariants.build(
      base: "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5"
    )

    # shadcn BreadcrumbItem: inline-flex items-center gap-1.5
    BreadcrumbItem = ClassVariants.build(
      base: "inline-flex items-center gap-1.5"
    )

    # shadcn BreadcrumbLink: hover:text-foreground transition-colors
    BreadcrumbLink = ClassVariants.build(
      base: "hover:text-foreground transition-colors"
    )

    # shadcn BreadcrumbPage: text-foreground font-normal
    BreadcrumbPage = ClassVariants.build(
      base: "text-foreground font-normal"
    )

    # shadcn BreadcrumbSeparator: [&>svg]:size-3.5
    BreadcrumbSeparator = ClassVariants.build(
      base: "[&>svg]:size-3.5"
    )

    # shadcn BreadcrumbEllipsis: flex size-9 items-center justify-center
    BreadcrumbEllipsis = ClassVariants.build(
      base: "flex size-9 items-center justify-center"
    )
  end
end
