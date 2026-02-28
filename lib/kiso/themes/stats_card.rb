module Kiso
  module Themes
    # Compact card for displaying a single dashboard metric.
    #
    # Same variant axis as {Card} (outline/soft/subtle) with tighter spacing.
    #
    # @example
    #   StatsCard.render(variant: :outline)
    #
    # Variants:
    # - +variant+ — :outline (default), :soft, :subtle
    #
    # Sub-parts: {StatsCardHeader}, {StatsCardLabel}, {StatsCardValue},
    # {StatsCardDescription}
    #
    # Related: {StatsGrid} for responsive grid layout of multiple stats cards.
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

    # Header row with label on the left and optional icon/badge on the right.
    StatsCardHeader = ClassVariants.build(
      base: "flex items-center justify-between gap-2"
    )

    # The metric name (e.g. "Total Revenue", "New Customers").
    StatsCardLabel = ClassVariants.build(
      base: "text-sm font-medium text-muted-foreground"
    )

    # The prominent metric number (e.g. "$1,250.00", "45,678").
    # Uses +tabular-nums+ for aligned digits.
    StatsCardValue = ClassVariants.build(
      base: "text-2xl font-semibold tabular-nums"
    )

    # Supplementary text below the value (e.g. trend info, subtitle).
    StatsCardDescription = ClassVariants.build(
      base: "text-xs text-muted-foreground"
    )

    # Responsive grid layout for arranging multiple {StatsCard} instances.
    #
    # @example
    #   StatsGrid.render(columns: 4)
    #
    # Variants:
    # - +columns+ — 2, 3, 4 (default)
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
