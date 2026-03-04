module Kiso
  # @label AspectRatio
  class AspectRatioPreview < Lookbook::Preview
    # @label Playground
    # @param ratio text "Aspect ratio (e.g. 16/9, 1/1, 4/3)"
    def playground(ratio: "16/9")
      render_with_template(locals: {
        ratio: eval_ratio(ratio)
      })
    end

    # @label Square
    def square
      render_with_template
    end

    # @label Portrait
    def portrait
      render_with_template
    end

    private

    def eval_ratio(str)
      parts = str.to_s.split("/")
      if parts.length == 2
        parts[0].to_f / parts[1].to_f
      else
        str.to_f
      end
    end
  end
end
