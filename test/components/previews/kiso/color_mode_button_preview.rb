module Kiso
  # @label Color Mode Button
  # @logical_path kiso/color_mode
  class ColorModeButtonPreview < Lookbook::Preview
    # @label Playground
    # @param size select { choices: [sm, md, lg] }
    def playground(size: :md)
      render_with_template(locals: {
        size: size.to_sym
      })
    end

    # @label Sizes
    def sizes
      render_with_template
    end
  end
end
