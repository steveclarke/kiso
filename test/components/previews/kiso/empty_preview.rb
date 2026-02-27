module Kiso
  # @label Empty
  class EmptyPreview < Lookbook::Preview
    # @label Playground
    # @param title text "No Projects Yet"
    # @param description text "You haven't created any projects yet. Get started by creating your first project."
    def playground(title: "No Projects Yet", description: "You haven't created any projects yet. Get started by creating your first project.")
      render_with_template(locals: {
        title: title,
        description: description
      })
    end

    # @label With Icon
    def with_icon
      render_with_template
    end

    # @label With Actions
    def with_actions
      render_with_template
    end

    # @label Outline
    def outline
      render_with_template
    end

    # @label Inside Card
    def inside_card
      render_with_template
    end
  end
end
