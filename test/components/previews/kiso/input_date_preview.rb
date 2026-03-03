module Kiso
  # @label Input Date
  # @logical_path kiso/date
  class InputDatePreview < Lookbook::Preview
    # @label Playground
    # @param variant select { choices: [outline, soft, ghost] }
    # @param size select { choices: [sm, md, lg] }
    def playground(variant: :outline, size: :md)
      render_with_template(locals: {
        variant: variant.to_sym,
        size: size.to_sym
      })
    end

    # @label With Value
    def with_value
      render_with_template
    end

    # @label Sizes
    def sizes
      render_with_template
    end

    # @label In a Form
    def in_a_form
      render_with_template
    end
  end
end
