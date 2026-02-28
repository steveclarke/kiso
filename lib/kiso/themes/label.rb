module Kiso
  module Themes
    # Standalone text label for form controls.
    #
    # Automatically dims when the associated control is disabled (via
    # +group-data-[disabled]+ and +peer-disabled+ selectors).
    #
    # @example
    #   Label.render
    Label = ClassVariants.build(
      base: "flex items-center gap-2 text-sm leading-none font-medium select-none " \
            "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 " \
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
    )
  end
end
