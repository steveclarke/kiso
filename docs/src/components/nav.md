---
title: Nav
layout: docs
description: Sidebar navigation with collapsible sections, icons, badges, and active state.
---

## Usage

Wrap navigation items in `kui(:nav)` with `:section` and `:item` sub-parts:

```erb
<%%= kui(:nav) do %>
  <%%= kui(:nav, :section, title: "Main") do %>
    <%%= kui(:nav, :item, href: "/dashboard", icon: "layout-dashboard", active: true) { "Dashboard" } %>
    <%%= kui(:nav, :item, href: "/analytics", icon: "bar-chart-3") { "Analytics" } %>
    <%%= kui(:nav, :item, href: "/team", icon: "users", badge: "3") { "Team" } %>
  <%% end %>
  <%%= kui(:nav, :section, title: "Settings") do %>
    <%%= kui(:nav, :item, href: "/settings", icon: "settings") { "General" } %>
    <%%= kui(:nav, :item, href: "/billing", icon: "credit-card") { "Billing" } %>
  <%% end %>
<%% end %>
```

## Collapsible Sections

Sections are collapsible by default using native `<details>/<summary>`. Control
the initial state with `open:` and disable collapsing with `collapsible:`:

```erb
<%%= kui(:nav, :section, title: "Open by default", open: true) do %>
  <%%= kui(:nav, :item, href: "#") { "Item" } %>
<%% end %>

<%%= kui(:nav, :section, title: "Closed by default", open: false) do %>
  <%%= kui(:nav, :item, href: "#") { "Hidden until expanded" } %>
<%% end %>

<%%= kui(:nav, :section, title: "Non-collapsible", collapsible: false) do %>
  <%%= kui(:nav, :item, href: "#") { "Always visible" } %>
<%% end %>
```

## Active State

Set `active: true` on the current page's nav item. This adds `data-active="true"`
and `aria-current="page"`:

```erb
<%%= kui(:nav, :item, href: "/dashboard", icon: "layout-dashboard", active: true) { "Dashboard" } %>
```

## Badges

Add a trailing badge to any item with the `badge:` prop:

```erb
<%%= kui(:nav, :item, href: "/inbox", icon: "inbox", badge: "12") { "Messages" } %>
```

## Sidebar Context

When placed inside `kui(:dashboard_sidebar)`, nav items automatically use sidebar
accent tokens (`--sidebar-accent`, `--sidebar-accent-foreground`) for hover and
active states via CSS context rules.

## Sub-parts

| Sub-part | Props | Purpose |
|----------|-------|---------|
| `:section` | `title:`, `open:` (true), `collapsible:` (true) | Group with optional collapsible title |
| `:section_title` | — | Custom title markup (replaces `title:` prop) |
| `:item` | `href:` (#), `icon:`, `badge:`, `active:` (false) | Navigation link |
