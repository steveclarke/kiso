module Kiso
  module Themes
    # Toggle switch built with a native +<input type="checkbox">+ inside a
    # +<label>+ that acts as the track. The +has-[:checked]:+ selector drives
    # track color and +peer-checked:+ drives thumb translation.
    #
    # @example
    #   SwitchTrack.render(color: :primary, size: :md)
    #
    # Variants:
    # - +color+ — :primary (default), :secondary, :success, :info, :warning, :error, :neutral
    # - +size+ — :sm, :md (default)
    #
    # Sub-parts: {SwitchThumb}
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

    # Sliding circle indicator inside the {SwitchTrack}.
    #
    # Variants:
    # - +size+ — :sm, :md (default)
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
