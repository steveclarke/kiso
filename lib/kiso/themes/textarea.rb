module Kiso
  module Themes
    Textarea = ClassVariants.build(
      base: "text-foreground w-full rounded-md outline-none transition-[color,box-shadow] " \
            "min-h-16 field-sizing-content " \
            "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground " \
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
          sm: "px-2.5 py-2 text-sm",
          md: "px-3 py-2 text-base md:text-sm",
          lg: "px-3 py-2 text-base"
        }
      },
      defaults: {variant: :outline, size: :md}
    )
  end
end
