module Kiso
  module Themes
    # shadcn: flex flex-col gap-6
    #         has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3
    FieldSet = ClassVariants.build(
      base: "flex flex-col gap-6 " \
            "has-[>[data-slot=checkbox-group]]:gap-3 " \
            "has-[>[data-slot=radio-group]]:gap-3"
    )

    # shadcn: mb-3 font-medium + variant (legend: text-base, label: text-sm)
    FieldLegend = ClassVariants.build(
      base: "mb-3 font-medium",
      variants: {
        variant: {
          legend: "text-base",
          label: "text-sm"
        }
      },
      defaults: {variant: :legend}
    )
  end
end
