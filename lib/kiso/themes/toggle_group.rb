module Kiso
  module Themes
    # shadcn ToggleGroup:
    #   group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md
    #   data-[spacing=default]:data-[variant=outline]:shadow-xs

    ToggleGroup = ClassVariants.build(
      base: "flex w-fit items-center rounded-md text-foreground"
    )
  end
end
