---
title: DashboardGroup
layout: docs
description: Full-screen sidebar + topbar layout shell for dashboard applications.
category: Layout
source: lib/kiso/themes/dashboard.rb
---

## Quick Start

Create a dashboard layout by composing the four layout components inside your
application layout file:

```erb
<!DOCTYPE html>
<html lang="en">
  <head>
    <%%= kiso_theme_script %>
    <%%= stylesheet_link_tag "tailwind" %>
    <%%= javascript_importmap_tags %>
  </head>
  <body>
    <%%= kui(:dashboard_group) do %>
      <%%= kui(:dashboard_navbar) do %>
        <%%= kui(:dashboard_sidebar, :toggle) %>
        <%%= kui(:dashboard_sidebar, :collapse) %>
        <%%= yield :topbar %>
      <%% end %>

      <%%= kui(:dashboard_sidebar) do %>
        <%%= kui(:nav) do %>
          <%%= kui(:nav, :section, title: "Main") do %>
            <%%= kui(:nav, :item, href: "/", icon: "layout-dashboard", active: true) { "Dashboard" } %>
          <%% end %>
        <%% end %>
        <%%= yield :sidebar %>
      <%% end %>

      <%%= kui(:dashboard_panel) do %>
        <%%= yield %>
      <%% end %>
    <%% end %>
  </body>
</html>
```

## Components

| Component | Element | Purpose |
|-----------|---------|---------|
| `kui(:dashboard_group)` | `<div>` | Root grid container, manages sidebar state |
| `kui(:dashboard_navbar)` | `<header>` | Full-width topbar spanning both columns |
| `kui(:dashboard_sidebar, :toggle)` | `<button>` | Mobile-only hamburger toggle (`lg:hidden`) |
| `kui(:dashboard_sidebar, :collapse)` | `<button>` | Desktop-only collapse button (`hidden lg:flex`) |
| `kui(:dashboard_sidebar)` | `<aside>` | Collapsible sidebar navigation area |
| `kui(:dashboard_toolbar)` | `<div>` | Secondary action bar with `:left` and `:right` sub-parts |
| `kui(:dashboard_panel)` | `<main>` | Main content area |
| `kui(:nav)` | `<nav>` | Navigation wrapper with `:section` and `:item` sub-parts |

## Locals

### DashboardGroup

| Local | Type | Default |
|-------|------|---------|
| `sidebar_open:` | `Boolean` \| `nil` | `nil` (reads from cookie) |
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

### DashboardNavbar, DashboardSidebar, DashboardPanel

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

### DashboardNavbar :toggle

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | `String` | `""` |
| `**component_options` | `Hash` | `{}` |

## Anatomy

```
DashboardGroup (grid root, kiso--sidebar controller)
├── DashboardNavbar (topbar, spans both columns)
│   └── DashboardNavbar :toggle (hamburger button)
├── DashboardSidebar (collapsible aside)
│   └── sidebar-inner (auto-rendered scroll container)
├── DashboardPanel (main content)
└── scrim (auto-rendered mobile overlay)
```

The sidebar inner wrapper and scrim are rendered automatically by
`dashboard_group` and `dashboard_sidebar`. You only compose the five
public components.

## Usage

### Sidebar State

By default, `dashboard_group` reads the `sidebar_open` cookie to restore
the user's preference. Pass `sidebar_open:` explicitly to override:

```erb
<%%= kui(:dashboard_group, sidebar_open: true) do %>
  ...
<%% end %>
```

The `kiso--sidebar` Stimulus controller persists the sidebar state to a
one-year cookie on every toggle, so the next page load restores it
server-side without JavaScript.

### Topbar Content

Place your logo, search bar, user menu, and other topbar elements inside
`dashboard_navbar`. The sidebar toggle and collapse buttons should come first:

```erb
<%%= kui(:dashboard_navbar) do %>
  <%%= kui(:dashboard_sidebar, :toggle) %>
  <%%= kui(:dashboard_sidebar, :collapse) %>
  <div class="flex-1"><%# logo, search, etc. %></div>
  <%%= kui(:color_mode_button) %>
<%% end %>
```

### Sidebar Content

Place navigation links, grouped menus, and any sidebar content inside
`dashboard_sidebar`:

```erb
<%%= kui(:dashboard_sidebar) do %>
  <nav class="flex flex-col gap-1 p-4">
    <%%= link_to "Home", root_path, class: "..." %>
    <%%= link_to "Settings", settings_path, class: "..." %>
  </nav>
<%% end %>
```

### Custom CSS Tokens

Override layout tokens in your app's Tailwind CSS:

```css
@theme {
  --sidebar-width: 18rem;
  --topbar-height: 4rem;
}
```

## CSS Tokens

| Token | Default | Purpose |
|-------|---------|---------|
| `--sidebar-width` | `16rem` | Sidebar width when open |
| `--topbar-height` | `3.5rem` | Navbar height |
| `--sidebar-duration` | `220ms` | Open/close animation duration |
| `--sidebar-background` | white / zinc-950 | Sidebar background (light/dark) |
| `--sidebar-foreground` | zinc-900 / zinc-100 | Sidebar text color |
| `--sidebar-border` | zinc-200 / zinc-800 | Sidebar right border |

## Theme

```ruby
DashboardGroup = ClassVariants.build(
  base: "grid h-dvh overflow-hidden bg-background text-foreground antialiased"
)

DashboardNavbar = ClassVariants.build(
  base: "col-span-full flex items-center gap-3 px-4 border-b border-border
         bg-background shrink-0 z-[--z-topbar]"
)

DashboardNavbarToggle = ClassVariants.build(
  base: "flex items-center justify-center w-8 h-8 rounded-md
         text-foreground/50 hover:text-foreground hover:bg-accent
         transition-colors duration-150 shrink-0"
)

DashboardSidebar = ClassVariants.build(
  base: "overflow-hidden border-r"
)

DashboardPanel = ClassVariants.build(
  base: "min-w-0 overflow-y-auto bg-background"
)
```

## Responsive Behavior

On desktop (768px+), the sidebar is an inline grid column that smoothly
animates between open and collapsed states. The panel content reflows
to fill the available space.

On mobile (below 768px), the sidebar column is always 0. When opened, the
sidebar becomes a fixed full-width overlay that slides in from the left.
A semi-transparent scrim appears behind it. Tapping the scrim closes the
sidebar.

## Accessibility

| Attribute | Element | Value |
|-----------|---------|-------|
| `data-slot` | group | `"dashboard-group"` |
| `data-slot` | navbar | `"dashboard-navbar"` |
| `data-slot` | toggle | `"dashboard-navbar-toggle"` |
| `data-slot` | sidebar | `"dashboard-sidebar"` |
| `data-slot` | panel | `"dashboard-panel"` |
| `aria-label` | toggle | `"Toggle sidebar"` |
| `aria-expanded` | toggle | synced with sidebar state |
| `aria-controls` | toggle | `"dashboard-sidebar"` |
| `aria-label` | sidebar | `"Sidebar navigation"` |
| `aria-hidden` | scrim | `"true"` |
