# frozen_string_literal: true

require "tailwind_merge"

module Kiso
  module IconHelper
    SIZE_PRESETS = {
      xs: "size-3",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-8"
    }.freeze

    BASE_CLASSES = "shrink-0"

    # Renders an inline SVG icon from Iconify icon sets.
    #
    #   kiso_icon("lucide:check")
    #   kiso_icon("check")                          # uses default set (lucide)
    #   kiso_icon("check", size: :md)               # size preset (standalone use)
    #   kiso_icon("check", class: "text-success")   # extra classes
    #   kiso_icon("check", aria: { label: "Done" }) # accessible icon
    #
    # Size defaults to nil so parent components (Button, Alert, Badge) can
    # control icon sizing via CSS selectors like [&_svg]:size-4.
    # Pass an explicit size: for standalone icons outside components.
    #
    def kiso_icon(name, size: nil, **options)
      css_classes = options.delete(:class) || ""

      icon_data = Kiso::Icons.resolve(name.to_s)

      unless icon_data
        if defined?(Rails) && Rails.env.development?
          return "<!-- Kiso::Icons: '#{ERB::Util.html_escape(name)}' not found -->".html_safe
        end
        return "".html_safe
      end

      size_class = size ? SIZE_PRESETS.fetch(size, nil) : nil
      merged = merge_icon_classes(BASE_CLASSES, size_class, css_classes)

      Kiso::Icons::Renderer.render(icon_data, css_class: merged, **options)
    end

    private

    def merge_icon_classes(*parts)
      combined = parts.reject { |p| p.nil? || p.to_s.empty? }.join(" ")
      icon_class_merger.merge(combined)
    end

    def icon_class_merger
      @icon_class_merger ||= TailwindMerge::Merger.new
    end
  end
end
