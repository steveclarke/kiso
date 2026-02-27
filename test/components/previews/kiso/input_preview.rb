module Kiso
  # @label Input
  class InputPreview < Lookbook::Preview
    # @label Playground
    # @param variant select { choices: [outline, soft, ghost] }
    # @param size select { choices: [sm, md, lg] }
    # @param placeholder text "Email address"
    # @param disabled toggle
    def playground(variant: :outline, size: :md, placeholder: "Email address", disabled: false)
      render_with_template(locals: {
        variant: variant.to_sym,
        size: size.to_sym,
        placeholder: placeholder,
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

    # @label With Field
    def with_field
      render_with_template
    end

    # @label File Input
    def file_input
      render_with_template
    end

    # @label Disabled
    def disabled
      render_with_template
    end
  end
end
