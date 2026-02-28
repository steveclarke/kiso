module Kiso
  module Themes
    # Contextual alert banner with optional icon, title, and description.
    #
    # Uses CSS Grid with +has-[>svg]+ to auto-allocate a column for the icon
    # when an SVG is present as a direct child.
    #
    # @example
    #   Alert.render(color: :error, variant: :soft)
    #
    # Variants:
    # - +color+ — :primary (default), :secondary, :success, :info, :warning, :error, :neutral
    # - +variant+ — :solid, :outline, :soft (default), :subtle
    #
    # Sub-parts: {AlertTitle}, {AlertDescription}
    Alert = ClassVariants.build(
      base: "relative w-full rounded-lg px-4 py-3 text-sm " \
            "grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] " \
            "has-[>svg]:gap-x-3 gap-y-0.5 items-start " \
            "[&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
      variants: {
        variant: {
          solid: "",
          outline: "ring ring-inset",
          soft: "",
          subtle: "ring ring-inset"
        },
        color: COLORS.index_with { "" }
      },
      compound_variants: [
        # -- solid --
        {color: :primary, variant: :solid, class: "bg-primary text-primary-foreground"},
        {color: :secondary, variant: :solid, class: "bg-secondary text-secondary-foreground"},
        {color: :success, variant: :solid, class: "bg-success text-success-foreground"},
        {color: :info, variant: :solid, class: "bg-info text-info-foreground"},
        {color: :warning, variant: :solid, class: "bg-warning text-warning-foreground"},
        {color: :error, variant: :solid, class: "bg-error text-error-foreground"},
        {color: :neutral, variant: :solid, class: "bg-inverted text-inverted-foreground"},

        # -- outline --
        {color: :primary, variant: :outline, class: "text-primary ring-primary/50"},
        {color: :secondary, variant: :outline, class: "text-secondary ring-secondary/50"},
        {color: :success, variant: :outline, class: "text-success ring-success/50"},
        {color: :info, variant: :outline, class: "text-info ring-info/50"},
        {color: :warning, variant: :outline, class: "text-warning ring-warning/50"},
        {color: :error, variant: :outline, class: "text-error ring-error/50"},
        {color: :neutral, variant: :outline, class: "text-foreground bg-background ring-accented"},

        # -- soft --
        {color: :primary, variant: :soft, class: "bg-primary/10 text-primary"},
        {color: :secondary, variant: :soft, class: "bg-secondary/10 text-secondary"},
        {color: :success, variant: :soft, class: "bg-success/10 text-success"},
        {color: :info, variant: :soft, class: "bg-info/10 text-info"},
        {color: :warning, variant: :soft, class: "bg-warning/10 text-warning"},
        {color: :error, variant: :soft, class: "bg-error/10 text-error"},
        {color: :neutral, variant: :soft, class: "text-foreground bg-elevated"},

        # -- subtle --
        {color: :primary, variant: :subtle, class: "bg-primary/10 text-primary ring-primary/25"},
        {color: :secondary, variant: :subtle, class: "bg-secondary/10 text-secondary ring-secondary/25"},
        {color: :success, variant: :subtle, class: "bg-success/10 text-success ring-success/25"},
        {color: :info, variant: :subtle, class: "bg-info/10 text-info ring-info/25"},
        {color: :warning, variant: :subtle, class: "bg-warning/10 text-warning ring-warning/25"},
        {color: :error, variant: :subtle, class: "bg-error/10 text-error ring-error/25"},
        {color: :neutral, variant: :subtle, class: "text-foreground bg-elevated ring-accented"}
      ],
      defaults: {color: :primary, variant: :soft}
    )

    # Alert title text. Rendered in the second grid column (after the icon column).
    AlertTitle = ClassVariants.build(
      base: "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight"
    )

    # Alert body text. Uses +opacity-90+ for relative dimming on colored backgrounds.
    AlertDescription = ClassVariants.build(
      base: "col-start-2 grid justify-items-start gap-1 text-sm opacity-90 [&_p]:leading-relaxed"
    )
  end
end
