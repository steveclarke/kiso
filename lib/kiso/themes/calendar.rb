module Kiso
  module Themes
    # Calendar date grid wrapping Cally web components.
    #
    # Since Cally renders inside Shadow DOM, most visual styling lives in
    # +calendar.css+ via +::part()+ selectors. This theme module provides:
    # - Wrapper classes (layout, padding, text color)
    # - CSS custom property mappings for color × variant (consumed by +::part()+ rules)
    #
    # The +color+ / +variant+ axes control the selected-date cell styling
    # through CSS custom properties (+--cally-color+, +--cally-color-fg+),
    # following the same compound variant formulas as Badge/Alert/Button.
    #
    # @example
    #   Calendar.render(color: :primary, variant: :solid, size: :md)
    #
    # Variants:
    # - +color+ — :primary (default), :secondary, :success, :info, :warning, :error, :neutral
    # - +variant+ — :solid (default), :outline, :soft, :subtle
    # - +size+ — :sm, :md (default), :lg
    Calendar = ClassVariants.build(
      base: "text-foreground inline-block",
      variants: {
        variant: {
          solid: "",
          outline: "",
          soft: "",
          subtle: ""
        },
        size: {
          sm: "[--cally-cell:1.75rem] text-xs",
          md: "[--cally-cell:2rem] text-sm",
          lg: "[--cally-cell:2.25rem] text-base"
        },
        color: COLORS.index_with { "" }
      },
      compound_variants: [
        # -- solid: selected cell gets bg-{color} text-{color}-foreground --
        {color: :primary, variant: :solid, class: "[--cally-color:var(--color-primary)] [--cally-color-fg:var(--color-primary-foreground)]"},
        {color: :secondary, variant: :solid, class: "[--cally-color:var(--color-secondary)] [--cally-color-fg:var(--color-secondary-foreground)]"},
        {color: :success, variant: :solid, class: "[--cally-color:var(--color-success)] [--cally-color-fg:var(--color-success-foreground)]"},
        {color: :info, variant: :solid, class: "[--cally-color:var(--color-info)] [--cally-color-fg:var(--color-info-foreground)]"},
        {color: :warning, variant: :solid, class: "[--cally-color:var(--color-warning)] [--cally-color-fg:var(--color-warning-foreground)]"},
        {color: :error, variant: :solid, class: "[--cally-color:var(--color-error)] [--cally-color-fg:var(--color-error-foreground)]"},
        {color: :neutral, variant: :solid, class: "[--cally-color:var(--color-inverted)] [--cally-color-fg:var(--color-inverted-foreground)]"},

        # -- outline: selected cell gets ring + text-{color} --
        {color: :primary, variant: :outline, class: "[--cally-color:var(--color-primary)] [--cally-color-fg:var(--color-primary)]"},
        {color: :secondary, variant: :outline, class: "[--cally-color:var(--color-secondary)] [--cally-color-fg:var(--color-secondary)]"},
        {color: :success, variant: :outline, class: "[--cally-color:var(--color-success)] [--cally-color-fg:var(--color-success)]"},
        {color: :info, variant: :outline, class: "[--cally-color:var(--color-info)] [--cally-color-fg:var(--color-info)]"},
        {color: :warning, variant: :outline, class: "[--cally-color:var(--color-warning)] [--cally-color-fg:var(--color-warning)]"},
        {color: :error, variant: :outline, class: "[--cally-color:var(--color-error)] [--cally-color-fg:var(--color-error)]"},
        {color: :neutral, variant: :outline, class: "[--cally-color:var(--color-accented)] [--cally-color-fg:var(--color-foreground)]"},

        # -- soft: selected cell gets bg-{color}/10 text-{color} --
        {color: :primary, variant: :soft, class: "[--cally-color:var(--color-primary)] [--cally-color-fg:var(--color-primary)]"},
        {color: :secondary, variant: :soft, class: "[--cally-color:var(--color-secondary)] [--cally-color-fg:var(--color-secondary)]"},
        {color: :success, variant: :soft, class: "[--cally-color:var(--color-success)] [--cally-color-fg:var(--color-success)]"},
        {color: :info, variant: :soft, class: "[--cally-color:var(--color-info)] [--cally-color-fg:var(--color-info)]"},
        {color: :warning, variant: :soft, class: "[--cally-color:var(--color-warning)] [--cally-color-fg:var(--color-warning)]"},
        {color: :error, variant: :soft, class: "[--cally-color:var(--color-error)] [--cally-color-fg:var(--color-error)]"},
        {color: :neutral, variant: :soft, class: "[--cally-color:var(--color-elevated)] [--cally-color-fg:var(--color-foreground)]"},

        # -- subtle: selected cell gets bg-{color}/10 text-{color} ring-{color}/25 --
        {color: :primary, variant: :subtle, class: "[--cally-color:var(--color-primary)] [--cally-color-fg:var(--color-primary)]"},
        {color: :secondary, variant: :subtle, class: "[--cally-color:var(--color-secondary)] [--cally-color-fg:var(--color-secondary)]"},
        {color: :success, variant: :subtle, class: "[--cally-color:var(--color-success)] [--cally-color-fg:var(--color-success)]"},
        {color: :info, variant: :subtle, class: "[--cally-color:var(--color-info)] [--cally-color-fg:var(--color-info)]"},
        {color: :warning, variant: :subtle, class: "[--cally-color:var(--color-warning)] [--cally-color-fg:var(--color-warning)]"},
        {color: :error, variant: :subtle, class: "[--cally-color:var(--color-error)] [--cally-color-fg:var(--color-error)]"},
        {color: :neutral, variant: :subtle, class: "[--cally-color:var(--color-elevated)] [--cally-color-fg:var(--color-foreground)]"}
      ],
      defaults: {color: :primary, variant: :solid, size: :md}
    )
  end
end
