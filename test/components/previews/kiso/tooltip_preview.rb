module Kiso
  # @label Tooltip
  class TooltipPreview < Lookbook::Preview
    # @label Playground
    # @param text text
    # @param side select { choices: [top, right, bottom, left] }
    # @param align select { choices: [center, start, end] }
    # @param delay number
    def playground(text: "Add to library", side: :top, align: :center, delay: 0)
      render_with_template(locals: {
        text: text,
        side: side.to_sym,
        align: align.to_sym,
        delay: delay.to_i
      })
    end

    # @label Positions
    def positions
      render_with_template
    end

    # @label With KBDs
    def with_kbds
      render_with_template
    end

    # @label Rich Content
    def rich_content
      render_with_template
    end
  end
end
