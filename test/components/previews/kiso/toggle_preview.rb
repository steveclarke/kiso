module Kiso
  # @label Toggle
  class TogglePreview < Lookbook::Preview
    # @label Playground
    # @param variant select { choices: [default, outline] }
    # @param size select { choices: [sm, default, lg] }
    # @param pressed toggle
    # @param disabled toggle
    def playground(variant: :default, size: :default, pressed: false, disabled: false)
      render_with_template(locals: {
        variant: variant.to_sym,
        size: size.to_sym,
        pressed: pressed,
        disabled: disabled
      })
    end

    # @label Variants
    def variants
      render_with_template
    end

    # @label Sizes
    def sizes
      render_with_template
    end

    # @label With Text
    def with_text
      render_with_template
    end

    # @label Disabled
    def disabled
      render_with_template
    end
  end
end
