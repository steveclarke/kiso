module Kiso
  module Themes
    Input = ClassVariants.build(
      base: "text-foreground w-full min-w-0 rounded-md outline-none transition-[color,box-shadow] " \
            "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground " \
            "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium " \
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " \
            "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary " \
            "aria-invalid:ring-error aria-invalid:focus-visible:ring-error",
      variants: {
        variant: {
          outline: "bg-background ring ring-inset ring-accented shadow-xs",
          soft: "bg-elevated/50 hover:bg-elevated focus:bg-elevated",
          ghost: "bg-transparent hover:bg-elevated focus:bg-elevated"
        },
        size: {
          sm: "h-8 px-2.5 py-1 text-sm",
          md: "h-9 px-3 py-1 text-base md:text-sm",
          lg: "h-10 px-3 py-2 text-base"
        }
      },
      defaults: {variant: :outline, size: :md}
    )
  end
end
