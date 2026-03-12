module Kiso
  # @label Progress
  class ProgressPreview < Lookbook::Preview
    # @label Playground
    # @param value range { min: 0, max: 100, step: 1 }
    # @param color select { choices: [primary, secondary, success, info, warning, error, neutral] }
    # @param size select { choices: [xs, sm, md, lg, xl] }
    # @param status toggle
    # @param animation select { choices: [carousel, carousel_inverse, swing, elastic] }
    def playground(value: 33, color: :primary, size: :md, status: false, animation: :carousel)
      render_with_template(locals: {
        value: value.to_i,
        color: color.to_sym,
        size: size.to_sym,
        status: ActiveModel::Type::Boolean.new.cast(status),
        animation: animation.to_sym
      })
    end

    # @label Colors
    def colors
      render_with_template
    end

    # @label Sizes
    def sizes
      render_with_template
    end

    # @label Indeterminate
    def indeterminate
      render_with_template
    end

    # @label Status
    def status
      render_with_template
    end

    # @label Steps
    def steps
      render_with_template
    end
  end
end
