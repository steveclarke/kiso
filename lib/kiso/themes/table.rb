module Kiso
  module Themes
    # shadcn wraps <table> in a scrollable container div.
    # Container: relative w-full overflow-x-auto
    # Table: w-full caption-bottom text-sm
    Table = ClassVariants.build(
      base: "w-full caption-bottom text-sm"
    )

    # shadcn: [&_tr]:border-b
    TableHeader = ClassVariants.build(
      base: "[&_tr]:border-b"
    )

    # shadcn: [&_tr:last-child]:border-0
    TableBody = ClassVariants.build(
      base: "[&_tr:last-child]:border-0"
    )

    # shadcn: bg-muted/50 border-t font-medium [&>tr]:last:border-b-0
    TableFooter = ClassVariants.build(
      base: "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0"
    )

    # shadcn: hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors
    TableRow = ClassVariants.build(
      base: "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
    )

    # shadcn: text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap
    #         [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]
    TableHead = ClassVariants.build(
      base: "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
    )

    # shadcn: p-2 align-middle whitespace-nowrap
    #         [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]
    TableCell = ClassVariants.build(
      base: "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
    )

    # shadcn: text-muted-foreground mt-4 text-sm
    TableCaption = ClassVariants.build(
      base: "text-muted-foreground mt-4 text-sm"
    )
  end
end
