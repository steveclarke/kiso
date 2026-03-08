module Kiso
  # @label Page
  # @logical_path kiso/page
  class PagePreview < Lookbook::Preview
    # @label Playground
    def playground
      render_with_template
    end

    # @label With Sidebars
    def with_sidebars
      render_with_template
    end

    # @label Header with Props
    def header_with_props
      render_with_template
    end

    # @label Section Horizontal
    def section_horizontal
      render_with_template
    end

    # @label Section Vertical
    def section_vertical
      render_with_template
    end

    # @label Grid with Cards
    def grid_with_cards
      render_with_template
    end

    # @label Card Variants
    def card_variants
      render_with_template
    end

    # @label Full Page
    def full_page
      render_with_template
    end
  end
end
