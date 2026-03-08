module Kiso
  module Themes
    # Root application wrapper. Provides base structure and sets
    # `text-foreground` for dark mode inheritance.
    #
    # @example
    #   App.render
    #
    # No variants — purely structural.
    App = ClassVariants.build(
      base: "bg-background text-foreground antialiased"
    )

    # Content containment with consistent max-width and padding.
    #
    # @example
    #   Container.render(size: :default)
    #
    # Variants:
    # - +size+ — :narrow, :default, :wide, :full
    #
    # Nuxt UI base: w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8
    Container = ClassVariants.build(
      base: "mx-auto w-full px-4 sm:px-6 lg:px-8",
      variants: {
        size: {
          narrow: "max-w-3xl",
          default: "max-w-7xl",
          wide: "max-w-screen-2xl",
          full: "max-w-full"
        }
      },
      defaults: {size: :default}
    )

    # Site/app header. Semantic `<header>` element.
    #
    # @example
    #   Header.render
    #
    # No variants — purely structural.
    #
    # Nuxt UI base: bg-default/75 backdrop-blur border-b border-default
    #   h-(--ui-header-height) sticky top-0 z-50
    Header = ClassVariants.build(
      base: "bg-background/75 backdrop-blur border-b border-border sticky top-0 z-50"
    )

    # Site/app footer. Semantic `<footer>` element.
    #
    # @example
    #   Footer.render
    #
    # No variants — purely structural.
    Footer = ClassVariants.build(
      base: ""
    )

    # Primary content area wrapper. Semantic `<main>` element.
    #
    # @example
    #   Main.render
    #
    # No variants — purely structural.
    Main = ClassVariants.build(
      base: "flex-1"
    )
  end
end
