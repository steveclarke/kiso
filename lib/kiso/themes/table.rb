module Kiso
  module Themes
    # Data table with header, body, footer, and caption sections.
    #
    # The partial wraps the +<table>+ in a scrollable container div.
    #
    # @example
    #   Table.render
    #
    # Sub-parts: {TableHeader}, {TableBody}, {TableFooter}, {TableRow},
    # {TableHead}, {TableCell}, {TableCaption}
    Table = ClassVariants.build(
      base: "w-full caption-bottom text-sm text-foreground"
    )

    # Table header section (+<thead>+). Adds bottom border to child rows.
    TableHeader = ClassVariants.build(
      base: "[&_tr]:border-b [&_tr]:border-border"
    )

    # Table body section (+<tbody>+). Removes border from the last row.
    TableBody = ClassVariants.build(
      base: "[&_tr:last-child]:border-0"
    )

    # Table footer section (+<tfoot>+) with muted background.
    TableFooter = ClassVariants.build(
      base: "bg-muted/50 border-t border-border font-medium [&>tr]:last:border-b-0"
    )

    # Table row (+<tr>+) with hover highlight and selection state.
    TableRow = ClassVariants.build(
      base: "hover:bg-muted/50 data-[state=selected]:bg-muted border-b border-border transition-colors"
    )

    # Table header cell (+<th>+) with fixed height and font-medium.
    TableHead = ClassVariants.build(
      base: "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
    )

    # Table data cell (+<td>+).
    TableCell = ClassVariants.build(
      base: "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
    )

    # Table caption (+<caption>+) rendered below the table.
    TableCaption = ClassVariants.build(
      base: "text-muted-foreground mt-4 text-sm"
    )
  end
end
