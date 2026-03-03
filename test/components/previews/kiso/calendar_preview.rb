module Kiso
  # @label Calendar
  # @logical_path kiso/date
  class CalendarPreview < Lookbook::Preview
    # @label Playground
    # @param color select { choices: [primary, secondary, success, info, warning, error, neutral] }
    # @param variant select { choices: [solid, outline, soft, subtle] }
    # @param size select { choices: [sm, md, lg] }
    def playground(color: :primary, variant: :solid, size: :md)
      render_with_template(locals: {
        color: color.to_sym,
        variant: variant.to_sym,
        size: size.to_sym
      })
    end

    # @label Colors
    def colors
      render_with_template
    end

    # @label Variants
    def variants
      render_with_template
    end

    # @label Range Selection
    def range
      render_with_template
    end

    # @label Multiple Months
    def multiple_months
      render_with_template
    end
  end
end
