module Kiso
  module Themes
    DashboardGroup = ClassVariants.build(
      base: "grid h-dvh overflow-hidden bg-background text-foreground antialiased"
    )

    DashboardNavbar = ClassVariants.build(
      base: "flex items-center gap-3 px-4 border-b border-border bg-background shrink-0 z-[--z-topbar]"
    )

    DashboardNavbarToggle = ClassVariants.build(
      base: "flex items-center justify-center w-8 h-8 rounded-md text-foreground/50 hover:text-foreground hover:bg-accent transition-colors duration-150 shrink-0 [&>svg]:size-4"
    )

    DashboardSidebar = ClassVariants.build(
      base: "overflow-hidden"
    )

    DashboardPanel = ClassVariants.build(
      base: "min-w-0 overflow-y-auto bg-background"
    )

    DashboardSidebarHeader = ClassVariants.build(
      base: "shrink-0 flex items-center gap-1.5 px-4"
    )

    DashboardSidebarFooter = ClassVariants.build(
      base: "shrink-0 flex items-center gap-1.5 px-4 py-2"
    )

    DashboardSidebarToggle = ClassVariants.build(
      base: "lg:hidden flex items-center justify-center w-8 h-8 rounded-md text-foreground/50 hover:text-foreground hover:bg-accent transition-colors duration-150 shrink-0 cursor-pointer [&>svg]:size-4"
    )

    DashboardSidebarCollapse = ClassVariants.build(
      base: "hidden lg:flex items-center justify-center w-8 h-8 rounded-md text-foreground/50 hover:text-foreground hover:bg-accent transition-colors duration-150 shrink-0 cursor-pointer [&>svg]:size-4"
    )

    DashboardToolbar = ClassVariants.build(
      base: "shrink-0 flex items-center justify-between border-b border-border px-4 sm:px-6 gap-1.5 overflow-x-auto h-(--topbar-height)"
    )

    DashboardToolbarLeft = ClassVariants.build(
      base: "flex items-center gap-1.5"
    )

    DashboardToolbarRight = ClassVariants.build(
      base: "flex items-center gap-1.5"
    )
  end
end
