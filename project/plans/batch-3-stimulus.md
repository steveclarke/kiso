# Batch 3: Stimulus Components — Issue Breakdown

Parent issue: #12

## Proposed Issues

### Issue 1: Breadcrumb

No JS needed. 7 shadcn exports. Pure HTML/CSS.

| Kiso component | shadcn export | HTML | Purpose |
|---|---|---|---|
| `kiso(:breadcrumb)` | `Breadcrumb` | `<nav>` | Root with aria-label |
| `kiso(:breadcrumb, :list)` | `BreadcrumbList` | `<ol>` | Ordered list |
| `kiso(:breadcrumb, :item)` | `BreadcrumbItem` | `<li>` | Segment wrapper |
| `kiso(:breadcrumb, :link)` | `BreadcrumbLink` | `<a>` | Clickable link |
| `kiso(:breadcrumb, :page)` | `BreadcrumbPage` | `<span>` | Current page (non-interactive) |
| `kiso(:breadcrumb, :separator)` | `BreadcrumbSeparator` | `<li>` | Chevron divider |
| `kiso(:breadcrumb, :ellipsis)` | `BreadcrumbEllipsis` | `<span>` | Truncation indicator |

**shadcn source:** `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/breadcrumb.tsx`
**Nuxt UI theme:** `vendor/nuxt-ui/src/theme/breadcrumb.ts`
**Stimulus:** None
**Complexity:** Low

---

### Issue 2: Popover

Foundation component. DropdownMenu, Combobox, and DatePicker all compose on
top of it. 7 shadcn exports.

| Kiso component | shadcn export | HTML | Purpose |
|---|---|---|---|
| `kiso(:popover)` | `Popover` | (context wrapper) | Root |
| `kiso(:popover, :trigger)` | `PopoverTrigger` | `<button>` | Opens popover |
| `kiso(:popover, :content)` | `PopoverContent` | `<div>` (portal) | Floating panel |
| `kiso(:popover, :anchor)` | `PopoverAnchor` | `<div>` | Position reference |
| `kiso(:popover, :header)` | `PopoverHeader` | `<div>` | Title + description wrapper |
| `kiso(:popover, :title)` | `PopoverTitle` | `<div>` | Heading |
| `kiso(:popover, :description)` | `PopoverDescription` | `<p>` | Description |

**shadcn source:** `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/popover.tsx`
**Nuxt UI theme:** `vendor/nuxt-ui/src/theme/popover.ts`
**Stimulus:** Yes — toggle open/close, click outside dismiss, positioning
(native `[popover]` API or Floating UI), focus trap, Escape to close.
**Complexity:** Medium-high. Foundation for other components.

---

### Issue 3: Toggle + ToggleGroup

Two shadcn components. Toggle is standalone two-state button, ToggleGroup
wraps multiple toggles with single/multi selection.

| Kiso component | shadcn export | HTML | Purpose |
|---|---|---|---|
| `kiso(:toggle)` | `Toggle` | `<button>` | Two-state toggle button |
| `kiso(:toggle_group)` | `ToggleGroup` | `<div>` | Container, single/multi select |
| `kiso(:toggle_group, :item)` | `ToggleGroupItem` | `<button>` | Individual toggle in group |

**shadcn source:** `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/toggle.tsx`,
`vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/toggle-group.tsx`
**Nuxt UI theme:** None (shadcn-only)
**Stimulus:** Yes — group selection mode (single vs multi), keyboard nav
(arrow keys), `data-state=on/off` management.
**Variants:** `variant` (default, outline), `size` (sm, default, lg)
**Complexity:** Medium

---

### Issue 4: DropdownMenu

Most sub-part-heavy component. 15 shadcn exports. Nested sub-menus.

| Kiso component | shadcn export | HTML | Purpose |
|---|---|---|---|
| `kiso(:dropdown_menu)` | `DropdownMenu` | (context wrapper) | Root |
| `kiso(:dropdown_menu, :trigger)` | `DropdownMenuTrigger` | `<button>` | Opens menu |
| `kiso(:dropdown_menu, :content)` | `DropdownMenuContent` | `<div>` (portal) | Menu panel |
| `kiso(:dropdown_menu, :item)` | `DropdownMenuItem` | `<div role="menuitem">` | Menu item |
| `kiso(:dropdown_menu, :checkbox_item)` | `DropdownMenuCheckboxItem` | `<div role="menuitemcheckbox">` | Checkbox item |
| `kiso(:dropdown_menu, :radio_group)` | `DropdownMenuRadioGroup` | `<div>` | Radio group container |
| `kiso(:dropdown_menu, :radio_item)` | `DropdownMenuRadioItem` | `<div role="menuitemradio">` | Radio item |
| `kiso(:dropdown_menu, :label)` | `DropdownMenuLabel` | `<span>` | Section header |
| `kiso(:dropdown_menu, :separator)` | `DropdownMenuSeparator` | `<div>` | Divider |
| `kiso(:dropdown_menu, :shortcut)` | `DropdownMenuShortcut` | `<span>` | Keyboard hint |
| `kiso(:dropdown_menu, :group)` | `DropdownMenuGroup` | `<div>` | Semantic grouping |
| `kiso(:dropdown_menu, :sub)` | `DropdownMenuSub` | (context wrapper) | Sub-menu root |
| `kiso(:dropdown_menu, :sub_trigger)` | `DropdownMenuSubTrigger` | `<div>` | Opens sub-menu |
| `kiso(:dropdown_menu, :sub_content)` | `DropdownMenuSubContent` | `<div>` | Sub-menu panel |

**shadcn source:** `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/dropdown-menu.tsx`
**Nuxt UI theme:** `vendor/nuxt-ui/src/theme/dropdown-menu.ts`
**Stimulus:** Yes — popover positioning, keyboard nav (arrow keys, Enter,
Escape), click outside, sub-menu hover/keyboard opening, focus management.
**Props on item:** `inset:` (boolean), `variant:` (default, destructive)
**Depends on:** Popover (Issue 2)
**Complexity:** Very high

**Note:** `DropdownMenuPortal` is listed in shadcn exports but is an internal
implementation detail (renders via portal). Kiso won't expose it as a
sub-part — the content partial handles portaling internally.

---

### Issue 5: Toast + Toaster

Notification system. shadcn deprecated their native toast for Sonner (a
third-party library). Kiso builds its own following Nuxt UI's architecture
(richer, framework-controlled).

| Kiso component | shadcn/Nuxt UI reference | HTML | Purpose |
|---|---|---|---|
| `kiso(:toaster)` | `Toaster` | `<div>` (fixed viewport) | Container, positioning, stacking |
| `kiso(:toast)` | `Toast` | `<li>` | Individual notification |
| `kiso(:toast, :title)` | Toast title slot | `<div>` | Heading text |
| `kiso(:toast, :description)` | Toast description slot | `<div>` | Secondary text |
| `kiso(:toast, :close)` | Toast close slot | `<button>` | Dismiss button |

**shadcn source:** `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/sonner.tsx`
(wrapper around Sonner library — reference only, not structural source)
**Nuxt UI theme:** `vendor/nuxt-ui/src/theme/toast.ts`,
`vendor/nuxt-ui/src/theme/toaster.ts`
**Stimulus:** Yes — auto-dismiss timer, stacking/positioning, swipe-to-dismiss,
flash message integration, Rails helper for `flash` → toast.
**Variants (Nuxt UI):** `color` (7 colors), `orientation` (vertical, horizontal)
**Complexity:** High. This is a system, not just a component.

---

### Issue 6: Command

Search/command palette. shadcn builds this on `cmdk`. 9 exports.

| Kiso component | shadcn export | HTML | Purpose |
|---|---|---|---|
| `kiso(:command)` | `Command` | `<div>` | Root with search filtering |
| `kiso(:command, :input)` | `CommandInput` | `<div>` + `<input>` | Search field |
| `kiso(:command, :list)` | `CommandList` | scrollable `<div>` | Results container |
| `kiso(:command, :empty)` | `CommandEmpty` | `<div>` | "No results" message |
| `kiso(:command, :group)` | `CommandGroup` | `<div>` | Grouped results |
| `kiso(:command, :item)` | `CommandItem` | `<div>` | Individual result item |
| `kiso(:command, :separator)` | `CommandSeparator` | `<div>` | Divider |
| `kiso(:command, :shortcut)` | `CommandShortcut` | `<span>` | Keyboard hint |
| `kiso(:command, :dialog)` | `CommandDialog` | `<dialog>` | Command palette in modal |

**shadcn source:** `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/command.tsx`
**Nuxt UI theme:** `vendor/nuxt-ui/src/theme/command-palette.ts`
**Stimulus:** Yes — search/filter as you type, keyboard nav (arrow keys,
Enter, Escape), item selection, Cmd+K shortcut to open dialog.
**External dependency in shadcn:** `cmdk` library — Kiso needs Stimulus equivalent.
**Complexity:** High

---

### Issue 7: Calendar

Date grid. shadcn uses `react-day-picker`. Kiso needs custom Stimulus.

| Kiso component | shadcn export | HTML | Purpose |
|---|---|---|---|
| `kiso(:calendar)` | `Calendar` | `<div>` + `<table>` | Date grid with navigation |

**shadcn source:** `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/calendar.tsx`
**Nuxt UI theme:** `vendor/nuxt-ui/src/theme/calendar.ts`
**Stimulus:** Yes — month navigation (prev/next), date selection, range
highlighting, disabled dates, min/max bounds, keyboard nav (arrow keys).
**Modes:** single, range, multiple
**External dependency in shadcn:** `react-day-picker` ^9.7.0, `date-fns` ^4.1.0
— Kiso needs Stimulus equivalent from scratch.
**Nuxt UI variants:** `color` (7), `variant` (solid/outline/soft/subtle), `size` (xs-xl)
**Complexity:** Very high

---

### Issue 8: DatePicker (composition pattern)

Not a standalone shadcn component — it's Calendar + Popover composed. Kiso
can provide a convenience wrapper.

| Kiso component | shadcn pattern | HTML | Purpose |
|---|---|---|---|
| `kiso(:date_picker)` | Popover + Calendar | `<div>` | Trigger button + popover + calendar |

**shadcn source:** `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/date-picker-demo.tsx`
(composition example, not a registered component)
**Stimulus:** Inherits from Popover + Calendar controllers.
**Modes:** single date, date range (two-month display), presets via Select
**Depends on:** Popover (Issue 2) + Calendar (Issue 7)
**Complexity:** Medium (if Popover + Calendar are done)

---

### Issue 9: Sidebar

The most complex component in all of shadcn. 23 exports + 1 hook. 3 collapse
modes, mobile Sheet overlay, keyboard shortcut, cookie persistence.

| Kiso component | shadcn export | HTML |
|---|---|---|
| `kiso(:sidebar_provider)` | `SidebarProvider` | `<div>` (context + CSS vars) |
| `kiso(:sidebar)` | `Sidebar` | `<div>` / Sheet on mobile |
| `kiso(:sidebar, :trigger)` | `SidebarTrigger` | `<button>` |
| `kiso(:sidebar, :rail)` | `SidebarRail` | `<button>` |
| `kiso(:sidebar, :inset)` | `SidebarInset` | `<main>` |
| `kiso(:sidebar, :input)` | `SidebarInput` | `<input>` |
| `kiso(:sidebar, :header)` | `SidebarHeader` | `<div>` |
| `kiso(:sidebar, :footer)` | `SidebarFooter` | `<div>` |
| `kiso(:sidebar, :separator)` | `SidebarSeparator` | Separator component |
| `kiso(:sidebar, :content)` | `SidebarContent` | `<div>` (scrollable) |
| `kiso(:sidebar, :group)` | `SidebarGroup` | `<div>` |
| `kiso(:sidebar, :group_label)` | `SidebarGroupLabel` | `<div>` |
| `kiso(:sidebar, :group_action)` | `SidebarGroupAction` | `<button>` |
| `kiso(:sidebar, :group_content)` | `SidebarGroupContent` | `<div>` |
| `kiso(:sidebar, :menu)` | `SidebarMenu` | `<ul>` |
| `kiso(:sidebar, :menu_item)` | `SidebarMenuItem` | `<li>` |
| `kiso(:sidebar, :menu_button)` | `SidebarMenuButton` | `<button>` / `<a>` |
| `kiso(:sidebar, :menu_action)` | `SidebarMenuAction` | `<button>` |
| `kiso(:sidebar, :menu_badge)` | `SidebarMenuBadge` | `<div>` |
| `kiso(:sidebar, :menu_skeleton)` | `SidebarMenuSkeleton` | `<div>` |
| `kiso(:sidebar, :menu_sub)` | `SidebarMenuSub` | `<ul>` |
| `kiso(:sidebar, :menu_sub_item)` | `SidebarMenuSubItem` | `<li>` |
| `kiso(:sidebar, :menu_sub_button)` | `SidebarMenuSubButton` | `<a>` / `<button>` |

**shadcn source:** `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/sidebar.tsx`
**Nuxt UI theme:** `vendor/nuxt-ui/src/theme/dashboard-sidebar.ts` (simpler pattern)
**Stimulus:** Yes — collapse/expand, mobile sheet overlay, Cmd/Ctrl+B keyboard
shortcut, cookie persistence (7-day), tooltip on collapsed icon-only mode.
**Variants:** `side` (left/right), `variant` (sidebar/floating/inset),
`collapsible` (offcanvas/icon/none), button `size` (default/sm/lg),
button `variant` (default/outline)
**Constants:** `SIDEBAR_WIDTH=16rem`, `SIDEBAR_WIDTH_MOBILE=18rem`,
`SIDEBAR_WIDTH_ICON=3rem`
**Complexity:** Extremely high. Could be its own batch.

---

## Recommended Build Order

```
Phase 3a (no/light JS — parallelizable):
  1. Breadcrumb        (no JS, simple)
  2. Toggle + ToggleGroup (light Stimulus)

Phase 3b (Popover foundation):
  3. Popover           (foundation for 4, 6, 8)

Phase 3c (Popover dependents — parallelizable after 3b):
  4. DropdownMenu      (depends on Popover)
  5. Toast + Toaster   (independent system)

Phase 3d (heavy JS):
  6. Command           (search/filter engine)
  7. Calendar          (date grid from scratch)
  8. DatePicker        (composes Popover + Calendar)

Phase 3e (or separate batch):
  9. Sidebar           (most complex, 23 sub-parts)
```

## Also Needed (from issue #12)

These are cross-cutting concerns, not individual component issues:

- [ ] importmap config for Stimulus controllers
- [ ] Icons helper (port `icon_for()` or use kiso-icons gem)
- [ ] Pagination helper (Pagy integration)
- [ ] Toast helper (flash message integration)
- [ ] Sidebar helper (cookie-based state)

## Component Count Summary

| Issue | Component | Sub-parts | Stimulus | Depends on |
|---|---|---|---|---|
| 1 | Breadcrumb | 7 | No | — |
| 2 | Popover | 7 | Yes | — |
| 3 | Toggle + ToggleGroup | 3 | Yes | — |
| 4 | DropdownMenu | 14 | Yes | Popover |
| 5 | Toast + Toaster | 5 | Yes | — |
| 6 | Command | 9 | Yes | — |
| 7 | Calendar | 1 | Yes | — |
| 8 | DatePicker | 1 | Yes | Popover, Calendar |
| 9 | Sidebar | 23 | Yes | — |
| **Total** | **9 issues** | **70 sub-parts** | | |
