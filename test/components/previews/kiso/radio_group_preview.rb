module Kiso
  # @label RadioGroup
  class RadioGroupPreview < Lookbook::Preview
    # @label Playground
    # @param color select { choices: [primary, secondary, success, info, warning, error, neutral] }
    def playground(color: :primary)
      render_with_template(locals: {color: color.to_sym})
    end

    # @label Colors
    def colors
      render_with_template
    end

    # @label With Field
    def with_field
      render_with_template
    end

    # @label Disabled
    def disabled
      render_with_template
    end
  end
end
