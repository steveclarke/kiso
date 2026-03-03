module Kiso
  # @label Date Picker
  # @logical_path kiso/date
  class DatePickerPreview < Lookbook::Preview
    # @label Playground
    # @param color select { choices: [primary, secondary, success, info, warning, error, neutral] }
    # @param variant select { choices: [solid, outline, soft, subtle] }
    def playground(color: :primary, variant: :solid)
      render_with_template(locals: {
        color: color.to_sym,
        variant: variant.to_sym
      })
    end

    # @label With Value
    def with_value
      render_with_template
    end

    # @label In a Form
    def in_a_form
      render_with_template
    end
  end
end
