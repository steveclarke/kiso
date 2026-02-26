---
title: Table
layout: docs
description: Data table with semantic HTML elements, hover states, and scrollable container.
category: Data
source: lib/kiso/themes/table.rb
---

## Quick Start

```erb
<%%= kiso(:table) do %>
  <%%= kiso(:table, :header) do %>
    <%%= kiso(:table, :row) do %>
      <%%= kiso(:table, :head) { "Name" } %>
      <%%= kiso(:table, :head) { "Email" } %>
      <%%= kiso(:table, :head, css_classes: "text-right") { "Amount" } %>
    <%% end %>
  <%% end %>
  <%%= kiso(:table, :body) do %>
    <%%= kiso(:table, :row) do %>
      <%%= kiso(:table, :cell, css_classes: "font-medium") { "Alice" } %>
      <%%= kiso(:table, :cell) { "alice@example.com" } %>
      <%%= kiso(:table, :cell, css_classes: "text-right") { "$250.00" } %>
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
| `:header` | `<thead>` | `kiso(:table, :header)` | Table head section |
| `:body` | `<tbody>` | `kiso(:table, :body)` | Table body section |
| `:footer` | `<tfoot>` | `kiso(:table, :footer)` | Table foot with muted bg |
| `:row` | `<tr>` | `kiso(:table, :row)` | Table row with hover state |
| `:head` | `<th>` | `kiso(:table, :head)` | Column header cell |
| `:cell` | `<td>` | `kiso(:table, :cell)` | Data cell |
| `:caption` | `<caption>` | `kiso(:table, :caption)` | Table caption (bottom) |

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
<%%= kiso(:table) do %>
  <%%= kiso(:table, :caption) { "A list of your recent invoices." } %>
  <%%= kiso(:table, :header) do %>
    <%%= kiso(:table, :row) do %>
      <%%= kiso(:table, :head, css_classes: "w-[100px]") { "Invoice" } %>
      <%%= kiso(:table, :head) { "Status" } %>
      <%%= kiso(:table, :head) { "Method" } %>
      <%%= kiso(:table, :head, css_classes: "text-right") { "Amount" } %>
    <%% end %>
  <%% end %>
  <%%= kiso(:table, :body) do %>
    <%%= kiso(:table, :row) do %>
      <%%= kiso(:table, :cell, css_classes: "font-medium") { "INV001" } %>
      <%%= kiso(:table, :cell) { "Paid" } %>
      <%%= kiso(:table, :cell) { "Credit Card" } %>
      <%%= kiso(:table, :cell, css_classes: "text-right") { "$250.00" } %>
    <%% end %>
  <%% end %>
  <%%= kiso(:table, :footer) do %>
    <%%= kiso(:table, :row) do %>
      <%%= kiso(:table, :cell, colspan: 3) { "Total" } %>
      <%%= kiso(:table, :cell, css_classes: "text-right") { "$2,500.00" } %>
    <%% end %>
  <%% end %>
<%% end %>
```

### Striped Rows

Add alternating row colors via `css_classes:` on individual rows:

```erb
<%%= kiso(:table, :row, css_classes: "bg-muted/25") do %>
  ...
<%% end %>
```

### Right-aligned Columns

Use `css_classes: "text-right"` on both the `:head` and `:cell` for
numeric columns:

```erb
<%%= kiso(:table, :head, css_classes: "text-right") { "Amount" } %>
<%%= kiso(:table, :cell, css_classes: "text-right") { "$250.00" } %>
```

### Selected Rows

Add `data-state="selected"` to highlight a row:

```erb
<%%= kiso(:table, :row, "data-state": "selected") do %>
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
