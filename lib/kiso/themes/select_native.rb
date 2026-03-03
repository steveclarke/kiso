module Kiso
  module Themes
    # Wrapper for the select native element and its chevron icon overlay.
    #
    # @example
    #   SelectNativeWrapper.render
    SelectNativeWrapper = ClassVariants.build(
      base: "relative w-full has-[select:disabled]:opacity-50"
    )

    # Native HTML `<select>` element with appearance-none and Kiso styling.
    #
    # @example
    #   SelectNative.render(variant: :outline, size: :md)
    #
    # Variants:
    # - +variant+ — :outline (default), :soft, :ghost
    # - +size+ — :sm, :md (default), :lg
    SelectNative = ClassVariants.build(
      base: "text-foreground w-full min-w-0 appearance-none rounded-md pr-9 outline-none " \
            "transition-[color,box-shadow] " \
            "disabled:pointer-events-none disabled:cursor-not-allowed " \
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

    # Chevron icon overlay positioned inside the select native wrapper.
    #
    # @example
    #   SelectNativeIcon.render
    SelectNativeIcon = ClassVariants.build(
      base: "text-muted-foreground pointer-events-none absolute top-1/2 right-3.5 " \
            "size-4 -translate-y-1/2 opacity-50 select-none"
    )
  end
end
