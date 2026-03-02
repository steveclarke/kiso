# DashboardGroup

Full-screen sidebar + topbar layout shell for dashboard applications. Four
components compose into a responsive 2x2 CSS grid.

**Locals (dashboard_group):** `sidebar_open:` (true/false/nil), `css_classes:`, `**component_options`

**Locals (dashboard_navbar, dashboard_sidebar, dashboard_panel):** `css_classes:`, `**component_options`

**Sub-part:** `kui(:dashboard_navbar, :toggle)` — hamburger button

**Defaults:** `sidebar_open: nil` (reads `cookies[:sidebar_open]`)

```erb
<%# In layouts/dashboard.html.erb %>
<head>
  <%= kiso_theme_script %>
  <%= stylesheet_link_tag "tailwind" %>
  <%= javascript_importmap_tags %>
</head>
<body>
  <%= kui(:dashboard_group) do %>
    <%= kui(:dashboard_navbar) do %>
      <%= kui(:dashboard_navbar, :toggle) %>
      <div class="flex-1"><!-- logo, search --></div>
      <%= kui(:color_mode_button) %>
    <% end %>

    <%= kui(:dashboard_sidebar) do %>
      <nav class="flex flex-col gap-1 p-4">
        <%= link_to "Home", root_path %>
        <%= link_to "Settings", settings_path %>
      </nav>
    <% end %>

    <%= kui(:dashboard_panel) do %>
      <%= yield %>
    <% end %>
  <% end %>
</body>
```

**Theme modules:** `Kiso::Themes::DashboardGroup`, `DashboardNavbar`, `DashboardNavbarToggle`, `DashboardSidebar`, `DashboardPanel` (`lib/kiso/themes/dashboard.rb`)

**CSS:** `app/assets/tailwind/kiso/dashboard.css` — grid mechanics, sidebar tokens, mobile overlay

**Stimulus:** `kiso--sidebar` controller (toggle, cookie persistence, mobile scrim close)

**Key CSS tokens:** `--sidebar-width` (16rem), `--topbar-height` (3.5rem), `--sidebar-duration` (220ms), `--sidebar-background`, `--sidebar-foreground`, `--sidebar-border`
