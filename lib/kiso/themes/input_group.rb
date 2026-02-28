module Kiso
  module Themes
    # Wrapper that combines an input with leading/trailing addons (icons, text, buttons).
    #
    # Resets the inner input's ring/shadow so the group ring applies uniformly.
    #
    # @example
    #   InputGroup.render
    #
    # Sub-parts: {InputGroupAddon}
    InputGroup = ClassVariants.build(
      base: "relative flex w-full items-center rounded-md text-foreground " \
            "ring ring-inset ring-accented shadow-xs " \
            "h-9 min-w-0 has-[>textarea]:h-auto " \
            "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-primary " \
            "has-[[aria-invalid]]:ring-error " \
            "[&_input]:flex-1 [&_input]:rounded-none [&_input]:border-0 [&_input]:shadow-none [&_input]:ring-0 [&_input]:bg-transparent [&_input]:focus-visible:ring-0 " \
            "[&_textarea]:flex-1 [&_textarea]:rounded-none [&_textarea]:border-0 [&_textarea]:shadow-none [&_textarea]:ring-0 [&_textarea]:bg-transparent [&_textarea]:focus-visible:ring-0",
      variants: {},
      defaults: {}
    )

    # Leading or trailing addon element (icon, text, button) inside an {InputGroup}.
    #
    # Variants:
    # - +align+ — :start (default, left side), :end (right side)
    InputGroupAddon = ClassVariants.build(
      base: "text-muted-foreground flex items-center justify-center gap-2 py-1.5 text-sm font-medium select-none " \
            "[&_svg:not([class*='size-'])]:size-4",
      variants: {
        align: {
          start: "ps-3",
          end: "pe-3"
        }
      },
      defaults: {align: :start}
    )
  end
end
