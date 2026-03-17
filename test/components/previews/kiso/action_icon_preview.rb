module Kiso
  # @label ActionIcon
  # @logical_path kiso
  class ActionIconPreview < Lookbook::Preview
    # @label Playground
    # @param size select { choices: [xs, sm, md] }
    # @param icon text
    # @param title text
    # @param disabled toggle
    def playground(size: :sm, icon: "pencil", title: "Edit", disabled: false)
      render_with_template(locals: {
        size: size.to_sym,
        icon: icon,
        title: title,
        disabled: disabled
      })
    end

    # @label Sizes
    def sizes
      render_with_template
    end

    # @label Inline with text
    def inline_with_text
      render_with_template
    end
  end
end
