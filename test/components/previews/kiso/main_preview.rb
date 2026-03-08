module Kiso
  # @label Main
  # @logical_path kiso/layout
  class MainPreview < Lookbook::Preview
    # @label Playground
    def playground
      render_with_template
    end
  end
end
