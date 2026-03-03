module Kiso
  module Themes
    Nav = ClassVariants.build(
      base: "flex flex-col gap-4"
    )

    NavSection = ClassVariants.build(
      base: "relative flex w-full min-w-0 flex-col gap-1 p-2"
    )

    NavSectionTitle = ClassVariants.build(
      base: "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-muted-foreground"
    )

    NavItem = ClassVariants.build(
      base: "group relative w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring data-[active=true]:bg-accent data-[active=true]:font-medium data-[active=true]:text-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0"
    )

    NavItemBadge = ClassVariants.build(
      base: "ms-auto pointer-events-none flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none"
    )
  end
end
