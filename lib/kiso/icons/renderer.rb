# frozen_string_literal: true

module Kiso
  module Icons
    class Renderer
      class << self
        def render(icon_data, css_class: nil, **options)
          body = icon_data[:body]
          width = icon_data[:width]
          height = icon_data[:height]

          attrs = {
            "xmlns" => "http://www.w3.org/2000/svg",
            "viewBox" => "0 0 #{width} #{height}",
            "width" => "1em",
            "height" => "1em",
            "aria-hidden" => "true",
            "fill" => "none"
          }

          attrs["class"] = css_class if css_class && !css_class.empty?

          options.each do |key, value|
            if key == :data && value.is_a?(Hash)
              value.each { |k, v| attrs["data-#{k.to_s.tr("_", "-")}"] = v.to_s }
            elsif key == :aria && value.is_a?(Hash)
              value.each { |k, v| attrs["aria-#{k.to_s.tr("_", "-")}"] = v.to_s }
            else
              attrs[key.to_s.tr("_", "-")] = value.to_s
            end
          end

          if attrs.key?("aria-label")
            attrs.delete("aria-hidden")
            attrs["role"] = "img"
          end

          attr_str = attrs.map { |k, v| %(#{k}="#{escape_attr(v)}") }.join(" ")
          svg = %(<svg #{attr_str}>#{body}</svg>)

          if defined?(ActiveSupport::SafeBuffer)
            ActiveSupport::SafeBuffer.new(svg)
          else
            svg
          end
        end

        private

        def escape_attr(value)
          value.to_s
            .gsub("&", "&amp;")
            .gsub('"', "&quot;")
            .gsub("<", "&lt;")
            .gsub(">", "&gt;")
        end
      end
    end
  end
end
