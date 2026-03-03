module Kiso
  # @label SelectNative
  # @logical_path kiso/form
  class SelectNativePreview < Lookbook::Preview
    # @label Playground
    # @param variant select :variant { choices: [outline, soft, ghost] }
    # @param size select :size { choices: [sm, md, lg] }
    def playground(variant: :outline, size: :md)
      render_with_template(locals: {variant: variant.to_sym, size: size.to_sym})
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
