module Kiso
  module Themes
    # Page layout wrapper with optional left/right sidebar grid.
    #
    # Provides a responsive grid that switches from stacked (mobile) to
    # a 10-column grid (desktop). Left and right sidebars each take 2
    # columns, the center adjusts automatically.
    #
    # @example
    #   Page.render
    #
    # Sub-parts: {PageLeft}, {PageCenter}, {PageRight}
    #
    # Nuxt UI base: flex flex-col lg:grid lg:grid-cols-10 lg:gap-10
    Page = ClassVariants.build(
      base: "flex flex-col lg:grid lg:grid-cols-10 lg:gap-10"
    )

    # Left sidebar slot — 2 columns on desktop.
    #
    # Nuxt UI: lg:col-span-2
    PageLeft = ClassVariants.build(
      base: "lg:col-span-2"
    )

    # Center content area — adjusts span based on sidebar presence.
    #
    # Nuxt UI: lg:col-span-8 (default), lg:col-span-6 (both sidebars),
    # lg:col-span-10 (no sidebars)
    PageCenter = ClassVariants.build(
      base: "lg:col-span-8"
    )

    # Right sidebar slot — 2 columns, ordered first on mobile, last on desktop.
    #
    # Nuxt UI: lg:col-span-2 order-first lg:order-last
    PageRight = ClassVariants.build(
      base: "lg:col-span-2 order-first lg:order-last"
    )

    # Page header with title, description, and links.
    #
    # Section header for page-level content with border-bottom divider.
    # Supports headline, title, description, and action links.
    #
    # @example
    #   PageHeader.render
    #
    # Sub-parts: {PageHeaderHeadline}, {PageHeaderTitle},
    # {PageHeaderDescription}, {PageHeaderLinks}
    #
    # Nuxt UI base: relative border-b border-default py-8
    PageHeader = ClassVariants.build(
      base: "relative border-b border-border py-8 text-foreground"
    )

    # Inner wrapper for page header content — flex row on desktop.
    #
    # Nuxt UI: flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4
    PageHeaderWrapper = ClassVariants.build(
      base: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
    )

    # Headline eyebrow text above the page header title.
    #
    # Nuxt UI: mb-2.5 text-sm font-semibold text-primary flex items-center gap-1.5
    PageHeaderHeadline = ClassVariants.build(
      base: "mb-2.5 text-sm font-semibold text-primary flex items-center gap-1.5"
    )

    # Page header title — large bold heading.
    #
    # Nuxt UI: text-3xl sm:text-4xl text-pretty font-bold text-highlighted
    PageHeaderTitle = ClassVariants.build(
      base: "text-3xl sm:text-4xl text-pretty font-bold text-foreground"
    )

    # Page header description text.
    #
    # Nuxt UI: text-lg text-pretty text-muted
    PageHeaderDescription = ClassVariants.build(
      base: "mt-4 text-lg text-pretty text-muted-foreground"
    )

    # Action links container in page header.
    #
    # Nuxt UI: flex flex-wrap items-center gap-1.5
    PageHeaderLinks = ClassVariants.build(
      base: "flex flex-wrap items-center gap-1.5"
    )

    # Page body — main content wrapper with vertical spacing.
    #
    # Nuxt UI base: mt-8 pb-24 space-y-12
    PageBody = ClassVariants.build(
      base: "mt-8 pb-24 space-y-12"
    )

    # Content section with consistent vertical spacing and optional title.
    #
    # Supports horizontal and vertical orientations. Horizontal uses a
    # 2-column grid for side-by-side content. Vertical centers text.
    #
    # @example
    #   PageSection.render(orientation: :vertical)
    #
    # Sub-parts: {PageSectionWrapper}, {PageSectionHeader},
    # {PageSectionTitle}, {PageSectionDescription}, {PageSectionBody},
    # {PageSectionLinks}
    #
    # Nuxt UI base: relative isolate
    PageSection = ClassVariants.build(
      base: "relative isolate text-foreground",
      variants: {
        orientation: {
          horizontal: "",
          vertical: ""
        }
      },
      defaults: {orientation: :horizontal}
    )

    # Section inner container — switches to grid on desktop.
    #
    # Nuxt UI: flex flex-col lg:grid py-16 sm:py-24 lg:py-32 gap-8 sm:gap-16
    PageSectionContainer = ClassVariants.build(
      base: "flex flex-col lg:grid py-16 sm:py-24 lg:py-32 gap-8 sm:gap-16",
      variants: {
        orientation: {
          horizontal: "lg:grid-cols-2 lg:items-center",
          vertical: ""
        }
      },
      defaults: {orientation: :horizontal}
    )

    # Section text/content wrapper.
    PageSectionWrapper = ClassVariants.build(
      base: "",
      variants: {
        order: {
          first: "",
          last: "order-last"
        }
      },
      defaults: {order: :first}
    )

    # Section header for title/description/links grouping.
    PageSectionHeader = ClassVariants.build(
      base: ""
    )

    # Section headline eyebrow text.
    #
    # Nuxt UI: mb-3 font-semibold text-primary flex items-center gap-1.5
    PageSectionHeadline = ClassVariants.build(
      base: "mb-3 font-semibold text-primary flex items-center gap-1.5",
      variants: {
        orientation: {
          horizontal: "",
          vertical: "justify-center"
        }
      },
      defaults: {orientation: :horizontal}
    )

    # Section title — large bold heading.
    #
    # Nuxt UI: text-3xl sm:text-4xl lg:text-5xl text-pretty tracking-tight font-bold text-highlighted
    PageSectionTitle = ClassVariants.build(
      base: "text-3xl sm:text-4xl lg:text-5xl text-pretty tracking-tight font-bold text-foreground",
      variants: {
        orientation: {
          horizontal: "",
          vertical: "text-center"
        }
      },
      defaults: {orientation: :horizontal}
    )

    # Section description text.
    #
    # Nuxt UI: text-base sm:text-lg text-muted
    PageSectionDescription = ClassVariants.build(
      base: "mt-6 text-base sm:text-lg text-muted-foreground",
      variants: {
        orientation: {
          horizontal: "text-pretty",
          vertical: "text-center text-balance"
        }
      },
      defaults: {orientation: :horizontal}
    )

    # Section body for additional content.
    PageSectionBody = ClassVariants.build(
      base: "mt-8"
    )

    # Section action links container.
    #
    # Nuxt UI: flex flex-wrap gap-x-6 gap-y-3
    PageSectionLinks = ClassVariants.build(
      base: "mt-8 flex flex-wrap gap-x-6 gap-y-3",
      variants: {
        orientation: {
          horizontal: "",
          vertical: "justify-center"
        }
      },
      defaults: {orientation: :horizontal}
    )

    # Responsive grid for page cards/features.
    #
    # Nuxt UI base: relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8
    PageGrid = ClassVariants.build(
      base: "relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    )

    # Content card for grid/column layouts.
    #
    # Supports outline, soft, subtle, and ghost variants.
    # Ghost variant has no background or border for minimal styling.
    #
    # @example
    #   PageCard.render(variant: :outline)
    #
    # Sub-parts: {PageCardHeader}, {PageCardBody}, {PageCardFooter},
    # {PageCardIcon}, {PageCardTitle}, {PageCardDescription}
    #
    # Nuxt UI base: relative flex rounded-lg
    PageCard = ClassVariants.build(
      base: "relative flex rounded-lg text-foreground",
      variants: {
        variant: {
          outline: "bg-background ring ring-inset ring-border",
          soft: "bg-elevated/50",
          subtle: "bg-elevated/50 ring ring-inset ring-border",
          ghost: ""
        }
      },
      defaults: {variant: :outline}
    )

    # Page card inner container with padding.
    #
    # Nuxt UI: relative flex flex-col flex-1 lg:grid gap-x-8 gap-y-4 p-4 sm:p-6
    PageCardContainer = ClassVariants.build(
      base: "relative flex flex-col flex-1 gap-x-8 gap-y-4 p-4 sm:p-6"
    )

    # Page card content wrapper.
    PageCardWrapper = ClassVariants.build(
      base: "flex flex-col flex-1 items-start"
    )

    # Page card header area.
    PageCardHeader = ClassVariants.build(
      base: "mb-4"
    )

    # Page card body — grows to fill available space.
    PageCardBody = ClassVariants.build(
      base: "flex-1"
    )

    # Page card footer area.
    PageCardFooter = ClassVariants.build(
      base: "pt-4 mt-auto"
    )

    # Page card leading icon.
    #
    # Nuxt UI: size-5 shrink-0 text-primary
    PageCardIcon = ClassVariants.build(
      base: "inline-flex items-center mb-2.5 [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:text-primary"
    )

    # Page card title text.
    #
    # Nuxt UI: text-base text-pretty font-semibold text-highlighted
    PageCardTitle = ClassVariants.build(
      base: "text-base text-pretty font-semibold text-foreground"
    )

    # Page card description text.
    #
    # Nuxt UI: text-[15px] text-pretty text-muted
    PageCardDescription = ClassVariants.build(
      base: "mt-1 text-sm text-pretty text-muted-foreground"
    )
  end
end
