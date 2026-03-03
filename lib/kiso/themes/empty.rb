module Kiso
  module Themes
    # Empty state placeholder for when there's no content to display.
    #
    # Centered layout with dashed border (border becomes visible when the user
    # adds +border+ via +css_classes:+).
    #
    # @example
    #   Empty.render
    #
    # Sub-parts: {EmptyHeader}, {EmptyMedia}, {EmptyTitle}, {EmptyDescription},
    # {EmptyActions}, {EmptyContent}
    #
    # shadcn base: flex min-w-0 flex-1 flex-col ... border-dashed p-6 ... md:p-12
    Empty = ClassVariants.build(
      base: "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance text-foreground md:p-12"
    )

    # Container for the empty state's title and description.
    EmptyHeader = ClassVariants.build(
      base: "flex max-w-sm flex-col items-center gap-2 text-center"
    )

    # Media container for an illustration or icon above the title.
    #
    # Variants:
    # - +variant+ — :default (transparent), :icon (muted background + rounded container)
    EmptyMedia = ClassVariants.build(
      base: "flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      variants: {
        variant: {
          default: "bg-transparent",
          icon: "bg-muted text-foreground size-10 rounded-lg [&_svg:not([class*='size-'])]:size-6"
        }
      },
      defaults: {variant: :default}
    )

    # Empty state heading text.
    EmptyTitle = ClassVariants.build(
      base: "text-lg font-medium tracking-tight"
    )

    # Empty state body text with automatic link styling.
    EmptyDescription = ClassVariants.build(
      base: "text-muted-foreground text-sm/relaxed [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4"
    )

    # Centered button group for call-to-action buttons.
    EmptyActions = ClassVariants.build(
      base: "flex flex-wrap items-center justify-center gap-2"
    )

    # Container for action buttons or other interactive content.
    EmptyContent = ClassVariants.build(
      base: "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance"
    )
  end
end
