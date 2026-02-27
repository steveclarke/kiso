module Kiso
  module Themes
    # shadcn base: bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm
    # We use variant: instead of hardcoded border + shadow, and our semantic tokens.
    Card = ClassVariants.build(
      base: "flex flex-col gap-6 rounded-xl py-6 text-foreground",
      variants: {
        variant: {
          outline: "bg-background ring ring-inset ring-border shadow-sm",
          soft: "bg-elevated/50",
          subtle: "bg-elevated/50 ring ring-inset ring-border"
        }
      },
      defaults: {variant: :outline}
    )

    # shadcn: @container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6
    #         has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6
    CardHeader = ClassVariants.build(
      base: "grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 " \
            "has-[>[data-card-part=action]]:grid-cols-[1fr_auto]"
    )

    # shadcn: leading-none font-semibold
    CardTitle = ClassVariants.build(
      base: "font-semibold leading-none"
    )

    # shadcn: text-muted-foreground text-sm
    CardDescription = ClassVariants.build(
      base: "text-sm text-muted-foreground"
    )

    # shadcn: col-start-2 row-span-2 row-start-1 self-start justify-self-end
    CardAction = ClassVariants.build(
      base: "col-start-2 row-span-2 row-start-1 self-start justify-self-end"
    )

    # shadcn: px-6
    CardContent = ClassVariants.build(
      base: "px-6"
    )

    # shadcn: flex items-center px-6 [.border-t]:pt-6
    CardFooter = ClassVariants.build(
      base: "flex items-center px-6"
    )
  end
end
