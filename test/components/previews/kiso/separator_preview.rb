module Kiso
  # @label Separator
  class SeparatorPreview < Lookbook::Preview
    # @label Playground
    # @param orientation select { choices: [horizontal, vertical] }
    # @param decorative toggle
    def playground(orientation: :horizontal, decorative: true)
      render_with_template(locals: {
        orientation: orientation.to_sym,
        decorative: decorative
      })
    end

    # @label Horizontal
    def horizontal
      render_with_template
    end

    # @label Vertical
    def vertical
      render_with_template
    end
  end
end
