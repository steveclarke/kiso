module Kiso
  module Themes
    # shadcn: group/field flex w-full gap-3 data-[invalid=true]:text-destructive
    #         + orientation variants (vertical/horizontal/responsive)
    Field = ClassVariants.build(
      base: "group/field flex w-full gap-3 text-foreground data-[invalid=true]:text-error",
      variants: {
        orientation: {
          vertical: "flex-col [&>*]:w-full [&>.sr-only]:w-auto",
          horizontal: "flex-row items-center " \
                      "[&>[data-slot=field-label]]:flex-auto " \
                      "has-[>[data-slot=field-content]]:items-start " \
                      "has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
          responsive: "flex-col [&>*]:w-full [&>.sr-only]:w-auto " \
                      "@md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto " \
                      "@md/field-group:[&>[data-slot=field-label]]:flex-auto " \
                      "@md/field-group:has-[>[data-slot=field-content]]:items-start " \
                      "@md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
        }
      },
      defaults: {orientation: :vertical}
    )

    # shadcn: group/field-content flex flex-1 flex-col gap-1.5 leading-snug
    FieldContent = ClassVariants.build(
      base: "group/field-content flex flex-1 flex-col gap-1.5 leading-snug"
    )

    # shadcn: group/field-label peer/field-label flex w-fit gap-2 leading-snug
    #         group-data-[disabled=true]/field:opacity-50
    #         + checkbox/radio container classes (dormant until those components exist)
    FieldLabel = ClassVariants.build(
      base: "group/field-label peer/field-label flex w-fit gap-2 leading-snug " \
            "group-data-[disabled=true]/field:opacity-50 " \
            "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col " \
            "has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border " \
            "[&>*[data-slot=field]]:p-4"
    )

    # shadcn: flex w-fit items-center gap-2 text-sm leading-snug font-medium
    #         group-data-[disabled=true]/field:opacity-50
    FieldTitle = ClassVariants.build(
      base: "flex w-fit items-center gap-2 text-sm leading-snug font-medium " \
            "group-data-[disabled=true]/field:opacity-50"
    )

    # shadcn: text-muted-foreground text-sm leading-normal font-normal
    #         + horizontal text-balance, spacing adjustments, link styling
    FieldDescription = ClassVariants.build(
      base: "text-muted-foreground text-sm leading-normal font-normal " \
            "group-has-[[data-orientation=horizontal]]/field:text-balance " \
            "last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5 " \
            "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4"
    )

    # shadcn: text-destructive text-sm font-normal
    FieldError = ClassVariants.build(
      base: "text-error text-sm font-normal"
    )

    # shadcn: relative -my-2 h-5 text-sm
    FieldSeparator = ClassVariants.build(
      base: "relative -my-2 h-5 text-sm"
    )

    # shadcn: bg-background text-muted-foreground relative mx-auto block w-fit px-2
    FieldSeparatorText = ClassVariants.build(
      base: "bg-background text-muted-foreground relative mx-auto block w-fit px-2"
    )
  end
end
