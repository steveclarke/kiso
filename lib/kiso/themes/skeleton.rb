module Kiso
  module Themes
    # Placeholder element displayed while content is loading.
    #
    # @example
    #   Skeleton.render
    #
    # No variants — dimensions set by consumer via css_classes.
    #
    # shadcn base: animate-pulse rounded-md bg-accent
    # Nuxt UI base: animate-pulse rounded-md bg-elevated
    Skeleton = ClassVariants.build(
      base: "animate-pulse rounded-md bg-elevated"
    )
  end
end
