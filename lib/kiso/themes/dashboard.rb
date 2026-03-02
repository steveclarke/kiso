module Kiso
  module Themes
    DashboardGroup = ClassVariants.build(
      base: "grid h-dvh overflow-hidden bg-background text-foreground antialiased"
    )

    DashboardNavbar = ClassVariants.build(
      base: "col-span-full flex items-center gap-3 px-4 border-b border-border bg-background shrink-0 z-[--z-topbar]"
    )

    DashboardNavbarToggle = ClassVariants.build(
      base: "flex items-center justify-center w-8 h-8 rounded-md text-foreground/50 hover:text-foreground hover:bg-accent transition-colors duration-150 shrink-0"
    )

    DashboardSidebar = ClassVariants.build(
      base: "overflow-hidden border-r"
    )

    DashboardPanel = ClassVariants.build(
      base: "min-w-0 overflow-y-auto bg-background"
    )
  end
end
