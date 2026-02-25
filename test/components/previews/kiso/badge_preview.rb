module Kiso
  # @label Badge
  class BadgePreview < Lookbook::Preview
    # @label Playground
    # @param color select { choices: [primary, secondary, success, info, warning, error, neutral] }
    # @param variant select { choices: [solid, outline, soft, subtle] }
    # @param size select { choices: [xs, sm, md, lg, xl] }
    # @param text text "Badge"
    def playground(color: :primary, variant: :soft, size: :md, text: "Badge")
      render_with_template(locals: {
        color: color.to_sym,
        variant: variant.to_sym,
        size: size.to_sym,
        text: text
      })
    end

    # @label Colors
    def colors
      render_with_template
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
