# frozen_string_literal: true

require "tailwind_merge"

module Kiso
  module Icons
    class Renderer
      SIZE_PRESETS = {
        xs: "size-3",
        sm: "size-4",
        md: "size-5",
        lg: "size-6",
        xl: "size-8"
      }.freeze

      BASE_CLASSES = "shrink-0"

      class << self
        def render(icon_data, size: nil, css_classes: "", **options)
          body = icon_data[:body]
          width = icon_data[:width]
          height = icon_data[:height]

          size_class = size ? SIZE_PRESETS.fetch(size, nil) : nil
          merged_classes = merge_classes(BASE_CLASSES, size_class, css_classes)

          attrs = {
            "xmlns" => "http://www.w3.org/2000/svg",
            "viewBox" => "0 0 #{width} #{height}",
            "class" => merged_classes,
            "aria-hidden" => "true",
            "fill" => "none"
          }

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

        def merge_classes(*parts)
          combined = parts.reject { |p| p.nil? || p.empty? }.join(" ")
          if defined?(TailwindMerge::Merger)
            merger.merge(combined)
          else
            combined
          end
        end

        def merger
          @merger ||= TailwindMerge::Merger.new
        end

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
