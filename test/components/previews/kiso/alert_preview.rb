module Kiso
  # @label Alert
  class AlertPreview < Lookbook::Preview
    # @label Playground
    # @param color select { choices: [primary, secondary, success, info, warning, error, neutral] }
    # @param variant select { choices: [solid, outline, soft, subtle] }
    # @param title text "Heads up!"
    # @param description text "You can add components to your app using the CLI."
    def playground(color: :primary, variant: :soft, title: "Heads up!", description: "You can add components to your app using the CLI.")
      render_with_template(locals: {
        color: color.to_sym,
        variant: variant.to_sym,
        title: title,
        description: description
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

    # @label With Icon
    def with_icon
      render_with_template
    end

    # @label Title Only
    def title_only
      render_with_template
    end

    # @label Dismissible
    def dismissible
      render_with_template
    end

    # @label With Actions
    def with_actions
      render_with_template
    end
  end
end
