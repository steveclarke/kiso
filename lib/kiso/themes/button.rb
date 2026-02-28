module Kiso
  module Themes
    Button = ClassVariants.build(
      base: "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap shrink-0 " \
            "transition-all " \
            "focus-visible:outline-2 focus-visible:outline-offset-2 " \
            "disabled:pointer-events-none disabled:opacity-50 " \
            "aria-disabled:cursor-not-allowed aria-disabled:opacity-50 " \
            "#{Shared::SVG_BASE}",
      variants: {
        variant: {
          solid: "",
          outline: "ring ring-inset",
          soft: "",
          subtle: "ring ring-inset",
          ghost: "",
          link: "underline-offset-4"
        },
        size: {
          xs: "h-7 px-2 py-1 text-xs rounded-md gap-1 has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
          sm: "h-8 px-3 py-1.5 text-xs rounded-md gap-1.5 has-[>svg]:px-2.5",
          md: "h-9 px-4 py-2 text-sm rounded-md gap-2 has-[>svg]:px-3",
          lg: "h-10 px-5 py-2.5 text-sm rounded-md gap-2 has-[>svg]:px-4",
          xl: "h-11 px-6 py-3 text-base rounded-md gap-2.5 has-[>svg]:px-5 [&_svg:not([class*='size-'])]:size-5"
        },
        color: COLORS.index_with { "" },
        block: {
          true => "w-full",
          false => ""
        }
      },
      compound_variants: [
        # == solid (base: bg-{color} text-{color}-foreground) ==
        {color: :primary, variant: :solid, class: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 focus-visible:outline-primary"},
        {color: :secondary, variant: :solid, class: "bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/80 focus-visible:outline-secondary"},
        {color: :success, variant: :solid, class: "bg-success text-success-foreground hover:bg-success/90 active:bg-success/80 focus-visible:outline-success"},
        {color: :info, variant: :solid, class: "bg-info text-info-foreground hover:bg-info/90 active:bg-info/80 focus-visible:outline-info"},
        {color: :warning, variant: :solid, class: "bg-warning text-warning-foreground hover:bg-warning/90 active:bg-warning/80 focus-visible:outline-warning"},
        {color: :error, variant: :solid, class: "bg-error text-error-foreground hover:bg-error/90 active:bg-error/80 focus-visible:outline-error"},
        {color: :neutral, variant: :solid, class: "bg-inverted text-inverted-foreground hover:bg-inverted/90 active:bg-inverted/80 focus-visible:outline-inverted"},

        # == outline (base: text-{color} ring-{color}/50) ==
        {color: :primary, variant: :outline, class: "text-primary ring-primary/50 hover:bg-primary/10 active:bg-primary/15 focus-visible:ring-2 focus-visible:ring-primary"},
        {color: :secondary, variant: :outline, class: "text-secondary ring-secondary/50 hover:bg-secondary/10 active:bg-secondary/15 focus-visible:ring-2 focus-visible:ring-secondary"},
        {color: :success, variant: :outline, class: "text-success ring-success/50 hover:bg-success/10 active:bg-success/15 focus-visible:ring-2 focus-visible:ring-success"},
        {color: :info, variant: :outline, class: "text-info ring-info/50 hover:bg-info/10 active:bg-info/15 focus-visible:ring-2 focus-visible:ring-info"},
        {color: :warning, variant: :outline, class: "text-warning ring-warning/50 hover:bg-warning/10 active:bg-warning/15 focus-visible:ring-2 focus-visible:ring-warning"},
        {color: :error, variant: :outline, class: "text-error ring-error/50 hover:bg-error/10 active:bg-error/15 focus-visible:ring-2 focus-visible:ring-error"},
        {color: :neutral, variant: :outline, class: "text-foreground bg-background ring-accented hover:bg-elevated active:bg-elevated focus-visible:ring-2 focus-visible:ring-inverted"},

        # == soft (base: bg-{color}/10 text-{color}) ==
        {color: :primary, variant: :soft, class: "bg-primary/10 text-primary hover:bg-primary/15 active:bg-primary/20 focus-visible:outline-primary"},
        {color: :secondary, variant: :soft, class: "bg-secondary/10 text-secondary hover:bg-secondary/15 active:bg-secondary/20 focus-visible:outline-secondary"},
        {color: :success, variant: :soft, class: "bg-success/10 text-success hover:bg-success/15 active:bg-success/20 focus-visible:outline-success"},
        {color: :info, variant: :soft, class: "bg-info/10 text-info hover:bg-info/15 active:bg-info/20 focus-visible:outline-info"},
        {color: :warning, variant: :soft, class: "bg-warning/10 text-warning hover:bg-warning/15 active:bg-warning/20 focus-visible:outline-warning"},
        {color: :error, variant: :soft, class: "bg-error/10 text-error hover:bg-error/15 active:bg-error/20 focus-visible:outline-error"},
        {color: :neutral, variant: :soft, class: "text-foreground bg-elevated hover:bg-accented/75 active:bg-accented focus-visible:outline-inverted"},

        # == subtle (base: bg-{color}/10 text-{color} ring-{color}/25) ==
        {color: :primary, variant: :subtle, class: "bg-primary/10 text-primary ring-primary/25 hover:bg-primary/15 active:bg-primary/20 focus-visible:ring-2 focus-visible:ring-primary"},
        {color: :secondary, variant: :subtle, class: "bg-secondary/10 text-secondary ring-secondary/25 hover:bg-secondary/15 active:bg-secondary/20 focus-visible:ring-2 focus-visible:ring-secondary"},
        {color: :success, variant: :subtle, class: "bg-success/10 text-success ring-success/25 hover:bg-success/15 active:bg-success/20 focus-visible:ring-2 focus-visible:ring-success"},
        {color: :info, variant: :subtle, class: "bg-info/10 text-info ring-info/25 hover:bg-info/15 active:bg-info/20 focus-visible:ring-2 focus-visible:ring-info"},
        {color: :warning, variant: :subtle, class: "bg-warning/10 text-warning ring-warning/25 hover:bg-warning/15 active:bg-warning/20 focus-visible:ring-2 focus-visible:ring-warning"},
        {color: :error, variant: :subtle, class: "bg-error/10 text-error ring-error/25 hover:bg-error/15 active:bg-error/20 focus-visible:ring-2 focus-visible:ring-error"},
        {color: :neutral, variant: :subtle, class: "text-foreground bg-elevated ring-accented hover:bg-accented/75 active:bg-accented focus-visible:ring-2 focus-visible:ring-inverted"},

        # == ghost (no background until hover) ==
        {color: :primary, variant: :ghost, class: "text-primary hover:bg-primary/10 active:bg-primary/15 focus-visible:outline-primary"},
        {color: :secondary, variant: :ghost, class: "text-secondary hover:bg-secondary/10 active:bg-secondary/15 focus-visible:outline-secondary"},
        {color: :success, variant: :ghost, class: "text-success hover:bg-success/10 active:bg-success/15 focus-visible:outline-success"},
        {color: :info, variant: :ghost, class: "text-info hover:bg-info/10 active:bg-info/15 focus-visible:outline-info"},
        {color: :warning, variant: :ghost, class: "text-warning hover:bg-warning/10 active:bg-warning/15 focus-visible:outline-warning"},
        {color: :error, variant: :ghost, class: "text-error hover:bg-error/10 active:bg-error/15 focus-visible:outline-error"},
        {color: :neutral, variant: :ghost, class: "text-foreground hover:bg-elevated active:bg-accented/75 focus-visible:outline-inverted"},

        # == link (text color + underline on hover) ==
        {color: :primary, variant: :link, class: "text-primary hover:text-primary/75 active:text-primary/75 hover:underline focus-visible:outline-primary"},
        {color: :secondary, variant: :link, class: "text-secondary hover:text-secondary/75 active:text-secondary/75 hover:underline focus-visible:outline-secondary"},
        {color: :success, variant: :link, class: "text-success hover:text-success/75 active:text-success/75 hover:underline focus-visible:outline-success"},
        {color: :info, variant: :link, class: "text-info hover:text-info/75 active:text-info/75 hover:underline focus-visible:outline-info"},
        {color: :warning, variant: :link, class: "text-warning hover:text-warning/75 active:text-warning/75 hover:underline focus-visible:outline-warning"},
        {color: :error, variant: :link, class: "text-error hover:text-error/75 active:text-error/75 hover:underline focus-visible:outline-error"},
        {color: :neutral, variant: :link, class: "text-muted-foreground hover:text-foreground active:text-foreground hover:underline focus-visible:outline-inverted"}
      ],
      defaults: {color: :primary, variant: :solid, size: :md, block: false}
    )
  end
end
