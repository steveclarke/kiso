module Kiso
  # @label Toggle
  class TogglePreview < Lookbook::Preview
    # @label Playground
    def playground
      render_with_template
    end

    # @label Outline
    def variants
      render_with_template
    end

    # @label With Text
    def with_text
      render_with_template
    end

    # @label Sizes
    def sizes
      render_with_template
    end

    # @label Disabled
    def disabled
      render_with_template
    end
  end
end
