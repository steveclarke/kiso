module Kiso
  module Themes
    # OTP/PIN code input container. Positions a transparent real +<input>+
    # over visual slot divs managed by the +kiso--input-otp+ Stimulus controller.
    #
    # @example
    #   InputOtp.render
    InputOtp = ClassVariants.build(
      base: "relative text-foreground flex items-center gap-2 has-disabled:opacity-50"
    )

    # Groups adjacent slots visually (e.g., first 3 digits, last 3 digits).
    InputOtpGroup = ClassVariants.build(
      base: "flex items-center"
    )

    # Individual character display slot with connected borders.
    # Content and active state managed by +kiso--input-otp+ controller.
    #
    # @example
    #   InputOtpSlot.render(size: :md)
    InputOtpSlot = ClassVariants.build(
      base: "border-border relative flex items-center justify-center " \
            "border -ml-px shadow-xs transition-all outline-none " \
            "first:ml-0 first:rounded-l-md last:rounded-r-md " \
            "data-[active=true]:z-10 data-[active=true]:border-primary " \
            "data-[active=true]:ring-[3px] data-[active=true]:ring-primary/50 " \
            "aria-invalid:border-error " \
            "data-[active=true]:aria-invalid:border-error " \
            "data-[active=true]:aria-invalid:ring-error/20",
      variants: {
        size: {
          sm: "size-8 text-xs",
          md: "size-9 text-sm",
          lg: "size-10 text-base"
        }
      },
      defaults: {size: :md}
    )

    # Separator between groups (renders a minus icon by default).
    InputOtpSeparator = ClassVariants.build(
      base: "flex items-center text-muted-foreground [&>svg]:size-4"
    )
  end
end
