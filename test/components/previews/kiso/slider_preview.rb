module Kiso
  # @label Slider
  # @logical_path kiso/form
  class SliderPreview < Lookbook::Preview
    # @label Playground
    # @param size select { choices: [sm, md, lg] }
    # @param value range { min: 0, max: 100, step: 1 }
    # @param disabled toggle
    def playground(size: :md, value: 75, disabled: false)
      render_with_template(locals: {
        size: size.to_sym,
        value: value.to_i,
        disabled: disabled
      })
    end

    # @label Sizes
    def sizes
      render_with_template
    end

    # @label Disabled
    def disabled
      render_with_template
    end

    # @label With Field
    def with_field
      render_with_template
    end

    # @label Controlled
    def controlled
      render_with_template
    end
  end
end
