module Kiso
  # @label Popover
  class PopoverPreview < Lookbook::Preview
    # @label Playground
    # @param align select { choices: [start, center, end] }
    def playground(align: :center)
      render_with_template(locals: {align: align.to_sym})
    end

    # @label Basic
    def basic
      render_with_template
    end

    # @label Alignments
    def alignments
      render_with_template
    end

    # @label With Form
    def with_form
      render_with_template
    end
  end
end
