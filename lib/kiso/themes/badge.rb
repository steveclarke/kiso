module Kiso
  module Themes
    Badge = ClassVariants.build(
      base: "inline-flex items-center rounded-md border font-medium transition-colors",
      variants: {
        variant: {
          default: "border-border bg-muted text-foreground",
          primary: "border-primary/20 bg-primary/10 text-primary",
          secondary: "border-secondary/20 bg-secondary/10 text-secondary",
          success: "border-success/20 bg-success/10 text-success",
          info: "border-info/20 bg-info/10 text-info",
          warning: "border-warning/20 bg-warning/10 text-warning",
          error: "border-error/20 bg-error/10 text-error",
          outline: "border-border-accented bg-transparent text-foreground"
        },
        size: {
          sm: "px-1.5 py-0.5 text-xs",
          md: "px-2 py-0.5 text-xs",
          lg: "px-2.5 py-1 text-sm"
        }
      },
      defaults: { variant: :default, size: :md }
    )
  end
end
