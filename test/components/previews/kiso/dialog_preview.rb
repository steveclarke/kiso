module Kiso
  # @label Dialog
  class DialogPreview < Lookbook::Preview
    # @label Playground
    # @param open toggle
    def playground(open: true)
      render_with_template(locals: {open: open})
    end

    # @label With Form
    def with_form
      render_with_template
    end

    # @label Confirmation
    def confirmation
      render_with_template
    end

    # @label Scrollable Body
    def scrollable_body
      render_with_template
    end
  end
end
