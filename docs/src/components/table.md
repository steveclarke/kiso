---
title: Table
layout: docs
description: Data table with semantic HTML elements, hover states, and scrollable container.
category: Data
source: lib/kiso/themes/table.rb
---

## Quick Start

```erb
<%%= kui(:table) do %>
  <%%= kui(:table, :header) do %>
    <%%= kui(:table, :row) do %>
      <%%= kui(:table, :head) { "Name" } %>
      <%%= kui(:table, :head) { "Email" } %>
      <%%= kui(:table, :head, css_classes: "text-right") { "Amount" } %>
    <%% end %>
  <%% end %>
  <%%= kui(:table, :body) do %>
    <%%= kui(:table, :row) do %>
      <%%= kui(:table, :cell, css_classes: "font-medium") { "Alice" } %>
      <%%= kui(:table, :cell) { "alice@example.com" } %>
      <%%= kui(:table, :cell, css_classes: "text-right") { "$250.00" } %>
    <%% end %>
  <%% end %>
<%% end %>
```

<%= render "component_preview", component: "kiso/table", scenario: "playground", height: "450px" %>

## Locals

The root `table` has no variant axis — it renders a scrollable container
wrapping a `<table>` element.

| Local | Type | Default |
|-------|------|---------|
| `css_classes:` | String | `""` |
| `**component_options` | Hash | `{}` |

## Sub-parts

| Part | HTML | Usage | Purpose |
|------|------|-------|---------|
| `:header` | `<thead>` | `kui(:table, :header)` | Table head section |
| `:body` | `<tbody>` | `kui(:table, :body)` | Table body section |
| `:footer` | `<tfoot>` | `kui(:table, :footer)` | Table foot with muted bg |
| `:row` | `<tr>` | `kui(:table, :row)` | Table row with hover state |
| `:head` | `<th>` | `kui(:table, :head)` | Column header cell |
| `:cell` | `<td>` | `kui(:table, :cell)` | Data cell |
| `:caption` | `<caption>` | `kui(:table, :caption)` | Table caption (bottom) |

All sub-parts accept `css_classes:` and `**component_options`.

## Anatomy

```
Table (scrollable container + <table>)
├── Caption
├── Header (<thead>)
│   └── Row (<tr>)
│       └── Head (<th>) ×n
├── Body (<tbody>)
│   └── Row (<tr>) ×n
│       └── Cell (<td>) ×n
└── Footer (<tfoot>)
    └── Row (<tr>)
        └── Cell (<td>) ×n
```

## Usage

### With Caption and Footer

```erb
<%%= kui(:table) do %>
  <%%= kui(:table, :caption) { "A list of your recent invoices." } %>
  <%%= kui(:table, :header) do %>
    <%%= kui(:table, :row) do %>
      <%%= kui(:table, :head, css_classes: "w-[100px]") { "Invoice" } %>
      <%%= kui(:table, :head) { "Status" } %>
      <%%= kui(:table, :head) { "Method" } %>
      <%%= kui(:table, :head, css_classes: "text-right") { "Amount" } %>
    <%% end %>
  <%% end %>
  <%%= kui(:table, :body) do %>
    <%%= kui(:table, :row) do %>
      <%%= kui(:table, :cell, css_classes: "font-medium") { "INV001" } %>
      <%%= kui(:table, :cell) { "Paid" } %>
      <%%= kui(:table, :cell) { "Credit Card" } %>
      <%%= kui(:table, :cell, css_classes: "text-right") { "$250.00" } %>
    <%% end %>
  <%% end %>
  <%%= kui(:table, :footer) do %>
    <%%= kui(:table, :row) do %>
      <%%= kui(:table, :cell, colspan: 3) { "Total" } %>
      <%%= kui(:table, :cell, css_classes: "text-right") { "$2,500.00" } %>
    <%% end %>
  <%% end %>
<%% end %>
```

### Striped Rows

Add alternating row colors via `css_classes:` on individual rows:

```erb
<%%= kui(:table, :row, css_classes: "bg-muted/25") do %>
  ...
<%% end %>
```

### Right-aligned Columns

Use `css_classes: "text-right"` on both the `:head` and `:cell` for
numeric columns:

```erb
<%%= kui(:table, :head, css_classes: "text-right") { "Amount" } %>
<%%= kui(:table, :cell, css_classes: "text-right") { "$250.00" } %>
```

### Selected Rows

Add `data-state="selected"` to highlight a row:

```erb
<%%= kui(:table, :row, "data-state": "selected") do %>
  ...
<%% end %>
```

## Theme

```ruby
Kiso::Themes::Table        = ClassVariants.build(base: "w-full caption-bottom text-sm")
Kiso::Themes::TableHeader  = ClassVariants.build(base: "[&_tr]:border-b")
Kiso::Themes::TableBody    = ClassVariants.build(base: "[&_tr:last-child]:border-0")
Kiso::Themes::TableFooter  = ClassVariants.build(base: "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0")
Kiso::Themes::TableRow     = ClassVariants.build(base: "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors")
Kiso::Themes::TableHead    = ClassVariants.build(base: "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap ...")
Kiso::Themes::TableCell    = ClassVariants.build(base: "p-2 align-middle whitespace-nowrap ...")
Kiso::Themes::TableCaption = ClassVariants.build(base: "text-muted-foreground mt-4 text-sm")
```

The root component wraps the `<table>` in a `<div class="relative w-full overflow-x-auto">`
for horizontal scrolling on narrow viewports.

## Accessibility

Table uses native HTML table elements (`<table>`, `<thead>`, `<tbody>`,
`<tfoot>`, `<tr>`, `<th>`, `<td>`, `<caption>`) which provide built-in
accessibility semantics.

The `<caption>` element is rendered at the bottom of the table visually
(`caption-bottom`) but is read first by screen readers.
