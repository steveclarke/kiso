# DashboardGroup

Full-screen sidebar + topbar layout shell for dashboard applications. Components
compose into a responsive 2x2 CSS grid.

**Locals (dashboard_group):** `sidebar_open:` (true/false/nil), `css_classes:`, `**component_options`

**Locals (dashboard_navbar, dashboard_sidebar, dashboard_panel, dashboard_toolbar):** `css_classes:`, `**component_options`

**Sub-parts:**
- `kui(:dashboard_sidebar, :toggle)` — mobile-only hamburger (`lg:hidden`)
- `kui(:dashboard_sidebar, :collapse)` — desktop-only collapse (`hidden lg:flex`)
- `kui(:dashboard_toolbar, :left)` / `kui(:dashboard_toolbar, :right)` — toolbar slots

**Defaults:** `sidebar_open: nil` (reads `cookies[:sidebar_open]`)

```erb
<%# In layouts/dashboard.html.erb %>
<body>
  <%= kui(:dashboard_group) do %>
    <%= kui(:dashboard_navbar) do %>
      <%= kui(:dashboard_sidebar, :toggle) %>
      <%= kui(:dashboard_sidebar, :collapse) %>
      <div class="flex-1"><!-- logo, search --></div>
      <%= kui(:color_mode_button) %>
    <% end %>

    <%= kui(:dashboard_sidebar) do %>
      <%= kui(:nav) do %>
        <%= kui(:nav, :section, title: "Main") do %>
          <%= kui(:nav, :item, href: "/", icon: "layout-dashboard", active: true) { "Dashboard" } %>
          <%= kui(:nav, :item, href: "/settings", icon: "settings") { "Settings" } %>
        <% end %>
      <% end %>
    <% end %>

    <%= kui(:dashboard_panel) do %>
      <%= kui(:dashboard_toolbar) do %>
        <%= kui(:dashboard_toolbar, :left) do %>
          <%= kui(:breadcrumb) { ... } %>
        <% end %>
        <%= kui(:dashboard_toolbar, :right) do %>
          <%= kui(:button, size: :sm) { "Export" } %>
        <% end %>
      <% end %>
      <%= yield %>
    <% end %>
  <% end %>
</body>
```

**Theme modules:** `Kiso::Themes::DashboardGroup`, `DashboardNavbar`, `DashboardSidebar`, `DashboardSidebarToggle`, `DashboardSidebarCollapse`, `DashboardToolbar`, `DashboardToolbarLeft`, `DashboardToolbarRight`, `DashboardPanel` (`lib/kiso/themes/dashboard.rb`)

**Nav theme modules:** `Kiso::Themes::Nav`, `NavSection`, `NavSectionTitle`, `NavSectionContent`, `NavItem`, `NavItemBadge` (`lib/kiso/themes/nav.rb`)

**CSS:** `app/assets/tailwind/kiso/dashboard.css` — grid mechanics, sidebar tokens, mobile overlay, collapse icon switching, nav section/item sidebar context

**Stimulus:** `kiso--sidebar` controller (toggle, cookie persistence, mobile scrim close, multiple trigger targets)

**Key CSS tokens:** `--sidebar-width` (16rem), `--topbar-height` (3.5rem), `--sidebar-duration` (220ms), `--sidebar-background`, `--sidebar-foreground`, `--sidebar-border`, `--sidebar-accent`, `--sidebar-accent-foreground`
