module Kiso
  # @label Alert Dialog
  class AlertDialogPreview < Lookbook::Preview
    # @label Playground
    # @param open toggle
    # @param size select [default, sm]
    def playground(open: true, size: :default)
      render_with_template(locals: {open: open, size: size.to_sym})
    end

    # @label Destructive
    def destructive
      render_with_template
    end

    # @label With Media
    def with_media
      render_with_template
    end

    # @label With Media (Small)
    def with_media_sm
      render_with_template
    end
  end
end
