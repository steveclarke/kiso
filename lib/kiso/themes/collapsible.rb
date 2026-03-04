module Kiso
  module Themes
    # Interactive panel that expands/collapses content.
    #
    # @example
    #   Collapsible.render
    #
    # Sub-parts: {CollapsibleTrigger}, {CollapsibleContent}
    #
    # shadcn base: (no classes — purely structural wrapper)
    Collapsible = ClassVariants.build(
      base: ""
    )

    # shadcn: (no classes — trigger is user-provided, typically a button)
    CollapsibleTrigger = ClassVariants.build(
      base: ""
    )

    # shadcn: (no classes — content is animated via CSS)
    # Nuxt UI: data-[state=open]:animate-[collapsible-down_200ms_ease-out]
    #          data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden
    CollapsibleContent = ClassVariants.build(
      base: "overflow-hidden"
    )
  end
end
