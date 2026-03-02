# DashboardGroup

Full-screen sidebar + topbar layout shell for dashboard applications. A family
of four components that compose into a responsive two-column layout.

## Current API

```erb
<%= kui(:dashboard_group) do %>
  <%= kui(:dashboard_navbar) do %>
    <%= kui(:dashboard_navbar, :toggle) %>
    <!-- topbar content -->
  <% end %>

  <%= kui(:dashboard_sidebar) do %>
    <!-- sidebar navigation -->
  <% end %>

  <%= kui(:dashboard_panel) do %>
    <!-- page content -->
  <% end %>
<% end %>
```

## Target API

Same as current. The layout shell is stable.

## Components

| Component | Element | Theme module | Purpose |
|-----------|---------|-------------|---------|
| `dashboard_group` | `<div>` | `DashboardGroup` | Root grid container, owns the sidebar controller |
| `dashboard_navbar` | `<header>` | `DashboardNavbar` | Full-width topbar spanning both columns |
| `dashboard_navbar, :toggle` | `<button>` | `DashboardNavbarToggle` | Hamburger button wired to `kiso--sidebar#toggle` |
| `dashboard_sidebar` | `<aside>` | `DashboardSidebar` | Collapsible sidebar with inner scrollable nav |
| `dashboard_panel` | `<main>` | `DashboardPanel` | Main content area |

## Layout Mechanics

**Flat 2x2 CSS grid.** The root `dashboard_group` uses a CSS grid with two rows
(topbar height + 1fr) and two columns (sidebar width + 1fr). The topbar spans
both columns. Sidebar and panel occupy the second row.

```
┌──────────────────────────────────────┐
│           dashboard_navbar           │
├──────────┬───────────────────────────┤
│ sidebar  │       dashboard_panel     │
│          │                           │
└──────────┴───────────────────────────┘
```

**Sidebar open/closed** is driven by `data-sidebar-open` on the root element.
CSS custom property `--sidebar-current-width` toggles between `--sidebar-width`
(16rem default) and `0rem`. The grid column transition is animated.

**Sidebar inner clipping.** The `<aside>` clips its content when collapsed. The
inner `<div data-slot="dashboard-sidebar-inner">` always stays at full
`--sidebar-width`, so content doesn't reflow during animation.

**Mobile overlay.** Below 768px, the sidebar column is always 0. The sidebar
becomes a fixed full-width overlay with slide-in animation. A scrim (dark
overlay) appears behind it.

## Sidebar Cookie Self-Reading

The `dashboard_group` partial reads `cookies[:sidebar_open]` directly to set
the initial `data-sidebar-open` attribute server-side. This prevents FOUC
(sidebar flash-open then collapse). The `sidebar_open:` local defaults to
`nil`, which triggers the cookie read. Pass `true` or `false` explicitly to
override.

## Scrim Auto-Rendering

The `dashboard_group` partial automatically renders a scrim `<div>` as the
last child. The scrim is hidden on desktop via CSS (`display: none`). On
mobile, when the sidebar is open, it becomes a fixed overlay that closes the
sidebar when clicked. No developer configuration needed.

## Host Owns Layout Philosophy

The `dashboard_group` family provides the layout shell only. All content
decisions belong to the host app:

- **Topbar content** — logo, search, user menu go inside `dashboard_navbar`
- **Sidebar content** — navigation links, grouped menus go inside `dashboard_sidebar`
- **Panel content** — page body goes inside `dashboard_panel`

The host app creates a layout file (e.g., `layouts/dashboard.html.erb`) that
composes these components and uses `yield` / `content_for` for app-specific
content injection.

## CSS Tokens

Defined in `app/assets/tailwind/kiso/dashboard.css`. Host apps override via
their own `@theme` block.

| Token | Default | Purpose |
|-------|---------|---------|
| `--sidebar-width` | `16rem` | Sidebar width when open |
| `--topbar-height` | `3.5rem` | Navbar height |
| `--sidebar-background` | white/zinc-950 | Sidebar background (light/dark) |
| `--sidebar-foreground` | zinc-900/zinc-100 | Sidebar text color |
| `--sidebar-border` | zinc-200/zinc-800 | Sidebar border color |
| `--sidebar-accent` | zinc-100/zinc-800 | Sidebar hover background |
| `--sidebar-accent-foreground` | zinc-700/zinc-300 | Sidebar hover text |
| `--sidebar-duration` | `220ms` | Animation duration |
| `--z-topbar` | `30` | Topbar z-index |
| `--z-sidebar` | `40` | Sidebar z-index (mobile overlay) |

## Dependencies

- **Stimulus:** `kiso--sidebar` controller (toggle, cookie persistence, mobile scrim)
- **CSS:** `app/assets/tailwind/kiso/dashboard.css` (grid mechanics, tokens, mobile overlay)
- **Helper:** `kiso_theme_script` in `<head>` for FOUC-free dark mode (recommended, not required)

## Design Decisions

- **No color axis.** Layout components are structural, not semantic. Surface
  colors come from CSS tokens, not compound variants.
- **Grid over flexbox.** A flat 2x2 grid avoids nested wrappers and makes the
  topbar-spans-all-columns pattern trivial.
- **Cookie over localStorage for sidebar.** The server needs the sidebar state
  to set `data-sidebar-open` before JavaScript loads. Cookies are readable
  server-side; localStorage is not.
- **Full-width mobile sidebar.** Matches common dashboard patterns (shadcn,
  Nuxt UI). The sidebar slides in from the left at 100dvw width.
