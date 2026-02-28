module Kiso
  # @label Kbd
  class KbdPreview < Lookbook::Preview
    # @label Playground
    # @param size select { choices: [sm, md, lg] }
    # @param text text "⌘K"
    def playground(size: :md, text: "⌘K")
      render_with_template(locals: {size: size.to_sym, text: text})
    end

    # @label Demo
    def demo
      render_with_template
    end

    # @label Group
    def group
      render_with_template
    end

    # @label Sizes
    def sizes
      render_with_template
    end

    # @label Button
    def button
      render_with_template
    end

    # @label Input Group
    def input_group
      render_with_template
    end
  end
end
