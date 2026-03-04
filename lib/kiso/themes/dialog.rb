module Kiso
  module Themes
    # Modal dialog wrapping the native +<dialog>+ element. Opens with
    # +showModal()+ via a Stimulus controller for proper focus trapping,
    # backdrop, and Escape-to-close behavior.
    #
    # The dialog element itself acts as the backdrop overlay (same
    # pattern as {CommandDialog}). A {DialogContent} wrapper inside
    # provides the centered panel.
    #
    # Sub-parts: {DialogContent}, {DialogHeader}, {DialogTitle},
    # {DialogDescription}, {DialogBody}, {DialogFooter}, {DialogClose}
    Dialog = ClassVariants.build(
      base: "fixed inset-0 z-50 m-0 h-full w-full max-w-none max-h-none bg-black/50 p-0 " \
            "items-center justify-center backdrop:bg-transparent open:flex"
    )

    # The centered panel inside the {Dialog} overlay.
    DialogContent = ClassVariants.build(
      base: "bg-background text-foreground relative grid w-full max-w-[calc(100%-2rem)] " \
            "gap-4 rounded-lg border p-6 shadow-lg outline-none sm:max-w-lg"
    )

    # Flex column container for {DialogTitle} and {DialogDescription}.
    DialogHeader = ClassVariants.build(
      base: "flex flex-col gap-2 text-center sm:text-left"
    )

    # Reversed column layout on mobile, horizontal on desktop.
    DialogFooter = ClassVariants.build(
      base: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
    )

    # The dialog heading. Renders as +<h2>+.
    DialogTitle = ClassVariants.build(
      base: "text-lg leading-none font-semibold"
    )

    # Descriptive text below the {DialogTitle}.
    DialogDescription = ClassVariants.build(
      base: "text-muted-foreground text-sm"
    )

    # Main content area between header and footer.
    DialogBody = ClassVariants.build(
      base: "text-sm"
    )

    # Absolutely positioned close button in the top-right corner.
    DialogClose = ClassVariants.build(
      base: "absolute top-4 right-4 rounded-xs opacity-70 transition-opacity " \
            "hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 " \
            "focus-visible:outline-ring disabled:pointer-events-none " \
            "[&>svg]:size-4 cursor-pointer"
    )
  end
end
