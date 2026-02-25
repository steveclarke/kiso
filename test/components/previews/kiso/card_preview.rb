module Kiso
  # @label Card
  class CardPreview < Lookbook::Preview
    # @label Playground
    # @param variant select { choices: [outline, soft, subtle] }
    # @param title text "Card Title"
    # @param description text "Card description goes here."
    def playground(variant: :outline, title: "Card Title", description: "Card description goes here.")
      render_with_template(locals: {
        variant: variant.to_sym,
        title: title,
        description: description
      })
    end

    # @label Variants
    def variants
      render_with_template
    end

    # @label With Footer
    def with_footer
      render_with_template
    end

    # @label Content Only
    def content_only
      render_with_template
    end
  end
end
