module Kiso
  module Themes
    Checkbox = ClassVariants.build(
      base: "appearance-none size-4 shrink-0 rounded-[4px] " \
            "ring ring-inset ring-accented shadow-xs " \
            "transition-shadow outline-none " \
            "disabled:cursor-not-allowed disabled:opacity-50 " \
            "focus-visible:ring-[3px] " \
            "aria-invalid:ring-error/30 aria-invalid:ring-2",
      variants: {
        color: COLORS.index_with { "" }
      },
      compound_variants: [
        {color: :primary, class: "checked:bg-primary checked:ring-primary checked:text-primary-foreground focus-visible:ring-primary/50"},
        {color: :secondary, class: "checked:bg-secondary checked:ring-secondary checked:text-secondary-foreground focus-visible:ring-secondary/50"},
        {color: :success, class: "checked:bg-success checked:ring-success checked:text-success-foreground focus-visible:ring-success/50"},
        {color: :info, class: "checked:bg-info checked:ring-info checked:text-info-foreground focus-visible:ring-info/50"},
        {color: :warning, class: "checked:bg-warning checked:ring-warning checked:text-warning-foreground focus-visible:ring-warning/50"},
        {color: :error, class: "checked:bg-error checked:ring-error checked:text-error-foreground focus-visible:ring-error/50"},
        {color: :neutral, class: "checked:bg-inverted checked:ring-inverted checked:text-inverted-foreground focus-visible:ring-inverted/50"}
      ],
      defaults: {color: :primary}
    )
  end
end
