module Kiso
  module Themes
    # Dashboard layout system -- composable components for admin/app shells.
    #
    # The dashboard uses CSS Grid for layout with a sidebar, navbar, and
    # main content panel. CSS mechanics (grid tracks, sidebar animation,
    # mobile overlay) live in +dashboard.css+ using +[data-slot]+ selectors.
    # Sidebar state is persisted via cookies.
    #
    # @example
    #   DashboardGroup.render
    #
    # Sub-parts: {DashboardNavbar}, {DashboardNavbarToggle}, {DashboardSidebar},
    # {DashboardPanel}, {DashboardSidebarHeader}, {DashboardSidebarFooter},
    # {DashboardSidebarToggle}, {DashboardSidebarCollapse}, {DashboardToolbar},
    # {DashboardToolbarLeft}, {DashboardToolbarRight}

    # Root grid container spanning the full viewport height.
    DashboardGroup = ClassVariants.build(
      base: "grid h-dvh overflow-hidden bg-background text-foreground antialiased"
    )

    # Top navigation bar with border-bottom separator.
    DashboardNavbar = ClassVariants.build(
      base: "flex items-center gap-3 px-4 border-b border-border bg-background shrink-0 z-(--z-topbar)"
    )

    # Icon button inside the navbar (e.g., sidebar toggle, color mode).
    DashboardNavbarToggle = ClassVariants.build(
      base: "flex items-center justify-center w-8 h-8 rounded-md text-foreground/50 hover:text-foreground hover:bg-accent transition-colors duration-150 shrink-0 [&>svg]:size-4"
    )

    # Collapsible side panel for navigation. Width and animation
    # controlled by CSS custom properties in +dashboard.css+.
    DashboardSidebar = ClassVariants.build(
      base: "overflow-hidden"
    )

    # Scrollable main content area beside the sidebar.
    DashboardPanel = ClassVariants.build(
      base: "min-w-0 overflow-y-auto bg-background"
    )

    # Top section of the sidebar (e.g., logo, search).
    # Fixed height matches the topbar; items-center vertically centers content.
    DashboardSidebarHeader = ClassVariants.build(
      base: "shrink-0 flex items-center gap-2 p-2"
    )

    # Bottom section of the sidebar (e.g., user menu, action buttons).
    # Horizontal layout for the common "avatar + action button" pattern.
    DashboardSidebarFooter = ClassVariants.build(
      base: "shrink-0 flex items-center gap-2 p-2"
    )

    # Mobile-only button to open/close the sidebar overlay.
    DashboardSidebarToggle = ClassVariants.build(
      base: "lg:hidden flex items-center justify-center w-8 h-8 rounded-md text-foreground/50 hover:text-foreground hover:bg-accent transition-colors duration-150 shrink-0 cursor-pointer [&>svg]:size-4"
    )

    # Desktop-only button to collapse the sidebar to icon-only width.
    DashboardSidebarCollapse = ClassVariants.build(
      base: "hidden lg:flex items-center justify-center w-8 h-8 rounded-md text-foreground/50 hover:text-foreground hover:bg-accent transition-colors duration-150 shrink-0 cursor-pointer [&>svg]:size-4"
    )

    # Secondary toolbar below the navbar with left/right content slots.
    DashboardToolbar = ClassVariants.build(
      base: "shrink-0 flex items-center justify-between border-b border-border px-4 sm:px-6 gap-1.5 overflow-x-auto h-(--topbar-height)"
    )

    # Left-aligned content area within {DashboardToolbar}.
    DashboardToolbarLeft = ClassVariants.build(
      base: "flex items-center gap-1.5"
    )

    # Right-aligned content area within {DashboardToolbar}.
    DashboardToolbarRight = ClassVariants.build(
      base: "ml-auto flex items-center gap-1.5"
    )
  end
end
