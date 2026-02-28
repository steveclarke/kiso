module Kiso
  module Themes
    # Fieldset grouping for related form controls (e.g. checkbox/radio groups).
    #
    # Automatically tightens gap when containing checkbox or radio groups.
    #
    # @example
    #   FieldSet.render
    #
    # Sub-parts: {FieldLegend}
    FieldSet = ClassVariants.build(
      base: "flex flex-col gap-6 " \
            "has-[>[data-slot=checkbox-group]]:gap-3 " \
            "has-[>[data-slot=radio-group]]:gap-3"
    )

    # Heading for a {FieldSet}.
    #
    # Variants:
    # - +variant+ — :legend (default, larger text), :label (smaller, label-sized)
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
