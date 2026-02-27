module Kiso
  # @label InputGroup
  class InputGroupPreview < Lookbook::Preview
    # @label Playground
    def playground
      render_with_template
    end

    # @label Prefix Text
    def prefix_text
      render_with_template
    end

    # @label Suffix Icon
    def suffix_icon
      render_with_template
    end

    # @label Prefix and Suffix
    def prefix_and_suffix
      render_with_template
    end
  end
end
