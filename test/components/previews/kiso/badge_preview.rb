module Kiso
  # @label Badge
  class BadgePreview < Lookbook::Preview
    # @label Playground
    # @param variant select { choices: [default, primary, secondary, success, info, warning, error, outline] }
    # @param size select { choices: [sm, md, lg] }
    # @param text text "Badge"
    def playground(variant: :primary, size: :md, text: "Badge")
      render_with_template(locals: {
        variant: variant.to_sym,
        size: size.to_sym,
        text: text
      })
    end

    # @label Variants
    def variants
      render_with_template
    end

    # @label Sizes
    def sizes
      render_with_template
    end
  end
end
