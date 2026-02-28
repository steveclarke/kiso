module Kiso
  module Themes
    # Groups multiple {Field} elements with consistent vertical spacing.
    #
    # Supports nesting — inner field groups use tighter +gap-4+ spacing.
    # Uses +@container/field-group+ for responsive field orientation queries.
    #
    # @example
    #   FieldGroup.render
    FieldGroup = ClassVariants.build(
      base: "group/field-group @container/field-group flex w-full flex-col gap-7 " \
            "[&>[data-slot=field-group]]:gap-4"
    )
  end
end
