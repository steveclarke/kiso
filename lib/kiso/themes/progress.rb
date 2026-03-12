module Kiso
  module Themes
    # Visual progress bar with color, size, and orientation axes.
    #
    # Div-based structure (not native <progress>) for full Tailwind control.
    # Optional status percentage text and step labels (when +max:+ is an array).
    # Indeterminate animation when +value:+ is nil.
    #
    # @example
    #   Progress.render(orientation: :horizontal)
    #
    # Variants:
    # - +orientation+ — :horizontal (default), :vertical
    #
    # Sub-parts: {ProgressTrack}, {ProgressIndicator}, {ProgressStatus},
    #            {ProgressSteps}, {ProgressStep}
    #
    # shadcn base: (no direct equivalent — shadcn wraps in Radix ProgressRoot)
    Progress = ClassVariants.build(
      base: "text-foreground gap-2",
      variants: {
        orientation: {
          horizontal: "w-full flex flex-col",
          vertical: "h-full flex flex-row-reverse"
        }
      },
      defaults: {orientation: :horizontal}
    )

    # Track (bar background) with orientation × size compound variants.
    #
    # shadcn base: bg-primary/20 relative h-2 w-full overflow-hidden rounded-full
    ProgressTrack = ClassVariants.build(
      base: "relative overflow-hidden rounded-full bg-accented",
      variants: {
        orientation: {
          horizontal: "w-full",
          vertical: "h-full"
        },
        size: {
          xs: "", sm: "", md: "", lg: "", xl: ""
        }
      },
      compound_variants: [
        # == horizontal sizes (height) ==
        {orientation: :horizontal, size: :xs, class: "h-0.5"},
        {orientation: :horizontal, size: :sm, class: "h-1"},
        {orientation: :horizontal, size: :md, class: "h-2"},
        {orientation: :horizontal, size: :lg, class: "h-3"},
        {orientation: :horizontal, size: :xl, class: "h-4"},
        # == vertical sizes (width) ==
        {orientation: :vertical, size: :xs, class: "w-0.5"},
        {orientation: :vertical, size: :sm, class: "w-1"},
        {orientation: :vertical, size: :md, class: "w-2"},
        {orientation: :vertical, size: :lg, class: "w-3"},
        {orientation: :vertical, size: :xl, class: "w-4"}
      ],
      defaults: {orientation: :horizontal, size: :md}
    )

    # Indicator (fill bar) — color axis maps directly to bg-{color}.
    # No variant axis (solid/outline/soft/subtle) — just direct color.
    #
    # shadcn base: bg-primary h-full w-full flex-1 transition-all
    ProgressIndicator = ClassVariants.build(
      base: "rounded-full size-full transition-transform duration-200 ease-out",
      variants: {
        color: {
          primary: "bg-primary",
          secondary: "bg-secondary",
          success: "bg-success",
          info: "bg-info",
          warning: "bg-warning",
          error: "bg-error",
          neutral: "bg-inverted"
        }
      },
      defaults: {color: :primary}
    )

    # Status text showing percentage above/beside the bar.
    ProgressStatus = ClassVariants.build(
      base: "flex text-muted-foreground transition-[width] duration-200",
      variants: {
        orientation: {
          horizontal: "flex-row items-center justify-end min-w-fit",
          vertical: "flex-col justify-end min-h-fit"
        },
        size: {
          xs: "text-xs", sm: "text-xs", md: "text-sm", lg: "text-sm", xl: "text-base"
        }
      },
      defaults: {orientation: :horizontal, size: :md}
    )

    # Container for step labels — grid overlay technique.
    ProgressSteps = ClassVariants.build(
      base: "grid items-end",
      variants: {
        color: {
          primary: "text-primary",
          secondary: "text-secondary",
          success: "text-success",
          info: "text-info",
          warning: "text-warning",
          error: "text-error",
          # text-inverted (not text-inverted-foreground) — step labels sit on
          # the page background, so we want dark-on-light / light-on-dark text.
          neutral: "text-inverted"
        },
        size: {
          xs: "text-xs", sm: "text-xs", md: "text-sm", lg: "text-sm", xl: "text-base"
        }
      },
      defaults: {color: :primary, size: :md}
    )

    # Individual step label — stacked in same grid cell via row/col-start-1.
    # Only the active step is visible (opacity-100), others hidden (opacity-0).
    ProgressStep = ClassVariants.build(
      base: "truncate text-end row-start-1 col-start-1 transition-opacity",
      variants: {
        step: {
          active: "opacity-100",
          first: "opacity-50",
          other: "opacity-0",
          last: ""
        }
      },
      defaults: {step: :other}
    )
  end
end
