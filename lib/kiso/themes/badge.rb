module Kiso
  module Themes
    COLORS = %i[primary secondary success info warning error neutral].freeze

    Badge = ClassVariants.build(
      base: "inline-flex items-center justify-center font-medium whitespace-nowrap shrink-0 overflow-hidden " \
            "transition-[color,box-shadow] " \
            "[&>svg]:pointer-events-none [&>svg]:shrink-0 " \
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      variants: {
        variant: {
          solid: "",
          outline: "ring ring-inset",
          soft: "",
          subtle: "ring ring-inset"
        },
        size: {
          xs: "px-1 py-0.5 text-[8px]/3 rounded-full gap-0.5 [&>svg]:size-2.5",
          sm: "px-1.5 py-0.5 text-[10px]/3 rounded-full gap-0.5 [&>svg]:size-3",
          md: "px-2 py-0.5 text-xs rounded-full gap-1 [&>svg]:size-3",
          lg: "px-2.5 py-1 text-sm rounded-full gap-1 [&>svg]:size-3.5",
          xl: "px-2.5 py-1 text-base rounded-full gap-1.5 [&>svg]:size-4"
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
      defaults: {color: :primary, variant: :soft, size: :md}
    )
  end
end
