module Kiso
  module Themes
    # User avatar with image, fallback initials, optional status badge,
    # and group layout.
    #
    # Supports automatic contrast text color for initials via
    # {ColorUtils.contrast_text_color} in the partial.
    #
    # @example
    #   Avatar.render(size: :md)
    #
    # Variants:
    # - +size+ -- :xs, :sm, :md (default), :lg, :xl, :2xl
    #
    # Sub-parts: {AvatarImage}, {AvatarFallback}, {AvatarBadge},
    # {AvatarGroup}, {AvatarGroupCount}
    Avatar = ClassVariants.build(
      base: "group/avatar relative flex shrink-0 rounded-full select-none items-center justify-center bg-muted",
      variants: {
        size: {
          xs: "size-5",
          sm: "size-6",
          md: "size-8",
          lg: "size-10",
          xl: "size-16",
          "2xl": "size-20"
        }
      },
      defaults: {size: :md}
    )

    # The +<img>+ element, absolutely positioned to fill the avatar circle.
    AvatarImage = ClassVariants.build(
      base: "absolute inset-0 aspect-square size-full rounded-full object-cover"
    )

    # Initials or icon shown when no image is provided.
    #
    # Variants:
    # - +size+ -- :xs, :sm, :md (default), :lg, :xl, :2xl (controls font size)
    AvatarFallback = ClassVariants.build(
      base: "flex size-full items-center justify-center rounded-full bg-muted text-muted-foreground font-medium",
      variants: {
        size: {
          xs: "text-[10px]",
          sm: "text-xs",
          md: "text-sm",
          lg: "text-base",
          xl: "text-2xl",
          "2xl": "text-3xl"
        }
      },
      defaults: {size: :md}
    )

    # Status indicator dot positioned at the bottom-right corner.
    # Size adapts to the parent avatar via +group-data-[size=*]+ selectors.
    AvatarBadge = ClassVariants.build(
      base: "bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 " \
            "inline-flex items-center justify-center rounded-full ring-2 select-none " \
            "group-data-[size=xs]/avatar:size-1.5 group-data-[size=xs]/avatar:[&>svg]:hidden " \
            "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden " \
            "group-data-[size=md]/avatar:size-2.5 group-data-[size=md]/avatar:[&>svg]:size-2 " \
            "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2 " \
            "group-data-[size=xl]/avatar:size-4 group-data-[size=xl]/avatar:[&>svg]:size-3 " \
            "group-data-[size=2xl]/avatar:size-5 group-data-[size=2xl]/avatar:[&>svg]:size-3.5"
    )

    # Overlapping row of avatars with negative spacing.
    AvatarGroup = ClassVariants.build(
      base: "*:data-[slot=avatar]:ring-background group/avatar-group flex -space-x-2 " \
            "*:data-[slot=avatar]:ring-2"
    )

    # "+N" overflow indicator at the end of an {AvatarGroup}.
    AvatarGroupCount = ClassVariants.build(
      base: "bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 " \
            "items-center justify-center rounded-full text-sm ring-2 " \
            "group-has-data-[size=xs]/avatar-group:size-5 " \
            "group-has-data-[size=sm]/avatar-group:size-6 " \
            "group-has-data-[size=lg]/avatar-group:size-10 " \
            "group-has-data-[size=xl]/avatar-group:size-16 " \
            "group-has-data-[size=2xl]/avatar-group:size-20 " \
            "[&>svg]:size-4 " \
            "group-has-data-[size=xs]/avatar-group:[&>svg]:size-2.5 " \
            "group-has-data-[size=sm]/avatar-group:[&>svg]:size-3 " \
            "group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 " \
            "group-has-data-[size=xl]/avatar-group:[&>svg]:size-6 " \
            "group-has-data-[size=2xl]/avatar-group:[&>svg]:size-7"
    )
  end
end
