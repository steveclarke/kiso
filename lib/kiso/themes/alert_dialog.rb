module Kiso
  module Themes
    # Alert dialog for confirmations that require an explicit user action.
    # Wraps the native +<dialog>+ element with +role="alertdialog"+.
    # Unlike {Dialog}, cannot be dismissed by backdrop click or Escape key.
    #
    # Reuses the +kiso--dialog+ Stimulus controller with
    # +dismissable: false+.
    #
    # Sub-parts: {AlertDialogContent}, {AlertDialogHeader},
    # {AlertDialogTitle}, {AlertDialogDescription}, {AlertDialogMedia},
    # {AlertDialogFooter}, {AlertDialogAction}, {AlertDialogCancel}
    AlertDialog = ClassVariants.build(
      base: "fixed inset-0 z-50 m-0 h-full w-full max-w-none max-h-none bg-black/50 p-0 " \
            "items-center justify-center backdrop:bg-transparent open:flex"
    )

    # The centered panel inside the {AlertDialog} overlay. Supports
    # +size:+ variant (+:default+ or +:sm+).
    AlertDialogContent = ClassVariants.build(
      base: "bg-background text-foreground relative grid w-full max-w-[calc(100%-2rem)] " \
            "gap-4 rounded-lg border p-6 shadow-lg outline-none group/alert-dialog-content",
      variants: {
        size: {
          default: "sm:max-w-lg",
          sm: "max-w-xs"
        }
      },
      defaults: {size: :default}
    )

    # Grid container for {AlertDialogTitle}, {AlertDialogDescription},
    # and optional {AlertDialogMedia}. Adapts layout responsively when
    # media is present via +has-[...]+ selectors.
    AlertDialogHeader = ClassVariants.build(
      base: "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center " \
            "has-[[data-slot=alert-dialog-media]]:grid-rows-[auto_auto_1fr] " \
            "has-[[data-slot=alert-dialog-media]]:gap-x-6 " \
            "sm:group-data-[size=default]/alert-dialog-content:place-items-start " \
            "sm:group-data-[size=default]/alert-dialog-content:text-left " \
            "sm:group-data-[size=default]/alert-dialog-content:has-[[data-slot=alert-dialog-media]]:grid-rows-[auto_1fr]"
    )

    # Action buttons container. Reversed column on mobile, horizontal
    # on desktop. Grid layout when parent content is +:sm+ size.
    AlertDialogFooter = ClassVariants.build(
      base: "flex flex-col-reverse gap-2 " \
            "group-data-[size=sm]/alert-dialog-content:grid " \
            "group-data-[size=sm]/alert-dialog-content:grid-cols-2 " \
            "sm:flex-row sm:justify-end"
    )

    # The alert dialog heading. Renders as +<h2>+. Shifts to column 2
    # when media is present in default size.
    AlertDialogTitle = ClassVariants.build(
      base: "text-lg font-semibold " \
            "sm:group-data-[size=default]/alert-dialog-content:group-has-[[data-slot=alert-dialog-media]]/alert-dialog-content:col-start-2"
    )

    # Descriptive text below the {AlertDialogTitle}.
    AlertDialogDescription = ClassVariants.build(
      base: "text-muted-foreground text-sm"
    )

    # Optional icon or image container in the header. Renders as a
    # rounded box with muted background. Spans 2 rows in default size.
    AlertDialogMedia = ClassVariants.build(
      base: "bg-muted mb-2 inline-flex size-16 items-center justify-center rounded-md " \
            "sm:group-data-[size=default]/alert-dialog-content:row-span-2 " \
            "*:[svg:not([class*='size-'])]:size-8"
    )

    # Action and Cancel buttons are styled directly via
    # {Kiso::Themes::Button} in their partials — no theme constants
    # needed. See +alert_dialog/_action.html.erb+ and
    # +alert_dialog/_cancel.html.erb+.
  end
end
