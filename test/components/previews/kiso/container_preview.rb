module Kiso
  # @label Container
  # @logical_path kiso/layout
  class ContainerPreview < Lookbook::Preview
    # @label Playground
    # @param size select { choices: [narrow, default, wide, full] }
    def playground(size: :default)
      render_with_template(locals: {size: size.to_sym})
    end

    # @label Sizes
    def sizes
      render_with_template
    end
  end
end
