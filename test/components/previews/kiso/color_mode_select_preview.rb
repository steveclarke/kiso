module Kiso
  # @label Color Mode Select
  # @logical_path kiso/color_mode
  class ColorModeSelectPreview < Lookbook::Preview
    # @label Playground
    # @param size select { choices: [sm, md, lg] }
    def playground(size: :md)
      render_with_template(locals: {
        size: size.to_sym
      })
    end

    # @label Small
    def small
      render_with_template
    end
  end
end
