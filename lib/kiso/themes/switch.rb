module Kiso
  module Themes
    # shadcn track: inline-flex shrink-0 items-center rounded-full border border-transparent
    #               shadow-xs transition-all outline-none
    #               data-[state=checked]:bg-primary data-[state=unchecked]:bg-input
    #               focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
    #               disabled:cursor-not-allowed disabled:opacity-50
    #
    # shadcn thumb: bg-background pointer-events-none block rounded-full ring-0 transition-transform
    #               data-[state=checked]:translate-x-[calc(100%-2px)]
    #               data-[state=unchecked]:translate-x-0
    #
    # Kiso: uses native <input type="checkbox"> inside a <label> that doubles as
    # the track. has-[:checked]: drives track color, peer-checked: drives thumb
    # translation. The <label> wraps: sr-only input + thumb <span>.

    SwitchTrack = ClassVariants.build(
      base: "relative inline-flex shrink-0 cursor-pointer items-center rounded-full " \
            "border-2 border-transparent shadow-xs outline-none bg-accented " \
            "transition-colors " \
            "has-[:focus-visible]:ring-[3px] " \
            "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
      variants: {
        color: COLORS.index_with { "" },
        size: {
          sm: "h-4 w-8",
          md: "h-5 w-9"
        }
      },
      compound_variants: [
        {color: :primary, class: "has-[:checked]:bg-primary has-[:focus-visible]:ring-primary/50"},
        {color: :secondary, class: "has-[:checked]:bg-secondary has-[:focus-visible]:ring-secondary/50"},
        {color: :success, class: "has-[:checked]:bg-success has-[:focus-visible]:ring-success/50"},
        {color: :info, class: "has-[:checked]:bg-info has-[:focus-visible]:ring-info/50"},
        {color: :warning, class: "has-[:checked]:bg-warning has-[:focus-visible]:ring-warning/50"},
        {color: :error, class: "has-[:checked]:bg-error has-[:focus-visible]:ring-error/50"},
        {color: :neutral, class: "has-[:checked]:bg-inverted has-[:focus-visible]:ring-inverted/50"}
      ],
      defaults: {color: :primary, size: :md}
    )

    SwitchThumb = ClassVariants.build(
      base: "pointer-events-none block rounded-full bg-background shadow-lg ring-0 " \
            "transition-transform translate-x-0.5",
      variants: {
        size: {
          sm: "size-3 peer-checked:translate-x-4",
          md: "size-4 peer-checked:translate-x-4"
        }
      },
      defaults: {size: :md}
    )
  end
end
