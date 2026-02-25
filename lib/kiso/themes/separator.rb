module Kiso
  module Themes
    # shadcn base: bg-border shrink-0
    # Horizontal: h-px w-full
    # Vertical: h-full w-px
    Separator = ClassVariants.build(
      base: "bg-border shrink-0",
      variants: {
        orientation: {
          horizontal: "h-px w-full",
          vertical: "h-full w-px"
        }
      },
      defaults: {orientation: :horizontal}
    )
  end
end
