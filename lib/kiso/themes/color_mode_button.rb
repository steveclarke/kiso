# frozen_string_literal: true

module Kiso
  module Themes
    ColorModeButton = ClassVariants.build(
      base: "inline-flex items-center justify-center rounded-md text-foreground/50 hover:text-foreground hover:bg-accent transition-colors duration-150 shrink-0 cursor-pointer",
      variants: {
        size: {
          sm: "w-7 h-7 [&>svg]:size-3.5",
          md: "w-8 h-8 [&>svg]:size-4",
          lg: "w-9 h-9 [&>svg]:size-5"
        }
      },
      defaults: {size: :md}
    )
  end
end
