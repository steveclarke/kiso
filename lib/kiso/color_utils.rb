# frozen_string_literal: true

module Kiso
  module ColorUtils
    module_function

    # Returns "white" or "black" based on WCAG relative luminance.
    # Accepts 3-digit (#abc) or 6-digit (#aabbcc) hex strings.
    def contrast_text_color(hex)
      hex = hex.delete("#")
      hex = hex.chars.map { |c| c * 2 }.join if hex.length == 3

      r, g, b = hex.scan(/../).map { |c| c.to_i(16) / 255.0 }
      luminance = [r, g, b].map { |c|
        (c <= 0.04045) ? c / 12.92 : ((c + 0.055) / 1.055)**2.4
      }.then { |lr, lg, lb| 0.2126 * lr + 0.7152 * lg + 0.0722 * lb }

      (luminance > 0.179) ? "black" : "white"
    end
  end
end
