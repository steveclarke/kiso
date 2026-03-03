module Kiso
  # @label Button
  class ButtonPreview < Lookbook::Preview
    # @label Playground
    # @param color select { choices: [primary, secondary, success, info, warning, error, neutral] }
    # @param variant select { choices: [solid, outline, soft, subtle, ghost, link] }
    # @param size select { choices: [xs, sm, md, lg, xl] }
    # @param text text "Button"
    # @param disabled toggle
    # @param block toggle
    def playground(color: :primary, variant: :solid, size: :md, text: "Button", disabled: false, block: false)
      render_with_template(locals: {
        color: color.to_sym,
        variant: variant.to_sym,
        size: size.to_sym,
        text: text,
        disabled: disabled,
        block: block
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

    # @label Sizes
    def sizes
      render_with_template
    end

    # @label With Icon
    def with_icon
      render_with_template
    end

    # @label As Link
    def as_link
      render_with_template
    end

    # @label Block
    def block_buttons
      render_with_template
    end

    # @label Disabled
    def disabled
      render_with_template
    end

    # @label Form Method
    # @param method select { choices: [delete, post, put, patch] }
    # @param variant select { choices: [solid, outline, soft, subtle, ghost, link] }
    # @param color select { choices: [primary, secondary, success, info, warning, error, neutral] }
    def form_method(method: :delete, variant: :ghost, color: :neutral)
      render_with_template(locals: {
        method: method.to_sym,
        variant: variant.to_sym,
        color: color.to_sym
      })
    end
  end
end
