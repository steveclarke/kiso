module Kiso
  module Themes
    # shadcn: group/field-group @container/field-group flex w-full flex-col gap-7
    #         [&>[data-slot=field-group]]:gap-4
    FieldGroup = ClassVariants.build(
      base: "group/field-group @container/field-group flex w-full flex-col gap-7 " \
            "[&>[data-slot=field-group]]:gap-4"
    )
  end
end
