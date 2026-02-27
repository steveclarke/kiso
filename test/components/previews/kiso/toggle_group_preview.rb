module Kiso
  # @label ToggleGroup
  class ToggleGroupPreview < Lookbook::Preview
    # @label Playground
    # @param type select { choices: [single, multiple] }
    # @param variant select { choices: [default, outline] }
    # @param size select { choices: [sm, default, lg] }
    def playground(type: :single, variant: :default, size: :default)
      render_with_template(locals: {
        type: type.to_sym,
        variant: variant.to_sym,
        size: size.to_sym
      })
    end

    # @label Single Selection
    def single
      render_with_template
    end

    # @label Multiple Selection
    def multiple
      render_with_template
    end

    # @label Outline Variant
    def outline
      render_with_template
    end

    # @label Sizes
    def sizes
      render_with_template
    end

    # @label Disabled Items
    def disabled
      render_with_template
    end
  end
end
