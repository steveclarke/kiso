module Kiso
  module Themes
    # Form field wrapper that groups a label, input, description, and error message.
    #
    # @example
    #   Field.render(orientation: :vertical)
    #
    # Variants:
    # - +orientation+ — :vertical (default), :horizontal, :responsive
    #
    # Sub-parts: {FieldContent}, {FieldLabel}, {FieldTitle}, {FieldDescription},
    # {FieldError}, {FieldSeparator}, {FieldSeparatorText}
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

    # Wrapper for the input element plus description/error text within a {Field}.
    FieldContent = ClassVariants.build(
      base: "group/field-content flex flex-1 flex-col gap-1.5 leading-snug"
    )

    # Label container within a {Field}. Supports nested field layouts for
    # checkbox/radio card patterns.
    FieldLabel = ClassVariants.build(
      base: "group/field-label peer/field-label flex w-fit gap-2 leading-snug " \
            "group-data-[disabled=true]/field:opacity-50 " \
            "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col " \
            "has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border " \
            "[&>*[data-slot=field]]:p-4"
    )

    # Title text within a {FieldLabel}.
    FieldTitle = ClassVariants.build(
      base: "flex w-fit items-center gap-2 text-sm leading-snug font-medium " \
            "group-data-[disabled=true]/field:opacity-50"
    )

    # Help text below the input. Includes automatic link styling.
    FieldDescription = ClassVariants.build(
      base: "text-muted-foreground text-sm leading-normal font-normal " \
            "group-has-[[data-orientation=horizontal]]/field:text-balance " \
            "last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5 " \
            "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4"
    )

    # Validation error message displayed below the input.
    FieldError = ClassVariants.build(
      base: "text-error text-sm font-normal"
    )

    # Horizontal rule between fields (e.g. "or" divider).
    FieldSeparator = ClassVariants.build(
      base: "relative -my-2 h-5 text-sm"
    )

    # Text label centered on the {FieldSeparator} line.
    FieldSeparatorText = ClassVariants.build(
      base: "bg-background text-muted-foreground relative mx-auto block w-fit px-2"
    )
  end
end
