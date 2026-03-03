module Kiso
  module Themes
    Avatar = ClassVariants.build(
      base: "group/avatar relative flex shrink-0 rounded-full select-none items-center justify-center bg-muted",
      variants: {
        size: {
          sm: "size-6",
          md: "size-8",
          lg: "size-10"
        }
      },
      defaults: {size: :md}
    )

    AvatarImage = ClassVariants.build(
      base: "absolute inset-0 aspect-square size-full rounded-full object-cover"
    )

    AvatarFallback = ClassVariants.build(
      base: "flex size-full items-center justify-center rounded-full bg-muted text-muted-foreground font-medium",
      variants: {
        size: {
          sm: "text-xs",
          md: "text-sm",
          lg: "text-base"
        }
      },
      defaults: {size: :md}
    )

    AvatarBadge = ClassVariants.build(
      base: "bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 " \
            "inline-flex items-center justify-center rounded-full ring-2 select-none " \
            "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden " \
            "group-data-[size=md]/avatar:size-2.5 group-data-[size=md]/avatar:[&>svg]:size-2 " \
            "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2"
    )

    AvatarGroup = ClassVariants.build(
      base: "*:data-[slot=avatar]:ring-background group/avatar-group flex -space-x-2 " \
            "*:data-[slot=avatar]:ring-2"
    )

    AvatarGroupCount = ClassVariants.build(
      base: "bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 " \
            "items-center justify-center rounded-full text-sm ring-2 " \
            "group-has-data-[size=lg]/avatar-group:size-10 " \
            "group-has-data-[size=sm]/avatar-group:size-6 " \
            "[&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 " \
            "group-has-data-[size=sm]/avatar-group:[&>svg]:size-3"
    )
  end
end
