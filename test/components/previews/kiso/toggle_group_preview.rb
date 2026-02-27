module Kiso
  # @label ToggleGroup
  class ToggleGroupPreview < Lookbook::Preview
    # @label Playground
    def playground
      render_with_template
    end

    # @label Outline
    def outline
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
