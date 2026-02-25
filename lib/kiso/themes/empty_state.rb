module Kiso
  module Themes
    # shadcn base: flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12
    # border-dashed pre-sets the style — no visible border unless user adds `border` via css_classes.
    EmptyState = ClassVariants.build(
      base: "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12"
    )

    # shadcn: flex max-w-sm flex-col items-center gap-2 text-center
    EmptyStateHeader = ClassVariants.build(
      base: "flex max-w-sm flex-col items-center gap-2 text-center"
    )

    # shadcn: flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0
    # variant: default (transparent bg) | icon (muted background + rounded container)
    EmptyStateMedia = ClassVariants.build(
      base: "flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      variants: {
        variant: {
          default: "bg-transparent",
          icon: "bg-muted text-foreground size-10 rounded-lg [&_svg:not([class*='size-'])]:size-6"
        }
      },
      defaults: {variant: :default}
    )

    # shadcn: text-lg font-medium tracking-tight
    EmptyStateTitle = ClassVariants.build(
      base: "text-lg font-medium tracking-tight"
    )

    # shadcn: text-muted-foreground text-sm/relaxed [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4
    EmptyStateDescription = ClassVariants.build(
      base: "text-muted-foreground text-sm/relaxed [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4"
    )

    # shadcn: flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance
    EmptyStateContent = ClassVariants.build(
      base: "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance"
    )
  end
end
