---
title: Command
layout: docs
description: Command menu for search and quick actions with filtering, keyboard navigation, and grouped results.
category: Navigation
source: lib/kiso/themes/command.rb
---

## Quick Start

```erb
<%%= kui(:command, css_classes: "max-w-sm rounded-lg ring ring-inset ring-border") do %>
  <%%= kui(:command, :input, placeholder: "Type a command or search...") %>
  <%%= kui(:command, :list) do %>
    <%%= kui(:command, :empty) { "No results found." } %>
    <%%= kui(:command, :group, heading: "Suggestions") do %>
      <%%= kui(:command, :item, value: "calendar") do %>
        <%%= kiso_icon("calendar") %>
        <span>Calendar</span>
      <%% end %>
      <%%= kui(:command, :item, value: "search") do %>
        <%%= kiso_icon("search") %>
        <span>Search</span>
        <%%= kui(:command, :shortcut) { "⌘K" } %>
      <%% end %>
    <%% end %>
  <%% end %>
<%% end %>
```

<%= render "component_preview", component: "kiso/command", scenario: "playground", height: "400px" %>

## Locals

### Command (root)

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

### Input

| Local | Type | Default |
|-------|------|---------|
| `placeholder:` | String | `nil` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

### Group

| Local | Type | Default |
|-------|------|---------|
| `heading:` | String | `nil` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

### Item

| Local | Type | Default |
|-------|------|---------|
| `value:` | String | `nil` |
| `disabled:` | Boolean | `false` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

### Dialog

| Local | Type | Default |
|-------|------|---------|
| `shortcut:` | String | `"k"` |
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

## Sub-parts

| Part | Usage | HTML | Purpose |
|------|-------|------|---------|
| `:input` | `kui(:command, :input)` | `<div>` + `<input>` | Search field with icon |
| `:list` | `kui(:command, :list)` | `<div>` | Scrollable results container |
| `:empty` | `kui(:command, :empty)` | `<div>` | "No results found" message |
| `:group` | `kui(:command, :group)` | `<div>` | Grouped results with heading |
| `:item` | `kui(:command, :item)` | `<div>` | Individual result item |
| `:separator` | `kui(:command, :separator)` | `<div>` | Divider between groups |
| `:shortcut` | `kui(:command, :shortcut)` | `<span>` | Keyboard hint (right-aligned) |
| `:dialog` | `kui(:command, :dialog)` | `<dialog>` | Command palette in modal (Cmd+K) |

All sub-parts accept `css_classes:` and `**component_options`.

## Anatomy

```
Command
├── Command Input (search icon + text input)
├── Command List
│   ├── Command Empty ("No results found")
│   ├── Command Group (heading: "Suggestions")
│   │   ├── Command Item (value: "calendar")
│   │   │   └── Command Shortcut
│   │   └── Command Item (value: "search")
│   ├── Command Separator
│   └── Command Group (heading: "Settings")
│       └── Command Item (value: "profile")
└── (optional) wrapped in Command Dialog
```

## Usage

### Inline Command Palette

An inline command palette with groups, icons, and keyboard shortcuts.

```erb
<%%= kui(:command, css_classes: "max-w-sm rounded-lg ring ring-inset ring-border") do %>
  <%%= kui(:command, :input, placeholder: "Type a command or search...") %>
  <%%= kui(:command, :list) do %>
    <%%= kui(:command, :empty) { "No results found." } %>
    <%%= kui(:command, :group, heading: "Suggestions") do %>
      <%%= kui(:command, :item, value: "calendar") do %>
        <%%= kiso_icon("calendar") %>
        <span>Calendar</span>
      <%% end %>
    <%% end %>
    <%%= kui(:command, :separator) %>
    <%%= kui(:command, :group, heading: "Settings") do %>
      <%%= kui(:command, :item, value: "profile") do %>
        <%%= kiso_icon("user") %>
        <span>Profile</span>
        <%%= kui(:command, :shortcut) { "⌘P" } %>
      <%% end %>
    <%% end %>
  <%% end %>
<%% end %>
```

### Dialog Mode (Cmd+K)

Wrap the command palette in a dialog for a modal experience. Opens with
Cmd+K (configurable via `shortcut:`), closes with Escape.

```erb
<%%= kui(:command, :dialog) do %>
  <%%= kui(:command) do %>
    <%%= kui(:command, :input, placeholder: "Type a command or search...") %>
    <%%= kui(:command, :list) do %>
      <%%= kui(:command, :empty) { "No results found." } %>
      <%%= kui(:command, :group, heading: "Suggestions") do %>
        <%%= kui(:command, :item, value: "calendar") { "Calendar" } %>
      <%% end %>
    <%% end %>
  <%% end %>
<%% end %>
```

### Disabled Items

```erb
<%%= kui(:command, :item, value: "calculator", disabled: true) do %>
  <%%= kiso_icon("calculator") %>
  <span>Calculator</span>
<%% end %>
```

## Stimulus Controllers

### `kiso--command`

Handles search filtering, keyboard navigation, and item selection.

- **Filter**: As user types, items are filtered by text content match
- **Keyboard**: Arrow up/down moves highlight, Enter selects, Escape closes dialog
- **Groups**: Groups with no matching items are hidden automatically
- **Selection**: `data-selected=true` on highlighted item

### `kiso--command-dialog`

Handles the modal dialog behavior.

- **Open**: Cmd+K (configurable via `shortcut:` local)
- **Close**: Escape key or clicking the backdrop
- **Focus**: Automatically focuses the search input when opened

## Theme

```ruby
Command          = ClassVariants.build(base: "bg-background text-foreground flex h-full w-full flex-col overflow-hidden rounded-md")
CommandInputWrapper = ClassVariants.build(base: "flex h-9 items-center gap-2 border-b border-border px-3")
CommandInput     = ClassVariants.build(base: "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none ...")
CommandList      = ClassVariants.build(base: "max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto")
CommandEmpty     = ClassVariants.build(base: "py-6 text-center text-sm")
CommandGroup     = ClassVariants.build(base: "text-foreground overflow-hidden p-1")
CommandGroupHeading = ClassVariants.build(base: "text-muted-foreground px-2 py-1.5 text-xs font-medium")
CommandItem      = ClassVariants.build(base: "data-[selected=true]:bg-elevated ... relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm ...")
CommandSeparator = ClassVariants.build(base: "bg-border -mx-1 h-px")
CommandShortcut  = ClassVariants.build(base: "text-muted-foreground ml-auto text-xs tracking-widest")
```

## Accessibility

- Command uses `role="listbox"` on the list and `role="option"` on items
- Groups use `role="group"` with heading elements
- Keyboard navigation: Arrow keys, Enter, Escape, Home, End
- Disabled items get `aria-disabled` and `data-disabled="true"`
- Dialog uses native `<dialog>` element with `showModal()` for proper focus trapping
- Search input is auto-focused when dialog opens
