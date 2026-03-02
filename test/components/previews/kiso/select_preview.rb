module Kiso
  # @label Select
  # @logical_path kiso/form
  class SelectPreview < Lookbook::Preview
    # @label Playground
    # @param size select { choices: [sm, md] }
    def playground(size: :md)
      render_with_template(locals: {size: size.to_sym})
    end

    # @label Groups
    def groups
      render_with_template
    end

    # @label Scrollable
    def scrollable
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
  end
end
