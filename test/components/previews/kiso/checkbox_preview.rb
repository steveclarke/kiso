module Kiso
  # @label Checkbox
  class CheckboxPreview < Lookbook::Preview
    # @label Playground
    # @param color select { choices: [primary, secondary, success, info, warning, error, neutral] }
    # @param checked toggle
    # @param disabled toggle
    def playground(color: :primary, checked: false, disabled: false)
      render_with_template(locals: {
        color: color.to_sym,
        checked: checked,
        disabled: disabled
      })
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
