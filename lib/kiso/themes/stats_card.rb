module Kiso
  module Themes
    # Stats card — specialized Card layout for dashboard metrics.
    # Same variant axis as Card (outline/soft/subtle) with tighter spacing.
    # shadcn ref: section-cards.tsx (Card + CardDescription + CardTitle + CardAction)
    # Maquina ref: stats/_stats_card.html.erb
    StatsCard = ClassVariants.build(
      base: "flex flex-col gap-2 rounded-xl p-4 text-foreground",
      variants: {
        variant: {
          outline: "bg-background ring ring-inset ring-border shadow-sm",
          soft: "bg-elevated/50",
          subtle: "bg-elevated/50 ring ring-inset ring-border"
        }
      },
      defaults: {variant: :outline}
    )

    # shadcn: CardHeader with CardDescription + CardAction in a row
    # Flex row for label on left, optional icon/badge on right.
    StatsCardHeader = ClassVariants.build(
      base: "flex items-center justify-between gap-2"
    )

    # shadcn: CardDescription — text-sm text-muted-foreground
    # The metric name ("Total Revenue", "New Customers").
    StatsCardLabel = ClassVariants.build(
      base: "text-sm font-medium text-muted-foreground"
    )

    # shadcn: CardTitle overridden to text-2xl font-semibold tabular-nums
    # The big metric number ("$1,250.00", "45,678").
    StatsCardValue = ClassVariants.build(
      base: "text-2xl font-semibold tabular-nums"
    )

    # shadcn: CardFooter description — text-xs text-muted-foreground
    # Trend text, subtitle, or additional context.
    StatsCardDescription = ClassVariants.build(
      base: "text-xs text-muted-foreground"
    )

    # Responsive grid wrapper for stats cards.
    # Maquina ref: stats/_stats_grid.html.erb
    StatsGrid = ClassVariants.build(
      base: "grid grid-cols-1 gap-4",
      variants: {
        columns: {
          2 => "sm:grid-cols-2",
          3 => "sm:grid-cols-3",
          4 => "sm:grid-cols-2 lg:grid-cols-4"
        }
      },
      defaults: {columns: 4}
    )
  end
end
