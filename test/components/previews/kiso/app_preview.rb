module Kiso
  # @label App
  # @logical_path kiso/layout
  class AppPreview < Lookbook::Preview
    # @label Playground
    def playground
      render_with_template
    end
  end
end
