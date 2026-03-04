module Kiso
  # @label Collapsible
  class CollapsiblePreview < Lookbook::Preview
    # @label Playground
    # @param open toggle
    def playground(open: false)
      render_with_template(locals: {open: open})
    end

    # @label Basic
    def basic
      render_with_template
    end

    # @label Settings
    def settings
      render_with_template
    end

    # @label File Tree
    def file_tree
      render_with_template
    end
  end
end
